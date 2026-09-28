import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Pencil } from "lucide-react";
import { toggleSupplierActive } from "@/app/actions/suppliers";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { fleetExpenses: { orderBy: { expenseDate: "desc" }, take: 20, include: { vehicle: { select: { economicNumber: true } } } } },
  });
  if (!supplier) notFound();
  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/suppliers" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a proveedores</Link>
    <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-xl bg-company-50 text-company-600"><Building2 className="size-6" /></span><div><p className="text-sm text-zinc-500">Proveedor</p><h1 className="text-3xl font-black text-zinc-900">{supplier.name}</h1></div></div><div className="flex gap-2"><Link href={`/suppliers/${id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold"><Pencil className="size-4" /> Editar</Link><form action={toggleSupplierActive}><input type="hidden" name="id" value={id} /><input type="hidden" name="active" value={String(supplier.active)} /><button className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold">{supplier.active ? "Desactivar" : "Activar"}</button></form></div></header>
    <section className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]"><article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-zinc-900">Datos de contacto</h2><dl className="mt-4 space-y-4 text-sm"><Info label="Teléfono" value={supplier.phone} /><Info label="Correo" value={supplier.email} /><Info label="RFC / ID fiscal" value={supplier.taxId} /><Info label="Dirección" value={supplier.address} /><Info label="Notas" value={supplier.notes} /></dl></article>
      <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-100 p-5"><h2 className="font-bold text-zinc-900">Gastos asociados</h2><p className="mt-1 text-sm text-zinc-500">Historial reciente registrado con este proveedor.</p></div>{supplier.fleetExpenses.length ? <div className="divide-y divide-zinc-100">{supplier.fleetExpenses.map((expense) => <Link key={expense.id} href={`/fleet-expenses/${expense.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50"><div><p className="font-semibold text-zinc-900">{expense.description}</p><p className="mt-1 text-xs text-zinc-500">{expense.vehicle.economicNumber} · {expense.expenseDate.toLocaleDateString("es-MX", { timeZone: "UTC" })}</p></div><p className="shrink-0 text-sm font-bold text-zinc-800">{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(expense.total))}</p></Link>)}</div> : <p className="p-8 text-center text-sm text-zinc-500">Todavía no hay gastos asociados.</p>}</article></section>
  </div></main>;
}

function Info({ label, value }: { label: string; value: string | null }) { return <div><dt className="text-xs font-medium text-zinc-400">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-zinc-700">{value || "—"}</dd></div>; }
