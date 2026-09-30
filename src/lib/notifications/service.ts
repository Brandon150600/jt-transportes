import { NotificationEntityType, NotificationType } from "@/generated/prisma/client/enums";
import { Prisma, type PrismaClient } from "@/generated/prisma/client/client";

type NotificationDb = PrismaClient | Prisma.TransactionClient;

export type NewNotification = {
  eventKey: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: string;
};

export function upcomingTripEventKey(tripId: string, scheduledStartAt: Date) {
  return `TRIP_UPCOMING:${tripId}:${scheduledStartAt.toISOString()}`;
}

export async function createUpcomingTripNotification(
  db: NotificationDb,
  trip: { id: string; tripNumber: string; scheduledStartAt: Date },
) {
  const scheduledTime = trip.scheduledStartAt.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  });

  return createNotification(db, {
    eventKey: upcomingTripEventKey(trip.id, trip.scheduledStartAt),
    type: NotificationType.TRIP_UPCOMING,
    title: "Viaje próximo",
    message: `El viaje ${trip.tripNumber} está programado para el ${scheduledTime}.`,
    entityType: NotificationEntityType.TRIP,
    entityId: trip.id,
  });
}

export async function createNotification(db: NotificationDb, input: NewNotification) {
  if (input.eventKey.length > 200) throw new Error("Notification event key is too long.");
  if ((input.entityType && !input.entityId) || (!input.entityType && input.entityId)) {
    throw new Error("Notification entity type and ID must be provided together.");
  }

  const expectedEntityType = input.type.startsWith("TRIP_")
    ? NotificationEntityType.TRIP
    : input.type === NotificationType.EXPENSE_CREATED
      ? NotificationEntityType.FLEET_EXPENSE
      : NotificationEntityType.VEHICLE;
  if (input.entityType !== expectedEntityType || !input.entityId) {
    throw new Error("Notification type does not match its entity reference.");
  }

  const entityExists = input.entityType === NotificationEntityType.TRIP
    ? await db.trip.findUnique({ where: { id: input.entityId }, select: { id: true } })
    : input.entityType === NotificationEntityType.VEHICLE
      ? await db.vehicle.findUnique({ where: { id: input.entityId }, select: { id: true } })
      : await db.fleetExpense.findUnique({ where: { id: input.entityId }, select: { id: true } });
  if (!entityExists) throw new Error("Notification entity does not exist.");

  return db.notification.upsert({
    where: { eventKey: input.eventKey },
    update: {},
    create: {
      eventKey: input.eventKey,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType,
      entityId: input.entityId,
    },
  });
}
