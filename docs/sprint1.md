# 🏃‍♂️ Sprint 1 Log — Foundation & Architecture (Vibecoding Edition)

Welcome to the **Sprint 1 Operational Log** for **Khan Enterprises**. This file acts as our living sprint history, tracking the exact technical evolution, bootstrap decisions, dependency configurations, and structural changes made during this rapid interactive development cycle.

---

## 📅 Sprint Context
- **Theme:** Establishing Monorepo Foundation & Modernizing Data Access
- **Style:** Vibecoding (Rapid Iterative Feedback, Auto-Configuring, Zero Boilerplate)
- **Status:** Foundations fully active and verified 🚀

---

## 🛠️ Sprint 1 Achievements

- Basically performed everything in `setup_guide_and_troubleshooting_tips.md`.

### 1. Prisma v7 Architecture Upgrade & Modernization
We successfully upgraded the database mapping layer from a legacy setup to **Prisma v7.8.0** to comply with the latest JavaScript/WASM query compilation standards.

- **Schema Decoupling:** 
  Refactored [packages/prisma/schema.prisma](file:///c:/Users/Laptop/Desktop/khan-enterprises/packages/prisma/schema.prisma) by removing the deprecated and unsupported `url` property from the `datasource` block. The schema is now 100% focused on pure domain modeling.
- **Relational Integrity Resolutions:**
  Fixed a critical duplicate field validation bug in the production schema where `branches` was defined twice under the `User` model. Correctly mapped the reverse relation for `BranchManager` under `managedBranches Branch[] @relation("BranchManager")` to ensure 100% stable ORM mapping compiler compliance.
- **Centralized Configuration:** 
  Created root-level and package-level `prisma.config.ts` configuration files that automatically resolve your environment using `dotenv`, ensuring migration commands run flawlessly.
- **Custom Client Compiler & Outputs:** 
  Updated the generator inside `schema.prisma` to use the v7 `prisma-client` compiler, routing outputs to `./generated` within the workspace package.
- **Enterprise Database Client wrapper:**
  Designed and wrote a production-ready client instantiation wrapper inside [packages/prisma/index.ts](file:///c:/Users/Laptop/Desktop/khan-enterprises/packages/prisma/index.ts). It automatically:
  - Detects if you're running locally and instantiates the PostgreSQL pool driver adapter (`@prisma/adapter-pg` + `pg`).
  - Detects if you're using **Prisma Accelerate** in production (`prisma://`) and initializes the serverless engine seamlessly.
  - Mitigates NestJS/Next.js hot-reload development leakage by keeping a singleton instance inside `globalThis`.
- **Monorepo Path Resolution:**
  Registered `@khan/prisma` inside the root [tsconfig.base.json](file:///c:/Users/Laptop/Desktop/khan-enterprises/tsconfig.base.json) and package scripts, allowing instant database imports across any workspace apps:
  ```typescript
  import { prisma } from "@khan/prisma";
  ```

---

### 2. Parallel Port Collision Resolution
Previously, the Next.js apps defaulted to Port 3000, causing Turborepo parallel executions to clash. 

We locked the frontend servers into their correct documented endpoints:
- **Customer Frontend (`apps/web`)** ➔ Explicitly bound to **Port 3000** (`next dev -p 3000`).
- **Admin ERP Dashboard (`apps/admin`)** ➔ Explicitly bound to **Port 3001** (`next dev -p 3001`).

---

### 3. NestJS Backend Core API Bootstrap (Port 4000)
We successfully bootstrapped a highly professional, decoupled NestJS server inside `apps/api` mapped directly into the workspaces.

- **Workspace Integration:** 
  Created a custom TS config `tsconfig.json` and `nest-cli.json` to handle ESM compilations and decorator metadata emit, linking the local `@khan/prisma` package inside the workspace package graph.
- **Enterprise Core App:**
  Set up `main.ts` and `app.module.ts` to boot the application on **Port 4000** with **CORS** enabled, enabling secure integrations from our Next.js portals.
- **Global Prisma Injection Module:**
  Established a global NestJS `PrismaModule` and `PrismaService` which exposes our customized `@khan/prisma` client singleton, allowing real-time database transactions with zero redundant connection leaks.
- **Bootstrapped Feature Modules:**
  - **Auth Module:** Exposes query validation controllers checking registered users inside our relational tables: `GET /auth/check?email=...`.
  - **Inventory Module:** Integrates data retrieval services fetching unique serialized motorcycle units (`BikeUnit`) and stock accessories (`PartInventory`): `GET /inventory/bikes` and `GET /inventory/parts`.
- **Zero-Error Dev Compilation:**
  Ran npm installations and proved compilation stability with `npm run build --workspace=api`, building successfully with **0 compilation errors**!

---

## 📐 Current Monorepo State

```
khan-enterprises/
├── apps/
│   ├── web/                  # Next.js Customer App (Port 3000) - Ready 🟢
│   ├── admin/                # Next.js ERP Dashboard (Port 3001) - Ready 🟢
│   └── api/                  # NestJS API (Port 4000) - Ready & Connected 🟢
├── packages/
│   ├── prisma/               # Prisma v7 ORM & Client exports - Ready 🟢
│   ├── ui/                   # Shared UI kit - Skeleton ⚪
│   ├── types/                # Shared Types - Skeleton ⚪
│   └── utils/                # Shared Utils - Skeleton ⚪
└── prisma.config.ts          # Central CLI migrations config
```

---

## 📝 Running Workspace Operations

Whenever you make database updates during this vibecoding session, use these standard commands:

| Task | Command | Scope |
| :--- | :--- | :--- |
| **Run Development Servers** | `npm run dev` | Global (Starts Web, Admin, and API on Port 4000) |
| **Re-compile Prisma Schema**| `npm run prisma:generate` | Global (Rebuilds types and client queries) |
| **Create DB Migrations**    | `npx prisma migrate dev --name <migration_name>` | From `packages/prisma` |
| **Inspect DB Instance**     | Access pgAdmin 4 | `http://localhost:8080` (admin@khan.com / admin) |

---

## 🔮 Sprint 1 Next Steps (Backlog)

1. **Bootstrap backend Core API (`apps/api`):** [COMPLETED ✅]
   - Initialized a NestJS architecture bound to Port 4000.
   - Fully integrated `@khan/prisma` database module.
   - Established modular directory structures for Auth and Serialized/Parts Inventory queries.
2. **First Database Seed:**
   - Write a seed script inside `packages/prisma` to pre-populate branches, default user accounts (Customer, CEO, Staff), and mock serialized bikes.
