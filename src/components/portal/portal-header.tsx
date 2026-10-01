"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    BusFront,
    ChevronLeft,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Route,
    Settings,
    Truck,
    Users,
    Wallet,
    X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { NotificationBell, type NotificationPreview } from "@/components/portal/notification-bell";

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

const dashboard: NavItem = { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard };
const groups: { label: string; items: NavItem[] }[] = [
    {
        label: "Operación",
        items: [
            { label: "Viajes", href: "/trips", icon: Route },
            { label: "Flota", href: "/fleet-management", icon: Truck },
        ],
    },
    {
        label: "Administración",
        items: [
            { label: "Gastos", href: "/fleet-expenses", icon: Wallet, roles: ["ADMIN", "SUPER_ADMIN"] },
            { label: "Clientes", href: "/clients", icon: Building2, roles: ["ADMIN", "SUPER_ADMIN"] },
            { label: "Operadores", href: "/users", icon: Users, roles: ["ADMIN", "SUPER_ADMIN"] },
            { label: "Proveedores", href: "/suppliers", icon: Package, roles: ["ADMIN", "SUPER_ADMIN"] },
            { label: "Transportistas", href: "/external-carriers", icon: BusFront, roles: ["ADMIN", "SUPER_ADMIN"] },
        ],
    },
];

