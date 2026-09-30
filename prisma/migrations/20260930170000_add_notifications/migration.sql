CREATE TYPE "NotificationType" AS ENUM (
  'TRIP_CREATED',
  'TRIP_UPCOMING',
  'TRIP_STARTED',
  'TRIP_COMPLETED',
  'TRIP_CANCELLED',
  'EXPENSE_CREATED',
  'VEHICLE_MAINTENANCE_DUE'
);

CREATE TYPE "NotificationEntityType" AS ENUM (
  'TRIP',
  'FLEET_EXPENSE',
  'VEHICLE'
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "entityType" "NotificationEntityType",
  "entityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NotificationRead" (
  "userId" TEXT NOT NULL,
  "notificationId" TEXT NOT NULL,
  "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("userId", "notificationId")
);

CREATE UNIQUE INDEX "Notification_eventKey_key" ON "Notification"("eventKey");
CREATE INDEX "Notification_createdAt_id_idx" ON "Notification"("createdAt", "id");
CREATE INDEX "NotificationRead_notificationId_idx" ON "NotificationRead"("notificationId");

ALTER TABLE "NotificationRead"
  ADD CONSTRAINT "NotificationRead_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "NotificationRead"
  ADD CONSTRAINT "NotificationRead_notificationId_fkey"
  FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
