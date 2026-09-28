import Link from "next/link";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    Fuel,
    MapPin,
    Plus,
    Search,
    Truck,
    Wrench,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

const PAGE_SIZE = 10;
const statusLabels = {
    AVAILABLE: "Disponible",
    IN_ROUTE: "En ruta",
    MAINTENANCE: "Mantenimiento",
    INACTIVE: "Inactiva",
} as const;
const typeLabels = {
    TRACTOR: "Tractocamión",
    TRUCK: "Camión",
    TRAILER: "Remolque",
    DRY_VAN: "Caja seca",
    PLATFORM: "Plataforma",
    OTHER: "Otro",
} as const;
const statusOptions = Object.keys(statusLabels) as Array<keyof typeof statusLabels>;
const typeOptions = Object.keys(typeLabels) as Array<keyof typeof typeLabels>;

function firstParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function statusStyles(status: keyof typeof statusLabels) {
    switch (status) {
        case "IN_ROUTE": return "bg-blue-50 text-blue-700 ring-blue-600/10";
        case "AVAILABLE": return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
        case "MAINTENANCE": return "bg-amber-50 text-amber-700 ring-amber-600/10";
        default: return "bg-zinc-50 text-zinc-700 ring-zinc-600/10";
    }
}

type FleetSearchParams = Promise<{
    q?: string | string[];
    status?: string | string[];
    type?: string | string[];
    assigned?: string | string[];
    page?: string | string[];
}>;

