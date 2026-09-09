"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    Truck,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/actions/auth";

type PortalUser = {
    name: string | null;
    email: string;
    role: "EMPLOYEE" | "ADMIN" | "SUPER_ADMIN";
};

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    roles?: PortalUser["role"][];
};

const navigation: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Operadores",
        href: "/users",
        icon: Users,
        roles: ["ADMIN", "SUPER_ADMIN"],
    },
    // {
    //     label: "Operación",
    //     href: "/operations",
    //     icon: Package,
    // },
    {
        label: "Flota",
        href: "/fleet-management",
        icon: Truck,
    },
    {
        label: "Clientes",
        href: "/clients",
        icon: Users,
        roles: ["ADMIN", "SUPER_ADMIN"],
    },

    {
        label: "Configuración",
        href: "/settings",
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
];

export function PortalHeader({ user }: { user: PortalUser }) {
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const visibleNavigation = navigation.filter(
        (item) => !item.roles || item.roles.includes(user.role),
    );

    const firstName = user.name?.split(" ")[0] ?? "Usuario";

    const roleLabel =
        user.role === "SUPER_ADMIN"
            ? "Super administrador"
            : user.role === "ADMIN"
                ? "Administrador"
                : "Empleado";

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 sm:px-6">

                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        className="mr-3 flex size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 lg:hidden"
                        aria-label="Abrir menú"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>

                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex shrink-0 items-center gap-3"
                        onClick={() => setMobileOpen(false)}
                    >
                        <Image
                            src="/logo_ind.png"
                            alt="JT Transportes"
                            width={38}
                            height={38}
                            className="size-9 rounded-lg object-contain"
                        />

                        <div className="hidden sm:block">
                            <p className="text-sm font-black leading-none text-zinc-950">
                                JT Transportes
                            </p>

                            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                                Portal interno
                            </p>
                        </div>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {visibleNavigation.map((item) => {
                            const Icon = item.icon;

                            const active =
                                pathname === item.href ||
                                (item.href !== "/dashboard" &&
                                    pathname.startsWith(`${item.href}/`));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${active
                                        ? "bg-company-50 text-company-700"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                                        }`}
                                >
                                    <Icon className="size-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-2">

                        {/* Notifications */}
                        <button
                            type="button"
                            className="relative flex size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100"
                            aria-label="Notificaciones"
                        >
                            <Bell className="size-5" />

                            <span className="absolute right-2 top-2 size-2 rounded-full bg-company" />
                        </button>

                        <div className="mx-1 hidden h-7 w-px bg-zinc-200 sm:block" />

                        {/* User menu */}
                        <div className="relative">

                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition hover:bg-zinc-100"
                                aria-expanded={userMenuOpen}
                            >
                                <div className="flex size-9 items-center justify-center rounded-lg bg-company text-sm font-bold text-white">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="max-w-32 truncate text-sm font-semibold text-zinc-900">
                                        {firstName}
                                    </p>

                                    <p className="text-[11px] text-zinc-500">
                                        {roleLabel}
                                    </p>
                                </div>

                                <ChevronDown
                                    className={`hidden size-4 text-zinc-400 transition md:block ${userMenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl">

                                    <div className="border-b border-zinc-100 px-3 py-3">
                                        <p className="truncate text-sm font-semibold text-zinc-900">
                                            {user.name ?? "Usuario"}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Link
                                        href="/settings"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
                                    >
                                        <Settings className="size-4" />
                                        Configuración
                                    </Link>

                                    <form action={logout} method="POST">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-red-50 hover:text-company-700"
                                        >
                                            <LogOut className="size-4" />
                                            Cerrar sesión
                                        </button>
                                    </form>

                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </header>

            {/* Mobile navigation */}
            {mobileOpen && (
                <div className="fixed inset-0 top-16 z-40 lg:hidden">

                    <button
                        type="button"
                        aria-label="Cerrar menú"
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />

                    <aside className="relative h-full w-[min(85vw,340px)] border-r border-zinc-200 bg-white p-4 shadow-2xl">

                        <div className="mb-4 px-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Navegación
                            </p>
                        </div>

                        <nav className="space-y-1">
                            {visibleNavigation.map((item) => {
                                const Icon = item.icon;

                                const active =
                                    pathname === item.href ||
                                    (item.href !== "/dashboard" &&
                                        pathname.startsWith(`${item.href}/`));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                                            ? "bg-company-50 text-company-700"
                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                                            }`}
                                    >
                                        <Icon className="size-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-zinc-50 p-4">
                            <p className="text-xs font-semibold text-zinc-400">
                                Sesión iniciada como
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-zinc-900">
                                {user.name ?? user.email}
                            </p>

                            <p className="mt-0.5 text-xs text-zinc-500">
                                {roleLabel}
                            </p>
                        </div>

                    </aside>
                </div>
            )}
        </>
    );
}