import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  PackageCheck,
  Truck,
  Users,
} from "lucide-react";


const stats = [
  {
    label: "Viajes activos",
    value: "12",
    description: "3 iniciados hoy",
    icon: Truck,
  },
  {
    label: "Unidades en ruta",
    value: "7",
    description: "De 18 unidades",
    icon: MapPin,
  },
  {
    label: "Entregas pendientes",
    value: "5",
    description: "2 para hoy",
    icon: PackageCheck,
  },
  {
    label: "Clientes activos",
    value: "24",
    description: "4 nuevos este mes",
    icon: Users,
  },
];

const trips = [
  {
    unit: "JT-001",
    route: "Monterrey → Ciudad de México",
    client: "Cliente ABC",
    status: "En ruta",
    time: "Salida 08:30",
  },
  {
    unit: "JT-004",
    route: "Saltillo → Monterrey",
    client: "Industria XYZ",
    status: "Entregado",
    time: "10:15",
  },
  {
    unit: "JT-008",
    route: "Monterrey → Querétaro",
    client: "Constructora Norte",
    status: "Pendiente",
    time: "Salida 14:00",
  },
];

export default async function DashboardPage() {

  const firstName = user.name?.split(" ")[0] ?? "Usuario";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-company" />
              <span className="text-xs font-bold uppercase tracking-widest text-company-600">
                Portal JT Transportes
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Buenos días, {firstName}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Consulta el estado de la operación, tus viajes y la actividad
              reciente de JT Transportes.
            </p>
          </div>

          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            <Bell className="size-5" />

            <span className="absolute right-2 top-2 size-2 rounded-full bg-company" />
          </button>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-xl bg-company-50 text-company-600 transition group-hover:bg-company group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs font-medium text-zinc-400">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* Operation */}
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-zinc-950">
                  Operación reciente
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Últimos movimientos registrados
                </p>
              </div>

              <button
                type="button"
                className="hidden items-center gap-1 text-sm font-semibold text-company-600 transition hover:text-company-700 sm:flex"
              >
                Ver todo
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {trips.map((trip) => (
                <article
                  key={trip.unit}
                  className="group px-5 py-5 transition hover:bg-zinc-50 sm:px-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-company-50 group-hover:text-company-600">
                        <Truck className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-zinc-950">
                            {trip.unit}
                          </p>

                          <span className="text-zinc-300">•</span>

                          <p className="truncate text-xs font-medium text-zinc-400">
                            {trip.client}
                          </p>
                        </div>

                        <p className="mt-1 truncate text-sm font-medium text-zinc-700">
                          {trip.route}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        <Clock3 className="size-3.5" />
                        {trip.time}
                      </div>

                      <StatusBadge status={trip.status} />

                      <ChevronRight className="hidden size-4 text-zinc-300 sm:block" />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 border-t border-zinc-100 px-5 py-4 text-sm font-semibold text-company-600 hover:bg-zinc-50 sm:hidden"
            >
              Ver operación completa
              <ChevronRight className="size-4" />
            </button>
          </section>

          {/* Right column */}
          <aside className="space-y-6">

            {/* Today */}
            <section className="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white shadow-sm">
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-company/20 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                    <CalendarDays className="size-5 text-white" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-400">
                      Operación
                    </p>

                    <p className="font-bold text-white">
                      Hoy
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-4xl font-extrabold tracking-tight text-white">
                    8
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    movimientos programados
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-zinc-400">
                    Próximo movimiento
                  </span>

                  <span className="text-xs font-bold text-white">
                    14:00
                  </span>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-zinc-950">
                    Accesos rápidos
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Acciones frecuentes
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <QuickAction
                  icon={Truck}
                  title="Nuevo viaje"
                  description="Registrar operación"
                />

                <QuickAction
                  icon={MapPin}
                  title="Consultar flota"
                  description="Ver unidades"
                />

                <QuickAction
                  icon={Users}
                  title="Clientes"
                  description="Consultar clientes"
                />
              </div>
            </section>

          </aside>
        </div>

        {/* Bottom CTA */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-company-100 bg-company-50">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-bold text-company-800">
                ¿Necesitas ayuda con una operación?
              </p>

              <p className="mt-1 text-sm text-company-700/70">
                Nuestro equipo está disponible para apoyarte.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-company px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-company-600"
            >
              Contactar soporte
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    "En ruta": "bg-blue-50 text-blue-700 border-blue-100",
    Entregado: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pendiente: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${
        styles[status as keyof typeof styles] ??
        "bg-zinc-100 text-zinc-700 border-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Truck;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left transition hover:border-company-200 hover:bg-company-50"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition group-hover:bg-company-100 group-hover:text-company-600">
          <Icon className="size-4" />
        </span>

        <span>
          <span className="block text-sm font-semibold text-zinc-900">
            {title}
          </span>

          <span className="mt-0.5 block text-xs text-zinc-400">
            {description}
          </span>
        </span>
      </span>

      <ChevronRight className="size-4 text-zinc-300 transition group-hover:text-company-600" />
    </button>
  );
}