import Link from "next/link";
import { Check, ExternalLink, EyeOff } from "lucide-react";

import { markNotificationAsRead, markNotificationAsUnread, openNotification } from "@/app/actions/notifications";
import type { NotificationType } from "@/generated/prisma/client/enums";
import { notificationIcon } from "@/lib/notifications/presentation";

export type NotificationListItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  displayDate: string;
  isRead: boolean;
  canMarkUnread: boolean;
  hasEntity: boolean;
};

export function NotificationList({ notifications, nextCursor }: {
  notifications: NotificationListItem[];
  nextCursor: string | null;
}) {
  if (!notifications.length) {
    return <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
      <p className="font-semibold text-zinc-800">No hay notificaciones todavía</p>
      <p className="mt-1 text-sm text-zinc-500">Los eventos del portal aparecerán aquí.</p>
    </div>;
  }

  return <>
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {notifications.map((notification) => {
        const Icon = notificationIcon(notification.type);
        return <li key={notification.id} className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 ${notification.isRead ? "" : "bg-company-50/40"}`}>
          <div className="flex min-w-0 items-start gap-3">
            <span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${notification.isRead ? "bg-zinc-100 text-zinc-500" : "bg-company-50 text-company-700"}`}><Icon className="size-5" /></span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-sm ${notification.isRead ? "font-semibold text-zinc-700" : "font-bold text-zinc-900"}`}>{notification.title}</p>
                {notification.isRead ? <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Leída</span> : <span className="rounded-full bg-company-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-company-700">Nueva</span>}
              </div>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{notification.message}</p>
              <p className="mt-2 text-xs text-zinc-400">{notification.displayDate}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 pl-13 sm:pl-0">
            {notification.hasEntity && <form action={openNotification}>
              <input type="hidden" name="notificationId" value={notification.id} />
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-company px-3 text-xs font-bold text-white transition hover:bg-company-600"><ExternalLink className="size-3.5" /> Abrir</button>
            </form>}
            {!notification.isRead && <form action={markNotificationAsRead}>
              <input type="hidden" name="notificationId" value={notification.id} />
              <button aria-label="Marcar como leída" title="Marcar como leída" className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"><Check className="size-4" /></button>
            </form>}
            {notification.isRead && notification.canMarkUnread && <form action={markNotificationAsUnread}>
              <input type="hidden" name="notificationId" value={notification.id} />
              <button aria-label="Marcar como no leída" title="Marcar como no leída" className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100"><EyeOff className="size-4" /></button>
            </form>}
          </div>
        </li>;
      })}
    </ul>
    {nextCursor && <div className="mt-5 flex justify-center"><Link href={`/notifications?cursor=${encodeURIComponent(nextCursor)}`} className="inline-flex h-10 items-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50">Cargar notificaciones anteriores</Link></div>}
  </>;
}
