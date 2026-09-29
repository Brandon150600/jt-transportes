import "dotenv/config";
import readlineSync from "readline-sync";

import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

async function main(): Promise<void> {
  console.log("\n=================================");
  console.log("       JT TRANSPORTES");
  console.log("       Cambiar contraseña");
  console.log("=================================\n");

  const email = readlineSync.question("Correo exacto del usuario: ").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El correo no tiene un formato válido.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user) throw new Error(`No existe un usuario con el correo ${email}.`);

  console.log("\nCuenta encontrada:");
  console.log(`Nombre:  ${user.name ?? "Sin nombre"}`);
  console.log(`Correo:  ${user.email}`);
  console.log(`Rol:     ${user.role}`);
  console.log(`Estado:  ${user.isActive ? "Activo" : "Inactivo"}`);

  const confirmation = readlineSync.question(
    "\nEscribe CAMBIAR para cambiar la contraseña y cerrar sus sesiones: ",
  );
  if (confirmation !== "CAMBIAR") {
    console.log("\nOperación cancelada.");
    return;
  }

  const password = readlineSync.question("Nueva contraseña (mínimo 10 caracteres): ", {
    hideEchoBack: true,
  });
  if (password.length < 10) {
    throw new Error("La contraseña debe tener al menos 10 caracteres.");
  }

  const passwordConfirmation = readlineSync.question("Confirmar nueva contraseña: ", {
    hideEchoBack: true,
  });
  if (password !== passwordConfirmation) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const passwordHash = await hashPassword(password);
  const [, deletedSessions] = await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  console.log("\nContraseña actualizada correctamente.");
  console.log(`Sesiones cerradas: ${deletedSessions.count}`);
}

main()
  .catch((error: unknown) => {
    console.error("\nError:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
