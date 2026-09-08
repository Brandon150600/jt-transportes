"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  deleteCurrentSession,
} from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  remember: z.boolean().optional().default(false),
});

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  });

  if (!parsed.success) {
    return { error: "Correo o contraseña inválidos." };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email.toLowerCase(),
    },
    select: {
      id: true,
      passwordHash: true,
      role: true,
      isActive: true,
    },
  });

  if (
    !user ||
    !user.isActive ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return { error: "Correo o contraseña inválidos." };
  }

  await createSession(user.id, parsed.data.remember);
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logout() {
  await deleteCurrentSession();
  redirect("/login");
}
