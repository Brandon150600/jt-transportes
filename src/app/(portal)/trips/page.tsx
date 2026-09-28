import Link from "next/link";
import { Plus, Route, Search } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const statusLabel = { SCHEDULED: "Programado", IN_PROGRESS: "En curso", COMPLETED: "Completado", CANCELLED: "Cancelado" };
const statusStyle = { SCHEDULED: "bg-blue-50 text-blue-700", IN_PROGRESS: "bg-amber-50 text-amber-700", COMPLETED: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-zinc-100 text-zinc-500" };

export default async function TripsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const status = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(params.status ?? "") ? params.status as keyof typeof statusLabel : undefined;
  const trips = await prisma.trip.findMany({
    where: { ...(status ? { status } : {}), ...(params.q ? { OR: [{ tripNumber: { contains: params.q, mode: "insensitive" } }, { clientNameSnapshot: { contains: params.q, mode: "insensitive" } }, { origin: { contains: params.q, mode: "insensitive" } }, { destinationNameSnapshot: { contains: params.q, mode: "insensitive" } }] } : {}) },
    include: { vehicle: { select: { economicNumber: true } }, driver: { select: { name: true } } }, orderBy: [{ scheduledStartAt: "desc" }], take: 100,
  });
  const finance = user.role !== "EMPLOYEE";
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-company-600">Operación</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Viajes</h1><p className="mt-2 text-sm text-zinc-500">Programación, seguimiento y rendimiento por recorrido.</p></div>{finance && <Link href="/trips/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white"><Plus className="size-4" /> Programar viaje</Link>}</header>
    <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><input name="q" defaultValue={params.q} placeholder="Buscar folio, cliente, origen o destino" className="h-10 w-full rounded-lg border border-zinc-200 pl-9 pr-3 text-sm" /></label><select name="status" defaultValue={status ?? ""} className="h-10 rounded-lg border border-zinc-200 px-3 text-sm"><option value="">Todos los estados</option>{Object.entries(statusLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white">Filtrar</button></form>
    <section className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">{trips.length ? <div className="divide-y divide-zinc-100">{trips.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className="flex flex-col gap-3 p-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-700"><Route className="size-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-zinc-900">{trip.tripNumber}</p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[trip.status]}`}>{statusLabel[trip.status]}</span></div><p className="mt-1 truncate text-sm text-zinc-600">{trip.clientNameSnapshot} · {trip.origin} → {trip.destinationNameSnapshot}</p><p className="mt-1 text-xs text-zinc-500">{trip.scheduledStartAt.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" })} · {trip.vehicle.economicNumber} · {trip.driver.name}</p></div></div>{finance && <p className="pl-13 text-sm font-bold text-zinc-800 sm:pl-0">${Number(trip.revenue).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>}</Link>)}</div> : <div className="p-12 text-center"><Route className="mx-auto size-9 text-zinc-300" /><p className="mt-3 font-semibold text-zinc-800">No hay viajes que coincidan</p><p className="mt-1 text-sm text-zinc-500">Ajusta la búsqueda o programa el primer viaje.</p></div>}</section>
  </div></main>;
}
