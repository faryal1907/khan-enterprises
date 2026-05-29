# 🚀 Prisma v7 Migration Guide — Database Configuration & Connections

This guide explains why the `url` property is no longer supported in Prisma schema files, what changes have been made to your project, and how to instantiate the new **Prisma Client** using a driver adapter for direct PostgreSQL connections.

---

## 🔍 Understanding the Prisma v7 Change

In previous Prisma versions, your database connection string was managed directly within `schema.prisma` inside the `datasource` block:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // ❌ DEPRECATED & REMOVED IN PRISMA v7
}
```

### Why has this changed?
1. **Separation of Concerns:** The `.prisma` schema file is now solely responsible for defining the database structure, relations, and data models. Settings such as migration directories, connection URLs, and custom seed scripts have moved to a centralized TypeScript/JavaScript file (`prisma.config.ts`).
2. **Pure TypeScript/WASM Compiler Engine:** Prisma has replaced its monolithic Rust-based query engine with a lightweight JavaScript/WASM query compiler. Because of this, it no longer supports native driver connections out of the box. Instead, you must explicitly use a **driver adapter** (like `@prisma/adapter-pg` + `pg` for PostgreSQL) or **Prisma Accelerate** (`accelerateUrl`) inside the application code when creating the `PrismaClient` instance.

---

## 🛠️ Actions Taken

We have successfully performed the necessary configuration updates to migrate your setup to Prisma v7:

### 1. Updated Schema File
We modified [schema.prisma](file:///c:/Users/Laptop/Desktop/khan-enterprises/packages/prisma/schema.prisma) to:
- Remove the deprecated `url` property from the `datasource db` block.
- Update the generator provider to `prisma-client` (Prisma v7 standard).
- Set an explicit `output = "./dist"` to compile the generated client directly into your `@khan/prisma` package's distribution folder.

### 2. Created Configuration Files
We created two config files to support Prisma CLI commands (migrations, schema validation, and db pushes) from either the project root or the package folder:
- **Root-level:** [prisma.config.ts](file:///c:/Users/Laptop/Desktop/khan-enterprises/prisma.config.ts)
- **Package-level:** [packages/prisma/prisma.config.ts](file:///c:/Users/Laptop/Desktop/khan-enterprises/packages/prisma/prisma.config.ts)

They utilize `dotenv` to load your environment variables automatically:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "packages/prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## 📋 What You Need To Do Next

To fully initialize the runtime connections, follow these steps to install the driver adapters and instantiate the client in your application.

### Step 1: Install Driver Dependencies
Run the following command in your terminal to install the PostgreSQL driver and Prisma adapter packages:

```bash
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

### Step 2: Instantiate the client
When connecting your apps (such as Next.js or NestJS) to the database, instantiate `PrismaClient` using the PostgreSQL pool adapter:

```typescript
import { PrismaClient } from "@khan/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Create a pg connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Wrap the pool in the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Initialize PrismaClient with the adapter
export const prisma = new PrismaClient({ adapter });
```

> [!NOTE]
> If you are using **Prisma Accelerate** (connection pooling via `prisma://` or `prisma+postgres://` protocol), you do **not** need a driver adapter. Instead, instantiate the client like this:
> ```typescript
> import { PrismaClient } from "@khan/prisma";
> 
> export const prisma = new PrismaClient({
>   accelerateUrl: process.env.DATABASE_URL,
> });
> ```

> [!IMPORTANT]
> Since the client's output is set to `./dist`, running `npx prisma generate` will build the client directly inside `@khan/prisma/dist`. You can import it seamlessly in other packages using:
> `import { PrismaClient } from "@khan/prisma";`
