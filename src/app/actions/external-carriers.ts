"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const carrierSchema = z.object({
  businessName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(160),
  contactName: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("El correo no es válido.").max(160).optional().or(z.literal("")),
  taxId: z.string().trim().max(30).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ExternalCarrierFormState = { error?: string; fieldErrors?: Record<string, string> };

function parse(formData: FormData) {
  return carrierSchema.safeParse(Object.fromEntries(formData.entries()));
}

function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.flatMap((issue) => {
    const key = issue.path[0];
    return typeof key === "string" ? [[key, issue.message]] : [];
  }));
}

function clean(data: z.infer<typeof carrierSchema>) {
  return {
    ...data,
    contactName: data.contactName || null,
    phone: data.phone || null,
    email: data.email || null,
    taxId: data.taxId || null,
    notes: data.notes || null,
  };
}

export async function createExternalCarrier(_state: ExternalCarrierFormState, formData: FormData): Promise<ExternalCarrierFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  const carrier = await prisma.externalCarrier.create({ data: clean(parsed.data), select: { id: true } });
  revalidatePath("/external-carriers");
  redirect(`/external-carriers/${carrier.id}/edit`);
}

export async function updateExternalCarrier(_state: ExternalCarrierFormState, formData: FormData): Promise<ExternalCarrierFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const id = String(formData.get("id") || "");
  if (!z.string().cuid().safeParse(id).success) return { error: "Transportista no válido." };
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await prisma.externalCarrier.update({ where: { id }, data: clean(parsed.data) });
  } catch {
    return { error: "No fue posible actualizar el transportista." };
  }
  revalidatePath("/external-carriers");
  revalidatePath("/trips");
  redirect("/external-carriers");
}

export async function setExternalCarrierActive(formData: FormData) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({ id: z.string().cuid(), active: z.enum(["true", "false"]) }).safeParse({
    id: formData.get("id"), active: formData.get("active"),
  });
  if (!parsed.success) return;
  await prisma.externalCarrier.update({ where: { id: parsed.data.id }, data: { active: parsed.data.active !== "true" } });
  revalidatePath("/external-carriers");
  revalidatePath("/trips");
}
