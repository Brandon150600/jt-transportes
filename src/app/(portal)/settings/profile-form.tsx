"use client";

import { useActionState } from "react";
import { updateAccountProfile, type UpdateProfileState } from "@/app/actions/settings";

const initialState: UpdateProfileState = {};
const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-company focus:ring-4 focus:ring-company-100";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction, pending] = useActionState(updateAccountProfile, initialState);

  return (
    <form action={formAction} className="space-y-4 border-t border-zinc-100 bg-zinc-50 p-5">
      {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={state.fieldErrors?.name}>
          <input name="name" type="text" autoComplete="name" defaultValue={name} maxLength={120} required className={inputClass} />
        </Field>
        <div className="text-sm font-medium text-zinc-700">
          <span>Correo electrónico (usuario de acceso)</span>
          <p className={`${inputClass} flex items-center bg-zinc-100 text-zinc-500`}>{email}</p>
          <span className="mt-1 block text-xs font-normal text-zinc-500">El correo lo administra el administrador del portal.</span>
        </div>
      </div>
      <div className="flex justify-end">
        <button disabled={pending} className="h-10 rounded-xl bg-company px-4 text-sm font-bold text-white transition hover:bg-company-600 disabled:cursor-wait disabled:opacity-60">
          {pending ? "Guardando…" : "Guardar nombre"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
