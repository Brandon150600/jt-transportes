CREATE TYPE "TripExecutionType" AS ENUM ('OWN', 'SUBCONTRACTED');

ALTER TYPE "NotificationType" ADD VALUE 'TRIP_SUBCONTRACTED_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'TRIP_CUSTOMER_PAYMENT_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE 'TRIP_SUBCONTRACTOR_PAYMENT_COMPLETED';

CREATE TABLE "ExternalCarrier" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "taxId" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExternalCarrier_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Trip"
    ADD COLUMN "executionType" "TripExecutionType" NOT NULL DEFAULT 'OWN',
    ADD COLUMN "externalCarrierId" TEXT,
    ADD COLUMN "externalCarrierNameSnapshot" TEXT,
    ADD COLUMN "externalVehicleDescription" TEXT,
    ADD COLUMN "externalDriverName" TEXT,
    ADD COLUMN "subcontractorCost" DECIMAL(12,2),
    ADD COLUMN "customerPaymentStatus" "PaymentStatus",
    ADD COLUMN "customerPaidAt" TIMESTAMP(3),
    ADD COLUMN "customerPaidByUserId" TEXT,
    ADD COLUMN "subcontractorPaymentStatus" "PaymentStatus",
    ADD COLUMN "subcontractorPaidAt" TIMESTAMP(3),
    ADD COLUMN "subcontractorPaidByUserId" TEXT;

ALTER TABLE "Trip"
    ALTER COLUMN "vehicleId" DROP NOT NULL,
    ALTER COLUMN "driverId" DROP NOT NULL,
    ALTER COLUMN "mileageStart" DROP NOT NULL;

CREATE INDEX "ExternalCarrier_active_businessName_idx" ON "ExternalCarrier"("active", "businessName");
CREATE INDEX "ExternalCarrier_taxId_idx" ON "ExternalCarrier"("taxId");
CREATE INDEX "Trip_executionType_status_scheduledStartAt_idx" ON "Trip"("executionType", "status", "scheduledStartAt");
CREATE INDEX "Trip_clientId_executionType_customerPaymentStatus_scheduledStartAt_idx" ON "Trip"("clientId", "executionType", "customerPaymentStatus", "scheduledStartAt");
CREATE INDEX "Trip_externalCarrierId_subcontractorPaymentStatus_scheduledStartAt_idx" ON "Trip"("externalCarrierId", "subcontractorPaymentStatus", "scheduledStartAt");

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_externalCarrierId_fkey"
    FOREIGN KEY ("externalCarrierId") REFERENCES "ExternalCarrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_customerPaidByUserId_fkey"
    FOREIGN KEY ("customerPaidByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_subcontractorPaidByUserId_fkey"
    FOREIGN KEY ("subcontractorPaidByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_executionType_fields_check" CHECK (
    (
        "executionType" = 'OWN'
        AND "vehicleId" IS NOT NULL
        AND "driverId" IS NOT NULL
        AND "mileageStart" IS NOT NULL
        AND "externalCarrierId" IS NULL
        AND "externalCarrierNameSnapshot" IS NULL
        AND "externalVehicleDescription" IS NULL
        AND "externalDriverName" IS NULL
        AND "subcontractorCost" IS NULL
        AND "customerPaymentStatus" IS NULL
        AND "customerPaidAt" IS NULL
        AND "customerPaidByUserId" IS NULL
        AND "subcontractorPaymentStatus" IS NULL
        AND "subcontractorPaidAt" IS NULL
        AND "subcontractorPaidByUserId" IS NULL
    )
    OR
    (
        "executionType" = 'SUBCONTRACTED'
        AND "vehicleId" IS NULL
        AND "driverId" IS NULL
        AND "mileageStart" IS NULL
        AND "mileageEnd" IS NULL
        AND "externalCarrierId" IS NOT NULL
        AND "externalCarrierNameSnapshot" IS NOT NULL
        AND "subcontractorCost" IS NOT NULL
        AND "subcontractorCost" >= 0
        AND "customerPaymentStatus" IS NOT NULL
        AND "subcontractorPaymentStatus" IS NOT NULL
    )
);

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_customerPayment_audit_check" CHECK (
    ("customerPaymentStatus" = 'PENDING' AND "customerPaidAt" IS NULL AND "customerPaidByUserId" IS NULL)
    OR
    ("customerPaymentStatus" = 'PAID' AND "customerPaidAt" IS NOT NULL AND "customerPaidByUserId" IS NOT NULL)
    OR
    ("customerPaymentStatus" IS NULL AND "customerPaidAt" IS NULL AND "customerPaidByUserId" IS NULL)
);

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_subcontractorPayment_audit_check" CHECK (
    ("subcontractorPaymentStatus" = 'PENDING' AND "subcontractorPaidAt" IS NULL AND "subcontractorPaidByUserId" IS NULL)
    OR
    ("subcontractorPaymentStatus" = 'PAID' AND "subcontractorPaidAt" IS NOT NULL AND "subcontractorPaidByUserId" IS NOT NULL)
    OR
    ("subcontractorPaymentStatus" IS NULL AND "subcontractorPaidAt" IS NULL AND "subcontractorPaidByUserId" IS NULL)
);
