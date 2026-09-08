import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    MapPin,
    ShieldCheck,
    Truck,
    Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
    title: "Nuestra flota | JT Transportes",
    description:
        "Conoce la flota de transporte de JT Transportes y nuestras capacidades para operaciones terrestres.",
};

const fleetFeatures = [
    {
        icon: ShieldCheck,
        title: "Seguridad",
        description:
            "Unidades preparadas para operar de manera segura durante cada recorrido.",
    },
    {
        icon: Wrench,
        title: "Mantenimiento",
        description:
            "Mantenimiento preventivo para mantener nuestras unidades en condiciones óptimas.",
    },
    {
        icon: MapPin,
        title: "Monitoreo",
        description:
            "Seguimiento de las unidades durante la operación para mantener visibilidad del traslado.",
    },
];

const fleetItems = [
    {
        name: "Kenworth T680",
        category: "Tractocamión",
        description:
            "Unidad orientada a operaciones de larga distancia y transporte de mercancías.",
        image: "/truck-hero.png",
        features: [
            "Operación de larga distancia",
            "Alta capacidad operativa",
            "Confort para el operador",
            "Enfoque en eficiencia",
        ],
        href: "/fleet/t680",
    },
];

export default function FleetPage() {
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
                            alt="Camión de JT Transportes"
                            fill
                            priority
                            className="object-cover opacity-35"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
                        <div className="max-w-3xl">

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur-sm">
                                <Truck className="size-3.5 text-red-300" />
                                Nuestra flota
                            </div>

                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                                Equipos preparados para
                                <span className="block text-company">
                                    cada recorrido.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                                Contamos con unidades orientadas a ofrecer confiabilidad,
                                seguridad y eficiencia para las operaciones de transporte
                                de nuestros clientes.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/contact"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-company px-6 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-company-600"
                                >
                                    Solicitar información
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/services"
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                                >
                                    Ver servicios
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

                {/* =====================================================
          INTRO
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                                Capacidad operativa
                            </p>

                            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                Más que camiones.
                                <span className="block text-company">
                                    Una operación.
                                </span>
                            </h2>

                            <p className="mt-5 text-base leading-7 text-zinc-500">
                                Nuestra flota forma parte de una operación diseñada para
                                mantener tus mercancías en movimiento. Cada traslado requiere
                                planeación, seguimiento y una unidad adecuada para el trabajo.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {fleetFeatures.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-company-50 text-company-600">
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
          FLEET LIST
      ====================================================== */}
                <section className="border-y border-zinc-100 bg-zinc-50">

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                                Unidades
                            </p>

                            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                Conoce nuestra flota
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-500">
                                Conoce algunos de los equipos que forman parte de la operación
                                de JT Transportes.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 lg:grid-cols-2">

                            {fleetItems.map((fleet) => (
                                <article
                                    key={fleet.name}
                                    className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60"
                                >

                                    {/* Image */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">

                                        <Image
                                            src={fleet.image}
                                            alt={fleet.name}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                        <div className="absolute bottom-5 left-5">
                                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-zinc-900 backdrop-blur-sm">
                                                {fleet.category}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Content */}
                                    <div className="p-6 sm:p-7">

                                        <div className="flex items-start justify-between gap-4">

                                            <div>
                                                <h3 className="text-2xl font-black tracking-tight text-zinc-950">
                                                    {fleet.name}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                                    {fleet.description}
                                                </p>
                                            </div>

                                            <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-company-50 text-company-600 sm:flex">
                                                <Truck className="size-5" />
                                            </div>

                                        </div>

                                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                            {fleet.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-center gap-2 text-sm text-zinc-700"
                                                >
                                                    <CheckCircle2 className="size-4 shrink-0 text-company-600" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-7 border-t border-zinc-100 pt-5">
                                            <Link
                                                href={fleet.href}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-company-600 transition hover:text-company-700"
                                            >
                                                Ver detalles de la unidad
                                                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                                            </Link>
                                        </div>

                                    </div>
                                </article>
                            ))}

                        </div>
                    </div>
                </section>

                {/* =====================================================
          OPERATION
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="overflow-hidden rounded-3xl bg-zinc-950">

                        <div className="grid lg:grid-cols-2">

                            <div className="p-8 sm:p-10 lg:p-14">

                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                                    Una flota que trabaja contigo
                                </p>

                                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    La unidad correcta para cada operación.
                                </h2>

                                <p className="mt-5 text-base leading-7 text-zinc-400">
                                    Cada traslado tiene diferentes necesidades. Por eso,
                                    analizamos las características de la operación antes de
                                    definir la solución adecuada.
                                </p>

                                <div className="mt-8 space-y-4">
                                    {[
                                        "Origen y destino",
                                        "Tipo y características de la carga",
                                        "Ruta y distancia",
                                        "Requerimientos de entrega",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 text-sm text-zinc-300"
                                        >
                                            <div className="flex size-7 items-center justify-center rounded-full bg-company/15">
                                                <CheckCircle2 className="size-4 text-company" />
                                            </div>

                                            {item}
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="relative min-h-[360px]">

                                <Image
                                    src="/truck-hero.jpg"
                                    alt="Flota JT Transportes"
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r" />

                                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-red-200">
                                        JT Transportes
                                    </p>

                                    <p className="mt-1 font-bold text-white">
                                        Transporte terrestre
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* =====================================================
          CTA
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">

                    <div className="relative overflow-hidden rounded-3xl bg-company px-6 py-12 text-white shadow-2xl shadow-red-200 sm:px-10 lg:px-14 lg:py-14">

                        <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-red-100">
                                    ¿Necesitas transportar mercancía?
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Hablemos de tu próxima operación.
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-red-100 sm:text-base">
                                    Cuéntanos qué necesitas transportar y nuestro equipo te
                                    ayudará a encontrar la solución adecuada.
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