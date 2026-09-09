"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const driverSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres."),

    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    licenseNumber: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    licenseType: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    licenseExpiresAt: z
        .string()
        .optional()
        .or(z.literal("")),

    status: z.enum(["ACTIVE", "INACTIVE"]),
});

const updateDriverSchema = driverSchema.extend({
    id: z.string().min(1, "El operador no es válido."),
});

export type DriverFormState = {
    error?: string;
    fieldErrors?: Record<string, string>;
};

export async function createDriver(
    _previousState: DriverFormState,
    formData: FormData,
): Promise<DriverFormState> {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const parsed = driverSchema.safeParse({
        name: formData.get("name"),
        phone: formData.get("phone"),
        licenseNumber: formData.get("licenseNumber"),
        licenseType: formData.get("licenseType"),
        licenseExpiresAt: formData.get("licenseExpiresAt"),
        status: formData.get("status"),
    });

    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};

        for (const issue of parsed.error.issues) {
            const field = issue.path[0];

            if (typeof field === "string" && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }

        return {
            error: "Revisa los campos marcados.",
            fieldErrors,
        };
    }

    const data = parsed.data;

    if (data.licenseNumber) {
        const existingDriver = await prisma.driver.findFirst({
            where: {
                licenseNumber: data.licenseNumber,
            },
            select: {
                id: true,
            },
        });

        if (existingDriver) {
            return {
                error: "Ya existe un operador con ese número de licencia.",
            };
        }
    }

    const driver = await prisma.driver.create({
        data: {
            name: data.name,
            phone: data.phone || null,
            licenseNumber: data.licenseNumber || null,
            licenseType: data.licenseType || null,
            licenseExpiresAt: data.licenseExpiresAt
                ? new Date(`${data.licenseExpiresAt}T00:00:00`)
                : null,
            status: data.status,
        },
        select: {
            id: true,
        },
    });

    redirect(`/users`);
}

export async function updateDriver(
    _previousState: DriverFormState,
    formData: FormData,
): Promise<DriverFormState> {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");

    const parsed = updateDriverSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        licenseNumber: formData.get("licenseNumber"),
        licenseType: formData.get("licenseType"),
        licenseExpiresAt: formData.get("licenseExpiresAt"),
        status: formData.get("status"),
    });
    
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};

        for (const issue of parsed.error.issues) {
            const field = issue.path[0];

            if (typeof field === "string" && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }

        return {
            error: "Revisa los campos marcados.",
            fieldErrors,
        };
    }

    const data = parsed.data;

    const existingDriver = await prisma.driver.findFirst({
        where: {
            licenseNumber: data.licenseNumber,
            NOT: {
                id: data.id,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingDriver) {
        return {
            error: "Ya existe otro operador con ese número de licencia.",
        };
    }

    try {
        await prisma.driver.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                phone: data.phone || null,
                licenseNumber: data.licenseNumber,
                licenseType: data.licenseType,
                licenseExpiresAt: data.licenseExpiresAt
                    ? new Date(data.licenseExpiresAt)
                    : null,
                status: data.status,
            },
        });
    } catch {
        return {
            error: "No fue posible actualizar el operador.",
        };
    }

    redirect(`/users/${data.id}`);
}