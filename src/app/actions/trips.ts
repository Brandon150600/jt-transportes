"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAnyRole, requireUser } from "@/lib/auth/session";
import { NotificationEntityType, NotificationType, PaymentStatus, TripExecutionType } from "@/generated/prisma/client/enums";
import { createNotification, createUpcomingTripNotification } from "@/lib/notifications/service";

export type TripFormState = { error?: string; fieldErrors?: Record<string, string> };
const MAX_DATABASE_INT = 2_147_483_647;
const MAX_DATABASE_MONEY = 9_999_999_999.99;
const UPCOMING_WINDOW_MS = 25 * 60 * 60 * 1000;

function isWithinUpcomingWindow(scheduledStartAt: Date, now = new Date()) {
  return scheduledStartAt > now && scheduledStartAt.getTime() <= now.getTime() + UPCOMING_WINDOW_MS;
}

const optionalNumber = (maximum: number) => z.preprocess(
  (value) => value === "" || value === null ? undefined : value,
  z.coerce.number().finite().nonnegative().max(maximum).optional(),
);

const tripSchema = z.object({
  executionType: z.nativeEnum(TripExecutionType),
  clientId: z.string().min(1, "Selecciona un cliente."),
  destinationAddressId: z.string().min(1, "Selecciona un destino."),
  origin: z.string().trim().min(2, "Indica el origen.").max(240),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  externalCarrierId: z.string().optional(),
  externalVehicleDescription: z.string().trim().max(200).optional(),
  externalDriverName: z.string().trim().max(120).optional(),
  subcontractorCost: optionalNumber(MAX_DATABASE_MONEY),
  scheduledStartAt: z.string().min(1, "Indica la fecha y hora de salida."),
  mileageStart: optionalNumber(MAX_DATABASE_INT).refine((value) => value === undefined || Number.isInteger(value), "El kilometraje debe ser un entero."),
  revenue: z.coerce.number().finite().nonnegative().max(MAX_DATABASE_MONEY),
  notes: z.string().trim().max(3000).optional(),
}).superRefine((data, context) => {
  if (data.executionType === TripExecutionType.OWN) {
    if (!data.vehicleId) context.addIssue({ code: "custom", path: ["vehicleId"], message: "Selecciona una unidad." });
    if (!data.driverId) context.addIssue({ code: "custom", path: ["driverId"], message: "Selecciona un operador." });
    if (data.mileageStart === undefined) context.addIssue({ code: "custom", path: ["mileageStart"], message: "Indica el kilometraje inicial." });
  } else {
    if (!data.externalCarrierId) context.addIssue({ code: "custom", path: ["externalCarrierId"], message: "Selecciona un transportista." });
    if (data.subcontractorCost === undefined) context.addIssue({ code: "custom", path: ["subcontractorCost"], message: "Indica el costo del transportista." });
  }
});

