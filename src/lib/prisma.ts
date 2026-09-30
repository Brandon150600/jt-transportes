import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type CurrentModelDelegates = PrismaClient & {
  fleetExpense?: unknown;
  supplier?: unknown;
  expenseItem?: unknown;
  client?: unknown;
  clientAddress?: unknown;
  trip?: unknown;
  notification?: unknown;
  notificationRead?: unknown;
};

const cachedPrisma = globalForPrisma.prisma as CurrentModelDelegates | undefined;
const hasCurrentSchema = Boolean(
  cachedPrisma?.fleetExpense && cachedPrisma.supplier && cachedPrisma.expenseItem &&
  cachedPrisma.client && cachedPrisma.clientAddress && cachedPrisma.trip &&
  cachedPrisma.notification && cachedPrisma.notificationRead,
);

export const prisma: PrismaClient = hasCurrentSchema && cachedPrisma
  ? cachedPrisma
  : new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
