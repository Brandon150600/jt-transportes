import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { TripForm } from "../trip-form";

export default async function NewTripPage({ searchParams }: { searchParams: Promise<{ clientId?: string; vehicleId?: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const params = await searchParams;
  const [clients, vehicles, drivers] = await Promise.all([
    prisma.client.findMany({ where: { active: true }, orderBy: { businessName: "asc" }, include: { addresses: { where: { active: true }, orderBy: { name: "asc" } } } }),
    prisma.vehicle.findMany({ where: { status: { not: "INACTIVE" } }, orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true, brand: true, model: true, mileage: true, driverId: true } }),
    prisma.driver.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  const clientOptions = clients.map((client) => ({ id: client.id, label: client.commercialName || client.businessName, addresses: client.addresses.map((address) => ({ id: address.id, name: address.name, address: [address.city, address.state].filter(Boolean).join(", ") })) }));
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8"><Link href="/trips" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a viajes</Link><header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Operación</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Programar viaje</h1><p className="mt-2 text-sm text-zinc-500">Elige cliente, destino, unidad y operador para registrar el servicio.</p></header><TripForm clients={clientOptions} vehicles={vehicles.map((vehicle) => ({ id: vehicle.id, label: `${vehicle.economicNumber} · ${vehicle.brand} ${vehicle.model}`, mileage: vehicle.mileage, assignedDriverId: vehicle.driverId }))} drivers={drivers} defaults={{ clientId: params.clientId, vehicleId: params.vehicleId }} /></div></main>;
}
