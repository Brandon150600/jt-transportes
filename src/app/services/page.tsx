import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileText,
    Gauge,
    MapPin,
    PackageCheck,
    Route,
    ShieldCheck,
    Truck,
    Warehouse,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
    title: "Servicios | JT Transportes",
    description:
        "Servicios de transporte terrestre, carga pesada y soluciones logísticas de JT Transportes.",
};

const services = [
    {
        icon: Truck,
        title: "Transporte terrestre",
        description:
            "Movilizamos mercancías de forma segura y eficiente, con una operación enfocada en cumplir tiempos de entrega.",
        features: [
            "Traslados nacionales",
            "Rutas programadas",
            "Seguimiento de unidades",
            "Coordinación de entregas",
        ],
    },
    {
        icon: PackageCheck,
        title: "Carga pesada",
        description:
            "Soluciones para mercancías de gran peso, volumen o características especiales que requieren una operación cuidadosamente planeada.",
        features: [
            "Carga pesada",
            "Maquinaria y equipo",
            "Planeación de rutas",
            "Operación especializada",
        ],
    },
    {
        icon: Warehouse,
        title: "Logística integral",
        description:
            "Coordinamos diferentes etapas de la operación logística para que tu mercancía llegue al destino correcto.",
        features: [
            "Planeación logística",
            "Almacenamiento",
            "Distribución",
            "Coordinación de última milla",
        ],
    },
];

const advantages = [
    {
        icon: ShieldCheck,
        title: "Seguridad",
        description:
            "Priorizamos la seguridad de la mercancía y de cada operación.",
    },
    {
        icon: Clock3,
        title: "Puntualidad",
        description:
            "Planeamos cada traslado para cumplir con los tiempos establecidos.",
    },
    {
        icon: MapPin,
        title: "Seguimiento",
        description:
            "Mantén visibilidad sobre el avance de tus operaciones.",
    },
    {
        icon: Gauge,
        title: "Eficiencia",
        description:
            "Optimizamos rutas y recursos para hacer cada traslado más eficiente.",
    },
];

const process = [
    {
        number: "01",
        icon: FileText,
        title: "Solicita tu cotización",
        description:
            "Compártenos el origen, destino, tipo de carga y requerimientos de tu operación.",
    },
    {
        number: "02",
        icon: Route,
        title: "Planeamos la operación",
        description:
            "Analizamos la ruta y definimos la mejor alternativa para realizar el traslado.",
    },
    {
        number: "03",
        icon: Truck,
        title: "Realizamos el traslado",
        description:
            "Nuestra unidad inicia el recorrido de acuerdo con la programación establecida.",
    },
    {
        number: "04",
        icon: CheckCircle2,
        title: "Entregamos",
        description:
            "Coordinamos la entrega y damos seguimiento hasta completar la operación.",
    },
];

export default function ServicesPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-white text-zinc-900">

                {/* =====================================================
          HERO
      ====================================================== */}
                <section className="relative overflow-hidden border-b border-zinc-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-company-50 via-white to-white" />

                    <div className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-company-100/60 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                        <div className="max-w-3xl">

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-company-200 bg-white px-3 py-1.5 text-xs font-semibold text-company-700 shadow-sm">
                                <span className="size-1.5 rounded-full bg-company" />
                                Servicios de transporte y logística
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                                Movemos tu carga.
                                <span className="block text-company">
                                    Tú enfócate en tu negocio.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                                En JT Transportes ofrecemos soluciones de transporte terrestre
                                y logística diseñadas para que tus mercancías lleguen de forma
                                segura, puntual y eficiente.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/contact"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-company px-6 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600"
                                >
                                    Solicitar cotización
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/"
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                                >
                                    Conocer JT Transportes
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
          SERVICIOS
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                            Lo que hacemos
                        </p>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                            Soluciones para cada etapa de tu operación
                        </h2>

                        <p className="mt-4 text-base leading-7 text-zinc-500">
                            Desde un traslado puntual hasta una operación logística
                            completa, adaptamos nuestro servicio a las necesidades de cada
                            cliente.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 lg:grid-cols-3">
                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <article
                                    key={service.title}
                                    className="group rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-company-200 hover:shadow-xl hover:shadow-zinc-200/50"
                                >
                                    <div className="flex size-13 items-center justify-center rounded-2xl bg-company-50 text-company-600 transition group-hover:bg-company group-hover:text-white">
                                        <Icon className="size-6" />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-zinc-950">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                                        {service.description}
                                    </p>

                                    <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6">
                                        {service.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center gap-2 text-sm text-zinc-700"
                                            >
                                                <CheckCircle2 className="size-4 shrink-0 text-company-600" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* =====================================================
          DIFERENCIADORES
      ====================================================== */}
                <section className="border-y border-zinc-100 bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                                    Nuestra forma de trabajar
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                                    Una operación pensada para darte tranquilidad.
                                </h2>

                                <p className="mt-5 text-base leading-7 text-zinc-500">
                                    Transportar mercancía no solamente significa moverla de un
                                    punto a otro. Se trata de cuidar tiempos, recursos y
                                    responsabilidades durante todo el recorrido.
                                </p>

                                <Link
                                    href="/contact"
                                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-company-600 transition hover:text-company-700"
                                >
                                    Habla con nosotros
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {advantages.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
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
                    </div>
                </section>

                {/* =====================================================
          PROCESO
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-company-600">
                            Nuestro proceso
                        </p>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                            Simple de principio a fin
                        </h2>

                        <p className="mt-4 text-base leading-7 text-zinc-500">
                            Nos encargamos de coordinar la operación para que tú tengas
                            claridad sobre cada etapa.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {process.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div key={step.number} className="relative">

                                    {index < process.length - 1 && (
                                        <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-zinc-200 lg:block" />
                                    )}

                                    <div className="relative">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-2xl bg-company text-white shadow-lg shadow-red-200">
                                                <Icon className="size-5" />
                                            </div>

                                            <span className="text-xs font-bold tracking-widest text-zinc-400">
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 font-bold text-zinc-950">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* =====================================================
          FLOTA
      ====================================================== */}
                <section className="overflow-hidden bg-zinc-950 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                                    Nuestra flota
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Equipos preparados para el camino.
                                </h2>

                                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
                                    Contamos con una flota enfocada en ofrecer confiabilidad,
                                    capacidad y eficiencia para operaciones de transporte
                                    terrestre.
                                </p>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    {[
                                        "Unidades Kenworth",
                                        "Mantenimiento programado",
                                        "Monitoreo de operación",
                                        "Operación de larga distancia",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2 text-sm text-zinc-300"
                                        >
                                            <CheckCircle2 className="size-4 text-company" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/contact"
                                    className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
                                >
                                    Solicitar información
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>

                            <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-company-900 via-company-700 to-zinc-950">

                                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-company/30 blur-3xl" />

                                <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center">
                                    <Truck className="size-20 text-white/90" />

                                    <p className="mt-6 text-2xl font-black">
                                        Kenworth
                                    </p>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-red-100/70">
                                        Potencia, capacidad y confiabilidad para las rutas que
                                        necesita tu operación.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* =====================================================
          CTA
      ====================================================== */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="relative overflow-hidden rounded-3xl bg-company px-6 py-12 text-white shadow-2xl shadow-red-200 sm:px-10 lg:px-14 lg:py-14">

                        <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-red-100">
                                    ¿Tienes una operación por realizar?
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Cuéntanos qué necesitas transportar.
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-red-100 sm:text-base">
                                    Nuestro equipo puede ayudarte a encontrar la solución
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