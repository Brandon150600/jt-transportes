CREATE TYPE "TripStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ExpenseCategory_new" AS ENUM ('FUEL', 'TOLLS', 'PER_DIEM', 'PARTS', 'MAINTENANCE', 'WASH', 'TIRES', 'OTHER');
ALTER TABLE "FleetExpense" ALTER COLUMN "category" TYPE "ExpenseCategory_new" USING ("category"::text::"ExpenseCategory_new");
DROP TYPE "ExpenseCategory";
ALTER TYPE "ExpenseCategory_new" RENAME TO "ExpenseCategory";

CREATE SEQUENCE "Trip_tripNumber_seq" START WITH 1 INCREMENT BY 1;
ALTER TABLE "ExpenseItem" ADD COLUMN "unit" TEXT;

CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "tripNumber" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'SCHEDULED',
    "clientId" TEXT NOT NULL,
    "destinationAddressId" TEXT NOT NULL,
    "clientNameSnapshot" TEXT NOT NULL,
    "destinationNameSnapshot" TEXT NOT NULL,
    "destinationSnapshot" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "scheduledStartAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "mileageStart" INTEGER NOT NULL,
    "mileageEnd" INTEGER,
    "revenue" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FleetExpense" ADD COLUMN "tripId" TEXT;
CREATE UNIQUE INDEX "Trip_tripNumber_key" ON "Trip"("tripNumber");
CREATE INDEX "Trip_clientId_scheduledStartAt_idx" ON "Trip"("clientId", "scheduledStartAt");
CREATE INDEX "Trip_destinationAddressId_idx" ON "Trip"("destinationAddressId");
CREATE INDEX "Trip_vehicleId_scheduledStartAt_idx" ON "Trip"("vehicleId", "scheduledStartAt");
CREATE INDEX "Trip_driverId_scheduledStartAt_idx" ON "Trip"("driverId", "scheduledStartAt");
CREATE INDEX "Trip_status_scheduledStartAt_idx" ON "Trip"("status", "scheduledStartAt");
CREATE UNIQUE INDEX "Trip_one_active_vehicle_idx" ON "Trip"("vehicleId") WHERE "status" = 'IN_PROGRESS';
CREATE UNIQUE INDEX "Trip_one_active_driver_idx" ON "Trip"("driverId") WHERE "status" = 'IN_PROGRESS';
CREATE INDEX "FleetExpense_tripId_expenseDate_idx" ON "FleetExpense"("tripId", "expenseDate");

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_destinationAddressId_fkey" FOREIGN KEY ("destinationAddressId") REFERENCES "ClientAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FleetExpense" ADD CONSTRAINT "FleetExpense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
