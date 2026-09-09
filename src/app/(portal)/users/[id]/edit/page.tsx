import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { DriverForm } from "../../new/driver-form";

export default async function EditDriverPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const { id } = await params;

    const driver = await prisma.driver.findUnique({
        where: {
            id,
        },
    });

    if (!driver) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="mb-6">
                    <Link
                        href={`/users/${driver.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900"
                    >
                        <ArrowLeft className="size-4" />
                        Volver al operador
                    </Link>
                </div>

                <header className="mb-8">
                    <p className="text-sm font-semibold text-blue-600">
                        Operadores
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
                        Editar operador
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Actualiza la información de {driver.name}.
                    </p>
                </header>

                <DriverForm driver={driver} />
            </div>
        </main>
    );
}