function parse(formData: FormData) {
  return tripSchema.safeParse({
    executionType: formData.get("executionType"),
    clientId: formData.get("clientId"),
    destinationAddressId: formData.get("destinationAddressId"),
    origin: formData.get("origin"),
    vehicleId: formData.get("vehicleId") || undefined,
    driverId: formData.get("driverId") || undefined,
    externalCarrierId: formData.get("externalCarrierId") || undefined,
    externalVehicleDescription: formData.get("externalVehicleDescription") || undefined,
    externalDriverName: formData.get("externalDriverName") || undefined,
    subcontractorCost: formData.get("subcontractorCost"),
    scheduledStartAt: formData.get("scheduledStartAt"),
    mileageStart: formData.get("mileageStart"),
    revenue: formData.get("revenue"),
    notes: formData.get("notes") || undefined,
  });
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

  const existing = id ? await prisma.trip.findUnique({ where: { id }, select: { status: true, executionType: true, externalCarrierId: true } }) : null;
  if (id && (!existing || existing.status !== "SCHEDULED")) return { error: "Solo se pueden editar viajes programados." };
  if (existing && existing.executionType !== data.executionType) return { error: "El tipo de ejecución no se puede cambiar después de crear el viaje." };

  try {
    const address = await prisma.clientAddress.findFirst({ where: { id: data.destinationAddressId, clientId: data.clientId, active: true }, include: { client: { select: { businessName: true, commercialName: true, active: true } } } });
    if (!address || !address.client.active) return { error: "El cliente o destino seleccionado no está activo.", fieldErrors: { destinationAddressId: "Selecciona un destino activo del cliente." } };

    let vehicle: { id: string; mileage: number } | null = null;
    let driver: { id: string } | null = null;
    let carrier: { id: string; businessName: string; active: boolean } | null = null;
    if (data.executionType === TripExecutionType.OWN) {
      [vehicle, driver] = await Promise.all([
        prisma.vehicle.findFirst({ where: { id: data.vehicleId, status: { not: "INACTIVE" } }, select: { id: true, mileage: true } }),
        prisma.driver.findFirst({ where: { id: data.driverId, status: "ACTIVE" }, select: { id: true } }),
      ]);
      if (!vehicle) return { error: "La unidad no está disponible.", fieldErrors: { vehicleId: "Selecciona una unidad disponible." } };
      if (!driver) return { error: "El operador no está activo.", fieldErrors: { driverId: "Selecciona un operador activo." } };
      if (data.mileageStart! < vehicle.mileage) return { error: `El kilometraje inicial no puede ser menor al odómetro actual (${vehicle.mileage.toLocaleString("es-MX")} km).`, fieldErrors: { mileageStart: "Menor al odómetro de la unidad." } };
      const conflict = await prisma.trip.findFirst({ where: { status: "IN_PROGRESS", ...(id ? { NOT: { id } } : {}), OR: [{ vehicleId: vehicle.id }, { driverId: driver.id }] }, select: { id: true } });
      if (conflict) return { error: "El operador o la unidad ya tiene un viaje en curso." };
    } else {
      carrier = await prisma.externalCarrier.findUnique({ where: { id: data.externalCarrierId }, select: { id: true, businessName: true, active: true } });
      if (!carrier || (!carrier.active && carrier.id !== existing?.externalCarrierId)) return { error: "El transportista no está activo.", fieldErrors: { externalCarrierId: "Selecciona un transportista activo." } };
    }

    const commonData = {
      executionType: data.executionType,
      clientId: data.clientId,
      destinationAddressId: data.destinationAddressId,
      clientNameSnapshot: address.client.commercialName || address.client.businessName,
      destinationNameSnapshot: address.name,
      destinationSnapshot: formatAddress(address),
      origin: data.origin,
      vehicleId: vehicle?.id ?? null,
      driverId: driver?.id ?? null,
      externalCarrierId: carrier?.id ?? null,
      externalCarrierNameSnapshot: carrier?.businessName ?? null,
      externalVehicleDescription: data.executionType === TripExecutionType.SUBCONTRACTED ? data.externalVehicleDescription || null : null,
      externalDriverName: data.executionType === TripExecutionType.SUBCONTRACTED ? data.externalDriverName || null : null,
      subcontractorCost: data.executionType === TripExecutionType.SUBCONTRACTED ? data.subcontractorCost : null,
      scheduledStartAt: date,
      mileageStart: data.executionType === TripExecutionType.OWN ? data.mileageStart! : null,
      revenue: data.revenue,
      notes: data.notes || null,
      updatedById: user.id,
    };

    if (id) {
      const updatedTrip = await prisma.$transaction(async (tx) => {
        const current = await tx.trip.findUnique({ where: { id }, select: { status: true, executionType: true } });
        if (!current || current.status !== "SCHEDULED") return null;
        const paymentDefaults = data.executionType === TripExecutionType.SUBCONTRACTED
          ? current.executionType === TripExecutionType.SUBCONTRACTED ? {} : { customerPaymentStatus: PaymentStatus.PENDING, subcontractorPaymentStatus: PaymentStatus.PENDING }
          : { customerPaymentStatus: null, customerPaidAt: null, customerPaidByUserId: null, subcontractorPaymentStatus: null, subcontractorPaidAt: null, subcontractorPaidByUserId: null };
        const trip = await tx.trip.update({ where: { id }, data: { ...commonData, ...paymentDefaults }, select: { id: true, tripNumber: true, scheduledStartAt: true } });
        if (isWithinUpcomingWindow(trip.scheduledStartAt)) await createUpcomingTripNotification(tx, trip);
        return trip;
      });
      if (!updatedTrip) return { error: "Solo se pueden editar viajes programados." };
      revalidatePath("/trips");
      revalidatePath(`/trips/${id}`);
      redirect(`/trips/${id}`);
    }

    const trip = await prisma.$transaction(async (tx) => {
      const sequence = await tx.$queryRaw<Array<{ value: bigint }>>`SELECT nextval('"Trip_tripNumber_seq"') AS value`;
      const tripNumber = `TRP-${String(sequence[0].value).padStart(6, "0")}`;
      const createdTrip = await tx.trip.create({ data: {
        ...commonData,
        ...(data.executionType === TripExecutionType.SUBCONTRACTED ? { customerPaymentStatus: PaymentStatus.PENDING, subcontractorPaymentStatus: PaymentStatus.PENDING } : {}),
        tripNumber,
        createdById: user.id,
      }, select: { id: true, tripNumber: true, executionType: true, scheduledStartAt: true, externalCarrierNameSnapshot: true } });
      const subcontracted = createdTrip.executionType === TripExecutionType.SUBCONTRACTED;
      await createNotification(tx, {
        eventKey: `${subcontracted ? NotificationType.TRIP_SUBCONTRACTED_CREATED : NotificationType.TRIP_CREATED}:${createdTrip.id}`,
        type: subcontracted ? NotificationType.TRIP_SUBCONTRACTED_CREATED : NotificationType.TRIP_CREATED,
        title: subcontracted ? "Nuevo viaje subcontratado" : "Nuevo viaje",
        message: subcontracted ? `Se creó el viaje subcontratado ${createdTrip.tripNumber} con ${createdTrip.externalCarrierNameSnapshot}.` : `Se creó el viaje ${createdTrip.tripNumber}.`,
        entityType: NotificationEntityType.TRIP,
        entityId: createdTrip.id,
      });
      if (isWithinUpcomingWindow(createdTrip.scheduledStartAt)) await createUpcomingTripNotification(tx, createdTrip);
      return createdTrip;
    });
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
  const parsed = z.object({ id: z.string().min(1), action: z.enum(["start", "complete", "cancel"]), mileageEnd: optionalNumber(MAX_DATABASE_INT).refine((value) => value === undefined || Number.isInteger(value), "El kilometraje debe ser un entero.") }).safeParse({ id: formData.get("id"), action: formData.get("action"), mileageEnd: formData.get("mileageEnd") });
  if (!parsed.success) return;
  const { id, action, mileageEnd } = parsed.data;
  if (action === "cancel" && user.role === "EMPLOYEE") return;
  const transitioned = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id }, include: { vehicle: { select: { mileage: true } } } });
    if (!trip) return false;

    let nextStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    let tripUpdate: { status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; startedAt?: Date; completedAt?: Date; cancelledAt?: Date; mileageEnd?: number | null; updatedById: string };
    if (action === "start") {
      if (trip.status !== "SCHEDULED") return false;
      if (trip.executionType === TripExecutionType.OWN) {
        if (!trip.vehicleId || !trip.driverId || !trip.vehicle) return false;
        const active = await tx.trip.findFirst({ where: { status: "IN_PROGRESS", NOT: { id }, OR: [{ vehicleId: trip.vehicleId }, { driverId: trip.driverId }] }, select: { id: true } });
        if (active) return false;
      }
      nextStatus = "IN_PROGRESS";
      tripUpdate = { status: nextStatus, startedAt: new Date(), updatedById: user.id };
    } else if (action === "complete") {
      if (trip.status !== "IN_PROGRESS") return false;
      if (trip.executionType === TripExecutionType.OWN) {
        if (mileageEnd === undefined || trip.mileageStart === null || mileageEnd < trip.mileageStart || !trip.vehicleId || !trip.vehicle) return false;
        tripUpdate = { status: "COMPLETED", completedAt: new Date(), mileageEnd, updatedById: user.id };
      } else {
        if (mileageEnd !== undefined) return false;
        tripUpdate = { status: "COMPLETED", completedAt: new Date(), mileageEnd: null, updatedById: user.id };
      }
      nextStatus = "COMPLETED";
    } else {
      if (trip.status !== "SCHEDULED" && trip.status !== "IN_PROGRESS") return false;
      nextStatus = "CANCELLED";
      tripUpdate = { status: nextStatus, cancelledAt: new Date(), updatedById: user.id };
    }

    const updated = await tx.trip.updateMany({ where: { id, status: trip.status }, data: tripUpdate });
    if (updated.count !== 1) return false;

    if (trip.executionType === TripExecutionType.OWN && trip.vehicleId) {
      if (action === "start") {
        await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "IN_ROUTE" } });
      } else if (action === "complete") {
        if (mileageEnd! > trip.vehicle!.mileage) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { mileage: mileageEnd } });
        await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } });
      } else if (trip.status === "IN_PROGRESS") {
        await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } });
      }
    }

    const notificationType = action === "start"
      ? NotificationType.TRIP_STARTED
      : action === "complete"
        ? NotificationType.TRIP_COMPLETED
        : NotificationType.TRIP_CANCELLED;
    const eventWord = action === "start" ? "ha iniciado" : action === "complete" ? "fue completado" : "fue cancelado";
    await createNotification(tx, {
      eventKey: `${notificationType}:${trip.id}`,
      type: notificationType,
      title: action === "start" ? "Viaje iniciado" : action === "complete" ? "Viaje completado" : "Viaje cancelado",
      message: `El viaje ${trip.tripNumber} ${eventWord}.`,
      entityType: NotificationEntityType.TRIP,
      entityId: trip.id,
    });
    return true;
  });
  if (!transitioned) return;
  revalidatePath("/trips");
  revalidatePath(`/trips/${id}`);
  revalidatePath("/dashboard");
  redirect(`/trips/${id}`);
}

