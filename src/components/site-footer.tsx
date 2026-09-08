import Link from "next/link";
import Image from "next/image";
import { Phone, Clock3, MapPin } from "lucide-react";
export function SiteFooter() {
    return (
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
                                Portal de empleados
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
    );
}