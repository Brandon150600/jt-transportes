"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, requireUser } from "@/lib/auth/session";

export type TripFormState = { error?: string; fieldErrors?: Record<string, string> };
const MAX_DATABASE_INT = 2_147_483_647;

const tripSchema = z.object({
  clientId: z.string().min(1, "Selecciona un cliente."),
  destinationAddressId: z.string().min(1, "Selecciona un destino."),
  origin: z.string().trim().min(2, "Indica el origen.").max(240),
  vehicleId: z.string().min(1, "Selecciona una unidad."),
  driverId: z.string().min(1, "Selecciona un operador."),
  scheduledStartAt: z.string().min(1, "Indica la fecha y hora de salida."),
  mileageStart: z.coerce.number().int().nonnegative().max(MAX_DATABASE_INT),
  revenue: z.coerce.number().nonnegative().max(9999999999),
  notes: z.string().trim().max(3000).optional(),
});

function parse(formData: FormData) {
  return tripSchema.safeParse(Object.fromEntries(formData.entries()));
}

function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

function mexicoLocalToDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return new Date(Number.NaN);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const wanted = Date.UTC(year, month - 1, day, hour, minute);
  let instant = wanted;
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (let index = 0; index < 3; index++) {
    const values = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((part) => [part.type, Number(part.value)]));
    const represented = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute);
    const adjustment = wanted - represented;
    instant += adjustment;
    if (!adjustment) break;
  }
  return new Date(instant);
}

export async function saveTrip(_previous: TripFormState, formData: FormData): Promise<TripFormState> {
  const user = await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const id = String(formData.get("id") || "");
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  const data = parsed.data;
  const date = mexicoLocalToDate(data.scheduledStartAt);
  if (Number.isNaN(date.getTime())) return { error: "La fecha de salida no es válida.", fieldErrors: { scheduledStartAt: "Fecha no válida." } };

  try {
    const [address, vehicle, driver] = await Promise.all([
      prisma.clientAddress.findFirst({ where: { id: data.destinationAddressId, clientId: data.clientId, active: true }, include: { client: { select: { businessName: true, commercialName: true, active: true } } } }),
      prisma.vehicle.findFirst({ where: { id: data.vehicleId, status: { not: "INACTIVE" } }, select: { id: true, mileage: true } }),
      prisma.driver.findFirst({ where: { id: data.driverId, status: "ACTIVE" }, select: { id: true } }),
    ]);
    if (!address || !address.client.active) return { error: "El cliente o destino seleccionado no está activo.", fieldErrors: { destinationAddressId: "Selecciona un destino activo del cliente." } };
    if (!vehicle) return { error: "La unidad no está disponible." };
    if (!driver) return { error: "El operador no está activo." };
    if (data.mileageStart < vehicle.mileage) return { error: `El kilometraje inicial no puede ser menor al odómetro actual (${vehicle.mileage.toLocaleString("es-MX")} km).`, fieldErrors: { mileageStart: "Menor al odómetro de la unidad." } };

    const conflicts = await prisma.trip.findFirst({ where: { status: "IN_PROGRESS", ...(id ? { NOT: { id } } : {}), OR: [{ vehicleId: data.vehicleId }, { driverId: data.driverId }] }, select: { tripNumber: true, vehicleId: true, driverId: true } });
    if (conflicts) return { error: "El operador o la unidad ya tiene un viaje en curso." };

    if (id) {
      const existing = await prisma.trip.findUnique({ where: { id }, select: { status: true } });
      if (!existing || existing.status !== "SCHEDULED") return { error: "Solo se pueden editar viajes programados." };
      await prisma.trip.update({ where: { id }, data: {
        clientId: data.clientId, destinationAddressId: data.destinationAddressId,
        clientNameSnapshot: address.client.commercialName || address.client.businessName,
        destinationNameSnapshot: address.name,
        destinationSnapshot: formatAddress(address), origin: data.origin, vehicleId: data.vehicleId, driverId: data.driverId,
        scheduledStartAt: date, mileageStart: data.mileageStart, revenue: data.revenue, notes: data.notes || null, updatedById: user.id,
      } });
      revalidatePath(`/trips/${id}`);
      redirect(`/trips/${id}`);
    }

    const sequence = await prisma.$queryRaw<Array<{ value: bigint }>>`SELECT nextval('"Trip_tripNumber_seq"') AS value`;
    const tripNumber = `TRP-${String(sequence[0].value).padStart(6, "0")}`;
    const trip = await prisma.trip.create({ data: {
      tripNumber, clientId: data.clientId, destinationAddressId: data.destinationAddressId,
      clientNameSnapshot: address.client.commercialName || address.client.businessName,
      destinationNameSnapshot: address.name, destinationSnapshot: formatAddress(address),
      origin: data.origin, vehicleId: data.vehicleId, driverId: data.driverId, scheduledStartAt: date,
      mileageStart: data.mileageStart, revenue: data.revenue, notes: data.notes || null,
      createdById: user.id, updatedById: user.id,
    }, select: { id: true } });
    redirect(`/trips/${trip.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { error: "No fue posible guardar el viaje. Revisa que los datos seleccionados sigan vigentes." };
  }
}

function formatAddress(address: { street: string; exteriorNumber: string | null; interiorNumber: string | null; neighborhood: string | null; city: string; state: string; postalCode: string | null; country: string }) {
  return [[address.street, address.exteriorNumber, address.interiorNumber ? `Int. ${address.interiorNumber}` : null].filter(Boolean).join(" "), address.neighborhood, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ");
}

export async function transitionTrip(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ id: z.string().min(1), action: z.enum(["start", "complete", "cancel"]), mileageEnd: z.coerce.number().int().nonnegative().max(MAX_DATABASE_INT).optional() }).safeParse({ id: formData.get("id"), action: formData.get("action"), mileageEnd: formData.get("mileageEnd") || undefined });
  if (!parsed.success) return;
  const { id, action, mileageEnd } = parsed.data;
  if (action === "cancel" && user.role === "EMPLOYEE") return;
  const trip = await prisma.trip.findUnique({ where: { id }, include: { vehicle: { select: { mileage: true } } } });
  if (!trip) return;
  if (action === "start") {
    if (trip.status !== "SCHEDULED") return;
    const active = await prisma.trip.findFirst({ where: { status: "IN_PROGRESS", OR: [{ vehicleId: trip.vehicleId }, { driverId: trip.driverId }] }, select: { id: true } });
    if (active) return;
    await prisma.$transaction([
      prisma.trip.update({ where: { id }, data: { status: "IN_PROGRESS", startedAt: new Date(), updatedById: user.id } }),
      prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "IN_ROUTE" } }),
    ]);
  } else if (action === "complete") {
    if (trip.status !== "IN_PROGRESS" || mileageEnd === undefined || mileageEnd < trip.mileageStart) return;
    await prisma.$transaction([
      prisma.trip.update({ where: { id }, data: { status: "COMPLETED", completedAt: new Date(), mileageEnd, updatedById: user.id } }),
      ...(mileageEnd > trip.vehicle.mileage ? [prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { mileage: mileageEnd } })] : []),
      prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } }),
    ]);
  } else {
    if (trip.status !== "SCHEDULED" && trip.status !== "IN_PROGRESS") return;
    await prisma.$transaction([
      prisma.trip.update({ where: { id }, data: { status: "CANCELLED", cancelledAt: new Date(), updatedById: user.id } }),
      ...(trip.status === "IN_PROGRESS" ? [prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } })] : []),
    ]);
  }
  revalidatePath("/trips");
  revalidatePath(`/trips/${id}`);
  redirect(`/trips/${id}`);
}