export async function setTripPaymentStatus(formData: FormData) {
  const user = await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({ id: z.string().cuid(), payment: z.enum(["customer", "subcontractor"]), status: z.nativeEnum(PaymentStatus) }).safeParse({
    id: formData.get("id"), payment: formData.get("payment"), status: formData.get("status"),
  });
  if (!parsed.success) return;

  const result = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findFirst({ where: { id: parsed.data.id, executionType: TripExecutionType.SUBCONTRACTED }, select: { id: true, tripNumber: true, customerPaymentStatus: true, subcontractorPaymentStatus: true } });
    if (!trip) return false;
    const customerPayment = parsed.data.payment === "customer";
    const currentStatus = customerPayment ? trip.customerPaymentStatus : trip.subcontractorPaymentStatus;
    if (!currentStatus || currentStatus === parsed.data.status) return false;

    const paidAt = parsed.data.status === PaymentStatus.PAID ? new Date() : null;
    const where = customerPayment
      ? { id: trip.id, executionType: TripExecutionType.SUBCONTRACTED, customerPaymentStatus: currentStatus }
      : { id: trip.id, executionType: TripExecutionType.SUBCONTRACTED, subcontractorPaymentStatus: currentStatus };
    const data = customerPayment
      ? { customerPaymentStatus: parsed.data.status, customerPaidAt: paidAt, customerPaidByUserId: paidAt ? user.id : null }
      : { subcontractorPaymentStatus: parsed.data.status, subcontractorPaidAt: paidAt, subcontractorPaidByUserId: paidAt ? user.id : null };
    const updated = await tx.trip.updateMany({ where, data });
    if (updated.count !== 1) return false;

    if (paidAt) {
      const type = customerPayment ? NotificationType.TRIP_CUSTOMER_PAYMENT_RECEIVED : NotificationType.TRIP_SUBCONTRACTOR_PAYMENT_COMPLETED;
      await createNotification(tx, {
        eventKey: `${type}:${trip.id}:${paidAt.getTime()}`,
        type,
        title: customerPayment ? "Pago del cliente registrado" : "Pago al transportista liquidado",
        message: customerPayment ? `El pago del viaje ${trip.tripNumber} fue registrado.` : `El pago al transportista del viaje ${trip.tripNumber} fue liquidado.`,
        entityType: NotificationEntityType.TRIP,
        entityId: trip.id,
      });
    }
    return true;
  });
  if (result) {
    revalidatePath("/trips");
    revalidatePath(`/trips/${parsed.data.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
  }
  redirect(`/trips/${parsed.data.id}`);
}
