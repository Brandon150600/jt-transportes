"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveTrip, type TripFormState } from "@/app/actions/trips";

type ClientOption = { id: string; label: string; addresses: { id: string; name: string; address: string }[] };
type VehicleOption = { id: string; label: string; mileage: number };
type DriverOption = { id: string; name: string };
type ExistingTrip = { id: string; clientId: string; destinationAddressId: string; origin: string; vehicleId: string; driverId: string; scheduledStartAt: string; mileageStart: number; revenue: string; notes: string | null };
const initial: TripFormState = {};

export function TripForm({ clients, vehicles, drivers, trip, defaults }: { clients: ClientOption[]; vehicles: VehicleOption[]; drivers: DriverOption[]; trip?: ExistingTrip; defaults?: { clientId?: string; vehicleId?: string } }) {
  const [state, action, pending] = useActionState(saveTrip, initial);
  const [clientId, setClientId] = useState(trip?.clientId ?? defaults?.clientId ?? "");
  const [vehicleId, setVehicleId] = useState(trip?.vehicleId ?? defaults?.vehicleId ?? "");
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
  const dateValue = trip?.scheduledStartAt ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(trip.scheduledStartAt)).replace(", ", "T") : "";
  return <form action={action} className="space-y-5">
    {trip && <input type="hidden" name="id" value={trip.id} />}
    {state.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>}
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-2">
      <Field label="Cliente" error={state.fieldErrors?.clientId}><select name="clientId" required value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}><option value="">Selecciona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.label}</option>)}</select></Field>
      <Field label="Destino del cliente" error={state.fieldErrors?.destinationAddressId}><select key={clientId} name="destinationAddressId" required defaultValue={trip?.destinationAddressId ?? ""} className={inputClass}><option value="">Selecciona destino</option>{clients.find((client) => client.id === clientId)?.addresses.map((address) => <option key={address.id} value={address.id}>{address.name} · {address.address}</option>)}</select></Field>
      <Field label="Origen" error={state.fieldErrors?.origin}><input name="origin" required defaultValue={trip?.origin} maxLength={240} placeholder="Ciudad, patio o dirección de salida" className={inputClass} /></Field>
      <Field label="Fecha y hora de salida" error={state.fieldErrors?.scheduledStartAt}><input type="datetime-local" name="scheduledStartAt" required defaultValue={dateValue} className={inputClass} /></Field>
      <Field label="Unidad" error={state.fieldErrors?.vehicleId}><select name="vehicleId" required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}><option value="">Selecciona unidad</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.label}</option>)}</select></Field>
      <Field label="Operador" error={state.fieldErrors?.driverId}><select name="driverId" required defaultValue={trip?.driverId ?? ""} className={inputClass}><option value="">Selecciona operador</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}</select></Field>
      <Field label="Kilometraje inicial" error={state.fieldErrors?.mileageStart}><input type="number" name="mileageStart" required min={selectedVehicle?.mileage ?? 0} defaultValue={trip?.mileageStart ?? selectedVehicle?.mileage ?? 0} className={inputClass} /><span className="mt-1 block text-xs text-zinc-500">Odómetro actual: {(selectedVehicle?.mileage ?? 0).toLocaleString("es-MX")} km</span></Field>
      <Field label="Ingreso del viaje ($)" error={state.fieldErrors?.revenue}><input type="number" name="revenue" required min="0" step="0.01" defaultValue={trip?.revenue ?? "0.00"} className={inputClass} /></Field>
      <div className="sm:col-span-2"><Field label="Notas"><textarea name="notes" rows={3} maxLength={3000} defaultValue={trip?.notes ?? ""} className={inputClass} /></Field></div>
    </section>
    <div className="flex justify-end gap-3"><Link href={trip ? `/trips/${trip.id}` : "/trips"} className="inline-flex h-11 items-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold">Cancelar</Link><button disabled={pending} className="h-11 rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : trip ? "Guardar cambios" : "Crear viaje"}</button></div>
  </form>;
}

const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-company focus:ring-4 focus:ring-company-100";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>; }
