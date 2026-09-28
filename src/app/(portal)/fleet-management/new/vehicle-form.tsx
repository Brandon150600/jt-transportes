"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    CheckCircle2,
    FileText,
    Fuel,
    Gauge,
    Hash,
    LoaderCircle,
    Palette,
    Truck,
} from "lucide-react";

import {
    createVehicle,
    updateVehicle,
    type VehicleFormState,
} from "@/app/actions/fleet";

type DriverOption = {
    id: string;
    name: string;
    licenseNumber: string | null;
    status?: string;
};

type VehicleFormVehicle = {
    id: string;
    economicNumber: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    plate: string | null;
    vin: string | null;
    status: string;
    mileage: number;
    fuelLevel: number;
    driverId: string | null;
    location: string | null;
    lastServiceAt: Date | null;
    nextServiceAt: Date | null;
    insuranceStatus: string | null;
    registrationStatus: string | null;
};

const initialState: VehicleFormState = {};

type VehicleFormProps = {
    drivers: DriverOption[];
    vehicle?: VehicleFormVehicle;
};

export function VehicleForm({
    drivers,
    vehicle,
}: VehicleFormProps) {
    const action = vehicle
        ? updateVehicle
        : createVehicle;

    const [state, formAction, isPending] = useActionState(
        action,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-6">
            {vehicle && (
                <input
                    type="hidden"
                    name="id"
                    value={vehicle.id}
                />
            )}
            {/* Error general */}
            {state.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-semibold">{state.error}</p>

                    {state.fieldErrors && (
                        <ul className="mt-2 list-disc pl-5">
                            {Object.entries(state.fieldErrors).map(
                                ([field, message]) => (
                                    <li key={field}>
                                        <strong>{field}:</strong> {message}
                                    </li>
                                ),
                            )}
                        </ul>
                    )}
                </div>
            )}

            {/* Información principal */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Información de la unidad
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Datos generales para identificar el vehículo.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    {/* Número económico */}
                    <div>
                        <label
                            htmlFor="economicNumber"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Número económico
                        </label>

                        <div className="relative">
                            <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="economicNumber"
                                name="economicNumber"
                                type="text"
                                defaultValue={vehicle?.economicNumber ?? ""}
                                required
                                placeholder="JT-019"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.economicNumber && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.economicNumber}
                            </p>
                        )}
                    </div>

                    {/* Tipo */}
                    <div>
                        <label
                            htmlFor="type"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Tipo de unidad
                        </label>

                        <div className="relative">
                            <Truck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <select
                                id="type"
                                name="type"
                                defaultValue={vehicle?.type ?? ""}
                                required
                                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            >
                                <option value="" disabled>
                                    Selecciona un tipo
                                </option>
                                <option value="TRACTOR">Tractocamión</option>
                                <option value="TRUCK">Camión</option>
                                <option value="TRAILER">Remolque</option>
                                <option value="DRY_VAN">Caja seca</option>
                                <option value="PLATFORM">Plataforma</option>
                                <option value="OTHER">Otro</option>
                            </select>
                        </div>

                        {state.fieldErrors?.type && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.type}
                            </p>
                        )}
                    </div>

                    {/* Marca */}
                    <div>
                        <label
                            htmlFor="brand"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Marca
                        </label>

                        <input
                            id="brand"
                            name="brand"
                            type="text"
                            required
                            placeholder="Kenworth"
                            defaultValue={vehicle?.brand ?? ""}
                            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                        />

                        {state.fieldErrors?.brand && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.brand}
                            </p>
                        )}
                    </div>

                    {/* Modelo */}
                    <div>
                        <label
                            htmlFor="model"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Modelo
                        </label>

                        <input
                            id="model"
                            name="model"
                            type="text"
                            defaultValue={vehicle?.model ?? ""}
                            required
                            placeholder="T680"
                            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                        />

                        {state.fieldErrors?.model && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.model}
                            </p>
                        )}
                    </div>

                    {/* Año */}
                    <div>
                        <label
                            htmlFor="year"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Año
                        </label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="year"
                                name="year"
                                defaultValue={vehicle?.year ?? ""}
                                type="number"
                                required
                                min="1980"
                                max="2100"
                                placeholder="2025"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.year && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.year}
                            </p>
                        )}
                    </div>

                    {/* Color */}
                    <div>
                        <label
                            htmlFor="color"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Color
                        </label>

                        <div className="relative">
                            <Palette className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="color"
                                name="color"
                                defaultValue={vehicle?.color ?? ""}
                                type="text"
                                placeholder="Blanco"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />

                        </div>
                    </div>
                </div>
            </section>

            {/* Identificación */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Identificación y registro
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Información necesaria para identificar legalmente la unidad.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    {/* Placas */}
                    <div>
                        <label
                            htmlFor="plate"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Placas
                        </label>

                        <div className="relative">
                            <FileText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="plate"
                                name="plate"
                                defaultValue={vehicle?.plate ?? ""}
                                type="text"
                                placeholder="XX-12-345"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm uppercase text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.plate && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.plate}
                            </p>
                        )}
                    </div>

                    {/* VIN */}
                    <div>
                        <label
                            htmlFor="vin"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            VIN / Número de serie
                        </label>

                        <input
                            id="vin"
                            name="vin"
                            type="text"
                            defaultValue={vehicle?.vin ?? ""}
                            maxLength={17}
                            placeholder="1XKAD49X5SJ123456"
                            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm uppercase text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                        />

                        {state.fieldErrors?.vin && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.vin}
                            </p>
                        )}

                        <p className="mt-1.5 text-xs text-zinc-400">
                            Normalmente contiene 17 caracteres.
                        </p>
                    </div>
                </div>
            </section>

            {/* Estado operativo */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Estado operativo
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Información inicial de operación de la unidad.
                    </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="location" className="mb-2 block text-sm font-medium text-zinc-700">Ubicación actual</label>
                        <input id="location" name="location" type="text" defaultValue={vehicle?.location ?? ""} placeholder="Monterrey, N.L." className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900" />
                    </div>
                    {/* Estado */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            {vehicle ? "Estado de la unidad" : "Estado inicial"}
                        </label>

                        <div className="relative">
                            <CheckCircle2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <select
                                id="status"
                                name="status"
                                defaultValue={vehicle?.status ?? "AVAILABLE"}
                                className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            >
                                <option value="AVAILABLE">Disponible</option>
                                <option value="IN_ROUTE">En ruta</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                                <option value="INACTIVE">Inactiva</option>
                            </select>
                        </div>
                    </div>

                    {/* Kilometraje */}
                    <div>
                        <label
                            htmlFor="mileage"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Kilometraje
                        </label>

                        <div className="relative">
                            <Gauge className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="mileage"
                                name="mileage"
                                type="number"
                                defaultValue={vehicle?.mileage ?? 0}
                                min="0"
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.mileage && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.mileage}
                            </p>
                        )}
                    </div>

                    {/* Combustible */}
                    <div>
                        <label
                            htmlFor="fuelLevel"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            Combustible inicial
                        </label>

                        <div className="relative">
                            <Fuel className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

                            <input
                                id="fuelLevel"
                                name="fuelLevel"
                                type="number"
                                min="0"
                                max="100"
                                defaultValue={vehicle?.fuelLevel ?? 0}
                                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                            />
                        </div>

                        {state.fieldErrors?.fuelLevel && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {state.fieldErrors.fuelLevel}
                            </p>
                        )}

                        <p className="mt-1.5 text-xs text-zinc-400">
                            Introduce un valor entre 0 y 100%.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mantenimiento */}
            <section id="maintenance" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4"><h2 className="font-semibold text-zinc-900">Mantenimiento</h2><p className="mt-1 text-xs text-zinc-500">Registra las fechas del último servicio y del próximo mantenimiento programado.</p></div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div><label htmlFor="lastServiceAt" className="mb-2 block text-sm font-medium text-zinc-700">Último servicio</label><input id="lastServiceAt" name="lastServiceAt" type="date" defaultValue={vehicle?.lastServiceAt ? vehicle.lastServiceAt.toISOString().slice(0, 10) : ""} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />{state.fieldErrors?.lastServiceAt && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.lastServiceAt}</p>}</div>
                    <div><label htmlFor="nextServiceAt" className="mb-2 block text-sm font-medium text-zinc-700">Próximo servicio</label><input id="nextServiceAt" name="nextServiceAt" type="date" defaultValue={vehicle?.nextServiceAt ? vehicle.nextServiceAt.toISOString().slice(0, 10) : ""} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />{state.fieldErrors?.nextServiceAt && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.nextServiceAt}</p>}</div>
                </div>
            </section>

            {/* Documentación */}
            <section id="documents" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4"><h2 className="font-semibold text-zinc-900">Documentación</h2><p className="mt-1 text-xs text-zinc-500">Registra el estado de vigencia. La carga de archivos requiere almacenamiento documental, aún no configurado.</p></div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                    {[{ name: "insuranceStatus", label: "Póliza de seguro", value: vehicle?.insuranceStatus }, { name: "registrationStatus", label: "Tarjeta de circulación", value: vehicle?.registrationStatus }].map((document) => (
                        <div key={document.name}>
                            <label htmlFor={document.name} className="mb-2 block text-sm font-medium text-zinc-700">{document.label}</label>
                            <select id={document.name} name={document.name} defaultValue={document.value ?? ""} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm">
                                <option value="">Sin registrar</option>
                                {document.value && !["VALID", "EXPIRING", "EXPIRED"].includes(document.value) && <option value={document.value}>{document.value}</option>}
                                <option value="VALID">Vigente</option><option value="EXPIRING">Por vencer</option><option value="EXPIRED">Vencido</option>
                            </select>
                        </div>
                    ))}
                </div>
            </section>

            {/* Operador */}
            <section id="driver" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">
                        Operador asignado
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        Puedes asignar un operador ahora o hacerlo posteriormente.
                    </p>
                </div>

                <div className="p-5">
                    <label
                        htmlFor="driverId"
                        className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                        Operador
                    </label>

                    <select
                        id="driverId"
                        name="driverId"
                        defaultValue={vehicle?.driverId ?? ""}
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                    >
                        <option value="">Sin asignar</option>

                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}{driver.status && driver.status !== "ACTIVE" ? ` · ${driver.status === "SUSPENDED" ? "Suspendido" : "Inactivo"}` : ""}
                                {driver.licenseNumber
                                    ? ` · Lic. ${driver.licenseNumber}`
                                    : ""}
                            </option>
                        ))}
                    </select>

                    {state.fieldErrors?.driverId && <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.driverId}</p>}

                    {drivers.length === 0 && (
                        <p className="mt-2 text-xs text-zinc-400">
                            No hay operadores activos registrados.
                        </p>
                    )}
                </div>
            </section>

            {/* Acciones */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                    href="/fleet-management"
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
                        ? vehicle
                            ? "Guardando..."
                            : "Registrando..."
                        : vehicle
                            ? "Guardar cambios"
                            : "Registrar unidad"}
                </button>
            </div>
        </form>
    );
}
