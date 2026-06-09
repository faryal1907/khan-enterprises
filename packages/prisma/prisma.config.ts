import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

// Load .env from root workspace since packages/prisma is nested
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
