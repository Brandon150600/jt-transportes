"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "@/app/actions/settings";

const initialState: ChangePasswordState = {};
const inputClass = "mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-company focus:ring-4 focus:ring-company-100";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return <form action={formAction} className="space-y-4 border-t border-zinc-100 bg-zinc-50 p-5">
    {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
    <Field label="Contraseña actual" error={state.fieldErrors?.currentPassword}>
      <input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} />
    </Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nueva contraseña" error={state.fieldErrors?.newPassword}>
        <input name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className={inputClass} />
      </Field>
      <Field label="Confirmar nueva contraseña" error={state.fieldErrors?.confirmPassword}>
        <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className={inputClass} />
      </Field>
    </div>
    <p className="text-xs text-zinc-500">Usa al menos 8 caracteres. Tu contraseña actual se necesita para confirmar el cambio.</p>
    <div className="flex justify-end"><button disabled={pending} className="h-10 rounded-xl bg-company px-4 text-sm font-bold text-white transition hover:bg-company-600 disabled:cursor-wait disabled:opacity-60">{pending ? "Actualizando…" : "Actualizar contraseña"}</button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700">{label}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
