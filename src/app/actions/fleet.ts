"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const vehicleFields = {
    economicNumber: z.string().trim().min(1, "El número económico es obligatorio.").transform((value) => value.toUpperCase()),
    type: z.enum(["TRACTOR", "TRUCK", "TRAILER", "DRY_VAN", "PLATFORM", "OTHER"]),
    brand: z.string().trim().min(1, "La marca es obligatoria."),
    model: z.string().trim().min(1, "El modelo es obligatorio."),
    year: z.coerce.number().int().min(1980, "El año no es válido.").max(2100, "El año no es válido."),
    color: z.string().trim().optional().or(z.literal("")),
    plate: z.string().trim().transform((value) => value.toUpperCase()).optional().or(z.literal("")),
    vin: z.string().trim().length(17, "El VIN debe tener 17 caracteres.").transform((value) => value.toUpperCase()).optional().or(z.literal("")),
    status: z.enum(["AVAILABLE", "IN_ROUTE", "MAINTENANCE", "INACTIVE"]),
    mileage: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
    fuelLevel: z.coerce.number().int().min(0, "El combustible debe estar entre 0 y 100.").max(100, "El combustible debe estar entre 0 y 100."),
    location: z.string().trim().optional().or(z.literal("")),
    lastServiceAt: z.string().optional().or(z.literal("")),
    nextServiceAt: z.string().optional().or(z.literal("")),
    insuranceStatus: z.string().trim().max(40).optional().or(z.literal("")),
    registrationStatus: z.string().trim().max(40).optional().or(z.literal("")),
    driverId: z.string().optional().or(z.literal("")),
};

const vehicleSchema = z.object(vehicleFields);
const updateVehicleSchema = z.object({ id: z.string().min(1, "La unidad no es válida."), ...vehicleFields });

type VehicleData = z.infer<typeof vehicleSchema>;
export type VehicleFormState = { error?: string; fieldErrors?: Record<string, string> };
export type UpdateVehicleState = VehicleFormState;

