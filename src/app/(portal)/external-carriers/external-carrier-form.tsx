"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createExternalCarrier, updateExternalCarrier, type ExternalCarrierFormState } from "@/app/actions/external-carriers";

type Carrier = { id: string; businessName: string; contactName: string | null; phone: string | null; email: string | null; taxId: string | null; notes: string | null };
const initial: ExternalCarrierFormState = {};
const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-company focus:ring-4 focus:ring-company-100";

export function ExternalCarrierForm({ carrier }: { carrier?: Carrier }) {
  const actionFn = carrier ? updateExternalCarrier : createExternalCarrier;
  const [state, action, pending] = useActionState(actionFn, initial);
  return <form action={action} className="space-y-5">
    {carrier && <input type="hidden" name="id" value={carrier.id} />}
    {state.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>}
    <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-2">
      <Field label="Razón social o nombre comercial" error={state.fieldErrors?.businessName}><input className={inputClass} name="businessName" required maxLength={160} defaultValue={carrier?.businessName} /></Field>
      <Field label="Contacto" error={state.fieldErrors?.contactName}><input className={inputClass} name="contactName" maxLength={120} defaultValue={carrier?.contactName ?? ""} /></Field>
      <Field label="Teléfono" error={state.fieldErrors?.phone}><input className={inputClass} name="phone" maxLength={40} defaultValue={carrier?.phone ?? ""} /></Field>
      <Field label="Correo" error={state.fieldErrors?.email}><input className={inputClass} type="email" name="email" maxLength={160} defaultValue={carrier?.email ?? ""} /></Field>
      <Field label="RFC" error={state.fieldErrors?.taxId}><input className={inputClass} name="taxId" maxLength={30} defaultValue={carrier?.taxId ?? ""} /></Field>
      <div className="sm:col-span-2"><Field label="Notas" error={state.fieldErrors?.notes}><textarea className={`${inputClass} h-auto py-3`} name="notes" rows={3} maxLength={2000} defaultValue={carrier?.notes ?? ""} /></Field></div>
    </section>
    <div className="flex justify-end gap-3"><Link href="/external-carriers" className="inline-flex h-11 items-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold">Cancelar</Link><button disabled={pending} className="h-11 rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : carrier ? "Guardar cambios" : "Crear transportista"}</button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
