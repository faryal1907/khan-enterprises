# Sprint 1 Finalized — Foundation & Architecture

This document is the definitive reference for everything built and verified during Sprint 1. It covers the full monorepo structure, every implemented API endpoint, how to start the stack, and how to test each piece.

---

## Monorepo Structure

```
khan-enterprises/
├── apps/
│   ├── web/              # Next.js customer-facing app   → Port 3000
│   ├── admin/            # Next.js ERP dashboard          → Port 3001
│   └── api/              # NestJS REST API                → Port 4000
├── packages/
│   └── prisma/           # Shared Prisma v7 ORM package (@khan/prisma)
├── docker/
│   └── docker-compose.yml
├── prisma.config.ts      # Root-level Prisma CLI config
├── tsconfig.base.json    # Shared TS paths (@khan/prisma, etc.)
└── .env                  # Environment variables (see below)
```

---

## Environment Variables

All variables live in the root `.env` file.

| Variable               | Description                              | Default (local)                                              |
| :--------------------- | :--------------------------------------- | :----------------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string             | `postgresql://postgres:postgres@localhost:5435/khan_db`      |
| `JWT_SECRET`           | Access token signing secret              | `super-secret-development-hash-key-value-12345`              |
| `JWT_REFRESH_SECRET`   | Refresh token signing secret             | `another-equally-secure-secret-key-development`              |
| `JWT_EXPIRE`           | Access token TTL                         | `15m`                                                        |
| `JWT_REFRESH_EXPIRE`   | Refresh token TTL                        | `7d`                                                         |
| `CLOUDINARY_URL`       | File storage (mock during Phase 1 & 2)   | placeholder                                                  |

---

## 1. Database — Docker + Postgres

### Start / stop

```bash
# Start Postgres + pgAdmin in the background
npm run db:up

# Stop and remove containers
npm run db:down
```

| Service  | Host              | Credentials                          |
| :------- | :---------------- | :----------------------------------- |
| Postgres | `localhost:5435`  | user: `postgres` / pass: `postgres`  |
| pgAdmin  | `localhost:8080`  | email: `admin@khan.com` / pass: `admin` |

### Run migrations

```bash
# From repo root — creates/applies migrations against the local DB
npx prisma migrate dev --name <migration_name>
```

> Prisma CLI reads `prisma.config.ts` at the root, which points to `packages/prisma/schema.prisma` and loads `DATABASE_URL` from `.env`.

### Regenerate the Prisma client

```bash
npm run prisma:generate
```

---

## 2. Database Schema — Key Models

Defined in `packages/prisma/schema.prisma`. Full production schema with 15 models.

| Model                | Purpose                                                  |
| :------------------- | :------------------------------------------------------- |
| `User`               | Staff accounts (ADMIN, MANAGER, SALES_STAFF)             |
| `RefreshToken`       | JWT refresh token store                                  |
| `Branch`             | Physical dealership locations                            |
| `Vendor`             | Motorcycle manufacturers / suppliers                     |
| `BikeModel`          | Catalog of motorcycle models (brand, specs, base price)  |
| `BikeUnit`           | Individual serialized units (chassis/engine numbers)     |
| `Part`               | Parts & accessories catalog                              |
| `PartInventory`      | Per-branch stock levels for each part                    |
| `StockMovement`      | Audit trail for inventory changes                        |
| `Offer`              | Customer price negotiation records                       |
| `Order`              | Confirmed sales orders                                   |
| `PaymentTransaction` | Payment records linked to orders                         |
| `DeliveryRequest`    | Delivery scheduling and status tracking                  |
| `Document`           | File attachments (invoices, warranties, receipts)        |
| `AuditLog`           | System-wide action audit trail                           |

---

## 3. Database Seed

Seeds branches, users, vendors, bike models, serialized bike units, and parts inventory with realistic Pakistani dealership data.

### Run the seed

```bash
# From repo root
npm run db:seed

# Or using Prisma CLI directly
npx prisma db seed
```

### What gets seeded

| Entity        | Records                                                                 |
| :------------ | :---------------------------------------------------------------------- |
| Branches      | Islamabad Headquarters, Tordher Branch                                  |
| Users         | 1 ADMIN (`admin@khan.com`), 2 MANAGERs, 1 SALES_STAFF                  |
| Vendors       | Evee Pakistan, Roadking Motors                                          |
| Bike Models   | Evee: C1 Pro, E5, Thunder, City Rider — Roadking: RK 125, RK 150, RK Cruiser, RK 70 |
| Bike Units    | 10 serialized units (7 AVAILABLE, 2 RESERVED, 1 SOLD)                  |
| Parts         | 9 parts (Evee + Roadking) with stock split across Islamabad HQ and Tordher |

> All seeded user passwords are placeholder bcrypt hashes. Real auth is a Sprint 2 concern.

---

## 4. NestJS API — `apps/api`

Runs on **Port 4000**. All routes are prefixed with `/api`. CORS is open to `localhost:3000` and `localhost:3001`.

### Start the API

```bash
# Development (watch mode) — run manually in a terminal
npm run dev --workspace=api

# Or from repo root via Turborepo (starts all apps)
npm run dev
```