export function PortalHeader({ user, children, unreadCount, notifications }: {
    user: PortalUser;
    children: ReactNode;
    unreadCount: number;
    notifications: NotificationPreview[];
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [hoverExpanded, setHoverExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const visuallyCollapsed = collapsed && !hoverExpanded;
    const pageTitle = pathname.startsWith("/settings")
        ? "Configuración"
        : pathname.startsWith("/notifications")
            ? "Notificaciones"
            : [dashboard, ...groups.flatMap((group) => group.items)]
            .find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)))?.label ?? "Portal";
    const firstName = user.name?.split(" ")[0] ?? "Usuario";
    const roleLabel = user.role === "SUPER_ADMIN" ? "Super administrador" : user.role === "ADMIN" ? "Administrador" : "Empleado";

    return (
        <div className={`min-h-screen bg-zinc-50 text-zinc-900 transition-[padding] duration-200 ${visuallyCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
            <aside
                onMouseEnter={() => { if (collapsed) setHoverExpanded(true); }}
                onMouseLeave={() => setHoverExpanded(false)}
                className={`fixed inset-y-0 left-0 z-40 hidden border-r border-zinc-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col ${visuallyCollapsed ? "w-20" : "w-64"}`}
            >
                <SidebarContent
                    user={user}
                    pathname={pathname}
                    collapsed={visuallyCollapsed}
                    roleLabel={roleLabel}
                    onToggle={() => { setCollapsed((value) => !value); setHoverExpanded(false); }}
                />
            </aside>

            {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
                <button aria-label="Cerrar menú" className="absolute inset-0 bg-zinc-950/35" onClick={() => setMobileOpen(false)} />
                <aside className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-zinc-200 bg-white shadow-2xl">
                    <SidebarContent user={user} pathname={pathname} collapsed={false} roleLabel={roleLabel} onClose={() => setMobileOpen(false)} />
                </aside>
            </div>}

            <div className="min-h-screen">
                <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                        <button type="button" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 lg:hidden" aria-label="Abrir navegación">
                            <Menu className="size-5" />
                        </button>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-zinc-900">{pageTitle}</p>
                            <p className="hidden text-xs text-zinc-400 sm:block">JT Transportes · Portal interno</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <NotificationBell unreadCount={unreadCount} notifications={notifications} />
                            <span className="flex size-9 items-center justify-center rounded-lg bg-company text-sm font-bold text-white">{firstName.charAt(0).toUpperCase()}</span>
                            <div className="hidden sm:block"><p className="max-w-40 truncate text-sm font-semibold text-zinc-800">{firstName}</p><p className="text-[11px] text-zinc-500">{roleLabel}</p></div>
                        </div>
                    </div>
                </header>
                <div className="min-h-[calc(100vh-4rem)]">{children}</div>
            </div>
        </div>
    );
}

function SidebarContent({
    user,
    pathname,
    collapsed,
    roleLabel,
    onToggle,
    onClose,
}: {
    user: PortalUser;
    pathname: string;
    collapsed: boolean;
    roleLabel: string;
    onToggle?: () => void;
    onClose?: () => void;
}) {
    const visibleItems = (items: NavItem[]) => items.filter((item) => !item.roles || item.roles.includes(user.role));
    return <>
        <div className={`flex h-16 shrink-0 items-center border-b border-zinc-100 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
            <Link href="/dashboard" onClick={onClose} className="flex min-w-0 items-center gap-3">
                <Image src="/logo_ind.png" alt="JT Transportes" width={38} height={38} className="size-9 shrink-0 rounded-lg object-contain" />
                {!collapsed && <span className="min-w-0"><span className="block truncate text-sm font-black leading-tight text-zinc-950">JT Transportes</span><span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-400">Portal interno</span></span>}
            </Link>
            {onToggle && <button type="button" onClick={onToggle} title={collapsed ? "Expandir menú" : "Colapsar menú"} aria-label={collapsed ? "Expandir menú" : "Colapsar menú"} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>}
            {onClose && <button type="button" onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100" aria-label="Cerrar navegación"><X className="size-5" /></button>}
        </div>

        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5">
            <NavLink item={dashboard} pathname={pathname} collapsed={collapsed} onClose={onClose} />
            {groups.map((group) => {
                const items = visibleItems(group.items);
                if (!items.length) return null;
                const groupActive = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
                return <section key={group.label}>
                    {!collapsed && <h2 className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-widest ${groupActive ? "text-company-700" : "text-zinc-400"}`}>{group.label}</h2>}
                    {collapsed && <div className="mx-3 mb-2 border-t border-zinc-100" title={group.label} />}
                    <div className="space-y-1">{items.map((item) => <NavLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} onClose={onClose} />)}</div>
                </section>;
            })}
        </nav>

        <div className={`shrink-0 border-t border-zinc-100 p-3 ${collapsed ? "space-y-2" : ""}`}>
            {!collapsed && <div className="mb-3 px-2"><p className="truncate text-sm font-semibold text-zinc-800">{user.name ?? user.email}</p><p className="mt-0.5 truncate text-xs text-zinc-500">{roleLabel}</p></div>}
            {user.role !== "EMPLOYEE" && <Link href="/settings" onClick={onClose} title={collapsed ? "Configuración" : undefined} className={`mb-1 flex h-10 items-center gap-3 rounded-xl text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 ${collapsed ? "justify-center px-0" : "px-3"}`}><Settings className="size-4 shrink-0" />{!collapsed && "Configuración"}</Link>}
            <form action={logout}>
                <button type="submit" title={collapsed ? "Cerrar sesión" : undefined} className={`flex h-10 w-full items-center gap-3 rounded-xl text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-700 ${collapsed ? "justify-center px-0" : "px-3"}`}><LogOut className="size-4 shrink-0" />{!collapsed && "Cerrar sesión"}</button>
            </form>
        </div>
    </>;
}

function NavLink({ item, pathname, collapsed, onClose }: { item: NavItem; pathname: string; collapsed: boolean; onClose?: () => void }) {
    const Icon = item.icon;
    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
    return <Link href={item.href} onClick={onClose} title={collapsed ? item.label : undefined} aria-label={collapsed ? item.label : undefined} aria-current={active ? "page" : undefined} className={`flex h-11 items-center gap-3 rounded-xl text-sm font-semibold transition ${collapsed ? "justify-center px-0" : "px-3"} ${active ? "bg-company-50 text-company-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"}`}>
        <Icon className="size-[18px] shrink-0" />{!collapsed && <span className="truncate">{item.label}</span>}
        {active && !collapsed && <ChevronLeft className="ml-auto size-3 rotate-180" />}
    </Link>;
}
