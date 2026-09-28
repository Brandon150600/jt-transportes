import Link from "next/link";
import { Plus, Search, Wallet } from "lucide-react";
import { ExpenseCategory, PaymentStatus } from "@/generated/prisma/client/enums";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const categoryLabels: Record<string, string> = {
  PARTS: "Refacciones", MAINTENANCE: "Mantenimiento", WASH: "Lavado", TIRES: "Llantas", OTHER: "Otro",
};

export default async function FleetExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string; category?: string; supplier?: string; payment?: string; from?: string; to?: string }>;
}) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const filters = await searchParams;
  const category = Object.values(ExpenseCategory).includes(filters.category as ExpenseCategory) ? filters.category as ExpenseCategory : undefined;
  const payment = Object.values(PaymentStatus).includes(filters.payment as PaymentStatus) ? filters.payment as PaymentStatus : undefined;
  const where = {
      ...(filters.vehicle ? { vehicleId: filters.vehicle } : {}),
      ...(category ? { category } : {}),
      ...(filters.supplier ? { supplierId: filters.supplier } : {}),
      ...(payment ? { paymentStatus: payment } : {}),
      ...(filters.from || filters.to ? { expenseDate: { ...(filters.from ? { gte: new Date(`${filters.from}T00:00:00.000Z`) } : {}), ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59.999Z`) } : {}) } } : {}),
  };
  const [expenses, vehicles, suppliers, totals, byCategory, byVehicle, bySupplier] = await Promise.all([
    prisma.fleetExpense.findMany({
    where,
    orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    take: 100,
    include: { vehicle: { select: { economicNumber: true } }, supplier: { select: { name: true } } },
    }),
    prisma.vehicle.findMany({ orderBy: { economicNumber: "asc" }, select: { id: true, economicNumber: true } }),
    prisma.supplier.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.fleetExpense.aggregate({ where, _sum: { total: true }, _count: { _all: true } }),
    prisma.fleetExpense.groupBy({ by: ["category"], where, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
    prisma.fleetExpense.groupBy({ by: ["vehicleId"], where, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
    prisma.fleetExpense.groupBy({ by: ["supplierId"], where: { ...where, supplierId: { not: null } }, _sum: { total: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
  ]);
  const currency = (amount: unknown) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(amount));
  const vehicleNames = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.economicNumber]));
  const supplierNames = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));

  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-company-600">Administración de flota</p><h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">Gastos de flota</h1><p className="mt-2 text-sm text-zinc-500">Consulta los gastos, sus proveedores y el estado de pago.</p></div><Link href="/fleet-expenses/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white"><Plus className="size-4" /> Registrar gasto</Link></header>
    <form className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
      <select name="vehicle" defaultValue={filters.vehicle ?? ""} className="h-10 rounded-lg border border-zinc-200 px-3 text-sm"><option value="">Todas las unidades</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.economicNumber}</option>)}</select>
      <select name="category" defaultValue={filters.category ?? ""} className="h-10 rounded-lg border border-zinc-200 px-3 text-sm"><option value="">Todas las categorías</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <select name="supplier" defaultValue={filters.supplier ?? ""} className="h-10 rounded-lg border border-zinc-200 px-3 text-sm"><option value="">Todos los proveedores</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <select name="payment" defaultValue={filters.payment ?? ""} className="h-10 rounded-lg border border-zinc-200 px-3 text-sm"><option value="">Todos los pagos</option><option value="PENDING">Pendientes</option><option value="PAID">Pagados</option></select>
      <input type="date" name="from" defaultValue={filters.from} aria-label="Desde" className="h-10 rounded-lg border border-zinc-200 px-3 text-sm" />
      <div className="flex gap-2"><input type="date" name="to" defaultValue={filters.to} aria-label="Hasta" className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 text-sm" /><button className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white"><Search className="size-4" /> Filtrar</button></div>
    </form>
    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Summary title="Total filtrado" value={currency(totals._sum.total ?? 0)} detail={`${totals._count._all} gastos`} />
      <Summary title="Por categoría" value={byCategory[0] ? categoryLabels[byCategory[0].category] : "—"} detail={byCategory[0] ? currency(byCategory[0]._sum.total ?? 0) : "Sin datos"} />
      <Summary title="Por unidad" value={byVehicle[0] ? vehicleNames.get(byVehicle[0].vehicleId) ?? "Unidad" : "—"} detail={byVehicle[0] ? currency(byVehicle[0]._sum.total ?? 0) : "Sin datos"} />
      <Summary title="Por proveedor" value={bySupplier[0]?.supplierId ? supplierNames.get(bySupplier[0].supplierId) ?? "Proveedor" : "—"} detail={bySupplier[0] ? currency(bySupplier[0]._sum.total ?? 0) : "Sin datos"} />
    </section>
    <section className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {expenses.length ? <div className="divide-y divide-zinc-100">{expenses.map((expense) => <Link key={expense.id} href={`/fleet-expenses/${expense.id}`} className="flex flex-col gap-3 p-4 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600"><Wallet className="size-5" /></div><div className="min-w-0"><p className="truncate font-semibold text-zinc-900">{expense.description}</p><p className="mt-1 text-xs text-zinc-500">{expense.vehicle.economicNumber} · {categoryLabels[expense.category]} · {expense.expenseDate.toLocaleDateString("es-MX", { timeZone: "UTC" })}{expense.supplier ? ` · ${expense.supplier.name}` : ""}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="text-sm font-bold text-zinc-900">{currency(expense.total)}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expense.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{expense.paymentStatus === "PAID" ? "Pagado" : "Pendiente"}</span></div></Link>)}</div> : <div className="p-12 text-center"><Wallet className="mx-auto size-9 text-zinc-300" /><p className="mt-3 font-semibold text-zinc-800">No hay gastos para estos filtros</p><p className="mt-1 text-sm text-zinc-500">Registra una compra o ajusta los filtros.</p></div>}
      <div className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">Mostrando hasta 100 registros recientes</div>
    </section>
  </div></main>;
}

function Summary({ title, value, detail }: { title: string; value: string; detail: string }) {
  return <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium text-zinc-500">{title}</p><p className="mt-2 truncate text-lg font-bold text-zinc-900">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></article>;
}
