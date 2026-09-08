import "dotenv/config";
import readlineSync from "readline-sync";

import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

const ROLES = ["EMPLOYEE", "ADMIN", "SUPER_ADMIN"] as const;

type Role = (typeof ROLES)[number];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function askRole(): Role {
  console.log("\nRoles disponibles:");
  console.log("1. EMPLOYEE");
  console.log("2. ADMIN");
  console.log("3. SUPER_ADMIN");

  const roleMap: Record<string, Role> = {
    "1": "EMPLOYEE",
    "2": "ADMIN",
    "3": "SUPER_ADMIN",
  };

  while (true) {
    const selection = readlineSync.question("\nSelecciona el rol: ");

    if (selection in roleMap) {
      return roleMap[selection];
    }

    console.log("Seleccion inválida. Elige 1, 2 o 3.");
  }
}

async function main(): Promise<void> {
  console.log("");
  console.log("=================================");
  console.log("       JT TRANSPORTES");
  console.log("       Crear usuario");
  console.log("=================================");
  console.log("");

  const name = readlineSync.question("Nombre: ").trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  const email = readlineSync
    .question("Email: ")
    .trim()
    .toLowerCase();

  if (!isValidEmail(email)) {
    throw new Error("El email no tiene un formato valido.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error(`Ya existe un usuario con el email ${email}.`);
  }

  const password = readlineSync.question("Contrasena: ", {
    hideEchoBack: true,
  });

  if (password.length < 10) {
    throw new Error(
      "La contrasena debe tener al menos 10 caracteres.",
    );
  }

  const passwordConfirmation = readlineSync.question(
    "Confirmar contrasena: ",
    {
      hideEchoBack: true,
    },
  );

  if (password !== passwordConfirmation) {
    throw new Error("Las contrasenas no coinciden.");
  }

  const role = askRole();

  if (role === "SUPER_ADMIN") {
    const confirmation = readlineSync.question(
      "\nEstas creando un SUPER_ADMIN.\n" +
        "Este usuario tendra acceso total al sistema.\n\n" +
        "Deseas continuar? (y/N): ",
    );

    if (confirmation.toLowerCase() !== "y") {
      console.log("\nOperacion cancelada.");
      return;
    }
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log("");
  console.log("=================================");
  console.log("     USUARIO CREADO");
  console.log("=================================");
  console.log("");
  console.log(`ID:      ${user.id}`);
  console.log(`Nombre:  ${user.name}`);
  console.log(`Email:   ${user.email}`);
  console.log(`Rol:     ${user.role}`);
  console.log(`Activo:  ${user.isActive ? "Si" : "No"}`);
  console.log(`Creado:  ${user.createdAt.toLocaleString()}`);
  console.log("");
}

main()
  .catch((error: unknown) => {
    console.error("");

    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });