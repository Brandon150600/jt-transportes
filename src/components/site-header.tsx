import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="JT Transportes - Inicio"
        >
          <Image
            src="/logo_ind.png"
            alt="JT Transportes"
            width={48}
            height={48}
            priority
            className="h-11 w-11 shrink-0 object-contain"
          />

          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-white sm:text-base">
              JT Transportes
            </div>

            <div className="hidden text-xs text-zinc-400 sm:block">
              Transporte y logística
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className="hidden text-sm text-zinc-300 transition hover:text-white sm:block"
          >
            Inicio
          </Link>

          <Link
            href="/services"
            className="hidden text-sm text-zinc-300 transition hover:text-white sm:block"
          >
            Servicios
          </Link>

          <Link
            href="/fleet"
            className="hidden text-sm text-zinc-300 transition hover:text-white sm:block"
          >
            Flota
          </Link>

          <Link
            href="/contact"
            className="hidden text-sm text-zinc-300 transition hover:text-white sm:block"
          >
            Contacto
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl border border-white/15 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            Iniciar sesión
          </Link>

          {/* CTA */}
          <Link
            href="/contact"
            className="group hidden items-center gap-2 rounded-xl bg-company px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-company/20 transition hover:bg-company-600 sm:inline-flex"
          >
            Cotizar

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}