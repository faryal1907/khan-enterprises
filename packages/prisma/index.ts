import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Global declaration to prevent multiple instances of PrismaClient in development (e.g., Next.js hot reloading)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

let prismaInstance: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

// Parse connection_limit from URL or default to 3 in development to prevent 
// hitting Supabase 15 connection limit across multiple developers/apps
let maxConnections = process.env.NODE_ENV === "production" ? 10 : 3;
try {
  const url = new URL(databaseUrl);
  const connectionLimit = url.searchParams.get("connection_limit");
  if (connectionLimit) {
    maxConnections = parseInt(connectionLimit, 10);
  }
} catch (e) {
  // Ignore parsing errors
}

// Check if using Accelerate (prisma:// or prisma+postgres://)
const isAccelerate = databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://");

if (isAccelerate) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    accelerateUrl: databaseUrl,
  });
} else {
  // Direct database connection via driver adapter.
  // Supabase pooler (port 6543) requires SSL — rejectUnauthorized:false trusts
  // Supabase's self-signed cert without needing a CA bundle.
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: databaseUrl,
    max: maxConnections,
    ssl: { rejectUnauthorized: false },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

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
