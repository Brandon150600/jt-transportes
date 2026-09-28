"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const supplierSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("El correo no es válido.").optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  taxId: z.string().trim().max(30).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

const updateSupplierSchema = supplierSchema.extend({ id: z.string().min(1) });

export type SupplierFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseSupplier(formData: FormData) {
  return supplierSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    taxId: formData.get("taxId"),
    notes: formData.get("notes"),
  });
}

function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(
    error.issues.flatMap((issue) => {
      const key = issue.path[0];
      return typeof key === "string" ? [[key, issue.message]] : [];
    }),
  );
}

export async function createSupplier(
  _previousState: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = parseSupplier(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };

  const supplier = await prisma.supplier.create({
    data: {
      ...parsed.data,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      taxId: parsed.data.taxId || null,
      notes: parsed.data.notes || null,
    },
    select: { id: true },
  });
  redirect(`/suppliers/${supplier.id}`);
}

export async function updateSupplier(
  _previousState: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = updateSupplierSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };

  const { id, ...data } = parsed.data;
  try {
    await prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        taxId: data.taxId || null,
        notes: data.notes || null,
      },
    });
  } catch {
    return { error: "No fue posible actualizar el proveedor." };
  }
  redirect(`/suppliers/${id}`);
}

export async function toggleSupplierActive(formData: FormData) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({ id: z.string().min(1), active: z.enum(["true", "false"]) }).safeParse({
    id: formData.get("id"),
    active: formData.get("active"),
  });
  if (!parsed.success) return;

  await prisma.supplier.update({
    where: { id: parsed.data.id },
    data: { active: parsed.data.active !== "true" },
  });
  redirect(`/suppliers/${parsed.data.id}`);
}
