import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAnyRole } from "@/lib/auth/session";

import { DriverForm } from "./driver-form";

export const metadata = {
    title: "Nuevo operador | JT Transportes",
    description: "Registrar un nuevo operador.",
};

export default async function NewDriverPage() {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Volver */}
                <div className="mb-6">
                    <Link
                        href="/users"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-company-600 transition hover:text-company-700"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a operadores
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-8">
                    <p className="text-sm font-semibold text-company-600">
                        Gestión de operadores
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                        Nuevo operador
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                        Registra los datos del operador para llevar el control de la
                        persona asignada a las unidades de JT Transportes.
                    </p>
                </header>

                <DriverForm />
            </div>
        </main>
    );
}