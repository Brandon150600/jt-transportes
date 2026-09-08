import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede al portal privado de JT Transportes.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden min-h-[620px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-company-900 via-company-700 to-company p-10 lg:flex">
          <Link href="/" className="inline-flex w-fit items-center gap-3">
            <Image
              src="/logo_ind.png"
              alt="JT Transportes"
              width={58}
              height={58}
              className="rounded-xl  object-contain p-1"
            />
            <span className="text-lg font-bold">JT Transportes</span>
          </Link>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-100">
              Portal empresarial
            </p>
            <h1 className="max-w-lg text-5xl font-black leading-[1.05]">
              Toda tu operación logística, en un solo lugar.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-red-100">
              Consulta tus envíos, administra tu flota y mantén el control de
              cada entrega con JT Transportes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-red-100">
            <div className="rounded-2xl bg-black/15 p-4">
              <strong className="block text-2xl text-white">24/7</strong>
              Soporte
            </div>
            <div className="rounded-2xl bg-black/15 p-4">
              <strong className="block text-2xl text-white">99%</strong>
              Entregas a tiempo
            </div>
            <div className="rounded-2xl bg-black/15 p-4">
              <strong className="block text-2xl text-white">GPS</strong>
              Rastreo activo
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
            <Image
              src="/logo_ind.png"
              alt="JT Transportes"
              width={44}
              height={44}
              className="rounded-lg bg-white object-contain p-1"
            />
            <span className="font-bold">JT Transportes</span>
          </Link>

          <div className="rounded-3xl bg-white p-6 text-zinc-900 shadow-2xl sm:p-8">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-company-600">
                Acceso seguro
              </p>
              <h2 className="text-3xl font-black tracking-tight">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Ingresa tus datos para acceder al portal de tu empresa.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-sm text-zinc-500">
              ¿Aún no tienes una cuenta?{" "}
              <Link
                href="/contact"
                className="font-semibold text-company-600 hover:text-company-700"
              >
                Solicita acceso
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            Al continuar aceptas los{" "}
            <Link href="/terms" className="underline hover:text-white">
              términos de servicio
            </Link>{" "}
            y la{" "}
            <Link href="/privacy" className="underline hover:text-white">
              política de privacidad
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
