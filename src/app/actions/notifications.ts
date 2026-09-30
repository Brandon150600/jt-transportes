"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { NotificationEntityType } from "@/generated/prisma/client/enums";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const notificationIdSchema = z.string().cuid();

function getEntityHref(entityType: NotificationEntityType | null, entityId: string | null) {
  if (!entityType || !entityId) return "/notifications";
  switch (entityType) {
    case NotificationEntityType.TRIP:
      return `/trips/${encodeURIComponent(entityId)}`;
    case NotificationEntityType.FLEET_EXPENSE:
      return `/fleet-expenses/${encodeURIComponent(entityId)}`;
    case NotificationEntityType.VEHICLE:
      return `/fleet-management/${encodeURIComponent(entityId)}`;
  }
}

function refreshNotificationViews() {
  revalidatePath("/", "layout");
  revalidatePath("/notifications");
}

export async function openNotification(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsedId = notificationIdSchema.safeParse(formData.get("notificationId"));
  if (!parsedId.success) redirect("/notifications");

  const notification = await prisma.notification.findFirst({
    where: { id: parsedId.data },
    select: { id: true, createdAt: true, entityType: true, entityId: true },
  });
  if (!notification) redirect("/notifications");

  if (notification.createdAt >= user.createdAt) {
    await prisma.notificationRead.upsert({
      where: { userId_notificationId: { userId: user.id, notificationId: notification.id } },
      update: {},
      create: { userId: user.id, notificationId: notification.id },
    });
  }

  refreshNotificationViews();
  redirect(getEntityHref(notification.entityType, notification.entityId));
}

export async function markNotificationAsRead(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsedId = notificationIdSchema.safeParse(formData.get("notificationId"));
  if (parsedId.success) {
    const notification = await prisma.notification.findFirst({
      where: { id: parsedId.data, createdAt: { gte: user.createdAt } },
      select: { id: true },
    });
    if (notification) {
      await prisma.notificationRead.upsert({
        where: { userId_notificationId: { userId: user.id, notificationId: notification.id } },
        update: {},
        create: { userId: user.id, notificationId: notification.id },
      });
    }
  }
  refreshNotificationViews();
}

export async function markNotificationAsUnread(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsedId = notificationIdSchema.safeParse(formData.get("notificationId"));
  if (parsedId.success) {
    await prisma.notificationRead.deleteMany({
      where: {
        userId: user.id,
        notificationId: parsedId.data,
        notification: { createdAt: { gte: user.createdAt } },
      },
    });
  }
  refreshNotificationViews();
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const user = await requireUser();
  await prisma.$executeRaw`
    INSERT INTO "NotificationRead" ("userId", "notificationId", "readAt")
    SELECT ${user.id}, notification."id", NOW()
    FROM "Notification" AS notification
    WHERE notification."createdAt" >= ${user.createdAt}
      AND NOT EXISTS (
        SELECT 1
        FROM "NotificationRead" AS readState
        WHERE readState."userId" = ${user.id}
          AND readState."notificationId" = notification."id"
      )
    ON CONFLICT ("userId", "notificationId") DO NOTHING
  `;
  refreshNotificationViews();
}
