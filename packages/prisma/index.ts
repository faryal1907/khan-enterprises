import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Global declaration to prevent multiple instances of PrismaClient in development (e.g., Next.js hot reloading)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

// Check if using Accelerate (prisma:// or prisma+postgres://)
const isAccelerate = databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://");

if (isAccelerate) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    accelerateUrl: databaseUrl,
  });
} else {
  // Direct database connection via driver adapter
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  const adapter = new PrismaPg(pool);
  
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
export * from "./generated/client";
