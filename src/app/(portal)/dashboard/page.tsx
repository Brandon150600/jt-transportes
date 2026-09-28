import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Route,
  Truck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const money = (value: unknown) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value));

const vehicleStatusLabels: Record<string, string> = {
  AVAILABLE: "Disponible",
  IN_ROUTE: "En ruta",
  MAINTENANCE: "Mantenimiento",
  INACTIVE: "Inactiva",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [vehicleCounts, totalVehicles, activeDrivers, tripCounts, upcomingTripsCount, operationalTrips] = await Promise.all([
    prisma.vehicle.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.vehicle.count(),
    prisma.driver.count({ where: { status: "ACTIVE" } }),
    prisma.trip.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.trip.count({ where: { status: "SCHEDULED", scheduledStartAt: { gte: now, lt: nextWeek } } }),
    prisma.trip.findMany({ where: { OR: [{ status: "IN_PROGRESS" }, { status: "SCHEDULED", scheduledStartAt: { gte: now, lt: nextWeek } }] }, orderBy: [{ status: "asc" }, { scheduledStartAt: "asc" }], take: 5, include: { vehicle: { select: { economicNumber: true } }, driver: { select: { name: true } } } }),
  ]);

  const vehicleCount = (status: string) =>
    vehicleCounts.find((item) => item.status === status)?._count._all ?? 0;
  const tripCount = (status: string) => tripCounts.find((item) => item.status === status)?._count._all ?? 0;
  operationalTrips.sort((a, b) => Number(a.status === "SCHEDULED") - Number(b.status === "SCHEDULED") || a.scheduledStartAt.getTime() - b.scheduledStartAt.getTime());

  const monthRange = getCurrentMonthRange();
  const monthLabel = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    month: "long",
    year: "numeric",
  }).format(new Date());

  let stats = [
    { label: "Viajes en curso", value: String(tripCount("IN_PROGRESS")), description: "Operaciones iniciadas", icon: Route },
    { label: "Próximos 7 días", value: String(upcomingTripsCount), description: "Viajes programados", icon: CalendarDays },
    { label: "En mantenimiento", value: String(vehicleCount("MAINTENANCE")), description: "Unidades en taller", icon: Wrench },
    { label: "Unidades disponibles", value: String(vehicleCount("AVAILABLE")), description: "Listas para asignar", icon: MapPin },
  ];

  let monthlyExpenses: { total: number; count: number } | null = null;
  let pendingPayments: { total: number; count: number } | null = null;
  let monthlyTripPerformance: { count: number; revenue: number; costs: number; margin: number; kmPerLiter: number | null; missingFuelCount: number } | null = null;
  let recentExpenses: Awaited<ReturnType<typeof loadRecentExpenses>> = [];
  let recentVehicles: Awaited<ReturnType<typeof loadRecentVehicles>> = [];

  if (isAdmin) {
    const tripMonthRange = getCurrentMexicoMonthRange();
    const [monthAggregate, pendingAggregate, expenses, completedTrips] = await Promise.all([
      prisma.fleetExpense.aggregate({
        where: { status: "CONFIRMED", expenseDate: { gte: monthRange.start, lt: monthRange.end } },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.fleetExpense.aggregate({
        where: { status: "CONFIRMED", paymentStatus: "PENDING" },
        _sum: { total: true },
        _count: { _all: true },
      }),
      loadRecentExpenses(),
      prisma.trip.findMany({
        where: { status: "COMPLETED", completedAt: { gte: tripMonthRange.start, lt: tripMonthRange.end } },
        select: {
          revenue: true,
          mileageStart: true,
          mileageEnd: true,
          expenses: { where: { status: "CONFIRMED" }, select: { total: true, category: true, items: { select: { quantity: true, unit: true } } } },
        },
      }),
    ]);

    stats = [
      { label: "Viajes en curso", value: String(tripCount("IN_PROGRESS")), description: `${vehicleCount("IN_ROUTE")} unidades en ruta`, icon: Route },
      { label: "Próximos 7 días", value: String(upcomingTripsCount), description: "Viajes programados", icon: CalendarDays },
      { label: "Unidades disponibles", value: String(vehicleCount("AVAILABLE")), description: `${totalVehicles} unidades en flota`, icon: Truck },
      { label: "Pagos pendientes", value: String(pendingAggregate._count._all), description: money(pendingAggregate._sum.total ?? 0), icon: CreditCard },
    ];
    monthlyExpenses = { total: Number(monthAggregate._sum.total ?? 0), count: monthAggregate._count._all };
    pendingPayments = { total: Number(pendingAggregate._sum.total ?? 0), count: pendingAggregate._count._all };
    recentExpenses = expenses;
    const tripTotals = completedTrips.reduce((totals, trip) => {
      const costs = trip.expenses.reduce((sum, expense) => sum + Number(expense.total), 0);
      const fuelLiters = trip.expenses
        .filter((expense) => expense.category === "FUEL")
        .flatMap((expense) => expense.items)
        .filter((item) => ["l", "litro", "litros"].includes(item.unit?.trim().toLowerCase() ?? ""))
        .reduce((sum, item) => sum + Number(item.quantity), 0);
      const distance = trip.mileageEnd === null ? 0 : Math.max(0, trip.mileageEnd - trip.mileageStart);
      const hasEfficiencyData = fuelLiters > 0 && distance > 0;
      return {
        revenue: totals.revenue + Number(trip.revenue),
        costs: totals.costs + costs,
        distance: totals.distance + (hasEfficiencyData ? distance : 0),
        fuelLiters: totals.fuelLiters + (hasEfficiencyData ? fuelLiters : 0),
        missingFuelCount: totals.missingFuelCount + (fuelLiters > 0 ? 0 : 1),
      };
    }, { revenue: 0, costs: 0, distance: 0, fuelLiters: 0, missingFuelCount: 0 });
    monthlyTripPerformance = {
      count: completedTrips.length,
      revenue: tripTotals.revenue,
      costs: tripTotals.costs,
      margin: tripTotals.revenue - tripTotals.costs,
      kmPerLiter: tripTotals.fuelLiters > 0 ? tripTotals.distance / tripTotals.fuelLiters : null,
      missingFuelCount: tripTotals.missingFuelCount,
    };
  } else {
    recentVehicles = await loadRecentVehicles();
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="mb-5 sm:mb-8">
          <p className="text-sm font-medium text-company-600">JT Transportes</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Resumen de operación</h1>
          <p className="mt-1 text-sm text-zinc-500">Estado actual de la flota y actividad registrada.</p>
        </header>

        <section aria-label="Indicadores de operación" className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label} className="group rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-zinc-500 sm:text-sm">{stat.label}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-950 sm:mt-3 sm:text-3xl">{stat.value}</p>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-company-50 text-company-600 transition group-hover:bg-company group-hover:text-white sm:size-11 sm:rounded-xl"><Icon className="size-4 sm:size-5" /></div>
                </div>
                <p className="mt-3 hidden text-xs font-medium text-zinc-400 sm:block">{stat.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:mt-6 sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 sm:px-6 sm:py-4">
            <div><h2 className="font-bold text-zinc-950">Seguimiento de viajes</h2><p className="mt-1 text-xs text-zinc-500">Viajes en curso y salidas programadas para los próximos 7 días.</p></div>
            <Link href="/trips" className="inline-flex items-center gap-1 text-sm font-semibold text-company-600 hover:text-company-700">Ver viajes<ChevronRight className="size-4" /></Link>
          </div>
          {operationalTrips.length ? <div className="divide-y divide-zinc-100">{operationalTrips.map((trip, index) => <Link key={trip.id} href={`/trips/${trip.id}`} className={`${index > 2 ? "hidden sm:flex" : "flex"} flex-col gap-2 px-4 py-3 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4`}><div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 ${trip.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}><Route className="size-4" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-900 sm:text-base">{trip.tripNumber} · {trip.clientNameSnapshot}</p><p className="mt-1 truncate text-xs text-zinc-500">{trip.origin} → {trip.destinationNameSnapshot} · {trip.vehicle.economicNumber} · {trip.driver.name}</p></div></div><div className="flex items-center justify-between gap-4 pl-11 sm:justify-end sm:pl-0"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trip.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{trip.status === "IN_PROGRESS" ? "En curso" : "Programado"}</span><span className="text-xs text-zinc-500">{trip.scheduledStartAt.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" })}</span></div></Link>)}</div> : <EmptyState icon={Route} title="Sin viajes próximos" description="No hay viajes en curso ni salidas programadas para los próximos 7 días." />}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-zinc-950">{isAdmin ? "Gastos recientes" : "Unidades actualizadas"}</h2>
                <p className="mt-1 text-xs text-zinc-500">{isAdmin ? "Últimos gastos confirmados en la flota" : "Cambios recientes en las unidades registradas"}</p>
              </div>
              {isAdmin && <Link href="/fleet-expenses" className="hidden items-center gap-1 text-sm font-semibold text-company-600 transition hover:text-company-700 sm:flex">Ver gastos<ChevronRight className="size-4" /></Link>}
            </div>

            {isAdmin ? (
              recentExpenses.length ? (
                <div className="divide-y divide-zinc-100">
                  {recentExpenses.map((expense, index) => (
                    <Link key={expense.id} href={`/fleet-expenses/${expense.id}`} className={`group ${index > 2 ? "hidden sm:flex" : "flex"} flex-col gap-3 px-4 py-3 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4`}>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 group-hover:bg-company-50 group-hover:text-company-600"><Wallet className="size-5" /></span>
                        <div className="min-w-0"><p className="truncate font-semibold text-zinc-900">{expense.description}</p><p className="mt-1 truncate text-xs text-zinc-500">{expense.vehicle.economicNumber}{expense.supplier ? ` · ${expense.supplier.name}` : ""} · {expense.expenseDate.toLocaleDateString("es-MX", { timeZone: "UTC" })}</p></div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end"><span className="text-sm font-bold text-zinc-900">{money(expense.total)}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expense.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{expense.paymentStatus === "PAID" ? "Pagado" : "Pendiente"}</span></div>
                    </Link>
                  ))}
                </div>
              ) : <EmptyState icon={Wallet} title="Aún no hay gastos" description="Los gastos confirmados aparecerán aquí." />
            ) : (
              recentVehicles.length ? (
                <div className="divide-y divide-zinc-100">
                  {recentVehicles.map((vehicle, index) => (
                    <Link key={vehicle.id} href={`/fleet-management/${vehicle.id}`} className={`group ${index > 2 ? "hidden sm:flex" : "flex"} items-center justify-between gap-4 px-4 py-3 transition hover:bg-zinc-50 sm:px-6 sm:py-4`}>
                      <div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 group-hover:bg-company-50 group-hover:text-company-600"><Truck className="size-5" /></span><div className="min-w-0"><p className="font-semibold text-zinc-900">{vehicle.economicNumber}</p><p className="mt-1 truncate text-xs text-zinc-500">{vehicle.brand} {vehicle.model} · Actualizada {vehicle.updatedAt.toLocaleDateString("es-MX")}</p></div></div>
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">{vehicleStatusLabels[vehicle.status]}</span>
                    </Link>
                  ))}
                </div>
              ) : <EmptyState icon={Truck} title="Aún no hay unidades" description="Las unidades registradas aparecerán aquí." />
            )}

            <Link href={isAdmin ? "/fleet-expenses" : "/fleet-management"} className="flex w-full items-center justify-center gap-1 border-t border-zinc-100 px-5 py-4 text-sm font-semibold text-company-600 hover:bg-zinc-50 sm:hidden">{isAdmin ? "Ver todos los gastos" : "Consultar flota"}<ChevronRight className="size-4" /></Link>
          </section>

          <aside className="space-y-6">
            {isAdmin && monthlyExpenses && pendingPayments ? (
              <section className="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white shadow-sm">
                <div className="absolute -right-12 -top-12 size-40 rounded-full bg-company/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-white/10"><CalendarDays className="size-5 text-white" /></div><div><p className="text-xs font-medium capitalize text-zinc-400">Gastos del mes</p><p className="font-bold text-white">{monthLabel}</p></div></div>
                  <p className="mt-7 text-3xl font-extrabold tracking-tight">{money(monthlyExpenses.total)}</p><p className="mt-1 text-sm text-zinc-400">{monthlyExpenses.count} {monthlyExpenses.count === 1 ? "gasto confirmado" : "gastos confirmados"}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="flex items-center gap-2 text-xs text-zinc-400"><Clock3 className="size-3.5" />Pendiente de pago</span><span className="text-sm font-bold text-white">{money(pendingPayments.total)}</span></div>
                  <Link href="/fleet-expenses?payment=PENDING" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-zinc-300">Ver {pendingPayments.count} pendientes<ChevronRight className="size-4" /></Link>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-company-50 text-company-600"><Users className="size-5" /></div><div><h2 className="font-bold text-zinc-950">Operadores activos</h2><p className="mt-1 text-xs text-zinc-500">{activeDrivers} registrados</p></div></div><div className="mt-4 border-t border-zinc-100 pt-4"><p className="text-sm text-zinc-600">Consulta el estado y asignación de las unidades en la sección de flota.</p><Link href="/fleet-management" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-company-600">Consultar flota<ChevronRight className="size-4" /></Link></div></section>
            )}

            {isAdmin && monthlyTripPerformance && <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-zinc-950">Rentabilidad de viajes</h2><p className="mt-1 text-xs capitalize text-zinc-500">Completados en {monthLabel}</p></div><Link href="/trips?status=COMPLETED" className="shrink-0 text-xs font-semibold text-company-700 hover:text-company-800">Ver viajes</Link></div>
              {monthlyTripPerformance.count ? <>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <PerformanceMetric label="Ingresos" value={money(monthlyTripPerformance.revenue)} />
                  <PerformanceMetric label="Gastos vinculados" value={money(monthlyTripPerformance.costs)} />
                  <PerformanceMetric label="Margen directo" value={money(monthlyTripPerformance.margin)} emphasize />
                  <PerformanceMetric label="Rendimiento" value={monthlyTripPerformance.kmPerLiter === null ? "Sin datos" : `${monthlyTripPerformance.kmPerLiter.toFixed(2)} km/L`} />
                </div>
                <p className="mt-3 text-xs text-zinc-500">{monthlyTripPerformance.count} {monthlyTripPerformance.count === 1 ? "viaje completado" : "viajes completados"} · {monthlyTripPerformance.missingFuelCount ? `${monthlyTripPerformance.missingFuelCount} sin litros de combustible registrados` : "Combustible registrado en todos"}</p>
              </> : <p className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-500">Todavía no hay viajes completados este mes.</p>}
            </section>}

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div><h2 className="font-bold text-zinc-950">Accesos rápidos</h2><p className="mt-1 text-xs text-zinc-500">Secciones disponibles para tu cuenta</p></div>
              <div className="mt-5 space-y-2">
                {isAdmin && <QuickAction icon={Wallet} title="Registrar gasto" description="Añadir un gasto de flota" href="/fleet-expenses/new" />}
                {isAdmin && <QuickAction icon={Route} title="Programar viaje" description="Asignar cliente, unidad y operador" href="/trips/new" />}
                <QuickAction icon={CalendarDays} title="Consultar viajes" description="Seguimiento de rutas y servicios" href="/trips" />
                <QuickAction icon={MapPin} title="Consultar flota" description="Ver unidades" href="/fleet-management" />
                {isAdmin && <QuickAction icon={Building2} title="Consultar clientes" description="Ver empresas y ubicaciones" href="/clients" />}
                {isAdmin && <QuickAction icon={Users} title="Consultar proveedores" description="Ver el catálogo" href="/suppliers" />}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

async function loadRecentExpenses() {
  return prisma.fleetExpense.findMany({
    where: { status: "CONFIRMED" },
    orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    take: 5,
    include: {
      vehicle: { select: { economicNumber: true } },
      supplier: { select: { name: true } },
    },
  });
}

async function loadRecentVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, economicNumber: true, brand: true, model: true, status: true, updatedAt: true },
  });
}

