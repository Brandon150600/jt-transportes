import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, Receipt, Truck, UserRound, Wallet } from "lucide-react";
import { setFleetExpensePayment } from "@/app/actions/fleet-expenses";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const categoryLabels: Record<string, string> = { FUEL: "Combustible", TOLLS: "Casetas", PER_DIEM: "Viáticos", PARTS: "Refacciones", MAINTENANCE: "Mantenimiento", WASH: "Lavado", TIRES: "Llantas", OTHER: "Otro" };
const money = (value: unknown) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value));

export default async function FleetExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const { id } = await params;
  const expense = await prisma.fleetExpense.findUnique({
    where: { id },
    include: {
      vehicle: { select: { id: true, economicNumber: true, brand: true, model: true } },
      supplier: { select: { id: true, name: true, phone: true, taxId: true } },
      createdBy: { select: { name: true, email: true } },
      paidBy: { select: { name: true, email: true } },
      items: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!expense) notFound();
  const isPaid = expense.paymentStatus === "PAID";

  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
    <Link href="/fleet-expenses" className="inline-flex items-center gap-2 text-sm font-semibold text-company-700"><ArrowLeft className="size-4" /> Volver a gastos</Link>
    <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-company-600">{expense.vehicle.economicNumber} · {categoryLabels[expense.category]}</p><h1 className="mt-1 text-3xl font-black text-zinc-900">{expense.description}</h1><p className="mt-2 text-sm text-zinc-500">Registrado el {expense.expenseDate.toLocaleDateString("es-MX", { timeZone: "UTC" })}</p></div><Link href={`/fleet-expenses/${id}/edit`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold"><Pencil className="size-4" /> Editar</Link></header>
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Truck className="size-5 text-company-600" /><div><h2 className="font-bold text-zinc-900">Unidad y proveedor</h2><p className="mt-1 text-sm text-zinc-600">{expense.vehicle.economicNumber} · {expense.vehicle.brand} {expense.vehicle.model}</p></div></div><div className="mt-4 border-t border-zinc-100 pt-4"><p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Proveedor</p><p className="mt-1 text-sm font-semibold text-zinc-800">{expense.supplier?.name ?? "Sin proveedor"}</p>{expense.supplier?.phone && <p className="mt-1 text-xs text-zinc-500">{expense.supplier.phone}</p>}</div></section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-zinc-900">Conceptos</h2>{expense.items.length ? <div className="mt-4 divide-y divide-zinc-100">{expense.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-medium text-zinc-800">{item.description}</p><p className="mt-1 text-xs text-zinc-500">{Number(item.quantity)}{item.unit ? ` ${item.unit}` : ""} × {money(item.unitCost)}</p></div><p className="font-semibold text-zinc-800">{money(item.subtotal)}</p></div>)}</div> : <p className="mt-2 text-sm text-zinc-500">Registro rápido sin desglose de conceptos.</p>}<div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm"><Line label="Subtotal" value={money(expense.subtotal)} /><Line label="Mano de obra" value={money(expense.laborAmount)} /><Line label="Total" value={money(expense.total)} strong /></div></section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-zinc-900">Información adicional</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><Info icon={CalendarDays} label="Kilometraje" value={expense.mileage?.toLocaleString("es-MX") ?? "No registrado"} /><Info icon={Receipt} label="Factura o ticket" value={expense.receiptNumber ?? "No registrado"} /><Info icon={UserRound} label="Registrado por" value={expense.createdBy.name ?? expense.createdBy.email} /><Info icon={Wallet} label="Origen" value={expense.source} /></div>{expense.notes && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600">{expense.notes}</p>}</section>
      </div>
      <aside className="space-y-5"><section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-bold text-zinc-900">Estado de pago</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{isPaid ? "Pagado" : "Pendiente"}</span></div>{isPaid && <div className="mt-4 text-sm text-zinc-600"><p>{expense.paidAt?.toLocaleDateString("es-MX")}</p>{expense.paidBy && <p className="mt-1">Marcado por {expense.paidBy.name ?? expense.paidBy.email}</p>}{expense.paymentMethod && <p className="mt-1">Método: {expense.paymentMethod}</p>}{expense.paymentReference && <p className="mt-1">Referencia: {expense.paymentReference}</p>}{expense.paymentNotes && <p className="mt-1 whitespace-pre-wrap">{expense.paymentNotes}</p>}</div>}<form action={setFleetExpensePayment} className="mt-4 space-y-2"><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={isPaid ? "PENDING" : "PAID"} />{!isPaid && <><input name="paymentMethod" placeholder="Método de pago (opcional)" className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm" /><input name="paymentReference" placeholder="Referencia (opcional)" className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm" /><textarea name="paymentNotes" placeholder="Notas de pago (opcional)" rows={2} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" /></>}<button className={`h-10 w-full rounded-xl text-sm font-bold ${isPaid ? "border border-zinc-200 text-zinc-700" : "bg-emerald-600 text-white"}`}>{isPaid ? "Marcar pendiente" : "Marcar como pagado"}</button></form></section>
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm shadow-sm"><h2 className="font-bold text-zinc-900">Trazabilidad</h2><p className="mt-3 text-zinc-600">Creado: {expense.createdAt.toLocaleString("es-MX")}</p><p className="mt-1 text-zinc-600">Última actualización: {expense.updatedAt.toLocaleString("es-MX")}</p></section></aside>
    </div>
  </div></main>;
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between ${strong ? "border-t border-zinc-100 pt-3 text-base font-bold text-zinc-950" : "text-zinc-500"}`}><span>{label}</span><span>{value}</span></div>; }
function Info({ icon: Icon, label, value }: { icon: typeof Truck; label: string; value: string }) { return <div className="rounded-xl bg-zinc-50 p-3"><p className="flex items-center gap-2 text-xs text-zinc-500"><Icon className="size-3.5" />{label}</p><p className="mt-1 text-sm font-semibold text-zinc-800">{value}</p></div>; }
