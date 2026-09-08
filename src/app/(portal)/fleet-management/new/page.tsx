import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

import { VehicleForm } from "./vehicle-form";

export const metadata = {
    title: "Nueva unidad | JT Transportes",
    description: "Registrar una nueva unidad en la flota.",
};

export default async function NewFleetVehiclePage() {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const drivers = await prisma.driver.findMany({
        where: {
            status: "ACTIVE",
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            licenseNumber: true,
        },
    });

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Volver */}
                <div className="mb-6">
                    <Link
                        href="/fleet-management"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-company-600 transition hover:text-company-700"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a la flota
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-8">
                    <p className="text-sm font-semibold text-company-600">
                        Gestión de flota
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                        Nueva unidad
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                        Registra una nueva unidad para comenzar a llevar el control de su
                        operación, mantenimiento y documentación.
                    </p>
                </header>

                <VehicleForm drivers={drivers} />
            </div>
        </main>
    );
}