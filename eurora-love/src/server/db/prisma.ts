import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requiredEnv } from "@/server/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: requiredEnv("DATABASE_URL"),
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
