import {
    Bell,
    ChevronRight,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { getCurrentSessionId, requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";
import { ActiveSessions } from "./active-sessions";

export const metadata = {
    title: "Configuración | JT Transportes",
    description: "Configuración de tu cuenta en JT Transportes.",
};

export default async function SettingsPage({ searchParams }: {
    searchParams: Promise<{ passwordChanged?: string; profileUpdated?: string; sessionsUpdated?: string; sessionsError?: string }>;
}) {
    const user = await requireUser();
    const params = await searchParams;
    const [sessions, currentSessionId] = await Promise.all([
        prisma.session.findMany({
            where: { userId: user.id, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: "desc" },
            select: { id: true, createdAt: true, expiresAt: true },
        }),
        getCurrentSessionId(),
    ]);

    const roleLabel =
        user.role === "SUPER_ADMIN"
            ? "Super administrador"
            : user.role === "ADMIN"
                ? "Administrador"
                : "Usuario";

    return (
        <main className="bg-zinc-50">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span>Portal</span>
                        <ChevronRight className="size-4" />
                        <span className="font-medium text-zinc-900">
                            Configuración
                        </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                        Configuración
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Administra tu cuenta y las preferencias del portal.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    {params.passwordChanged === "1" && (
                        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                            Tu contraseña se actualizó correctamente.
                        </div>
                    )}
                    {params.profileUpdated === "1" && (
                        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                            Los datos de tu cuenta se actualizaron correctamente.
                        </div>
                    )}
                    {params.sessionsUpdated === "1" && (
                        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                            La lista de sesiones se actualizó correctamente.
                        </div>
                    )}
                    {params.sessionsError && (
                        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            No se puede cerrar la sesión actual desde esta lista. Cierra sesión desde el menú del portal.
                        </div>
                    )}

                    {/* Account */}
                    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                    <UserRound className="size-5" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-zinc-900">
                                        Mi cuenta
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        Información asociada a tu acceso al portal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-zinc-100">

                            <ProfileForm name={user.name ?? ""} email={user.email} />

                            {/* Role */}
                            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium text-zinc-400">
                                        Nivel de acceso
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-company-600" />

                                        <p className="text-sm font-semibold text-zinc-900">
                                            {roleLabel}
                                        </p>
                                    </div>
                                </div>

                                <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                                    Administrado por sistema
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                    <LockKeyhole className="size-5" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-zinc-900">
                                        Seguridad
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        Protege y administra el acceso a tu cuenta.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-zinc-100">

                            <details className="group">
                                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                                        <KeyRound className="size-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900">
                                            Cambiar contraseña
                                        </p>

                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            Actualiza la contraseña de acceso al portal.
                                        </p>
                                    </div>
                                </div>

                                    <ChevronRight className="size-4 shrink-0 text-zinc-400 transition group-open:rotate-90" />
                                </summary>
                                <ChangePasswordForm />
                            </details>

                            <details className="group">
                                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                                            <ShieldCheck className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">Sesiones activas</p>
                                            <p className="mt-0.5 text-xs text-zinc-500">Consulta y cierra sesiones que ya no reconozcas.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-4 shrink-0 text-zinc-400 transition group-open:rotate-90" />
                                </summary>
                                <ActiveSessions sessions={sessions} currentSessionId={currentSessionId} />
                            </details>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-company-50 text-company-600">
                                    <Bell className="size-5" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-zinc-900">
                                        Notificaciones
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        Define qué avisos deseas recibir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-zinc-100">

                            <div className="flex items-center justify-between gap-4 px-5 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">
                                        Alertas operativas
                                    </p>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        Recibe avisos relacionados con la operación.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Activar alertas operativas"
                                    className="relative h-6 w-11 rounded-full bg-company transition"
                                >
                                    <span className="absolute right-1 top-1 size-4 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-4 px-5 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">
                                        Alertas de documentación
                                    </p>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        Avisos sobre documentos próximos a vencer.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Activar alertas de documentación"
                                    className="relative h-6 w-11 rounded-full bg-company transition"
                                >
                                    <span className="absolute right-1 top-1 size-4 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Security notice */}
                    <section className="rounded-2xl border border-zinc-200 bg-zinc-900 p-5 text-white shadow-sm">
                        <div className="flex gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <ShieldCheck className="size-5" />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Portal privado
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-zinc-400">
                                    Este portal está destinado exclusivamente al personal
                                    autorizado de JT Transportes. Tu acceso y actividad pueden
                                    estar sujetos a controles de seguridad.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
