"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getCurrentSessionId, requireUser } from "@/lib/auth/session";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Ingresa tu contraseña actual."),
  newPassword: z.string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
    .max(72, "La contraseña no puede superar 72 caracteres.")
    .refine((password) => new TextEncoder().encode(password).length <= 72, "La contraseña es demasiado larga para el cifrado actual."),
  confirmPassword: z.string().min(1, "Confirma la nueva contraseña."),
}).superRefine((data, context) => {
  if (data.newPassword !== data.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Las contraseñas no coinciden." });
  }
  if (data.newPassword === data.currentPassword) {
    context.addIssue({ code: "custom", path: ["newPassword"], message: "La nueva contraseña debe ser distinta a la actual." });
  }
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(120, "El nombre no puede superar 120 caracteres."),
});

export type ChangePasswordState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type UpdateProfileState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateAccountProfile(
  _previousState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const currentUser = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { error: "Revisa los campos marcados.", fieldErrors };
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/settings");
  redirect("/settings?profileUpdated=1");
}

export async function revokeSession(formData: FormData): Promise<void> {
  const currentUser = await requireUser();
  const sessionId = z.string().min(1).safeParse(formData.get("sessionId"));
  if (!sessionId.success) redirect("/settings?sessionsError=invalid");

  const currentSessionId = await getCurrentSessionId();
  if (!currentSessionId) redirect("/login");
  if (sessionId.data === currentSessionId) redirect("/settings?sessionsError=current");

  await prisma.session.deleteMany({
    where: { id: sessionId.data, userId: currentUser.id },
  });
  revalidatePath("/settings");
  redirect("/settings?sessionsUpdated=1");
}

export async function revokeOtherSessions(): Promise<void> {
  const currentUser = await requireUser();
  const currentSessionId = await getCurrentSessionId();
  if (!currentSessionId) redirect("/login");

  await prisma.session.deleteMany({
    where: { userId: currentUser.id, id: { not: currentSessionId } },
  });
  revalidatePath("/settings");
  redirect("/settings?sessionsUpdated=1");
}

export async function changePassword(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentUser = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { error: "Revisa los campos marcados.", fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { passwordHash: true },
  });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { error: "La contraseña actual es incorrecta.", fieldErrors: { currentPassword: "Verifica tu contraseña actual." } };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({ where: { id: currentUser.id }, data: { passwordHash } });
  redirect("/settings?passwordChanged=1");
}
