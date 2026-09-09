import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { VehicleForm } from "../../new/vehicle-form";

export const metadata = {
    title: "Editar unidad | JT Transportes",
};

export default async function EditVehiclePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const { id } = await params;


    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });

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

    if (!vehicle) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href={`/fleet-management/${vehicle.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-company-600 transition hover:text-company-700"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a la unidad
                    </Link>
                </div>

                <header className="mb-8">
                    <p className="text-sm font-semibold text-company-600">
                        Gestión de flota
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
                        Editar unidad
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Actualiza la información de {vehicle.economicNumber}.
                    </p>
                </header>

                <VehicleForm
                    vehicle={vehicle}
                    drivers={drivers}
                />
            </div>
        </main>
    );
}