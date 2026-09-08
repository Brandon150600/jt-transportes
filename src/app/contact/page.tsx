import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
    Phone,
    Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-white text-zinc-950">
            <SiteHeader />

            {/* Hero */}
            <section className="relative overflow-hidden bg-zinc-950">
                <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-company/20 blur-[120px]" />
                <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-company/10 blur-[100px]" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-company-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-company" />
                            Estamos para ayudarte
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Hablemos de tu
                            <span className="text-company"> próximo envío.</span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                            Cuéntanos qué necesitas transportar y nuestro equipo preparará
                            una solución a la medida para tu operación.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact section */}
            <section className="bg-zinc-50">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-16">

                    {/* Form */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-8">
                            <p className="text-sm font-bold text-company-600">
                                Solicita una cotización
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
                                Cuéntanos sobre tu operación
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Entre más información nos proporciones, mejor podremos
                                preparar tu propuesta.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Nombre
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Tu nombre"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="company"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Empresa
                                    </label>

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        placeholder="Nombre de tu empresa"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Correo electrónico
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="nombre@empresa.com"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Teléfono
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+52 81 0000 0000"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="service"
                                    className="mb-2 block text-sm font-semibold text-zinc-800"
                                >
                                    ¿Qué servicio necesitas?
                                </label>

                                <select
                                    id="service"
                                    name="service"
                                    className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Selecciona un servicio
                                    </option>
                                    <option>Transporte terrestre</option>
                                    <option>Carga pesada</option>
                                    <option>Logística integral</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="origin"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Origen
                                    </label>

                                    <input
                                        id="origin"
                                        name="origin"
                                        type="text"
                                        placeholder="Ciudad / Estado"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="destination"
                                        className="mb-2 block text-sm font-semibold text-zinc-800"
                                    >
                                        Destino
                                    </label>

                                    <input
                                        id="destination"
                                        name="destination"
                                        type="text"
                                        placeholder="Ciudad / Estado"
                                        className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-semibold text-zinc-800"
                                >
                                    Detalles de tu solicitud
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Cuéntanos qué necesitas transportar, cantidad, fechas, tipo de carga, etc."
                                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-company focus:bg-white focus:ring-4 focus:ring-company-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-company px-5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-company-600"
                            >
                                Solicitar cotización
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </form>
                    </div>

                    {/* Information */}
                    <aside className="space-y-5">
                        <div className="rounded-3xl bg-zinc-950 p-6 text-white shadow-sm">
                            <p className="text-sm font-semibold text-company-400">
                                JT Transportes
                            </p>

                            <h2 className="mt-2 text-xl font-bold">
                                Una solución para cada ruta.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                                Nuestro equipo está listo para ayudarte a planear y coordinar
                                tu próximo movimiento.
                            </p>

                            <div className="mt-6 space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                        <Clock3 className="size-4 text-company-400" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">Atención personalizada</p>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            Seguimiento durante tu operación
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                        <Truck className="size-4 text-company-400" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">Flota especializada</p>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            Unidades preparadas para diferentes necesidades
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                        <MapPin className="size-4 text-company-400" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">Cobertura amplia</p>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            Operaciones nacionales
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                            <h3 className="font-bold text-zinc-950">
                                También puedes contactarnos
                            </h3>

                            <div className="mt-5 space-y-4">
                                <a
                                    href="tel:+528100000000"
                                    className="flex items-center gap-3 text-sm text-zinc-600 transition hover:text-company"
                                >
                                    <Phone className="size-4 text-company-600" />
                                    +52 81 0000 0000
                                </a>

                                <a
                                    href="mailto:contacto@jttransportes.com"
                                    className="flex items-center gap-3 text-sm text-zinc-600 transition hover:text-company"
                                >
                                    <Mail className="size-4 text-company-600" />
                                    contacto@jttransportes.com
                                </a>

                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <MapPin className="size-4 text-company-600" />
                                    Santiago, Nuevo León
                                </div>
                            </div>
                        </div>

                        {/* <div className="rounded-3xl border border-company-100 bg-company-50 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-company-600" />

                <div>
                  <p className="text-sm font-bold text-company-900">
                    ¿Ya eres cliente?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-company-800">
                    Accede al portal para consultar la información de tus
                    operaciones.
                  </p>

                  <Link
                    href="/login"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-company-700 hover:text-company-900"
                  >
                    Acceder al portal
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div> */}
                    </aside>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}