### Global Prisma injection

`PrismaModule` is registered as `@Global()` in `app.module.ts`. Every feature module gets `PrismaService` injected automatically — no need to import `PrismaModule` per-module.

`PrismaService` exposes the shared `@khan/prisma` singleton via `this.prisma.client`.

---

## 5. API Endpoints

### Auth — `/api/auth`

| Method | Route                        | Description                                      |
| :----- | :--------------------------- | :----------------------------------------------- |
| GET    | `/api/auth/check?email=`     | Verify a user exists by email                    |
| GET    | `/api/auth/users`            | List all staff users (for admin dashboard)       |

**Test examples:**

```bash
# Check if a user exists
curl "http://localhost:4000/api/auth/check?email=admin@khan.com"

# List all users
curl "http://localhost:4000/api/auth/users"
```

**Sample response — `/api/auth/check`:**
```json
{
  "exists": true,
  "user": {
    "id": "...",
    "email": "admin@khan.com",
    "fullName": "Muhammad Ali Khan",
    "role": "ADMIN",
    "status": "ACTIVE",
    "branch": null
  }
}
```

---

### Inventory — `/api/inventory`

| Method | Route                              | Description                                          |
| :----- | :--------------------------------- | :--------------------------------------------------- |
| GET    | `/api/inventory/bikes`             | All serialized bike units                            |
| GET    | `/api/inventory/bikes?branchId=`   | Bike units filtered by branch                        |
| GET    | `/api/inventory/parts`             | All parts inventory records                          |
| GET    | `/api/inventory/parts?branchId=`   | Parts inventory filtered by branch                   |

**Test examples:**

```bash
# All bikes
curl "http://localhost:4000/api/inventory/bikes"

# Bikes at a specific branch
curl "http://localhost:4000/api/inventory/bikes?branchId=<branch-uuid>"

# All parts
curl "http://localhost:4000/api/inventory/parts"
```

**Sample response — `/api/inventory/bikes`:**
```json
{
  "count": 4,
  "bikes": [
    {
      "id": "...",
      "chassisNumber": "EVC1P-2025-78492",
      "engineNumber": "EMOT-78492-EV25",
      "serialNumber": "SR-EV-C1P-001",
      "status": "AVAILABLE",
      "model": { "brand": "Evee", "modelName": "C1 Pro", "basePrice": "285000.00" },
      "vendor": { "name": "Evee Pakistan" },
      "branch": { "name": "Islamabad Headquarters", "city": "Islamabad" }
    }
  ]
}
```

---

### Branches — `/api/branches`

| Method | Route                  | Description                                              |
| :----- | :--------------------- | :------------------------------------------------------- |
| GET    | `/api/branches`        | All branches with manager info and inventory counts      |
| GET    | `/api/branches/:id`    | Single branch with full staff list and inventory counts  |

**Test examples:**

```bash
# All branches
curl "http://localhost:4000/api/branches"

# Single branch (use a UUID from the list above)
curl "http://localhost:4000/api/branches/<branch-uuid>"
```

**Sample response — `/api/branches`:**
```json
{
  "count": 3,
  "branches": [
    {
      "id": "...",
      "name": "Islamabad Headquarters",
      "city": "Islamabad",
      "address": "Plot 12, Street 4, F-10 Markaz, Islamabad",
      "manager": null,
      "_count": { "users": 0, "bikeInventory": 1, "partInventory": 0 }
    }
  ]
}
```

---

## 6. Frontend Apps

Both are default Next.js scaffolds at this stage — no feature UI yet. Ports are locked.

| App     | URL                     | Notes                        |
| :------ | :---------------------- | :--------------------------- |
| `web`   | `http://localhost:3000` | Customer-facing storefront   |
| `admin` | `http://localhost:3001` | ERP / staff dashboard        |

```bash
# Start all apps together
npm run dev
```

---

## 7. Full Stack Startup Sequence

Run these in order when starting fresh:

```bash
# 1. Start the database
npm run db:up

# 2. Apply migrations (first time or after schema changes)
npx prisma migrate dev --name init

# 3. Regenerate the Prisma client
npm run prisma:generate

# 4. Seed the database
npm run db:seed

# 5. Start all dev servers (run manually in a terminal)
npm run dev
```

After step 5, the following are live:

| Service  | URL                          |
| :------- | :--------------------------- |
| API      | `http://localhost:4000/api`  |
| Web app  | `http://localhost:3000`      |
| Admin    | `http://localhost:3001`      |
| pgAdmin  | `http://localhost:8080`      |

---

## 8. Postman Collection

A Postman resource file is available at `.postman/resources.yaml` for importing the API collection.

---

## Sprint 2 Backlog

- JWT authentication (login, token refresh, logout) using the existing `RefreshToken` model and JWT env vars
- Role-based access guards on API routes
- Offer / negotiation endpoints (`POST /offers`, `PATCH /offers/:id`)
- Order creation and payment recording
- Admin and customer UI implementation
- Shared `packages/ui`, `packages/types`, `packages/utils` — currently empty skeletons
