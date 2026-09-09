"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    CheckCircle2,
    FileText,
    LoaderCircle,
    Phone,
    UserRound,
} from "lucide-react";

import {
    createDriver,
    updateDriver,
    type DriverFormState,
} from "@/app/actions/drivers";

const initialState: DriverFormState = {};

type DriverFormProps = {
    driver?: {
        id: string;
        name: string;
        phone: string | null;
        licenseNumber: string | null;
        licenseType: string | null;
        licenseExpiresAt: Date | null;
        status: string;
    };
};

export function DriverForm({ driver }: DriverFormProps) {
    const action = driver ? updateDriver : createDriver;

    const [state, formAction, isPending] = useActionState(
        action,
        initialState,
    );
    return (
        <form action={formAction} className="space-y-6">
            {driver && (
                <input
                    type="hidden"
                    name="id"
                    value={driver.id}
                />
            )}
            {/* Error general */}
            {state.error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                >
                    {state.error}
                </div>
            )}

            {/* Información personal */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Información personal
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Información básica del operador.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    {/* Nombre */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Nombre completo
                        </label>

                        <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                defaultValue={driver?.name ?? ""}
                                placeholder="Carlos Martínez"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.name && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.name}
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Teléfono
                        </label>

                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="81 1234 5678"
                                defaultValue={driver?.phone ?? ""}
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.phone && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.phone}
                            </p>
                        )}
                    </div>

                    {/* Estado */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Estado
                        </label>

                        <div className="relative">
                            <CheckCircle2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <select
                                id="status"
                                name="status"
                                defaultValue={driver?.status ?? "ACTIVE"}
                                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            >
                                <option value="ACTIVE">Activo</option>
                                <option value="INACTIVE">Inactivo</option>
                            </select>
                        </div>

                        {state.fieldErrors?.status && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.status}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Licencia */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Licencia de conducir
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Información de la licencia vigente del operador.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    {/* Número */}
                    <div>
                        <label
                            htmlFor="licenseNumber"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Número de licencia
                        </label>

                        <div className="relative">
                            <FileText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="licenseNumber"
                                name="licenseNumber"
                                defaultValue={driver?.licenseNumber ?? ""}
                                type="text"
                                placeholder="E123456789"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm uppercase text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.licenseNumber && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.licenseNumber}
                            </p>
                        )}
                    </div>

                    {/* Tipo */}
                    <div>
                        <label
                            htmlFor="licenseType"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Tipo de licencia
                        </label>

                        <select
                            id="licenseType"
                            name="licenseType"
                            defaultValue={driver?.licenseType ?? ""}
                            className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="FEDERAL">Federal</option>
                            <option value="ESTATAL">Estatal</option>
                            <option value="A">Tipo A</option>
                            <option value="B">Tipo B</option>
                            <option value="C">Tipo C</option>
                            <option value="D">Tipo D</option>
                            <option value="E">Tipo E</option>
                        </select>

                        {state.fieldErrors?.licenseType && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.licenseType}
                            </p>
                        )}
                    </div>

                    {/* Vigencia */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="licenseExpiresAt"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Vigencia de la licencia
                        </label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="licenseExpiresAt"
                                name="licenseExpiresAt"
                                type="date"
                                defaultValue={
                                    driver?.licenseExpiresAt
                                        ? driver.licenseExpiresAt.toISOString().split("T")[0]
                                        : ""
                                }
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.licenseExpiresAt && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.licenseExpiresAt}
                            </p>
                        )}

                        <p className="mt-1.5 text-xs text-zinc-400">
                            Se utilizará para detectar licencias próximas a vencer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Nota */}
            <div className="rounded-2xl border border-company-100 bg-company-50 p-4">
                <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                        <UserRound className="size-5 text-company-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-zinc-900">
                            Operador sin acceso al portal
                        </p>

                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                            Los operadores se registran únicamente para llevar el control
                            de la flota. No se les crea una cuenta de acceso al sistema.
                        </p>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                    href="/users"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                    Cancelar
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-company px-6 text-sm font-bold text-white shadow-sm transition hover:bg-company-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending && (
                        <LoaderCircle className="size-4 animate-spin" />
                    )}

                    {isPending
                        ? driver
                            ? "Guardando..."
                            : "Registrando..."
                        : driver
                            ? "Guardar cambios"
                            : "Registrar operador"}
                </button>
            </div>
        </form>
    );
}