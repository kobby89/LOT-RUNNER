import { PrismaClient } from "@prisma/client";

// Prevents hot-reload in dev from spawning a new PrismaClient (and a new
// DB connection pool) on every file save.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
