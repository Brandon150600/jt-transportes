import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { setExternalCarrierActive } from "@/app/actions/external-carriers";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ExternalCarriersPage() {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const carriers = await prisma.externalCarrier.findMany({ orderBy: [{ active: "desc" }, { businessName: "asc" }], include: { _count: { select: { trips: true } } } });
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-company-600">Viajes subcontratados</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Transportistas externos</h1><p className="mt-2 text-sm text-zinc-500">Catálogo de empresas que ejecutan viajes para JT.</p></div><Link href="/external-carriers/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white"><Plus className="size-4" /> Nuevo transportista</Link></header>
    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">{carriers.length ? <div className="divide-y divide-zinc-100">{carriers.map((carrier) => <div key={carrier.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><Link href={`/external-carriers/${carrier.id}`} className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600"><Building2 className="size-5" /></span><span className="min-w-0"><span className="block truncate font-semibold text-zinc-900">{carrier.businessName}</span><span className="mt-1 block truncate text-xs text-zinc-500">{carrier.contactName ?? carrier.phone ?? carrier.email ?? "Sin datos de contacto"} · {carrier._count.trips} viajes</span></span></Link><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${carrier.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{carrier.active ? "Activo" : "Inactivo"}</span><form action={setExternalCarrierActive}><input type="hidden" name="id" value={carrier.id} /><input type="hidden" name="active" value={String(carrier.active)} /><button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">{carrier.active ? "Desactivar" : "Activar"}</button></form></div></div>)}</div> : <p className="p-12 text-center text-sm text-zinc-500">Aún no hay transportistas externos.</p>}</section>
  </div></main>;
}
