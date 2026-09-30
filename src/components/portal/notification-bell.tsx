"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { markAllNotificationsAsRead, openNotification } from "@/app/actions/notifications";
import type { NotificationType } from "@/generated/prisma/client/enums";
import { notificationIcon } from "@/lib/notifications/presentation";

export type NotificationPreview = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  displayDate: string;
  isRead: boolean;
};

export function NotificationBell({ unreadCount, notifications }: {
  unreadCount: number;
  notifications: NotificationPreview[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={unreadCount ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          const opening = !open;
          setOpen(opening);
          if (opening) router.refresh();
        }}
        className="relative flex size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-company px-1 text-[10px] font-bold leading-none text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && <section role="dialog" aria-label="Notificaciones recientes" className="absolute right-0 z-50 mt-2 w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
          <div><h2 className="text-sm font-bold text-zinc-900">Notificaciones</h2><p className="mt-0.5 text-xs text-zinc-500">{unreadCount ? `${unreadCount} sin leer` : "Estás al día"}</p></div>
          {unreadCount > 0 && <form action={markAllNotificationsAsRead}><button className="inline-flex items-center gap-1.5 text-xs font-semibold text-company-700 hover:text-company-800"><CheckCheck className="size-3.5" /> Marcar todas</button></form>}
        </header>

        {notifications.length ? <ul className="max-h-[min(65vh,28rem)] divide-y divide-zinc-100 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notificationIcon(notification.type);
            return <li key={notification.id}>
              <form action={openNotification}>
                <input type="hidden" name="notificationId" value={notification.id} />
                <button onClick={() => setOpen(false)} className={`flex w-full gap-3 p-4 text-left transition hover:bg-zinc-50 ${notification.isRead ? "" : "bg-company-50/50"}`}>
                  <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${notification.isRead ? "bg-zinc-100 text-zinc-500" : "bg-company-50 text-company-700"}`}><Icon className="size-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2"><span className={`text-sm ${notification.isRead ? "font-medium text-zinc-700" : "font-bold text-zinc-900"}`}>{notification.title}</span>{!notification.isRead && <span aria-label="No leída" className="mt-1.5 size-2 shrink-0 rounded-full bg-company" />}</span>
                    <span className="mt-1 block text-xs leading-5 text-zinc-600">{notification.message}</span>
                    <span className="mt-1.5 block text-[11px] text-zinc-400">{notification.displayDate}</span>
                  </span>
                </button>
              </form>
            </li>;
          })}
        </ul> : <p className="px-4 py-8 text-center text-sm text-zinc-500">Todavía no hay notificaciones.</p>}

        <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-zinc-100 px-4 py-3 text-center text-sm font-bold text-company-700 transition hover:bg-zinc-50">Ver todas</Link>
      </section>}
    </div>
  );
}
