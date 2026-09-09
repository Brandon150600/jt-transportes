import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleDot,
    FileText,
    Fuel,
    Gauge,
    MapPin,
    Pencil,
    Truck,
    UserRound,
    Wrench,
} from "lucide-react";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";




function InfoItem({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon: typeof Truck;
}) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Icon className="size-4" />
                {label}
            </div>

            <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
        </div>
    );
}

export default async function FleetVehiclePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id: id,
        },
        include: {
            driver: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    licenseNumber: true,
                },
            },
        },
    });

    if (!vehicle) {
        notFound();
    }

    const statusLabels = {
        AVAILABLE: "Disponible",
        IN_ROUTE: "En ruta",
        MAINTENANCE: "Mantenimiento",
        INACTIVE: "Inactiva",
    } as const;

    const statusLabel = statusLabels[vehicle.status];
    function getStatusStyles(status: string) {
        switch (status) {
            case "En ruta":
                return {
                    badge: "bg-blue-50 text-blue-700 ring-blue-200",
                    icon: "text-blue-600",
                };

            case "Disponible":
                return {
                    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
                    icon: "text-emerald-600",
                };

            case "Mantenimiento":
                return {
                    badge: "bg-amber-50 text-amber-700 ring-amber-200",
                    icon: "text-amber-600",
                };

            default:
                return {
                    badge: "bg-zinc-100 text-zinc-700 ring-zinc-200",
                    icon: "text-zinc-600",
                };
        }
    }
    const statusStyles = getStatusStyles(statusLabel);

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                    <Link
                        href="/fleet-management"
                        className="transition hover:text-company-600"
                    >
                        Flota
                    </Link>

                    <ChevronRight className="size-4" />

                    <span className="font-medium text-zinc-900">{vehicle.id}</span>
                </div>

                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/fleet-management"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-company-600 transition hover:text-company-700"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a la flota
                    </Link>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                                    {vehicle.economicNumber}
                                </h1>

                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusStyles.badge}`}
                                >
                                    <CircleDot className={`size-3 ${statusStyles.icon}`} />
                                    {vehicle.status}
                                </span>
                            </div>

                            <p className="mt-2 text-base text-zinc-500">
                                {vehicle.brand} {vehicle.model} · {vehicle.year}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                            >
                                <Wrench className="size-4" />
                                Mantenimiento
                            </button>

                            <Link
                                href={`/fleet-management/${vehicle.id}/edit`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                            >
                                <Pencil className="size-4" />
                                Editar unidad
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        {/* Overview */}
                        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <div className="border-b border-zinc-100 px-5 py-4">
                                <h2 className="font-semibold text-zinc-900">
                                    Información general
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Datos principales de la unidad
                                </p>
                            </div>

                            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                                <InfoItem
                                    label="Número económico"
                                    value={vehicle.economicNumber}
                                    icon={Truck}
                                />
                                <InfoItem
                                    label="Marca"
                                    value={vehicle.brand}
                                    icon={Truck}
                                />
                                <InfoItem
                                    label="Modelo"
                                    value={vehicle.model}
                                    icon={Truck}
                                />

                                <InfoItem
                                    label="Año"
                                    value={vehicle.year.toString()}
                                    icon={CalendarDays}
                                />

                                <InfoItem
                                    label="Tipo"
                                    value={vehicle.type.replace("_", " ")}
                                    icon={Truck}
                                />

                                <InfoItem
                                    label="Placas"
                                    value={vehicle.plate ?? "Sin placas"}
                                    icon={FileText}
                                />

                                <InfoItem
                                    label="Kilometraje"
                                    value={`${vehicle.mileage.toLocaleString("es-MX")} km`}
                                    icon={Gauge}
                                />
                                <InfoItem
                                    label="Color"
                                    value={vehicle.color ?? "No especificado"}
                                    icon={Truck}
                                />
                                <InfoItem
                                    label="VIN"
                                    value={vehicle.vin ?? "No registrado"}
                                    icon={FileText}
                                />
                            </div>
                        </section>

                        {/* Operation */}
                        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <div className="border-b border-zinc-100 px-5 py-4">
                                <h2 className="font-semibold text-zinc-900">
                                    Estado operativo
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Situación actual de la unidad
                                </p>
                            </div>

                            <div className="grid gap-3 p-5 sm:grid-cols-2">
                                <InfoItem
                                    label="Ubicación actual"
                                    value={vehicle.location ?? "Sin ubicación registrada"}
                                    icon={MapPin}
                                />

                                <InfoItem
                                    label="Operador asignado"
                                    value={vehicle.driver?.name ?? "Sin asignar"}
                                    icon={UserRound}
                                />

                                <InfoItem
                                    label="Nivel de combustible"
                                    value={`${vehicle.fuelLevel}%`} icon={Fuel}
                                />

                                <InfoItem
                                    label="Estado"
                                    value={statusLabel}
                                    icon={CheckCircle2}
                                />
                            </div>
                        </section>

                        {/* Maintenance */}
                        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <div className="border-b border-zinc-100 px-5 py-4">
                                <h2 className="font-semibold text-zinc-900">Mantenimiento</h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Próximos servicios y mantenimiento de la unidad
                                </p>
                            </div>

                            <div className="grid gap-3 p-5 sm:grid-cols-2">
                                <div className="rounded-xl border border-zinc-200 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                        <Wrench className="size-4" />
                                        Último servicio
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                                        {vehicle.lastServiceAt
                                            ? vehicle.lastServiceAt.toLocaleDateString("es-MX")
                                            : "Sin registro"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-200 p-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                        <CalendarDays className="size-4" />
                                        Próximo servicio
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                                        {vehicle.nextServiceAt
                                            ? vehicle.nextServiceAt.toLocaleDateString("es-MX")
                                            : "No programado"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Documentation */}
                        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <div className="border-b border-zinc-100 px-5 py-4">
                                <h2 className="font-semibold text-zinc-900">Documentación</h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Vigencia de documentos de la unidad
                                </p>
                            </div>

                            <div className="divide-y divide-zinc-100">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100">
                                            <FileText className="size-4 text-zinc-600" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">
                                                Póliza de seguro
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Documento vigente
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        <CheckCircle2 className="size-3.5" />
                                        {vehicle.insuranceStatus ?? "No registrada"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100">
                                            <FileText className="size-4 text-zinc-600" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">
                                                Tarjeta de circulación
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Documento vigente
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        <CheckCircle2 className="size-3.5" />
                                        {vehicle.registrationStatus ?? "No registrada"}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Vehicle status */}
                        <section className="rounded-2xl bg-zinc-900 p-5 text-white shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                                    <Truck className="size-5" />
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400">Unidad</p>
                                    <p className="font-bold">{vehicle.economicNumber}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs text-zinc-400">Estado actual</p>

                                <p className="mt-1 text-2xl font-bold">{statusLabel}</p>

                                <p className="mt-2 text-sm text-zinc-400">
                                    {vehicle.location ?? "Sin ubicación registrada"}
                                </p>
                            </div>
                        </section>

                        {/* Driver */}
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-company-50">
                                    <UserRound className="size-5 text-company-600" />
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-500">Operador</p>

                                    <p className="font-semibold text-zinc-900">
                                        {vehicle.driver?.name ?? "Sin asignar"}
                                    </p>
                                </div>
                            </div>

                            {vehicle.driver && (
                                <button
                                    type="button"
                                    className="mt-4 flex w-full items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    Ver perfil
                                    <ChevronRight className="size-4 text-zinc-400" />
                                </button>
                            )}
                        </section>

                        {/* Quick actions */}
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-zinc-900">
                                Acciones rápidas
                            </h2>

                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left transition hover:border-company-200 hover:bg-company-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <Wrench className="size-4 text-company-600" />
                                        <span className="text-sm font-medium">
                                            Registrar mantenimiento
                                        </span>
                                    </span>

                                    <ChevronRight className="size-4 text-zinc-400" />
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left transition hover:border-company-200 hover:bg-company-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <UserRound className="size-4 text-company-600" />
                                        <span className="text-sm font-medium">
                                            Asignar operador
                                        </span>
                                    </span>

                                    <ChevronRight className="size-4 text-zinc-400" />
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left transition hover:border-company-200 hover:bg-company-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <FileText className="size-4 text-company-600" />
                                        <span className="text-sm font-medium">
                                            Ver documentos
                                        </span>
                                    </span>

                                    <ChevronRight className="size-4 text-zinc-400" />
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}