export default async function FleetManagementPage({
    searchParams,
}: {
    searchParams: FleetSearchParams;
}) {
    const user = await requireUser();
    const canManageFleet = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    const params = await searchParams;
    const query = firstParam(params.q)?.trim() ?? "";
    const requestedStatus = firstParam(params.status);
    const requestedType = firstParam(params.type);
    const status = statusOptions.includes(requestedStatus as keyof typeof statusLabels) ? requestedStatus as keyof typeof statusLabels : "ALL";
    const type = typeOptions.includes(requestedType as keyof typeof typeLabels) ? requestedType as keyof typeof typeLabels : "ALL";
    const assigned = ["YES", "NO"].includes(firstParam(params.assigned) ?? "") ? firstParam(params.assigned)! : "ALL";
    const parsedPage = Number.parseInt(firstParam(params.page) ?? "1", 10);
    const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const where = {
        ...(status !== "ALL" ? { status } : {}),
        ...(type !== "ALL" ? { type } : {}),
        ...(assigned === "YES" ? { driverId: { not: null } } : {}),
        ...(assigned === "NO" ? { driverId: null } : {}),
        ...(query ? {
            OR: [
                { economicNumber: { contains: query, mode: "insensitive" as const } },
                { brand: { contains: query, mode: "insensitive" as const } },
                { model: { contains: query, mode: "insensitive" as const } },
                { plate: { contains: query, mode: "insensitive" as const } },
                { driver: { is: { name: { contains: query, mode: "insensitive" as const } } } },
            ],
        } : {}),
    };

    const [totalVehicles, statusCounts, filteredCount] = await Promise.all([
        prisma.vehicle.count(),
        prisma.vehicle.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.vehicle.count({ where }),
    ]);
    const countForStatus = (key: keyof typeof statusLabels) =>
        statusCounts.find((entry) => entry.status === key)?._count._all ?? 0;
    const inRouteCount = countForStatus("IN_ROUTE");
    const availableCount = countForStatus("AVAILABLE");
    const maintenanceCount = countForStatus("MAINTENANCE");
    const inactiveCount = countForStatus("INACTIVE");
    const pageCount = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, pageCount);
    const vehicles = await prisma.vehicle.findMany({
        where,
        orderBy: { economicNumber: "asc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { driver: { select: { id: true, name: true } } },
    });
    const rangeStart = filteredCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredCount);
    const pageHref = (page: number) => {
        const next = new URLSearchParams();
        if (query) next.set("q", query);
        if (status !== "ALL") next.set("status", status);
        if (type !== "ALL") next.set("type", type);
        if (assigned !== "ALL") next.set("assigned", assigned);
        next.set("page", String(page));
        return `/fleet-management?${next.toString()}`;
    };
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endOfWindowUtc = new Date(todayUtc.getTime() + 30 * 24 * 60 * 60 * 1000);
    const [overdueServiceCount, dueSoonCount, expiredDocumentCount, unregisteredDocumentCount] = await Promise.all([
        prisma.vehicle.count({ where: { nextServiceAt: { lt: todayUtc } } }),
        prisma.vehicle.count({ where: { nextServiceAt: { gte: todayUtc, lte: endOfWindowUtc } } }),
        prisma.vehicle.count({ where: { OR: [{ insuranceStatus: "EXPIRED" }, { registrationStatus: "EXPIRED" }] } }),
        prisma.vehicle.count({ where: { OR: [{ insuranceStatus: null }, { registrationStatus: null }] } }),
    ]);
    const stats = [
        { label: "Total de unidades", value: totalVehicles, description: "Flota registrada", icon: Truck },
        { label: "En ruta", value: inRouteCount, description: "Unidades en operación", icon: CheckCircle2 },
        { label: "En mantenimiento", value: maintenanceCount, description: "No disponibles para operación", icon: Wrench },
        { label: "Disponibles", value: availableCount, description: "Listas para asignar", icon: CircleDot },
    ];

    return (
        <main className="bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500"><span>Portal</span><ChevronRight className="size-4" /><span className="font-medium text-zinc-900">Gestión de flota</span></div>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Gestión de flota</h1>
                        <p className="mt-1 max-w-2xl text-sm text-zinc-500">Consulta y administra las unidades de JT Transportes.</p>
                    </div>
                    {canManageFleet && <Link href="/fleet-management/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600">Nueva unidad<Plus className="size-4" /></Link>}
                </div>

                <section aria-label="Resumen de unidades" className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
                    {stats.map(({ label, value, description, icon: Icon }) => (
                        <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
                            <div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-medium text-zinc-500 sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:mt-2 sm:text-3xl">{value}</p></div><div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-company-50 text-company-600 sm:size-11 sm:rounded-xl"><Icon className="size-4 sm:size-5" /></div></div>
                            <p className="mt-3 hidden text-xs text-zinc-500 sm:block">{description}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:mt-6 sm:rounded-2xl sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div><h2 className="font-semibold text-zinc-900">Estado de la flota</h2><p className="mt-1 text-xs text-zinc-500">Distribución actual de las unidades.</p></div>
                        <div className="flex flex-wrap gap-3 text-xs">
                            <span className="rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700">{inRouteCount} en ruta</span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">{availableCount} disponibles</span>
                            <span className="rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700">{maintenanceCount} mantenimiento</span>
                            <span className="rounded-full bg-zinc-100 px-3 py-1.5 font-medium text-zinc-700">{inactiveCount} inactivas</span>
                        </div>
                    </div>
                    <div className="mt-5 hidden h-3 overflow-hidden rounded-full bg-zinc-100 sm:flex" aria-label="Distribución del estado de la flota">
                        {[
                            [inRouteCount, "bg-blue-500"],
                            [availableCount, "bg-emerald-500"],
                            [maintenanceCount, "bg-amber-500"],
                            [inactiveCount, "bg-zinc-500"],
                        ].map(([count, color], index) => <div key={index} className={color as string} style={{ width: `${totalVehicles ? (Number(count) / totalVehicles) * 100 : 0}%` }} />)}
                    </div>
                </section>

                <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div><h2 className="font-semibold text-zinc-900">Unidades</h2><p className="mt-1 text-xs text-zinc-500">{filteredCount} de {totalVehicles} unidades coinciden con los criterios.</p></div>
                            <form action="/fleet-management" method="get" className="grid gap-2 sm:grid-cols-2 lg:flex">
                                <label className="relative"><span className="sr-only">Buscar unidad</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><input type="search" name="q" defaultValue={query} placeholder="Unidad, placas u operador..." className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm sm:w-60" /></label>
                                <select name="status" defaultValue={status} aria-label="Filtrar por estado" className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"><option value="ALL">Todos los estados</option>{statusOptions.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select>
                                <select name="type" defaultValue={type} aria-label="Filtrar por tipo" className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"><option value="ALL">Todos los tipos</option>{typeOptions.map((value) => <option key={value} value={value}>{typeLabels[value]}</option>)}</select>
                                <select name="assigned" defaultValue={assigned} aria-label="Filtrar por asignación" className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"><option value="ALL">Cualquier asignación</option><option value="YES">Con operador</option><option value="NO">Sin operador</option></select>
                                <button type="submit" className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700">Aplicar</button>
                                {(query || status !== "ALL" || type !== "ALL" || assigned !== "ALL") && <Link href="/fleet-management" className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm text-zinc-600 hover:bg-zinc-50">Limpiar</Link>}
                            </form>
                        </div>
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left"><thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500"><tr><th className="px-5 py-3">Unidad</th><th className="px-5 py-3">Ubicación</th><th className="px-5 py-3">Operador</th><th className="px-5 py-3">Combustible</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Acciones</th></tr></thead>
                            <tbody className="divide-y divide-zinc-100">
                                {vehicles.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-500">No se encontraron unidades con esos criterios.</td></tr>}
                                {vehicles.map((vehicle) => <tr key={vehicle.id} className="transition hover:bg-zinc-50">
                                    <td className="px-5 py-4"><p className="text-sm font-semibold text-zinc-900">{vehicle.economicNumber} · {vehicle.brand}</p><p className="mt-0.5 text-xs text-zinc-500">{vehicle.model} · {vehicle.year} · {typeLabels[vehicle.type]}</p><p className="mt-0.5 text-xs text-zinc-400">{vehicle.plate || "Sin placas"}</p></td>
                                    <td className="px-5 py-4 text-sm text-zinc-600"><span className="inline-flex items-center gap-2"><MapPin className="size-4 text-zinc-400" />{vehicle.location || "Sin ubicación"}</span></td>
                                    <td className="px-5 py-4 text-sm text-zinc-600">{vehicle.driver?.name || "Sin asignar"}</td>
                                    <td className="px-5 py-4"><div className="flex items-center gap-2"><Fuel className="size-4 text-zinc-400" /><div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-company" style={{ width: `${vehicle.fuelLevel}%` }} /></div><span className="text-xs font-medium text-zinc-600">{vehicle.fuelLevel}%</span></div></td>
                                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(vehicle.status)}`}>{statusLabels[vehicle.status]}</span></td>
                                    <td className="px-5 py-4 text-right"><Link href={`/fleet-management/${vehicle.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-company-600 hover:text-company-700">Ver unidad<ChevronRight className="size-4" /></Link></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-zinc-100 md:hidden">
                        {vehicles.length === 0 && <p className="px-5 py-12 text-center text-sm text-zinc-500">No se encontraron unidades con esos criterios.</p>}
                        {vehicles.map((vehicle) => <article key={vehicle.id} className="p-4">
                            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-zinc-900">{vehicle.economicNumber} · {vehicle.brand}</p><p className="text-xs text-zinc-500">{vehicle.model} · {vehicle.year} · {typeLabels[vehicle.type]}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(vehicle.status)}`}>{statusLabels[vehicle.status]}</span></div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><p className="text-zinc-400">Ubicación</p><p className="mt-1 font-medium text-zinc-700">{vehicle.location || "Sin ubicación"}</p></div><div><p className="text-zinc-400">Operador</p><p className="mt-1 font-medium text-zinc-700">{vehicle.driver?.name || "Sin asignar"}</p></div><div><p className="text-zinc-400">Combustible</p><p className="mt-1 font-medium text-zinc-700">{vehicle.fuelLevel}%</p></div><div><p className="text-zinc-400">Placas</p><p className="mt-1 font-medium text-zinc-700">{vehicle.plate || "Sin placas"}</p></div></div>
                            <Link href={`/fleet-management/${vehicle.id}`} className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-company-600 hover:bg-company-50">Ver detalles<ChevronRight className="size-4" /></Link>
                        </article>)}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><span>Mostrando {rangeStart}–{rangeEnd} de {filteredCount} unidades</span><div className="flex items-center gap-2"><Link href={pageHref(Math.max(1, currentPage - 1))} aria-disabled={currentPage === 1} className={`rounded-lg border border-zinc-200 px-3 py-2 ${currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"}`}>Anterior</Link><span>{currentPage} / {pageCount}</span><Link href={pageHref(Math.min(pageCount, currentPage + 1))} aria-disabled={currentPage === pageCount} className={`rounded-lg border border-zinc-200 px-3 py-2 ${currentPage === pageCount ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"}`}>Siguiente</Link></div></div>
                </section>

                <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm"><AlertTriangle className="size-5" /></div><div><h2 className="font-semibold text-amber-900">Atención de flota</h2><p className="mt-1 text-sm text-amber-800">{maintenanceCount} unidades en mantenimiento, {overdueServiceCount} servicios vencidos y {dueSoonCount} próximos a vencer en 30 días.</p><p className="mt-1 text-sm text-amber-800">Documentos: {expiredDocumentCount} unidades con documento vencido y {unregisteredDocumentCount} con algún estado sin registrar.</p></div></div></section>
            </div>
        </main>
    );
}
