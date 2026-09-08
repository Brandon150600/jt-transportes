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
  type VehicleFormState,
} from "@/app/actions/fleet";

type DriverOption = {
  id: string;
  name: string;
  licenseNumber: string | null;
};

type VehicleFormProps = {
  drivers: DriverOption[];
};

const initialState: VehicleFormState = {};

export function VehicleForm({ drivers }: VehicleFormProps) {
  const [state, formAction, isPending] = useActionState(
    createVehicle,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Error general */}
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {state.error}
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
                defaultValue=""
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
          {/* Estado */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Estado inicial
            </label>

            <div className="relative">
              <CheckCircle2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

              <select
                id="status"
                name="status"
                defaultValue="AVAILABLE"
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
                min="0"
                defaultValue="0"
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
                defaultValue="0"
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

      {/* Operador */}
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
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
            defaultValue=""
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
          >
            <option value="">Sin asignar</option>

            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
                {driver.licenseNumber
                  ? ` · Lic. ${driver.licenseNumber}`
                  : ""}
              </option>
            ))}
          </select>

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

          {isPending ? "Registrando..." : "Registrar unidad"}
        </button>
      </div>
    </form>
  );
}