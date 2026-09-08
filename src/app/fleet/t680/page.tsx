import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Gauge,
    MapPin,
    ShieldCheck,
    Truck,
    Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
    title: "Kenworth T680 | JT Transportes",
    description:
        "Conoce el Kenworth T680 de JT Transportes y su capacidad para operaciones de transporte terrestre.",
};

const highlights = [
    {
        icon: Truck,
        title: "Operación pesada",
        description:
            "Equipo destinado a operaciones de transporte terrestre y recorridos de larga distancia.",
    },
    {
        icon: ShieldCheck,
        title: "Seguridad",
        description:
            "Unidad integrada a nuestros procesos de monitoreo y operación segura.",
    },
    {
        icon: Wrench,
        title: "Mantenimiento",
        description:
            "Seguimiento preventivo para mantener la unidad en condiciones óptimas de operación.",
    },
    {
        icon: MapPin,
        title: "Larga distancia",
        description:
            "Configurada para formar parte de operaciones de transporte entre diferentes destinos.",
    },
];

const capabilities = [
    "Transporte terrestre",
    "Operaciones de larga distancia",
    "Carga general",
    "Rutas nacionales",
];

export default function T680Page() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-white text-zinc-900">

                {/* =====================================================
          HERO
      ====================================================== */}
                <section className="relative overflow-hidden bg-zinc-950 text-white">

                    <div className="absolute inset-0">
                        <Image
                            src="/truck-hero.png"
                            alt="Kenworth T680 de JT Transportes"
                            fill
                            priority
                            className="object-cover opacity-45"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                        {/* Breadcrumb */}
                        <Link
                            href="/fleet"
                            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Volver a la flota
                        </Link>

                        <div className="grid min-h-[620px] items-end pb-14 pt-24 lg:grid-cols-[1fr_380px] lg:items-center lg:gap-16">

                            <div className="max-w-3xl">

                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur-sm">
                                    <Truck className="size-3.5 text-red-300" />
                                    Tractocamión
                                </div>

                                <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl lg:leading-[0.95]">
                                    Kenworth
                                    <span className="block text-company">
                                        T680
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                                    Una unidad diseñada para formar parte de operaciones de
                                    transporte exigentes, combinando capacidad, confiabilidad
                                    y eficiencia para mantener tu carga en movimiento.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                                    <Link
                                        href="/contact"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-company px-6 text-sm font-bold text-white shadow-lg transition hover:bg-company-600"
                                    >
                                        Solicitar información
                                        <ArrowRight className="size-4" />
                                    </Link>

                                    <Link
                                        href="/fleet"
                                        className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                                    >
                                        Ver toda la flota
                                    </Link>

                                </div>

                            </div>

                            {/* Hero info */}
                            <div className="mt-10 rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md lg:mt-0">

                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">
                                    JT Transportes
                                </p>

                                <p className="mt-3 text-2xl font-black">
                                    T680
                                </p>

                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                    Parte de nuestra flota destinada a operaciones de transporte
                                    terrestre.
                                </p>

                                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            Categoría
                                        </span>
                                        <span className="font-semibold text-white">
                                            Tractocamión
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            Operación
                                        </span>
                                        <span className="font-semibold text-white">
                                            Transporte terrestre
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            Cobertura
                                        </span>
                                        <span className="font-semibold text-white">
                                            Nacional
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* =====================================================
          INTRO
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                                Kenworth T680
                            </p>

                            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                Un equipo preparado para trabajar.
                            </h2>

                            <p className="mt-5 text-base leading-7 text-zinc-500">
                                En JT Transportes entendemos que una unidad no es solamente
                                un vehículo. Es una parte fundamental de la operación y de
                                la confianza que nuestros clientes depositan en nosotros.
                            </p>

                            <p className="mt-4 text-base leading-7 text-zinc-500">
                                Por eso buscamos mantener nuestros equipos listos para
                                enfrentar los recorridos y las exigencias de cada servicio.
                            </p>

                            <Link
                                href="/contact"
                                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-company-600 hover:text-company-700"
                            >
                                Solicitar información sobre esta unidad
                                <ArrowRight className="size-4" />
                            </Link>

                        </div>

                        {/* Capabilities */}
                        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">

                            <div className="flex items-center gap-3">

                                <div className="flex size-11 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                    <Gauge className="size-5" />
                                </div>

                                <div>
                                    <p className="font-bold text-zinc-950">
                                        Capacidades operativas
                                    </p>

                                    <p className="text-sm text-zinc-500">
                                        Aplicaciones principales de la unidad
                                    </p>
                                </div>

                            </div>

                            <div className="mt-7 grid gap-3 sm:grid-cols-2">

                                {capabilities.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
                                    >
                                        <CheckCircle2 className="size-4 shrink-0 text-company-600" />

                                        <span className="text-sm font-medium text-zinc-700">
                                            {item}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>
                </section>

                {/* =====================================================
          FEATURES
      ====================================================== */}
                <section className="border-y border-zinc-100 bg-zinc-50">

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                        <div className="max-w-2xl">

                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                                Operación JT
                            </p>

                            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                Una unidad respaldada por nuestra operación.
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-500">
                                El equipo es solamente una parte de la solución. Detrás de
                                cada recorrido existe un proceso de seguimiento y
                                mantenimiento.
                            </p>

                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {highlights.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                                    >

                                        <div className="flex size-12 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                            <Icon className="size-5" />
                                        </div>

                                        <h3 className="mt-5 font-bold text-zinc-950">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                                            {item.description}
                                        </p>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </section>

                {/* =====================================================
          IMAGE / VISUAL
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-zinc-950">

                        <Image
                            src="/truck-hero.png"
                            alt="Kenworth T680 JT Transportes"
                            fill
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">

                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200">
                                Flota JT Transportes
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                                Kenworth T680
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
                                Parte de nuestra infraestructura para ofrecer soluciones de
                                transporte terrestre confiables.
                            </p>

                        </div>

                    </div>
                </section>

                {/* =====================================================
          CTA
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">

                    <div className="relative overflow-hidden rounded-3xl bg-company px-6 py-12 text-white shadow-2xl shadow-red-200 sm:px-10 lg:px-14 lg:py-14">

                        <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                            <div className="max-w-2xl">

                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-100">
                                    ¿Tienes una operación?
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Hablemos de lo que necesitas transportar.
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-red-100 sm:text-base">
                                    Nuestro equipo puede ayudarte a definir la solución
                                    adecuada para tu operación.
                                </p>

                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
                            >
                                Solicitar cotización
                                <ArrowRight className="size-4" />
                            </Link>

                        </div>

                    </div>
                </section>

            </main>
            <SiteFooter />
        </>
    );
}