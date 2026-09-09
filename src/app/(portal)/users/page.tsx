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

function statusStyles(status: string) {
    switch (status) {
        case "En ruta":
            return "bg-blue-50 text-blue-700 ring-blue-600/10";

        case "Disponible":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";

        case "Documentación":
            return "bg-amber-50 text-amber-700 ring-amber-600/10";

        default:
            return "bg-zinc-100 text-zinc-700 ring-zinc-600/10";
    }
}


export default async function UsersPage() {
    const operators = await prisma.driver.findMany({
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
    const totalOperators = operators.length;

    const activeOperators = operators.filter(
        (operator) => operator.status === "ACTIVE",
    ).length;

    const operatorsInRoute = operators.filter((operator) =>
        operator.vehicles.some((vehicle) => vehicle.status === "IN_ROUTE"),
    ).length;

    const today = new Date();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const operatorsToRenew = operators.filter((operator) => {
        if (!operator.licenseExpiresAt) return false;

        return (
            operator.licenseExpiresAt >= today &&
            operator.licenseExpiresAt <= thirtyDaysFromNow
        );
    }).length;


    function getOperatorStatus(
        operator: (typeof operators)[number],
    ) {
        if (
            operator.status === "ACTIVE" &&
            operator.vehicles.some((vehicle) => vehicle.status === "IN_ROUTE")
        ) {
            return "En ruta";
        }

        if (operator.status === "ACTIVE") {
            return "Disponible";
        }

        return "Inactivo";
    }


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
            label: "Por renovar",
            value: operatorsToRenew.toString(),
            description: "Documentación próxima a vencer",
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
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {operatorStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500">
                                            {stat.label}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className="flex size-11 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                        <Icon className="size-5" />
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-zinc-500">
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

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                                    <input
                                        type="search"
                                        placeholder="Buscar operador..."
                                        className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:ring-4 focus:ring-company-100 sm:w-64"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    Todos
                                </button>

                                <button
                                    type="button"
                                    className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    Activos
                                </button>
                            </div>
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
                                {operators.map((operator) => {
                                    const initials = operator.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((name) => name[0])
                                        .join("")
                                        .toUpperCase();

                                    const vehicle = operator.vehicles[0];

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
                                                            {operator.licenseNumber ?? "Sin licencia"}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-zinc-400">
                                                            {operator.licenseType}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                                                            <CalendarDays className="size-3.5" />
                                                            {operator.licenseExpiresAt
                                                                ? operator.licenseExpiresAt.toLocaleDateString("es-MX")
                                                                : "Sin fecha"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Unit */}
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-zinc-700">
                                                    {vehicle?.economicNumber ?? "Sin asignar"}
                                                </p>
                                            </td>

                                            {/* Operation */}
                                            <td className="px-5 py-4">
                                                {vehicle?.status === "IN_ROUTE" ? (
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
                        {operators.map((operator) => {
                            const initialsmovile = operator.name
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase();

                            const vehicle = operator.vehicles[0];

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
                                                operator.status,
                                            )}`}
                                        >
                                            {operator.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Teléfono
                                            </p>

                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                                                <Phone className="size-3.5" />
                                                {operator.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Unidad
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-zinc-700">
                                                {vehicle?.economicNumber ?? "Sin asignar"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                Licencia
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-zinc-700">
                                                {operator.licenseNumber ?? "Sin licencia"}
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
                                                    ? operator.licenseExpiresAt.toLocaleDateString("es-MX")
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

                                    <button
                                        type="button"
                                        className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-company-600 transition hover:bg-company-50"
                                    >
                                        Ver detalles
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando 5 de 16 operadores
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled
                                className="rounded-lg border border-zinc-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            <button
                                type="button"
                                disabled
                                className="rounded-lg border border-zinc-200 px-3 py-2 transition hover:bg-zinc-50"
                            >
                                Siguiente
                            </button>
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
                                {operatorsToRenew === 0
                                    ? "No hay operadores con documentación próxima a vencer"
                                    : operatorsToRenew === 1
                                        ? "1 operador tiene documentación próxima a vencer"
                                        : `${operatorsToRenew} operadores tienen documentación próxima a vencer`}
                            </h2>

                            <p className="mt-1 text-sm text-amber-800">
                                Revisa las licencias y documentos de los operadores para
                                mantener la flota disponible para operación.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}