import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    Fuel,
    MapPin,
    Plus,
    Search,
    Settings2,
    Truck,
    Wrench,
} from "lucide-react";

const fleetStats = [
    {
        label: "Total de unidades",
        value: "18",
        description: "Flota registrada",
        icon: Truck,
    },
    {
        label: "En operación",
        value: "12",
        description: "Unidades activas",
        icon: CheckCircle2,
    },
    {
        label: "En mantenimiento",
        value: "3",
        description: "Requieren atención",
        icon: Wrench,
    },
    {
        label: "Disponibles",
        value: "3",
        description: "Listas para asignar",
        icon: CircleDot,
    },
];

const vehicles = [
    {
        id: "JT-001",
        model: "Kenworth T680",
        year: "2025",
        plate: "XX-12-345",
        status: "En ruta",
        location: "Monterrey, NL",
        driver: "Carlos Martínez",
        fuel: "78%",
    },
    {
        id: "JT-002",
        model: "Kenworth T680",
        year: "2025",
        plate: "XX-23-456",
        status: "Disponible",
        location: "Patio Monterrey",
        driver: "Sin asignar",
        fuel: "94%",
    },
    {
        id: "JT-003",
        model: "Kenworth T880",
        year: "2024",
        plate: "XX-34-567",
        status: "Mantenimiento",
        location: "Taller Monterrey",
        driver: "Sin asignar",
        fuel: "42%",
    },
    {
        id: "JT-004",
        model: "Kenworth T680",
        year: "2024",
        plate: "XX-45-678",
        status: "En ruta",
        location: "Saltillo, COAH",
        driver: "Jorge Ramírez",
        fuel: "61%",
    },
    {
        id: "JT-005",
        model: "Kenworth T680",
        year: "2023",
        plate: "XX-56-789",
        status: "Disponible",
        location: "Patio Monterrey",
        driver: "Sin asignar",
        fuel: "87%",
    },
];

function statusStyles(status: string) {
    switch (status) {
        case "En ruta":
            return "bg-blue-50 text-blue-700 ring-blue-600/10";

        case "Disponible":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";

        case "Mantenimiento":
            return "bg-amber-50 text-amber-700 ring-amber-600/10";

        default:
            return "bg-zinc-100 text-zinc-700 ring-zinc-600/10";
    }
}

export default function FleetManagementPage() {
    return (
        <main className="bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Page header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <span>Portal</span>
                            <ChevronRight className="size-4" />
                            <span className="font-medium text-zinc-900">
                                Gestión de flota
                            </span>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                            Gestión de flota
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                            Consulta y administra las unidades que forman parte de la flota
                            de JT Transportes.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600"
                    >
                        <Plus className="size-4" />
                        Nueva unidad
                    </button>
                </div>

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {fleetStats.map((stat) => {
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

                {/* Fleet status */}
                <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="font-semibold text-zinc-900">
                                Estado de la flota
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Distribución actual de las unidades.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
                                <span className="size-2 rounded-full bg-blue-600" />
                                12 en ruta
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                                <span className="size-2 rounded-full bg-emerald-600" />
                                3 disponibles
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700">
                                <span className="size-2 rounded-full bg-amber-600" />
                                3 mantenimiento
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-100">
                        <div className="flex h-full">
                            <div className="w-[67%] bg-blue-500" />
                            <div className="w-[17%] bg-emerald-500" />
                            <div className="w-[16%] bg-amber-500" />
                        </div>
                    </div>
                </section>

                {/* Vehicles */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

                    {/* Toolbar */}
                    <div className="border-b border-zinc-100 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <h2 className="font-semibold text-zinc-900">
                                    Unidades
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    18 unidades registradas en la flota.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                                    <input
                                        type="search"
                                        placeholder="Buscar unidad..."
                                        className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:ring-4 focus:ring-company-100 sm:w-64"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    <Settings2 className="size-4" />
                                    Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                <tr>
                                    <th className="px-5 py-3">Unidad</th>
                                    <th className="px-5 py-3">Ubicación</th>
                                    <th className="px-5 py-3">Operador</th>
                                    <th className="px-5 py-3">Combustible</th>
                                    <th className="px-5 py-3">Estado</th>
                                    <th className="px-5 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-100">
                                {vehicles.map((vehicle) => (
                                    <tr
                                        key={vehicle.id}
                                        className="transition hover:bg-zinc-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                                    <Truck className="size-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900">
                                                        {vehicle.id}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        {vehicle.model} · {vehicle.year}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-400">
                                                        {vehicle.plate}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <MapPin className="size-4 text-zinc-400" />
                                                {vehicle.location}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-zinc-600">
                                            {vehicle.driver}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Fuel className="size-4 text-zinc-400" />

                                                <div className="w-20">
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                                                        <div
                                                            className="h-full rounded-full bg-company"
                                                            style={{ width: vehicle.fuel }}
                                                        />
                                                    </div>
                                                </div>

                                                <span className="text-xs font-medium text-zinc-600">
                                                    {vehicle.fuel}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                                    vehicle.status,
                                                )}`}
                                            >
                                                {vehicle.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-company-600 hover:text-company-700"
                                            >
                                                Ver unidad
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-zinc-100 md:hidden">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                            <Truck className="size-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">
                                                {vehicle.id}
                                            </p>

                                            <p className="text-xs text-zinc-500">
                                                {vehicle.model} · {vehicle.year}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                            vehicle.status,
                                        )}`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <p className="text-zinc-400">Ubicación</p>
                                        <p className="mt-1 flex items-center gap-1.5 font-medium text-zinc-700">
                                            <MapPin className="size-3.5" />
                                            {vehicle.location}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-zinc-400">Operador</p>
                                        <p className="mt-1 font-medium text-zinc-700">
                                            {vehicle.driver}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-zinc-400">Combustible</p>
                                        <p className="mt-1 flex items-center gap-1.5 font-medium text-zinc-700">
                                            <Fuel className="size-3.5" />
                                            {vehicle.fuel}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-zinc-400">Placas</p>
                                        <p className="mt-1 font-medium text-zinc-700">
                                            {vehicle.plate}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-company-600 transition hover:bg-company-50"
                                >
                                    Ver detalles
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando 5 de 18 unidades
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
                                className="rounded-lg border border-zinc-200 px-3 py-2 hover:bg-zinc-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </section>

                {/* Maintenance alert */}
                <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                            <AlertTriangle className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-amber-900">
                                3 unidades requieren atención
                            </h2>

                            <p className="mt-1 text-sm text-amber-800">
                                Hay unidades actualmente en mantenimiento. Revisa su estado
                                antes de asignarlas a un nuevo viaje.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}