function isValidDateOnly(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseDate(value: string | undefined) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

function fieldErrorsFrom(error: z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return fieldErrors;
}

function readVehicleData(formData: FormData) {
    return {
        economicNumber: formData.get("economicNumber"), type: formData.get("type"),
        brand: formData.get("brand"), model: formData.get("model"), year: formData.get("year"),
        color: formData.get("color"), plate: formData.get("plate"), vin: formData.get("vin"),
        status: formData.get("status"), mileage: formData.get("mileage"), fuelLevel: formData.get("fuelLevel"),
        location: formData.get("location"), lastServiceAt: formData.get("lastServiceAt"),
        nextServiceAt: formData.get("nextServiceAt"), insuranceStatus: formData.get("insuranceStatus"),
        registrationStatus: formData.get("registrationStatus"), driverId: formData.get("driverId"),
    };
}

function invalidDates(data: Pick<VehicleData, "lastServiceAt" | "nextServiceAt">) {
    const fieldErrors: Record<string, string> = {};
    if (data.lastServiceAt && !isValidDateOnly(data.lastServiceAt)) fieldErrors.lastServiceAt = "La fecha no es válida.";
    if (data.nextServiceAt && !isValidDateOnly(data.nextServiceAt)) fieldErrors.nextServiceAt = "La fecha no es válida.";
    if (data.lastServiceAt && data.nextServiceAt && data.lastServiceAt > data.nextServiceAt) {
        fieldErrors.nextServiceAt = "Debe ser igual o posterior a la fecha del último servicio.";
    }
    return fieldErrors;
}

async function findIdentifierConflict(data: VehicleData, excludeId?: string) {
    const conflict = await prisma.vehicle.findFirst({
        where: {
            ...(excludeId ? { id: { not: excludeId } } : {}),
            OR: [
                { economicNumber: data.economicNumber },
                ...(data.plate ? [{ plate: data.plate }] : []),
                ...(data.vin ? [{ vin: data.vin }] : []),
            ],
        },
        select: { economicNumber: true, plate: true, vin: true },
    });
    if (!conflict) return null;
    if (conflict.economicNumber === data.economicNumber) return "Ya existe una unidad con ese número económico.";
    if (data.plate && conflict.plate === data.plate) return "Ya existe una unidad con esas placas.";
    if (data.vin && conflict.vin === data.vin) return "Ya existe una unidad con ese VIN.";
    return "Uno de los identificadores ya está registrado en otra unidad.";
}

async function validateDriver(driverId: string, currentlyAssignedId?: string) {
    if (!driverId) return null;
    const driver = await prisma.driver.findUnique({ where: { id: driverId }, select: { id: true, status: true } });
    if (!driver) return "El operador seleccionado no existe.";
    if (driver.status !== "ACTIVE" && driver.id !== currentlyAssignedId) return "Solo se puede asignar un operador activo.";
    return null;
}

function vehicleWriteData(data: VehicleData) {
    return {
        economicNumber: data.economicNumber,
        type: data.type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color || null,
        plate: data.plate || null,
        vin: data.vin || null,
        status: data.status,
        mileage: data.mileage,
        fuelLevel: data.fuelLevel,
        location: data.location || null,
        lastServiceAt: parseDate(data.lastServiceAt),
        nextServiceAt: parseDate(data.nextServiceAt),
        insuranceStatus: data.insuranceStatus || null,
        registrationStatus: data.registrationStatus || null,
        driverId: data.driverId || null,
    };
}

export async function createVehicle(_previousState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");
    const parsed = vehicleSchema.safeParse(readVehicleData(formData));
    if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrorsFrom(parsed.error) };
    const data = parsed.data;
    const dateErrors = invalidDates(data);
    if (Object.keys(dateErrors).length) return { error: "Revisa las fechas del formulario.", fieldErrors: dateErrors };

    const identifierConflict = await findIdentifierConflict(data);
    if (identifierConflict) return { error: identifierConflict };
    const driverError = await validateDriver(data.driverId ?? "");
    if (driverError) return { error: driverError, fieldErrors: { driverId: driverError } };

    let vehicleId: string;
    try {
        const vehicle = await prisma.vehicle.create({ data: vehicleWriteData(data), select: { id: true } });
        vehicleId = vehicle.id;
    } catch {
        return { error: "No fue posible registrar la unidad. Revisa que sus placas y VIN no estén duplicados." };
    }
    revalidatePath("/fleet-management");
    revalidatePath(`/fleet-management/${vehicleId}`);
    redirect(`/fleet-management/${vehicleId}`);
}

export async function updateVehicle(_previousState: UpdateVehicleState, formData: FormData): Promise<UpdateVehicleState> {
    await requireAnyRole("ADMIN", "SUPER_ADMIN");
    const parsed = updateVehicleSchema.safeParse({ id: formData.get("id"), ...readVehicleData(formData) });
    if (!parsed.success) return { error: "Revisa los campos marcados.", fieldErrors: fieldErrorsFrom(parsed.error) };
    const { id, ...data } = parsed.data;
    const dateErrors = invalidDates(data);
    if (Object.keys(dateErrors).length) return { error: "Revisa las fechas del formulario.", fieldErrors: dateErrors };

    const existingVehicle = await prisma.vehicle.findUnique({ where: { id }, select: { id: true, driverId: true } });
    if (!existingVehicle) return { error: "La unidad ya no existe. Actualiza la página e inténtalo de nuevo." };
    const identifierConflict = await findIdentifierConflict(data, id);
    if (identifierConflict) return { error: identifierConflict };
    const driverError = await validateDriver(data.driverId ?? "", existingVehicle.driverId ?? undefined);
    if (driverError) return { error: driverError, fieldErrors: { driverId: driverError } };

    try {
        await prisma.vehicle.update({ where: { id }, data: vehicleWriteData(data) });
    } catch {
        return { error: "No fue posible actualizar la unidad. Revisa que sus placas y VIN no estén duplicados." };
    }
    revalidatePath("/fleet-management");
    revalidatePath(`/fleet-management/${id}`);
    redirect(`/fleet-management/${id}`);
}
