-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('PARTS', 'MAINTENANCE', 'WASH', 'TIRES', 'OTHER');

-- CreateEnum
CREATE TYPE "FleetExpenseStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseSource" AS ENUM ('MANUAL', 'WHATSAPP', 'IMPORT', 'API');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "taxId" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetExpense" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "supplierId" TEXT,
    "expenseDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "laborAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "mileage" INTEGER,
    "receiptNumber" TEXT,
    "notes" TEXT,
    "status" "FleetExpenseStatus" NOT NULL DEFAULT 'CONFIRMED',
    "source" "ExpenseSource" NOT NULL DEFAULT 'MANUAL',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "paidByUserId" TEXT,
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "paymentNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseItem" (
    "id" TEXT NOT NULL,
    "fleetExpenseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");
CREATE INDEX "Supplier_active_name_idx" ON "Supplier"("active", "name");
CREATE INDEX "Supplier_taxId_idx" ON "Supplier"("taxId");
CREATE INDEX "FleetExpense_vehicleId_expenseDate_idx" ON "FleetExpense"("vehicleId", "expenseDate");
CREATE INDEX "FleetExpense_category_expenseDate_idx" ON "FleetExpense"("category", "expenseDate");
CREATE INDEX "FleetExpense_supplierId_expenseDate_idx" ON "FleetExpense"("supplierId", "expenseDate");
CREATE INDEX "FleetExpense_status_expenseDate_idx" ON "FleetExpense"("status", "expenseDate");
CREATE INDEX "FleetExpense_paymentStatus_expenseDate_idx" ON "FleetExpense"("paymentStatus", "expenseDate");
CREATE INDEX "FleetExpense_createdById_expenseDate_idx" ON "FleetExpense"("createdById", "expenseDate");
CREATE INDEX "FleetExpense_paidByUserId_idx" ON "FleetExpense"("paidByUserId");
CREATE INDEX "ExpenseItem_fleetExpenseId_idx" ON "ExpenseItem"("fleetExpenseId");

-- AddForeignKey
ALTER TABLE "FleetExpense" ADD CONSTRAINT "FleetExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FleetExpense" ADD CONSTRAINT "FleetExpense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FleetExpense" ADD CONSTRAINT "FleetExpense_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FleetExpense" ADD CONSTRAINT "FleetExpense_paidByUserId_fkey" FOREIGN KEY ("paidByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExpenseItem" ADD CONSTRAINT "ExpenseItem_fleetExpenseId_fkey" FOREIGN KEY ("fleetExpenseId") REFERENCES "FleetExpense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