function getCurrentMonthRange() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

function getCurrentMexicoMonthRange() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", year: "numeric", month: "numeric" }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const nextMonth = new Date(Date.UTC(year, month, 1));
  return {
    start: mexicoLocalDateTimeToUtc(year, month, 1),
    end: mexicoLocalDateTimeToUtc(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1, 1),
  };
}

function mexicoLocalDateTimeToUtc(year: number, month: number, day: number) {
  const target = Date.UTC(year, month - 1, day);
  let instant = target;
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  for (let attempt = 0; attempt < 3; attempt++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((part) => [part.type, Number(part.value)]));
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const adjustment = target - represented;
    instant += adjustment;
    if (adjustment === 0) break;
  }
  return new Date(instant);
}

function PerformanceMetric({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return <div className={`min-w-0 rounded-xl p-3 ${emphasize ? "bg-company-50" : "bg-zinc-50"}`}>
    <p className="truncate text-[11px] font-medium text-zinc-500">{label}</p>
    <p className={`mt-1 truncate text-sm font-bold ${emphasize ? "text-company-800" : "text-zinc-900"}`}>{value}</p>
  </div>;
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Truck; title: string; description: string }) {
  return <div className="p-12 text-center"><Icon className="mx-auto size-9 text-zinc-300" /><p className="mt-3 font-semibold text-zinc-800">{title}</p><p className="mt-1 text-sm text-zinc-500">{description}</p></div>;
}

function QuickAction({ icon: Icon, title, description, href }: { icon: typeof Truck; title: string; description: string; href: string }) {
  return <Link href={href} className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left transition hover:border-company-200 hover:bg-company-50">
    <span className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition group-hover:bg-company-100 group-hover:text-company-600"><Icon className="size-4" /></span><span><span className="block text-sm font-semibold text-zinc-900">{title}</span><span className="mt-0.5 block text-xs text-zinc-400">{description}</span></span></span>
    <ChevronRight className="size-4 text-zinc-300 transition group-hover:text-company-600" />
  </Link>;
}
