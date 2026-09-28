"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSupplier, updateSupplier, type SupplierFormState } from "@/app/actions/suppliers";

type Supplier = { id: string; name: string; phone: string | null; email: string | null; address: string | null; taxId: string | null; notes: string | null };
const initialState: SupplierFormState = {};
const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-company focus:ring-4 focus:ring-company-100";

export function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const [state, action, pending] = useActionState(supplier ? updateSupplier : createSupplier, initialState);
  return <form action={action} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
    {supplier && <input type="hidden" name="id" value={supplier.id} />}
    {state.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" error={state.fieldErrors?.name}><input name="name" required defaultValue={supplier?.name ?? ""} className={inputClass} /></Field>
      <Field label="Teléfono" error={state.fieldErrors?.phone}><input name="phone" defaultValue={supplier?.phone ?? ""} className={inputClass} /></Field>
      <Field label="Correo" error={state.fieldErrors?.email}><input name="email" type="email" defaultValue={supplier?.email ?? ""} className={inputClass} /></Field>
      <Field label="RFC / identificación fiscal" error={state.fieldErrors?.taxId}><input name="taxId" defaultValue={supplier?.taxId ?? ""} className={inputClass} /></Field>
      <Field label="Dirección" error={state.fieldErrors?.address}><input name="address" defaultValue={supplier?.address ?? ""} className={inputClass} /></Field>
      <Field label="Notas" error={state.fieldErrors?.notes}><textarea name="notes" rows={3} defaultValue={supplier?.notes ?? ""} className={`${inputClass} h-auto py-3`} /></Field>
    </div>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href={supplier ? `/suppliers/${supplier.id}` : "/suppliers"} className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-semibold text-zinc-700">Cancelar</Link><button disabled={pending} className="h-11 rounded-xl bg-company px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Guardando…" : supplier ? "Guardar cambios" : "Crear proveedor"}</button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>; }
