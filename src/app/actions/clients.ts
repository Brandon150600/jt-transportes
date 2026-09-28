"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const clientSchema = z.object({
  businessName: z.string().trim().min(2, "La razón social debe tener al menos 2 caracteres.").max(180),
  commercialName: z.string().trim().max(180).optional().or(z.literal("")),
  taxId: z.string().trim().toUpperCase().max(30).optional().or(z.literal("")),
  contactName: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("El correo no es válido.").max(180).optional().or(z.literal("")),
  notes: z.string().trim().max(3000).optional().or(z.literal("")),
});

const updateClientSchema = clientSchema.extend({ id: z.string().min(1) });

const addressSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().trim().min(2, "El nombre de la ubicación es obligatorio.").max(120),
  street: z.string().trim().min(3, "Agrega la calle o carretera.").max(180),
  exteriorNumber: z.string().trim().max(30).optional().or(z.literal("")),
  interiorNumber: z.string().trim().max(30).optional().or(z.literal("")),
  neighborhood: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "La ciudad es obligatoria.").max(120),
  state: z.string().trim().min(2, "El estado es obligatorio.").max(120),
  postalCode: z.string().trim().max(15).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(80),
  reference: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

const updateAddressSchema = addressSchema.extend({ id: z.string().min(1) });

export type ClientFormState = { error?: string; fieldErrors?: Record<string, string> };
export type ClientAddressFormState = { error?: string; fieldErrors?: Record<string, string> };

function collectFieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

function readClient(formData: FormData) {
  return clientSchema.safeParse({
    businessName: formData.get("businessName"), commercialName: formData.get("commercialName"),
    taxId: formData.get("taxId"), contactName: formData.get("contactName"),
    phone: formData.get("phone"), email: formData.get("email"), notes: formData.get("notes"),
  });
}

function toClientData(data: z.infer<typeof clientSchema>) {
  return {
    businessName: data.businessName,
    commercialName: data.commercialName || null,
    taxId: data.taxId || null,
    contactName: data.contactName || null,
    phone: data.phone || null,
    email: data.email || null,
    notes: data.notes || null,
  };
}

export async function createClient(_previous: ClientFormState, formData: FormData): Promise<ClientFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = readClient(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: collectFieldErrors(parsed.error) };
  if (parsed.data.taxId) {
    const existing = await prisma.client.findUnique({ where: { taxId: parsed.data.taxId }, select: { id: true } });
    if (existing) return { error: "Ya existe un cliente con ese RFC.", fieldErrors: { taxId: "RFC registrado." } };
  }
  try {
    const client = await prisma.client.create({ data: toClientData(parsed.data), select: { id: true } });
    redirect(`/clients/${client.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return { error: "No fue posible crear el cliente. Verifica si el RFC ya está registrado." };
  }
}

export async function updateClient(_previous: ClientFormState, formData: FormData): Promise<ClientFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = updateClientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: collectFieldErrors(parsed.error) };
  const { id, ...clientFields } = parsed.data;
  if (clientFields.taxId) {
    const existing = await prisma.client.findFirst({ where: { taxId: clientFields.taxId, NOT: { id } }, select: { id: true } });
    if (existing) return { error: "Ya existe otro cliente con ese RFC.", fieldErrors: { taxId: "RFC registrado." } };
  }
  try {
    await prisma.client.update({ where: { id }, data: toClientData(clientFields) });
  } catch {
    return { error: "No fue posible actualizar el cliente." };
  }
  redirect(`/clients/${id}`);
}

export async function setClientActive(formData: FormData) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({ id: z.string().min(1), active: z.enum(["true", "false"]) }).safeParse({ id: formData.get("id"), active: formData.get("active") });
  if (!parsed.success) return;
  await prisma.client.update({ where: { id: parsed.data.id }, data: { active: parsed.data.active !== "true" } });
  redirect(`/clients/${parsed.data.id}`);
}

function readAddress(formData: FormData) {
  return addressSchema.safeParse({
    clientId: formData.get("clientId"), name: formData.get("name"), street: formData.get("street"),
    exteriorNumber: formData.get("exteriorNumber"), interiorNumber: formData.get("interiorNumber"),
    neighborhood: formData.get("neighborhood"), city: formData.get("city"), state: formData.get("state"),
    postalCode: formData.get("postalCode"), country: formData.get("country") || "México",
    reference: formData.get("reference"), notes: formData.get("notes"),
  });
}

function toAddressData(data: z.infer<typeof addressSchema>) {
  return {
    name: data.name, street: data.street, exteriorNumber: data.exteriorNumber || null,
    interiorNumber: data.interiorNumber || null, neighborhood: data.neighborhood || null,
    city: data.city, state: data.state, postalCode: data.postalCode || null,
    country: data.country, reference: data.reference || null, notes: data.notes || null,
  };
}

export async function createClientAddress(_previous: ClientAddressFormState, formData: FormData): Promise<ClientAddressFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = readAddress(formData);
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: collectFieldErrors(parsed.error) };
  try {
    await prisma.clientAddress.create({ data: { ...toAddressData(parsed.data), clientId: parsed.data.clientId } });
  } catch {
    return { error: "No fue posible guardar la ubicación. El nombre debe ser único dentro de este cliente." };
  }
  redirect(`/clients/${parsed.data.clientId}`);
}

export async function updateClientAddress(_previous: ClientAddressFormState, formData: FormData): Promise<ClientAddressFormState> {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = updateAddressSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: collectFieldErrors(parsed.error) };
  const { id, clientId, ...addressFields } = parsed.data;
  const belongsToClient = await prisma.clientAddress.findFirst({ where: { id, clientId }, select: { id: true } });
  if (!belongsToClient) return { error: "La ubicación no pertenece a este cliente." };
  try {
    await prisma.clientAddress.update({ where: { id }, data: toAddressData({ ...addressFields, clientId }) });
  } catch {
    return { error: "No fue posible actualizar la ubicación. Revisa que su nombre no esté repetido." };
  }
  redirect(`/clients/${clientId}`);
}

export async function setClientAddressActive(formData: FormData) {
  await requireAnyRole("ADMIN", "SUPER_ADMIN");
  const parsed = z.object({ id: z.string().min(1), clientId: z.string().min(1), active: z.enum(["true", "false"]) }).safeParse({
    id: formData.get("id"), clientId: formData.get("clientId"), active: formData.get("active"),
  });
  if (!parsed.success) return;
  const result = await prisma.clientAddress.updateMany({
    where: { id: parsed.data.id, clientId: parsed.data.clientId },
    data: { active: parsed.data.active !== "true" },
  });
  if (result.count) redirect(`/clients/${parsed.data.clientId}`);
}
