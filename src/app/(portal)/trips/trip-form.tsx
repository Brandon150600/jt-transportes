"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveTrip, type TripFormState } from "@/app/actions/trips";

type ClientOption = { id: string; label: string; addresses: { id: string; name: string; address: string }[] };
type VehicleOption = { id: string; label: string; mileage: number; assignedDriverId: string | null };
type DriverOption = { id: string; name: string };
type CarrierOption = { id: string; businessName: string; active: boolean };
type ExecutionType = "OWN" | "SUBCONTRACTED";
type ExistingTrip = { id: string; executionType: ExecutionType; clientId: string; destinationAddressId: string; origin: string; vehicleId: string | null; driverId: string | null; externalCarrierId: string | null; externalVehicleDescription: string | null; externalDriverName: string | null; subcontractorCost: string | null; scheduledStartAt: string; mileageStart: number | null; revenue: string; notes: string | null };
const initial: TripFormState = {};

export function TripForm({ clients, vehicles, drivers, carriers, trip, defaults }: { clients: ClientOption[]; vehicles: VehicleOption[]; drivers: DriverOption[]; carriers: CarrierOption[]; trip?: ExistingTrip; defaults?: { clientId?: string; vehicleId?: string } }) {
  const [state, action, pending] = useActionState(saveTrip, initial);
  const [clientId, setClientId] = useState(trip?.clientId ?? defaults?.clientId ?? "");
  const [executionType, setExecutionType] = useState<ExecutionType>(trip?.executionType ?? "OWN");
  const [vehicleId, setVehicleId] = useState(trip?.vehicleId ?? defaults?.vehicleId ?? "");
  const [carrierId, setCarrierId] = useState(trip?.externalCarrierId ?? "");
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
  const [mileageStart, setMileageStart] = useState(String(trip?.mileageStart ?? selectedVehicle?.mileage ?? 0));
  const initialAssignedDriverId = selectedVehicle?.assignedDriverId && drivers.some((driver) => driver.id === selectedVehicle.assignedDriverId)
    ? selectedVehicle.assignedDriverId
    : "";
  const [driverId, setDriverId] = useState(trip?.driverId ?? initialAssignedDriverId);
  const dateValue = trip?.scheduledStartAt ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(trip.scheduledStartAt)).replace(", ", "T") : "";
  return <form action={action} className="space-y-5">
    {trip && <input type="hidden" name="id" value={trip.id} />}
    {state.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>}
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-2">
      <Field label="Tipo de ejecución" error={state.fieldErrors?.executionType}><select name={trip ? undefined : "executionType"} required disabled={Boolean(trip)} value={executionType} onChange={(e) => setExecutionType(e.target.value as ExecutionType)} className={inputClass}><option value="OWN">Propio</option><option value="SUBCONTRACTED">Subcontratado</option></select>{trip && <><input type="hidden" name="executionType" value={executionType} /><span className="mt-1 block text-xs text-zinc-500">El tipo de ejecución se define al crear el viaje para conservar su historial.</span></>}</Field>
      <Field label="Cliente" error={state.fieldErrors?.clientId}><select name="clientId" required value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}><option value="">Selecciona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.label}</option>)}</select></Field>
      <Field label="Destino del cliente" error={state.fieldErrors?.destinationAddressId}><select key={clientId} name="destinationAddressId" required defaultValue={trip?.destinationAddressId ?? ""} className={inputClass}><option value="">Selecciona destino</option>{clients.find((client) => client.id === clientId)?.addresses.map((address) => <option key={address.id} value={address.id}>{address.name} · {address.address}</option>)}</select></Field>
      <Field label="Origen" error={state.fieldErrors?.origin}><input name="origin" required defaultValue={trip?.origin} maxLength={240} placeholder="Ciudad, patio o dirección de salida" className={inputClass} /></Field>
      <Field label="Fecha y hora de salida" error={state.fieldErrors?.scheduledStartAt}><input type="datetime-local" name="scheduledStartAt" required defaultValue={dateValue} className={inputClass} /></Field>
      {executionType === "OWN" ? <>
      <Field label="Unidad" error={state.fieldErrors?.vehicleId}><select name="vehicleId" required value={vehicleId} onChange={(e) => {
        const nextVehicleId = e.target.value;
        const nextVehicle = vehicles.find((vehicle) => vehicle.id === nextVehicleId);
        setVehicleId(nextVehicleId);
        setDriverId(nextVehicle?.assignedDriverId && drivers.some((driver) => driver.id === nextVehicle.assignedDriverId) ? nextVehicle.assignedDriverId : "");
        setMileageStart(String(nextVehicle?.mileage ?? 0));
      }} className={inputClass}><option value="">Selecciona unidad</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.label}</option>)}</select></Field>
      <Field label="Operador" error={state.fieldErrors?.driverId}><select name="driverId" required value={driverId} onChange={(e) => setDriverId(e.target.value)} className={inputClass}><option value="">Selecciona operador</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}</select><span className="mt-1 block text-xs text-zinc-500">Se sugiere el operador asignado a la unidad; puedes cambiarlo para este viaje.</span></Field>
      <Field label="Kilometraje inicial" error={state.fieldErrors?.mileageStart}><input type="number" name="mileageStart" required min={selectedVehicle?.mileage ?? 0} max={2147483647} value={mileageStart} onChange={(e) => setMileageStart(e.target.value)} className={inputClass} /><span className="mt-1 block text-xs text-zinc-500">Odómetro actual: {(selectedVehicle?.mileage ?? 0).toLocaleString("es-MX")} km</span></Field>
      </> : <>
      <Field label="Transportista externo" error={state.fieldErrors?.externalCarrierId}><select name="externalCarrierId" required value={carrierId} onChange={(e) => setCarrierId(e.target.value)} className={inputClass}><option value="">Selecciona transportista</option>{carriers.map((carrier) => <option key={carrier.id} value={carrier.id}>{carrier.businessName}{!carrier.active ? " · Inactivo (histórico)" : ""}</option>)}</select><Link href="/external-carriers/new" className="mt-1 inline-block text-xs font-semibold text-company-700">Crear transportista</Link></Field>
      <Field label="Descripción del camión externo" error={state.fieldErrors?.externalVehicleDescription}><input name="externalVehicleDescription" maxLength={200} defaultValue={trip?.externalVehicleDescription ?? ""} placeholder="Kenworth T680 / placas ABC-123" className={inputClass} /></Field>
      <Field label="Nombre del operador externo" error={state.fieldErrors?.externalDriverName}><input name="externalDriverName" maxLength={120} defaultValue={trip?.externalDriverName ?? ""} placeholder="Nombre del operador" className={inputClass} /></Field>
      <Field label="Costo del transportista ($)" error={state.fieldErrors?.subcontractorCost}><input type="number" name="subcontractorCost" required min="0" max="9999999999.99" step="0.01" defaultValue={trip?.subcontractorCost ?? ""} className={inputClass} /></Field>
      </>}
      <Field label="Ingreso del viaje ($)" error={state.fieldErrors?.revenue}><input type="number" name="revenue" required min="0" step="0.01" defaultValue={trip?.revenue ?? "0.00"} className={inputClass} /></Field>
      {executionType === "SUBCONTRACTED" && <div className="sm:col-span-2"><p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Si el costo supera el ingreso, el margen será negativo. El viaje puede guardarse y el margen se mostrará como advertencia.</p></div>}
      <div className="sm:col-span-2"><Field label="Notas"><textarea name="notes" rows={3} maxLength={3000} defaultValue={trip?.notes ?? ""} className={inputClass} /></Field></div>
    </section>
    <div className="flex justify-end gap-3"><Link href={trip ? `/trips/${trip.id}` : "/trips"} className="inline-flex h-11 items-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold">Cancelar</Link><button disabled={pending} className="h-11 rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : trip ? "Guardar cambios" : "Crear viaje"}</button></div>
  </form>;
}

const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-company focus:ring-4 focus:ring-company-100";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>; }
