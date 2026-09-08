"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAnyRole } from "@/lib/auth/session";

const vehicleSchema = z.object({
  economicNumber: z
    .string()
    .trim()
    .min(1, "El número económico es obligatorio."),

  type: z.enum([
    "TRACTOR",
    "TRUCK",
    "TRAILER",
    "DRY_VAN",
    "PLATFORM",
    "OTHER",
  ]),

  brand: z.string().trim().min(1, "La marca es obligatoria."),

  model: z.string().trim().min(1, "El modelo es obligatorio."),

  year: z.coerce
    .number()
    .int()
    .min(1980, "El año no es válido.")
    .max(2100, "El año no es válido."),

  color: z.string().trim().optional(),

  plate: z.string().trim().optional(),

  vin: z
    .string()
    .trim()
    .length(17, "El VIN debe tener 17 caracteres.")
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "AVAILABLE",
    "IN_ROUTE",
    "MAINTENANCE",
    "INACTIVE",
  ]),

  mileage: z.coerce
    .number()
    .int()
    .min(0, "El kilometraje no puede ser negativo."),

  fuelLevel: z.coerce
    .number()
    .int()
    .min(0, "El combustible debe estar entre 0 y 100.")
    .max(100, "El combustible debe estar entre 0 y 100."),

  driverId: z.string().optional(),
});

export type VehicleFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createVehicle(
  _previousState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  await requireAnyRole("ADMIN","SUPER_ADMIN");

  const parsed = vehicleSchema.safeParse({
    economicNumber: formData.get("economicNumber"),
    type: formData.get("type"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    color: formData.get("color"),
    plate: formData.get("plate"),
    vin: formData.get("vin"),
    status: formData.get("status"),
    mileage: formData.get("mileage"),
    fuelLevel: formData.get("fuelLevel"),
    driverId: formData.get("driverId"),
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

  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      OR: [
        { economicNumber: data.economicNumber },
        ...(data.plate ? [{ plate: data.plate }] : []),
        ...(data.vin ? [{ vin: data.vin }] : []),
      ],
    },
    select: {
      economicNumber: true,
      plate: true,
      vin: true,
    },
  });

  if (existingVehicle) {
    if (existingVehicle.economicNumber === data.economicNumber) {
      return {
        error: "Ya existe una unidad con ese número económico.",
      };
    }

    if (data.plate && existingVehicle.plate === data.plate) {
      return {
        error: "Ya existe una unidad con esas placas.",
      };
    }

    if (data.vin && existingVehicle.vin === data.vin) {
      return {
        error: "Ya existe una unidad con ese VIN.",
      };
    }
  }

  if (data.driverId) {
    const driver = await prisma.driver.findUnique({
      where: {
        id: data.driverId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!driver) {
      return {
        error: "El operador seleccionado no existe.",
      };
    }

    if (driver.status !== "ACTIVE") {
      return {
        error: "El operador seleccionado no está activo.",
      };
    }
  }

  const vehicle = await prisma.vehicle.create({
    data: {
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
      driverId: data.driverId || null,
    },
    select: {
      id: true,
      economicNumber: true,
    },
  });

  redirect(`/fleet-management/${vehicle.economicNumber}`);
}