"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useActionState, useState } from "react";

import { login, type LoginState } from "@/app/actions/auth";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Correo electrónico
        </label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            required
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition focus:border-company focus:ring-4 focus:ring-company-100"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Contraseña
          </label>

          <button
            type="button"
            className="text-xs font-semibold text-company-600 hover:text-company-700"
            onClick={() =>
              setSubmitMessage(
                "Solicita a un administrador el restablecimiento de tu contraseña.",
              )
            }
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-11 text-sm outline-none transition focus:border-company focus:ring-4 focus:ring-company-100"
          />

          <button
            type="button"
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input
          type="checkbox"
          name="remember"
          value="on"
          className="size-4 rounded border-zinc-300 text-company focus:ring-company"
        />

        Mantener mi sesión iniciada
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending && (
          <LoaderCircle className="size-4 animate-spin" />
        )}

        {isPending ? "Validando..." : "Ingresar al portal"}
      </button>

      {(state.error || submitMessage) && (
        <p
          role="status"
          className="rounded-xl bg-company-50 p-3 text-sm text-company-800"
        >
          {state.error ?? submitMessage}
        </p>
      )}
    </form>
  );
}