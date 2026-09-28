"use client";

import { useActionState } from "react";
import { createClientAddress, updateClientAddress, type ClientAddressFormState } from "@/app/actions/clients";

export type ClientAddressData = {
  id: string;
  name: string;
  street: string;
  exteriorNumber: string | null;
  interiorNumber: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  country: string;
  reference: string | null;
  notes: string | null;
};

const initialState: ClientAddressFormState = {};
const inputClass = "mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-company focus:ring-4 focus:ring-company-100";

export function ClientAddressForm({ clientId, address, onCancel }: { clientId: string; address?: ClientAddressData; onCancel?: () => void }) {
  const [state, action, pending] = useActionState(address ? updateClientAddress : createClientAddress, initialState);
  return <form action={action} className="space-y-4">
    <input type="hidden" name="clientId" value={clientId} />
    {address && <input type="hidden" name="id" value={address.id} />}
    {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Nombre de la ubicación" error={state.fieldErrors?.name}><input name="name" required defaultValue={address?.name ?? ""} placeholder="Planta Monterrey" className={inputClass} /></Field>
      <Field label="Calle o carretera" error={state.fieldErrors?.street}><input name="street" required defaultValue={address?.street ?? ""} className={inputClass} /></Field>
      <Field label="Número exterior"><input name="exteriorNumber" defaultValue={address?.exteriorNumber ?? ""} className={inputClass} /></Field>
      <Field label="Número interior"><input name="interiorNumber" defaultValue={address?.interiorNumber ?? ""} className={inputClass} /></Field>
      <Field label="Colonia"><input name="neighborhood" defaultValue={address?.neighborhood ?? ""} className={inputClass} /></Field>
      <Field label="Ciudad" error={state.fieldErrors?.city}><input name="city" required defaultValue={address?.city ?? ""} className={inputClass} /></Field>
      <Field label="Estado" error={state.fieldErrors?.state}><input name="state" required defaultValue={address?.state ?? ""} className={inputClass} /></Field>
      <Field label="Código postal"><input name="postalCode" inputMode="numeric" defaultValue={address?.postalCode ?? ""} className={inputClass} /></Field>
      <Field label="País"><input name="country" required defaultValue={address?.country ?? "México"} className={inputClass} /></Field>
      <Field label="Referencia de acceso"><input name="reference" defaultValue={address?.reference ?? ""} placeholder="Acceso por caseta norte" className={inputClass} /></Field>
      <Field label="Notas"><textarea name="notes" rows={2} defaultValue={address?.notes ?? ""} className={`${inputClass} h-auto py-2`} /></Field>
    </div>
    <div className="flex justify-end gap-2">{onCancel && <button type="button" onClick={onCancel} className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium">Cancelar</button>}<button disabled={pending} className="h-10 rounded-lg bg-company px-4 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : address ? "Guardar ubicación" : "Agregar ubicación"}</button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
