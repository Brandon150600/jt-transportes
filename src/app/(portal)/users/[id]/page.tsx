import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    CarFront,
    Edit,
    FileText,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function DriverPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({
        where: {
            id,
        },
        include: {
            vehicles: {
                select: {
                    id: true,
                    economicNumber: true,
                    type: true,
                    brand: true,
                    model: true,
                    year: true,
                    status: true,
                },
            },
        },
    });

    if (!driver) {
        notFound();
    }

    const statusLabel = {
        ACTIVE: "Activo",
        INACTIVE: "Inactivo",
    }[driver.status];

    const statusClass =
        driver.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-zinc-100 text-zinc-600";

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/users"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a operadores
                    </Link>

                    <Link
                        href={`/users/${driver.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        <Edit className="size-4" />
                        Editar operador
                    </Link>
                </div>

                {/* Profile header */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-100">
                                <UserRound className="size-8 text-zinc-500" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                                        {driver.name}
                                    </h1>

                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                                    >
                                        <span className="size-1.5 rounded-full bg-current" />
                                        {statusLabel}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Operador · {driver.licenseNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main grid */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">

                    {/* Personal information */}
                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-zinc-900">
                                Información del operador
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Datos generales y documentación.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">

                            <InfoItem
                                icon={UserRound}
                                label="Nombre completo"
                                value={driver.name}
                            />

                            <InfoItem
                                icon={Phone}
                                label="Teléfono"
                                value={driver.phone || "No registrado"}
                            />

                            <InfoItem
                                icon={FileText}
                                label="Número de licencia"
                                value={driver.licenseNumber}
                            />

                            <InfoItem
                                icon={BadgeCheck}
                                label="Tipo de licencia"
                                value={driver.licenseType}
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Vigencia de licencia"
                                value={
                                    driver.licenseExpiresAt
                                        ? new Intl.DateTimeFormat("es-MX", {
                                              day: "2-digit",
                                              month: "long",
                                              year: "numeric",
                                          }).format(
                                              driver.licenseExpiresAt,
                                          )
                                        : "No registrada"
                                }
                            />

                            <InfoItem
                                icon={ShieldCheck}
                                label="Estado"
                                value={statusLabel}
                            />

                        </div>
                    </section>

                    {/* Assigned vehicle */}
                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-zinc-900">
                                Unidades asignadas
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Vehículos asociados a este operador.
                            </p>
                        </div>

                        {driver.vehicles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-5 py-10 text-center">
                                <CarFront className="size-8 text-zinc-300" />

                                <p className="mt-3 text-sm font-semibold text-zinc-600">
                                    Sin unidades asignadas
                                </p>

                                <p className="mt-1 text-xs text-zinc-400">
                                    Este operador no tiene vehículos asociados.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {driver.vehicles.map((vehicle) => (
                                    <Link
                                        key={vehicle.id}
                                        href={`/fleet-management/${vehicle.id}`}
                                        className="block rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-300 hover:bg-zinc-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-zinc-900">
                                                    {vehicle.economicNumber}
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {vehicle.brand}{" "}
                                                    {vehicle.model} ·{" "}
                                                    {vehicle.year}
                                                </p>
                                            </div>

                                            <CarFront className="size-5 text-zinc-400" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Future modules */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-zinc-900">
                            Documentación
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Aquí podremos agregar posteriormente los documentos
                            del operador.
                        </p>

                        <div className="mt-5 rounded-xl bg-zinc-50 p-5">
                            <p className="text-sm font-semibold text-zinc-600">
                                Licencia
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                {driver.licenseNumber}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-zinc-900">
                            Historial
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Aquí podremos mostrar posteriormente operaciones,
                            asignaciones y eventos del operador.
                        </p>

                        <div className="mt-5 flex min-h-32 items-center justify-center rounded-xl border border-dashed border-zinc-200">
                            <p className="text-sm text-zinc-400">
                                Sin actividad registrada
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                <Icon className="size-4 text-zinc-500" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-400">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-zinc-800">
                    {value}
                </p>
            </div>
        </div>
    );
}