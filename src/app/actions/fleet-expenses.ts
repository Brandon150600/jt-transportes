"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ExpenseCategory, NotificationEntityType, NotificationType } from "@/generated/prisma/client/enums";
import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";
import { createNotification } from "@/lib/notifications/service";

const itemSchema = z.object({
  description: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().positive().max(100000),
  unitCost: z.coerce.number().nonnegative().max(100000000),
  unit: z.string().trim().max(30).optional(),
});

const expenseSchema = z.object({
  id: z.string().optional(),
  vehicleId: z.string().min(1, "Selecciona una unidad."),
  tripId: z.string().optional(),
  category: z.nativeEnum(ExpenseCategory),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha no es válida."),
  supplierId: z.string().optional(),
  newSupplierName: z.string().trim().max(120).optional(),
  newSupplierPhone: z.string().trim().max(40).optional(),
  description: z.string().trim().min(2, "Agrega una descripción.").max(300),
  amount: z.coerce.number().positive("El total debe ser mayor que cero.").max(100000000).optional(),
  laborAmount: z.coerce.number().nonnegative().max(100000000).default(0),
  mileage: z.union([z.coerce.number().int().nonnegative().max(10000000), z.literal("")]).optional(),
  receiptNumber: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(2000).optional(),
  items: z.array(itemSchema).max(100).default([]),
}).superRefine((data, context) => {
  if (!data.items.length && !data.amount) {
    context.addIssue({ code: "custom", path: ["amount"], message: "Indica el total del gasto." });
  }
  if (data.newSupplierName && data.supplierId) {
    context.addIssue({ code: "custom", path: ["supplierId"], message: "Elige un proveedor existente o captura uno nuevo." });
  }
  if (data.category === "FUEL" && (!data.items.length || data.items.some((item) => !item.unit || !["l", "litro", "litros"].includes(item.unit.toLowerCase())))) {
    context.addIssue({ code: "custom", path: ["items"], message: "El combustible requiere conceptos con cantidad en litros." });
  }
  if (data.category === "FUEL" && data.items.some((item) => item.unitCost <= 0)) {
    context.addIssue({ code: "custom", path: ["items"], message: "El combustible requiere un precio por litro mayor que cero." });
  }
});

export type FleetExpenseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function readFormData(formData: FormData) {
  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    items = null;
  }

  return {
    id: formData.get("id") || undefined,
    vehicleId: formData.get("vehicleId"),
    tripId: formData.get("tripId") || undefined,
    category: formData.get("category"),
    expenseDate: formData.get("expenseDate"),
    supplierId: formData.get("supplierId") || undefined,
    newSupplierName: formData.get("newSupplierName") || undefined,
    newSupplierPhone: formData.get("newSupplierPhone") || undefined,
    description: formData.get("description"),
    amount: formData.get("amount") || undefined,
    laborAmount: formData.get("laborAmount") || 0,
    mileage: formData.get("mileage") || undefined,
    receiptNumber: formData.get("receiptNumber") || undefined,
    notes: formData.get("notes") || undefined,
    items,
  };
}

function getFieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export async function saveFleetExpense(
  _previousState: FleetExpenseFormState,
  formData: FormData,
): Promise<FleetExpenseFormState> {
  const user = await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = expenseSchema.safeParse(readFormData(formData));
  if (!parsed.success) {
    return { error: "Revisa los campos marcados.", fieldErrors: getFieldErrors(parsed.error) };
  }

  const data = parsed.data;
  const itemSubtotals = data.items.map((item) => Math.round(item.quantity * item.unitCost * 100) / 100);
  const subtotal = data.items.length
    ? Math.round(itemSubtotals.reduce((sum, value) => sum + value, 0) * 100) / 100
    : data.amount ?? 0;
  const laborAmount = data.items.length ? data.laborAmount : 0;
  const total = Math.round((subtotal + laborAmount) * 100) / 100;

  try {
    const expense = await prisma.$transaction(async (tx) => {
      let supplierId = data.supplierId || null;
      if (data.tripId) {
        const trip = await tx.trip.findUnique({ where: { id: data.tripId }, select: { executionType: true, vehicleId: true, status: true } });
        if (!trip || trip.executionType !== "OWN" || !trip.vehicleId || trip.vehicleId !== data.vehicleId || trip.status === "CANCELLED") throw new Error("INVALID_TRIP");
      }
      if (data.newSupplierName) {
        const supplier = await tx.supplier.create({
          data: {
            name: data.newSupplierName,
            phone: data.newSupplierPhone || null,
          },
          select: { id: true },
        });
        supplierId = supplier.id;
      }

      const values = {
        vehicleId: data.vehicleId,
        tripId: data.tripId || null,
        supplierId,
        expenseDate: new Date(`${data.expenseDate}T12:00:00.000Z`),
        category: data.category,
        description: data.description,
        subtotal,
        laborAmount,
        total,
        mileage: data.mileage === "" ? null : data.mileage ?? null,
        receiptNumber: data.receiptNumber || null,
        notes: data.notes || null,
      };

      if (data.id) {
        await tx.expenseItem.deleteMany({ where: { fleetExpenseId: data.id } });
        return tx.fleetExpense.update({
          where: { id: data.id },
          data: {
            ...values,
            items: data.items.length
              ? { create: data.items.map((item, index) => ({ ...item, unit: item.unit || null, subtotal: itemSubtotals[index] })) }
              : undefined,
          },
          select: { id: true },
        });
      }

      const createdExpense = await tx.fleetExpense.create({
        data: {
          ...values,
          createdById: user.id,
          source: "MANUAL",
          items: data.items.length
            ? { create: data.items.map((item, index) => ({ ...item, unit: item.unit || null, subtotal: itemSubtotals[index] })) }
            : undefined,
        },
        select: {
          id: true,
          trip: { select: { tripNumber: true } },
          vehicle: { select: { economicNumber: true } },
        },
      });
      const expenseContext = createdExpense.trip
        ? `para el viaje ${createdExpense.trip.tripNumber}`
        : `para la unidad ${createdExpense.vehicle.economicNumber}`;
      await createNotification(tx, {
        eventKey: `EXPENSE_CREATED:${createdExpense.id}`,
        type: NotificationType.EXPENSE_CREATED,
        title: "Nuevo gasto",
        message: `Se registró un gasto ${expenseContext}.`,
        entityType: NotificationEntityType.FLEET_EXPENSE,
        entityId: createdExpense.id,
      });
      return { id: createdExpense.id };
    });
    redirect(`/fleet-expenses/${expense.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { error: "No fue posible guardar el gasto. Verifica la unidad y el proveedor." };
  }
}

export async function setFleetExpensePayment(formData: FormData) {
  const user = await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({
    id: z.string().min(1),
    status: z.enum(["PENDING", "PAID"]),
    paymentMethod: z.string().trim().max(80).optional(),
    paymentReference: z.string().trim().max(120).optional(),
    paymentNotes: z.string().trim().max(500).optional(),
  }).safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    paymentMethod: formData.get("paymentMethod") || undefined,
    paymentReference: formData.get("paymentReference") || undefined,
    paymentNotes: formData.get("paymentNotes") || undefined,
  });
  if (!parsed.success) return;

  await prisma.fleetExpense.update({
    where: { id: parsed.data.id },
    data: parsed.data.status === "PAID"
      ? {
          paymentStatus: "PAID",
          paidAt: new Date(),
          paidByUserId: user.id,
          paymentMethod: parsed.data.paymentMethod || null,
          paymentReference: parsed.data.paymentReference || null,
          paymentNotes: parsed.data.paymentNotes || null,
        }
      : {
          paymentStatus: "PENDING",
          paidAt: null,
          paidByUserId: null,
          paymentMethod: null,
          paymentReference: null,
          paymentNotes: null,
        },
  });
  redirect(`/fleet-expenses/${parsed.data.id}`);
}
