import type { Metadata } from "next";
import { CheckCheck, Inbox } from "lucide-react";
import { z } from "zod";

import { markAllNotificationsAsRead } from "@/app/actions/notifications";
import { requireUser } from "@/lib/auth/session";
import { formatNotificationDate } from "@/lib/notifications/format-date";
import { prisma } from "@/lib/prisma";
import { NotificationList } from "./notification-list";

export const metadata: Metadata = {
  title: "Notificaciones | JT Transportes",
  description: "Historial de notificaciones del portal JT Transportes.",
};

const PAGE_SIZE = 20;

export default async function NotificationsPage({ searchParams }: {
  searchParams: Promise<{ cursor?: string | string[] }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const cursorValue = Array.isArray(params.cursor) ? params.cursor[0] : params.cursor;
  const parsedCursor = z.string().cuid().safeParse(cursorValue);
  const cursor = parsedCursor.success
    ? await prisma.notification.findUnique({ where: { id: parsedCursor.data }, select: { id: true } })
    : null;

  const [unreadCount, rows] = await Promise.all([
    prisma.notification.count({
      where: {
        createdAt: { gte: user.createdAt },
        reads: { none: { userId: user.id } },
      },
    }),
    prisma.notification.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: PAGE_SIZE + 1,
      ...(cursor ? { cursor: { id: cursor.id }, skip: 1 } : {}),
      include: { reads: { where: { userId: user.id }, select: { readAt: true } } },
    }),
  ]);

  const hasMore = rows.length > PAGE_SIZE;
  const pageRows = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
  const now = new Date();
  const notifications = pageRows.map((notification) => {
    const beforeAccount = notification.createdAt < user.createdAt;
    const isRead = beforeAccount || notification.reads.length > 0;
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      displayDate: formatNotificationDate(notification.createdAt, now),
      isRead,
      canMarkUnread: !beforeAccount && isRead,
      hasEntity: Boolean(notification.entityType && notification.entityId),
    };
  });
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.id ?? null : null;

  return <main className="min-h-screen bg-zinc-50">
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-company-600">Portal</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">Notificaciones</h1>
          <p className="mt-2 text-sm text-zinc-500">Eventos recientes de la operación y la flota.</p>
        </div>
        {unreadCount > 0 && <form action={markAllNotificationsAsRead}>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"><CheckCheck className="size-4" /> Marcar todas como leídas</button>
        </form>}
      </header>

      <div className="mb-4 mt-5 flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Inbox className="size-4" /> {unreadCount === 1 ? "1 notificación sin leer" : `${unreadCount} notificaciones sin leer`}
      </div>
      <NotificationList notifications={notifications} nextCursor={nextCursor} />
    </div>
  </main>;
}
