import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function SuppliersPage() {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const suppliers = await prisma.supplier.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }], include: { _count: { select: { fleetExpenses: true } } } });
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-company-600">Gastos de flota</p><h1 className="mt-1 text-3xl font-black text-zinc-900">Proveedores</h1><p className="mt-2 text-sm text-zinc-500">Catálogo de talleres, refaccionarias y prestadores de servicio.</p></div><Link href="/suppliers/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white"><Plus className="size-4" /> Nuevo proveedor</Link></header>
    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">{suppliers.length ? <div className="divide-y divide-zinc-100">{suppliers.map((supplier) => <Link key={supplier.id} href={`/suppliers/${supplier.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 sm:px-5"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600"><Building2 className="size-5" /></span><div className="min-w-0"><p className="truncate font-semibold text-zinc-900">{supplier.name}</p><p className="mt-1 truncate text-xs text-zinc-500">{supplier.phone ?? supplier.email ?? "Sin datos de contacto"}</p></div></div><div className="flex shrink-0 items-center gap-3"><span className="hidden text-xs text-zinc-500 sm:inline">{supplier._count.fleetExpenses} gastos</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${supplier.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{supplier.active ? "Activo" : "Inactivo"}</span></div></Link>)}</div> : <div className="p-12 text-center"><p className="font-semibold text-zinc-800">Aún no hay proveedores</p><p className="mt-1 text-sm text-zinc-500">Puedes crear uno aquí o desde el formulario de gasto.</p></div>}</section>
  </div></main>;
}
