import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Truck,
  Warehouse,
  Route,
  Phone,
} from "lucide-react";

const stats = [
  { value: "24/7", label: "Monitoreo de unidades" },
  { value: "32", label: "Estados de cobertura" },
  { value: "100%", label: "Compromiso operativo" },
  { value: "T680", label: "Flota Kenworth" },
];

const services = [
  {
    icon: Truck,
    number: "01",
    title: "Transporte terrestre",
    description:
      "Movemos mercancía por carretera con una operación enfocada en seguridad, puntualidad y seguimiento.",
  },
  {
    icon: Route,
    number: "02",
    title: "Carga pesada",
    description:
      "Soluciones para maquinaria, materiales y mercancía de gran volumen que requieren una operación especializada.",
  },
  {
    icon: Warehouse,
    number: "03",
    title: "Logística integral",
    description:
      "Coordinamos transporte, almacenamiento y distribución para simplificar toda tu operación logística.",
  },
];

const advantages = [
  "Monitoreo y seguimiento de unidades",
  "Operación enfocada en seguridad",
  "Flota Kenworth",
  "Atención personalizada",
  "Planeación de rutas",
  "Comunicación durante todo el traslado",
];

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between rounded-2xl border border-white/10 bg-black/80 px-4 shadow-2xl backdrop-blur-xl sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_ind.png"
                alt="JT Transportes"
                width={180}
                height={60}
                priority
                className="h-12 w-auto object-contain"
              />

              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-tight text-white">
                  JT TRANSPORTES
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400">
                  Logística & Transporte
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Inicio
              </Link>

              <Link
                href="/services"
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Servicios
              </Link>

              <Link
                href="/fleet/t680"
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Nuestra flota
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white sm:block"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-company px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-company/20 transition hover:bg-company-600"
              >
                Cotizar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[760px] overflow-hidden bg-black pt-24">
        <Image
          src="/truck-hero.png"
          alt="Camión Kenworth JT Transportes"
          fill
          priority
          className="object-cover object-center opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-company/20 blur-[120px]" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-company shadow-[0_0_12px_#E10600]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-200">
                Transporte & Logística
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
              MOVEMOS TU
              <span className="block text-company">OPERACIÓN.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Soluciones de transporte terrestre diseñadas para mover tu
              mercancía con seguridad, puntualidad y la confianza que tu
              operación necesita.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-company px-6 py-4 text-sm font-black text-white shadow-2xl shadow-company/20 transition hover:bg-company-600"
              >
                Solicitar cotización
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                Conocer servicios
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-white/20 pl-4"
                >
                  <div className="text-2xl font-black text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-company">
              JT Transportes
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Una operación logística que responde.
            </h2>
          </div>

          <div className="lg:pt-2">
            <p className="text-lg leading-8 text-zinc-600">
              Sabemos que detrás de cada carga existe una operación que no
              puede detenerse. Por eso combinamos experiencia, tecnología y
              una flota preparada para ofrecer un servicio confiable de
              principio a fin.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 text-sm font-black text-zinc-950 transition hover:text-company"
            >
              Conoce nuestra operación
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="bg-zinc-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-company">
                Lo que hacemos
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Servicios pensados
                <span className="block text-zinc-400">para tu operación.</span>
              </h2>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-company"
            >
              Ver todos los servicios
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-company/30 hover:shadow-2xl hover:shadow-zinc-200/70"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-company-50 text-company">
                      <Icon className="h-7 w-7" />
                    </div>

                    <span className="text-sm font-black text-zinc-300">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-black">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-500">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-black text-zinc-950 transition group-hover:text-company"
                  >
                    Más información
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-company/5 transition group-hover:bg-company/10" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FLEET
      ========================================================= */}
      <section className="overflow-hidden bg-black py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-company">
                Nuestra flota
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Potencia para
                <span className="block text-zinc-500">rutas exigentes.</span>
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-zinc-400">
                Nuestra operación cuenta con unidades Kenworth preparadas
                para ofrecer rendimiento, confiabilidad y eficiencia en
                recorridos de larga distancia.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Kenworth T680",
                  "Operación para larga distancia",
                  "Monitoreo de unidades",
                  "Mantenimiento preventivo",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-zinc-300"
                  >
                    <CheckCircle2 className="h-5 w-5 text-company" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/fleet/t680"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-black transition hover:bg-company hover:text-white"
              >
                Conocer Kenworth T680
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/truck-hero.png"
                alt="Kenworth T680 JT Transportes"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-company px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                  Flota destacada
                </div>

                <h3 className="mt-3 text-3xl font-black text-white">
                  Kenworth T680
                </h3>

                <p className="mt-1 text-sm text-zinc-300">
                  Rendimiento y eficiencia para rutas largas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY JT
      ========================================================= */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-company">
                ¿Por qué JT?
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                La diferencia está
                <span className="block text-zinc-400">en cómo operamos.</span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-zinc-600">
                Cada traslado requiere coordinación, comunicación y
                responsabilidad. Nuestro objetivo es que tú puedas concentrarte
                en tu negocio mientras nosotros nos encargamos del camino.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {advantages.map((advantage) => (
                <div
                  key={advantage}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-company-50">
                    <CheckCircle2 className="h-5 w-5 text-company" />
                  </div>

                  <span className="text-sm font-bold text-zinc-800">
                    {advantage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}
      <section className="border-y border-zinc-100 bg-zinc-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-company">
              Así trabajamos
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Del origen al destino.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Cuéntanos qué necesitas",
                text: "Analizamos tu carga, ruta, tiempos y requerimientos.",
              },
              {
                number: "02",
                title: "Planeamos la operación",
                text: "Definimos la unidad y la estrategia de traslado más adecuada.",
              },
              {
                number: "03",
                title: "Movemos tu carga",
                text: "Damos seguimiento a la operación hasta completar la entrega.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-zinc-200 bg-white p-7"
              >
                <div className="text-5xl font-black text-company/20">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-black">{step.title}</h3>

                <p className="mt-2 leading-7 text-zinc-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-company py-20 sm:py-24">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                Hablemos de tu operación
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                ¿Tienes una carga que mover?
              </h2>

              <p className="mt-4 text-base leading-7 text-white/80">
                Cuéntanos qué necesitas y nuestro equipo te ayudará a encontrar
                la solución adecuada.
              </p>
            </div>

            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-black text-company shadow-2xl transition hover:bg-zinc-950 hover:text-white"
            >
              Solicitar cotización
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo_ind.png"
                  alt="JT Transportes"
                  width={80}
                  height={80}
                // className="object-cover"

                />


                <div>
                  <div className="font-black">JT TRANSPORTES</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Logística & Transporte
                  </div>
                </div>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-6 text-zinc-500">
                Soluciones de transporte terrestre para empresas que necesitan
                mover su operación con seguridad, puntualidad y confianza.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Navegación
              </h3>

              <div className="mt-4 space-y-3">
                <Link
                  href="/services"
                  className="block text-sm text-zinc-500 hover:text-white"
                >
                  Servicios
                </Link>

                <Link
                  href="/fleet/t680"
                  className="block text-sm text-zinc-500 hover:text-white"
                >
                  Nuestra flota
                </Link>

                <Link
                  href="/contact"
                  className="block text-sm text-zinc-500 hover:text-white"
                >
                  Contacto
                </Link>

                <Link
                  href="/login"
                  className="block text-sm text-zinc-500 hover:text-white"
                >
                  Área de clientes
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Contacto
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <Phone className="h-4 w-4 text-company" />
                  Atención personalizada
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <Clock3 className="h-4 w-4 text-company" />
                  Atención operativa
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <MapPin className="h-4 w-4 text-company" />
                  Cobertura nacional
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row">
            <div>
              © {new Date().getFullYear()} JT Transportes. Todos los derechos
              reservados.
            </div>

            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-zinc-300">
                Política de privacidad
              </Link>

              <Link href="/terms" className="hover:text-zinc-300">
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
