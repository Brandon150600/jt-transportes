import {
    Building2,
    ChevronRight,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Users,
} from "lucide-react";

const clientStats = [
    {
        label: "Clientes registrados",
        value: "24",
        description: "Total en el sistema",
        icon: Users,
    },
    {
        label: "Clientes activos",
        value: "21",
        description: "Con operaciones vigentes",
        icon: Building2,
    },
    {
        label: "Nuevos este mes",
        value: "4",
        description: "Clientes incorporados",
        icon: Plus,
    },
    {
        label: "Con operaciones",
        value: "16",
        description: "Con viajes activos",
        icon: MapPin,
    },
];

const clients = [
    {
        id: "CLI-001",
        name: "Cliente ABC",
        company: "ABC Industrial, S.A. de C.V.",
        contact: "Roberto Sánchez",
        email: "roberto@abcindustrial.com",
        phone: "81 1234 5678",
        location: "Monterrey, NL",
        operations: 8,
        status: "Activo",
    },
    {
        id: "CLI-002",
        name: "Industria XYZ",
        company: "Industria XYZ México",
        contact: "Mariana López",
        email: "mariana@xyz.com",
        phone: "844 234 5678",
        location: "Saltillo, COAH",
        operations: 5,
        status: "Activo",
    },
    {
        id: "CLI-003",
        name: "Constructora Norte",
        company: "Constructora Norte, S.A.",
        contact: "Alejandro Torres",
        email: "alejandro@constructoranorte.com",
        phone: "81 3456 7890",
        location: "Monterrey, NL",
        operations: 3,
        status: "Activo",
    },
    {
        id: "CLI-004",
        name: "Comercial del Norte",
        company: "Comercial del Norte, S.A. de C.V.",
        contact: "Laura Hernández",
        email: "laura@comercialnorte.com",
        phone: "81 4567 8901",
        location: "Apodaca, NL",
        operations: 0,
        status: "Inactivo",
    },
    {
        id: "CLI-005",
        name: "Logística Integral",
        company: "Logística Integral MX",
        contact: "Daniel Ramírez",
        email: "daniel@logisticaintegral.com",
        phone: "81 5678 9012",
        location: "Santa Catarina, NL",
        operations: 6,
        status: "Activo",
    },
];

function statusStyles(status: string) {
    if (status === "Activo") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
    }

    return "bg-zinc-100 text-zinc-600 ring-zinc-500/10";
}

export default function ClientsPage() {
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
                                Clientes
                            </span>
                        </div>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                            Clientes
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                            Consulta y administra la información de los clientes de
                            JT Transportes.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600"
                    >
                        <Plus className="size-4" />
                        Nuevo cliente
                    </button>
                </div>

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {clientStats.map((stat) => {
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

                {/* Client list */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

                    {/* Toolbar */}
                    <div className="border-b border-zinc-100 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="font-semibold text-zinc-900">
                                    Directorio de clientes
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Clientes registrados en JT Transportes.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                                    <input
                                        type="search"
                                        placeholder="Buscar cliente..."
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

                    {/* Desktop */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                <tr>
                                    <th className="px-5 py-3">Cliente</th>
                                    <th className="px-5 py-3">Contacto</th>
                                    <th className="px-5 py-3">Ubicación</th>
                                    <th className="px-5 py-3">Operaciones</th>
                                    <th className="px-5 py-3">Estado</th>
                                    <th className="px-5 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-100">
                                {clients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="transition hover:bg-zinc-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                                    <Building2 className="size-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900">
                                                        {client.name}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        {client.company}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-400">
                                                        {client.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-zinc-700">
                                                {client.contact}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                                <Mail className="size-3.5" />
                                                {client.email}
                                            </div>

                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                                <Phone className="size-3.5" />
                                                {client.phone}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <MapPin className="size-4 text-zinc-400" />
                                                {client.location}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold text-zinc-900">
                                                {client.operations}
                                            </p>

                                            <p className="text-xs text-zinc-400">
                                                viajes registrados
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                                    client.status,
                                                )}`}
                                            >
                                                {client.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                className="text-sm font-semibold text-company-600 hover:text-company-700"
                                            >
                                                Ver cliente
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="divide-y divide-zinc-100 md:hidden">
                        {clients.map((client) => (
                            <div key={client.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                            <Building2 className="size-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-zinc-900">
                                                {client.name}
                                            </p>

                                            <p className="truncate text-xs text-zinc-500">
                                                {client.company}
                                            </p>

                                            <p className="text-xs text-zinc-400">
                                                {client.id}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles(
                                            client.status,
                                        )}`}
                                    >
                                        {client.status}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <Users className="size-4 text-zinc-400" />
                                        {client.contact}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <Mail className="size-4 text-zinc-400" />
                                        <span className="truncate">{client.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <Phone className="size-4 text-zinc-400" />
                                        {client.phone}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <MapPin className="size-4 text-zinc-400" />
                                        {client.location}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <div>
                                        <p className="text-xs text-zinc-400">
                                            Operaciones
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-zinc-800">
                                            {client.operations} viajes
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-company-600 transition hover:bg-company-50"
                                    >
                                        Ver cliente
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>Mostrando 5 de 24 clientes</span>

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
            </div>
        </main>
    );
}