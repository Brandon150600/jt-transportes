import {
    Award,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FileText,
    MapPin,
    Phone,
    Plus,
    Search,
    UserRound,
    Users,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const PAGE_SIZE = 10;
type UserSearchParams = Promise<{
    q?: string | string[];
    status?: string | string[];
    page?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function statusStyles(status: string) {
    switch (status) {
        case "En ruta":
            return "bg-blue-50 text-blue-700 ring-blue-600/10";

        case "Disponible":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";

        case "Suspendido":
            return "bg-amber-50 text-amber-700 ring-amber-600/10";

        case "Documentación":
            return "bg-amber-50 text-amber-700 ring-amber-600/10";

        default:
            return "bg-zinc-100 text-zinc-700 ring-zinc-600/10";
    }
}


export default async function UsersPage({
    searchParams,
}: {
    searchParams: UserSearchParams;
}) {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const params = await searchParams;
    const query = firstParam(params.q)?.trim() ?? "";
    const requestedStatus = firstParam(params.status);
    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;
    const status = validStatuses.includes(requestedStatus as (typeof validStatuses)[number])
        ? requestedStatus as (typeof validStatuses)[number]
        : "ALL";
    const parsedPage = Number.parseInt(firstParam(params.page) ?? "1", 10);
    const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const allOperators = await prisma.driver.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            vehicles: {
                select: {
                    economicNumber: true,
                    status: true,
                },
            },
        },
    });
    const totalOperators = allOperators.length;

    const activeOperators = allOperators.filter(
        (operator) => operator.status === "ACTIVE",
    ).length;

    const operatorsInRoute = allOperators.filter((operator) =>
        operator.vehicles.some((vehicle) => vehicle.status === "IN_ROUTE"),
    ).length;

    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const thirtyDaysFromNowUtc = todayUtc + 30 * 24 * 60 * 60 * 1000;
    const expiredLicenses = allOperators.filter((operator) =>
        operator.licenseExpiresAt && operator.licenseExpiresAt.getTime() < todayUtc,
    ).length;
    const operatorsToRenew = allOperators.filter((operator) => {
        const expiration = operator.licenseExpiresAt?.getTime();
        return expiration !== undefined && expiration >= todayUtc && expiration <= thirtyDaysFromNowUtc;
    }).length;
    const licensesWithoutExpiration = allOperators.filter((operator) => !operator.licenseExpiresAt).length;


    function getOperatorStatus(operator: (typeof allOperators)[number]) {
        if (operator.status === "SUSPENDED") return "Suspendido";
        if (operator.status === "INACTIVE") return "Inactivo";
        if (
            operator.vehicles.some((vehicle) => vehicle.status === "IN_ROUTE")
        ) {
            return "En ruta";
        }

        return "Disponible";
    }

    const normalizedQuery = query.toLocaleLowerCase("es-MX");
    const filteredOperators = allOperators.filter((operator) => {
        const matchesStatus = status === "ALL" || operator.status === status;
        const matchesQuery = !normalizedQuery || [
            operator.name,
            operator.phone ?? "",
            operator.licenseNumber ?? "",
            operator.licenseType ?? "",
            ...operator.vehicles.map((vehicle) => vehicle.economicNumber),
        ].some((value) => value.toLocaleLowerCase("es-MX").includes(normalizedQuery));
        return matchesStatus && matchesQuery;
    });
    const pageCount = Math.max(1, Math.ceil(filteredOperators.length / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, pageCount);
    const operators = filteredOperators.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const rangeStart = filteredOperators.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredOperators.length);
    const pageHref = (page: number) => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (status !== "ALL") params.set("status", status);
        params.set("page", String(page));
        return `/users?${params.toString()}`;
    };


    const operatorStats = [
        {
            label: "Operadores registrados",
            value: totalOperators.toString(),
            description: "Total de operadores",
            icon: Users,
        },
        {
            label: "Activos",
            value: activeOperators.toString(),
            description: "Disponibles para operación",
            icon: CheckCircle2,
        },
        {
            label: "En ruta",
            value: operatorsInRoute.toString(),
            description: "Actualmente asignados",
            icon: MapPin,
        },
        {
            label: "Licencias por revisar",
            value: (expiredLicenses + operatorsToRenew).toString(),
            description: `${expiredLicenses} vencidas · ${operatorsToRenew} próximas a vencer`,
            icon: FileText,
        },
    ];


    return (
        <main className="bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <span>Portal</span>
                            <ChevronRight className="size-4" />
                            <span className="font-medium text-zinc-900">
                                Operadores
                            </span>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                            Operadores
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                            Consulta y administra la información de los operadores de
                            JT Transportes.
                        </p>
                    </div>
                    <Link
                        href="/users/new"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600"
                    >
                        Nuevo operador
                        <Plus className="size-4" />
                    </Link>
                </div>

                {/* Stats */}
                <section aria-label="Resumen de operadores" className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 xl:grid-cols-4">
                    {operatorStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-zinc-500 sm:text-sm">
                                            {stat.label}
                                        </p>

                                        <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:mt-2 sm:text-3xl">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-company-50 text-company-600 sm:size-11 sm:rounded-xl">
                                        <Icon className="size-4 sm:size-5" />
                                    </div>
                                </div>

                                <p className="mt-3 hidden text-xs text-zinc-500 sm:block">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* Operators */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

                    {/* Toolbar */}
                    <div className="border-b border-zinc-100 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="font-semibold text-zinc-900">
                                    Directorio de operadores
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Operadores registrados en JT Transportes.
                                </p>
                            </div>

                            <form action="/users" method="get" className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                                    <input
                                        type="search"
                                        name="q"
                                        defaultValue={query}
                                        placeholder="Buscar operador..."
                                        className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:ring-4 focus:ring-company-100 sm:w-64"
                                    />
                                </div>

                                <select name="status" defaultValue={status} aria-label="Filtrar por estado" className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700">
                                    <option value="ALL">Todos los estados</option>
                                    <option value="ACTIVE">Activos</option>
                                    <option value="INACTIVE">Inactivos</option>
                                    <option value="SUSPENDED">Suspendidos</option>
                                </select>
                                <button type="submit" className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-700">Buscar</button>
                            </form>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                <tr>
                                    <th className="px-5 py-3">Operador</th>
                                    <th className="px-5 py-3">Licencia</th>
                                    <th className="px-5 py-3">Unidad asignada</th>
                                    <th className="px-5 py-3">Operación</th>
                                    <th className="px-5 py-3">Estado</th>
                                    <th className="px-5 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-100">
                                {operators.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-500">
                                            No se encontraron operadores con esos criterios.
                                        </td>
                                    </tr>
                                )}
                                {operators.map((operator) => {
                                    const initials = operator.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((name) => name[0])
                                        .join("")
                                        .toUpperCase();

                                    const assignedVehicles = operator.vehicles.map((vehicle) => vehicle.economicNumber).join(", ");

                                    const status = getOperatorStatus(operator);
                                    return (
                                        <tr
                                            key={operator.id}
                                            className="transition hover:bg-zinc-50"
                                        >
                                            {/* Operator */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-company-50 text-sm font-bold text-company-600">
                                                        {initials}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900">
                                                            {operator.name}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                                            <Phone className="size-3.5" />
                                                            {operator.phone ?? "Sin teléfono"}
                                                        </div>

                                                        <p className="mt-0.5 text-xs text-zinc-400">
                                                            {operator.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* License */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-start gap-2">
                                                    <Award className="mt-0.5 size-4 text-zinc-400" />

                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-700">
                                                            {operator.licenseNumber || "Sin licencia"}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-zinc-400">
                                                            {operator.licenseType}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                                                            <CalendarDays className="size-3.5" />
                                                            {operator.licenseExpiresAt
                                                                ? operator.licenseExpiresAt.toLocaleDateString("es-MX", { timeZone: "UTC" })
                                                                : "Sin fecha"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Unit */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-700">
                                                    {assignedVehicles || "Sin asignar"}
                                                </p>
                                            </td>

                                            {/* Operation */}
                                            <td className="px-5 py-4">
                                                {operator.vehicles.some((assignedVehicle) => assignedVehicle.status === "IN_ROUTE") ? (
                                                    <>
                                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                            <MapPin className="size-4 text-zinc-400" />
                                                            En ruta
                                                        </div>

                                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                                            <Clock3 className="size-3.5" />
                                                            Operación activa
                                                        </p>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-zinc-400">
                                                        Sin operación
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                                        status,
                                                    )}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                   <Link
                                                href={`/users/${operator.id}`}
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-company-600 hover:text-company-700"
                                            >
                                                Ver Operador
                                                <ChevronRight className="size-4" />
                                            </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-zinc-100 md:hidden">
                        {operators.length === 0 && (
                            <p className="px-5 py-12 text-center text-sm text-zinc-500">
                                No se encontraron operadores con esos criterios.
                            </p>
                        )}
                        {operators.map((operator) => {
                            const initialsmovile = operator.name
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase();

                            const assignedVehicles = operator.vehicles.map((vehicle) => vehicle.economicNumber).join(", ");

                            const status = getOperatorStatus(operator);
                            return (
                                <div key={operator.id} className="p-4">

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-company-50 text-sm font-bold text-company-600">
                                                {initialsmovile}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-zinc-900">
                                                    {operator.name}
                                                </p>

                                                <p className="text-xs text-zinc-400">
                                                    {operator.id}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                                status,
                                            )}`}
                                        >
                                            {status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Teléfono
                                            </p>

                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                                                <Phone className="size-3.5" />
                                                {operator.phone || "Sin teléfono"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Unidad
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-zinc-700">
                                                {assignedVehicles || "Sin asignar"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Licencia
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-zinc-700">
                                                {operator.licenseNumber || "Sin licencia"}
                                            </p>

                                            <p className="mt-0.5 text-xs text-zinc-400">
                                                {operator.licenseType}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Vencimiento
                                            </p>

                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                                                <CalendarDays className="size-3.5" />
                                                {operator.licenseExpiresAt
                                                    ? operator.licenseExpiresAt.toLocaleDateString("es-MX", { timeZone: "UTC" })
                                                    : "Sin fecha"}
                                            </p>
                                        </div>

                                    </div>

                                    {/* {operator.route !== "—" && (
                                        <div className="mt-4 rounded-xl bg-zinc-50 p-3">
                                            <p className="text-xs text-zinc-400">
                                                Operación actual
                                            </p>

                                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                                <MapPin className="size-4 text-zinc-400" />
                                                {operator.route}
                                            </p>
                                        </div>
                                    )} */}

                                    <Link
                                        href={`/users/${operator.id}`}
                                        className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-company-600 transition hover:bg-company-50"
                                    >
                                        Ver detalles
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando {rangeStart}–{rangeEnd} de {filteredOperators.length} operadores
                        </span>

                        <div className="flex items-center gap-2">
                            <Link href={pageHref(Math.max(1, currentPage - 1))} aria-disabled={currentPage === 1} className={`rounded-lg border border-zinc-200 px-3 py-2 ${currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"}`}>
                                Anterior
                            </Link>

                            <span className="px-2">{currentPage} / {pageCount}</span>
                            <Link href={pageHref(Math.min(pageCount, currentPage + 1))} aria-disabled={currentPage === pageCount} className={`rounded-lg border border-zinc-200 px-3 py-2 ${currentPage === pageCount ? "pointer-events-none opacity-40" : "hover:bg-zinc-50"}`}>
                                Siguiente
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Documentation alert */}
                <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                            <FileText className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-amber-900">
                                {expiredLicenses > 0
                                    ? `${expiredLicenses} licencias vencidas; ${operatorsToRenew} próximas a vencer`
                                    : `${operatorsToRenew} licencias próximas a vencer`}
                            </h2>

                            <p className="mt-1 text-sm text-amber-800">
                                {licensesWithoutExpiration} operadores no tienen registrada la vigencia de su licencia. Revisa la documentación para mantener la flota disponible.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
