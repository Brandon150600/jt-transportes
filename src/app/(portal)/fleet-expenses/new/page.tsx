import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { ExpenseForm } from "../expense-form";

export default async function NewFleetExpensePage({ searchParams }: { searchParams: Promise<{ tripId?: string; vehicleId?: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const params = await searchParams;
  const [vehicles, suppliers, trips] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true, brand: true, model: true } }),
    prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.trip.findMany({ where: { executionType: "OWN", vehicleId: { not: null }, status: { in: ["SCHEDULED", "IN_PROGRESS", "COMPLETED"] } }, orderBy: { scheduledStartAt: "desc" }, select: { id: true, tripNumber: true, vehicleId: true, clientNameSnapshot: true, status: true } }),
  ]);
  const ownTrips = trips.filter((trip): trip is typeof trip & { vehicleId: string } => trip.vehicleId !== null);
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/fleet-expenses" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a gastos</Link>
    <header className="mb-6 mt-5"><p className="text-sm font-semibold text-company-600">Gastos de flota</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Registrar gasto</h1><p className="mt-2 text-sm text-zinc-500">Captura lo esencial en pocos pasos; el detalle es opcional.</p></header>
    <ExpenseForm vehicles={vehicles} suppliers={suppliers} trips={ownTrips} defaultTripId={params.tripId} defaultVehicleId={params.vehicleId} />
  </div></main>;
}
