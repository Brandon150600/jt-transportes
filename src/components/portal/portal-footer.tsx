"use client";

import {
    ArrowUpRight
} from "lucide-react";

type PortalUser = {
    name: string | null;
    email: string;
    role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
};

export function PortalFooter() {
    return (
        <>
            <section className="mt-6 overflow-hidden rounded-2xl border border-company-100 bg-company-50 mr-16 ml-16 mb-10">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <p className="text-sm font-bold text-company-800">
                            ¿Necesitas ayuda con una operación?
                        </p>

                        <p className="mt-1 text-sm text-company-700/70">
                            Nuestro equipo está disponible para apoyarte.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-company px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-company-600"
                    >
                        Contactar soporte
                        <ArrowUpRight className="size-4" />
                    </button>
                </div>
            </section>
        </>
    );
}