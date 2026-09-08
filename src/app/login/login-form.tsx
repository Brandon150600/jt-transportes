"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login, type LoginState } from "@/app/actions/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un correo electrónico válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  remember: z.boolean().default(false),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  function onSubmit(values: LoginInput) {
    setSubmitMessage(null);
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    if (values.remember) formData.set("remember", "on");
    formAction(formData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            {...register("email")}
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition focus:border-company focus:ring-4 focus:ring-company-100"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-company-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
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
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-11 text-sm outline-none transition focus:border-company focus:ring-4 focus:ring-company-100"
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-company-600">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input
          type="checkbox"
          {...register("remember")}
          className="size-4 rounded border-zinc-300 text-company focus:ring-company"
        />
        Mantener mi sesión iniciada
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-company px-4 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending && <LoaderCircle className="size-4 animate-spin" />}
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
