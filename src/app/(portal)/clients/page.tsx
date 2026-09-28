import Link from "next/link";
import { Building2, Mail, MapPin, Phone, Plus, Search, Users } from "lucide-react";
import { requireAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage({ searchParams }: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const activeFilter = params.status === "active" ? true : params.status === "inactive" ? false : undefined;
  const where = {
    ...(activeFilter === undefined ? {} : { active: activeFilter }),
    ...(query ? { OR: [
      { businessName: { contains: query, mode: "insensitive" as const } },
      { commercialName: { contains: query, mode: "insensitive" as const } },
      { taxId: { contains: query, mode: "insensitive" as const } },
      { contactName: { contains: query, mode: "insensitive" as const } },
      { email: { contains: query, mode: "insensitive" as const } },
      { phone: { contains: query, mode: "insensitive" as const } },
    ] } : {}),
  };
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [clients, matchingCount, allCount, activeCount, createdThisMonth, withAddressesCount] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: [{ active: "desc" }, { businessName: "asc" }],
      include: { addresses: { where: { active: true }, select: { id: true } } },
    }),
    prisma.client.count({ where }),
    prisma.client.count(),
    prisma.client.count({ where: { active: true } }),
    prisma.client.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.client.count({ where: { addresses: { some: { active: true } } } }),
  ]);

  const stats = [
    { label: "Clientes registrados", value: String(allCount), description: "Total en el catálogo", icon: Users },
    { label: "Clientes activos", value: String(activeCount), description: "Disponibles para nuevos viajes", icon: Building2 },
    { label: "Nuevos este mes", value: String(createdThisMonth), description: "Altas del mes actual", icon: Plus },
    { label: "Con ubicaciones", value: String(withAddressesCount), description: "Clientes con direcciones activas", icon: MapPin },
  ];

  return <main className="min-h-screen bg-zinc-50"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-company-600">Administración comercial</p><h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">Clientes</h1><p className="mt-2 max-w-2xl text-sm text-zinc-500">Empresas y ubicaciones de origen y destino para la operación de JT Transportes.</p></div><Link href="/clients/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200"><Plus className="size-4" /> Nuevo cliente</Link></header>
    <section aria-label="Resumen de clientes" className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">{stats.map(({ label, value, description, icon: Icon }) => <article key={label} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-medium text-zinc-500 sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:mt-2 sm:text-3xl">{value}</p></div><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-company-50 text-company-600 sm:size-11 sm:rounded-xl"><Icon className="size-4 sm:size-5" /></span></div><p className="mt-3 hidden text-xs text-zinc-500 sm:block">{description}</p></article>)}</section>
    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold text-zinc-900">Directorio de clientes</h2><p className="mt-1 text-xs text-zinc-500">Busca por empresa, RFC, contacto o datos de contacto.</p></div><form className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><input type="search" name="q" defaultValue={query} placeholder="Buscar cliente…" className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm outline-none focus:border-company focus:ring-4 focus:ring-company-100 sm:w-64" /></div><select name="status" defaultValue={params.status ?? "all"} className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"><option value="all">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option></select><button className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Buscar</button></form></div></div>
      {clients.length ? <div className="divide-y divide-zinc-100">{clients.map((client) => <Link key={client.id} href={`/clients/${client.id}`} className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600"><Building2 className="size-5" /></span><div className="min-w-0"><p className="truncate font-bold text-zinc-900">{client.commercialName || client.businessName}</p>{client.commercialName && <p className="mt-0.5 truncate text-sm text-zinc-500">{client.businessName}</p>}<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">{client.taxId && <span>RFC: {client.taxId}</span>}{client.contactName && <span>{client.contactName}</span>}{client.email && <span className="inline-flex items-center gap-1"><Mail className="size-3.5" />{client.email}</span>}{client.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3.5" />{client.phone}</span>}</div></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="inline-flex items-center gap-1.5 text-sm text-zinc-500"><MapPin className="size-4" />{client.addresses.length} {client.addresses.length === 1 ? "dirección" : "direcciones"}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${client.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{client.active ? "Activo" : "Inactivo"}</span><span className="text-sm font-semibold text-company-700">Ver cliente</span></div></Link>)}</div> : <div className="p-12 text-center"><Building2 className="mx-auto size-9 text-zinc-300" /><p className="mt-3 font-semibold text-zinc-800">{query ? "No encontramos clientes" : "Aún no hay clientes registrados"}</p><p className="mt-1 text-sm text-zinc-500">{query ? "Prueba con otro término o cambia el filtro." : "Crea el primer cliente para registrar sus ubicaciones."}</p></div>}
      <div className="border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500">Mostrando {matchingCount} {matchingCount === 1 ? "cliente" : "clientes"}</div>
    </section>
  </div></main>;
}
