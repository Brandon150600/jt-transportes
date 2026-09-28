"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createClient, updateClient, type ClientFormState } from "@/app/actions/clients";

export type ClientFormData = {
  id: string;
  businessName: string;
  commercialName: string | null;
  taxId: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

const initialState: ClientFormState = {};
const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-company focus:ring-4 focus:ring-company-100";

export function ClientForm({ client }: { client?: ClientFormData }) {
  const [state, action, pending] = useActionState(client ? updateClient : createClient, initialState);
  return <form action={action} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
    {client && <input type="hidden" name="id" value={client.id} />}
    {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <section><h2 className="font-semibold text-zinc-900">Información de la empresa</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field label="Razón social" error={state.fieldErrors?.businessName}><input name="businessName" required autoFocus defaultValue={client?.businessName ?? ""} placeholder="Vitro, S.A.B. de C.V." className={inputClass} /></Field>
      <Field label="Nombre comercial (opcional)" error={state.fieldErrors?.commercialName}><input name="commercialName" defaultValue={client?.commercialName ?? ""} placeholder="Vitro" className={inputClass} /></Field>
      <Field label="RFC (opcional)" error={state.fieldErrors?.taxId}><input name="taxId" autoCapitalize="characters" defaultValue={client?.taxId ?? ""} placeholder="ABC123456XYZ" className={inputClass} /></Field>
    </div></section>
    <section className="border-t border-zinc-100 pt-5"><h2 className="font-semibold text-zinc-900">Contacto principal <span className="font-normal text-zinc-400">(opcional)</span></h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field label="Nombre de contacto" error={state.fieldErrors?.contactName}><input name="contactName" defaultValue={client?.contactName ?? ""} className={inputClass} /></Field>
      <Field label="Teléfono" error={state.fieldErrors?.phone}><input name="phone" type="tel" defaultValue={client?.phone ?? ""} className={inputClass} /></Field>
      <Field label="Correo" error={state.fieldErrors?.email}><input name="email" type="email" defaultValue={client?.email ?? ""} className={inputClass} /></Field>
      <Field label="Notas" error={state.fieldErrors?.notes}><textarea name="notes" rows={3} defaultValue={client?.notes ?? ""} className={`${inputClass} h-auto py-3`} /></Field>
    </div></section>
    <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:justify-end"><Link href={client ? `/clients/${client.id}` : "/clients"} className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-semibold text-zinc-700">Cancelar</Link><button disabled={pending} className="h-11 rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : client ? "Guardar cambios" : "Crear cliente"}</button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
