import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { TripForm } from "../../trip-form";

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.status !== "SCHEDULED") notFound();
  const [clients, vehicles, drivers, carriers] = await Promise.all([
    prisma.client.findMany({ where: { OR: [{ active: true }, { id: trip.clientId }] }, orderBy: { businessName: "asc" }, include: { addresses: { where: { OR: [{ active: true }, { id: trip.destinationAddressId }] }, orderBy: { name: "asc" } } } }),
    prisma.vehicle.findMany({ where: { OR: [{ status: { not: "INACTIVE" } }, ...(trip.vehicleId ? [{ id: trip.vehicleId }] : [])] }, orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true, brand: true, model: true, mileage: true, driverId: true } }),
    prisma.driver.findMany({ where: { OR: [{ status: "ACTIVE" }, ...(trip.driverId ? [{ id: trip.driverId }] : [])] }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.externalCarrier.findMany({ where: { OR: [{ active: true }, ...(trip.externalCarrierId ? [{ id: trip.externalCarrierId }] : [])] }, orderBy: { businessName: "asc" }, select: { id: true, businessName: true, active: true } }),
  ]);
  const clientOptions = clients.map((client) => ({ id: client.id, label: client.commercialName || client.businessName, addresses: client.addresses.map((address) => ({ id: address.id, name: address.name, address: [address.city, address.state].filter(Boolean).join(", ") })) }));
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8"><Link href={`/trips/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver al viaje</Link><header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">{trip.tripNumber}</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Editar viaje programado</h1></header><TripForm clients={clientOptions} vehicles={vehicles.map((vehicle) => ({ id: vehicle.id, label: `${vehicle.economicNumber} · ${vehicle.brand} ${vehicle.model}`, mileage: vehicle.mileage, assignedDriverId: vehicle.driverId }))} drivers={drivers} carriers={carriers} trip={{ id: trip.id, executionType: trip.executionType, clientId: trip.clientId, destinationAddressId: trip.destinationAddressId, origin: trip.origin, vehicleId: trip.vehicleId, driverId: trip.driverId, externalCarrierId: trip.externalCarrierId, externalVehicleDescription: trip.externalVehicleDescription, externalDriverName: trip.externalDriverName, subcontractorCost: trip.subcontractorCost?.toString() ?? null, scheduledStartAt: trip.scheduledStartAt.toISOString(), mileageStart: trip.mileageStart, revenue: trip.revenue.toString(), notes: trip.notes }} /></div></main>;
}
