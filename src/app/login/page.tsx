import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
  description: "Acceso al sistema interno de JT Transportes.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 lg:bg-zinc-950 lg:px-4 lg:py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center lg:min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">

        {/* =====================================================
            PANEL DE MARCA - DESKTOP
        ====================================================== */}
        <section className="relative hidden min-h-[620px] overflow-hidden rounded-3xl bg-gradient-to-br from-company-900 via-company-700 to-company p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-black/10 blur-3xl" />

          {/* Logo */}
          <Link
            href="/"
            className="relative inline-flex w-fit items-center gap-3"
          >
            <Image
              src="/logo_ind.png"
              alt="JT Transportes"
              width={90}
              height={60}
              priority
              className="h-auto w-20 object-contain"
            />

            <span className="text-lg font-bold">
              JT Transportes
            </span>
          </Link>

          {/* Main message */}
          <div className="relative">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-100">
              Sistema interno
            </p>

            <h1 className="max-w-lg text-5xl font-black leading-[1.05] tracking-tight">
              La operación de JT Transportes, bajo control.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-red-100">
              Administra la operación, consulta información y mantén
              el control de las actividades de JT Transportes desde un
              solo lugar.
            </p>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-3 gap-3 text-sm text-red-100">
            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm">
              <strong className="block text-2xl text-white">
                24/7
              </strong>
              Operación
            </div>

            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm">
              <strong className="block text-2xl text-white">
                GPS
              </strong>
              Rastreo
            </div>

            <div className="rounded-2xl bg-black/15 p-4 backdrop-blur-sm">
              <strong className="block text-2xl text-white">
                JT
              </strong>
              Transportes
            </div>
          </div>
        </section>

        {/* =====================================================
            LOGIN
        ====================================================== */}
        <section className="flex w-full flex-col justify-center px-4 py-8 sm:px-6 lg:mx-auto lg:max-w-md lg:px-0">

          {/* Mobile brand */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link
              href="/"
              aria-label="JT Transportes - Inicio"
              className="inline-flex flex-col items-center"
            >
              <Image
                src="/logo_ind.png"
                alt="JT Transportes"
                width={180}
                height={80}
                priority
                className="h-auto max-h-20 w-auto object-contain"
              />

              <span className="mt-3 text-lg font-bold text-zinc-950">
                JT Transportes
              </span>
            </Link>

            <p className="mt-1 text-sm text-zinc-500">
              Sistema interno de operaciones
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 sm:p-8">

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-company-600">
                Acceso seguro
              </p>

              <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
                Bienvenido de nuevo
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Ingresa tus credenciales para acceder al sistema
                interno de JT Transportes.
              </p>
            </div>

            <LoginForm />

            <p className="mt-7 text-center text-xs leading-5 text-zinc-400">
              Este sistema es de uso exclusivo para personal
              autorizado de JT Transportes.
            </p>
          </div>

          {/* Legal */}
          <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
            Al continuar aceptas los{" "}
            <Link
              href="/terms"
              className="underline transition hover:text-zinc-700"
            >
              términos de servicio
            </Link>{" "}
            y la{" "}
            <Link
              href="/privacy"
              className="underline transition hover:text-zinc-700"
            >
              política de privacidad
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} JT Transportes
          </p>
        </section>
      </div>
    </main>
  );
}