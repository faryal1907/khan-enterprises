import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

// Load .env.local first so local credentials override placeholder values in .env
dotenv.config({ path: path.resolve(process.cwd(), "../../apps/web/.env.local") });
dotenv.config({ path: path.resolve(process.cwd(), "../../apps/admin/.env.local") });
// Fallback to root .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    seed: "tsx seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
