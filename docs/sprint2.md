# Sprint 2 Log — Domain Correction, JWT Auth & Infrastructure Fixes

This document records every change made after Sprint 1 was finalized. Changes are grouped by concern, with the exact file modified, what changed, and why.

---

## 1. Payment Gateway Roadmap Correction

### What changed
The original payment plan used `EASYPAISA` and `HBL` as `PaymentMethod` enum values. These were replaced with the three actual gateways the business will integrate.

### Files modified

**`packages/prisma/schema.prisma`**

```prisma
// Before
enum PaymentMethod {
  CASH
  BANK_TRANSFER
  EASYPAISA
  HBL
}

// After
enum PaymentMethod {
  CASH
  BANK_TRANSFER
  SAFEPAY      // Phase 1 — Visa/Mastercard debit & credit cards
  JAZZCASH     // Phase 1 — Mobile wallet payments
  RAAST        // Phase 2 — Instant bank transfer via PayFast, zero MDR
}
```

**`packages/prisma/generated/`** — regenerated via `npm run prisma:generate`. `enums.ts` now exports `SAFEPAY`, `JAZZCASH`, `RAAST`.

**`README.md`** — Payment Gateway row in the roadmap table updated to describe the three-gateway phased plan.

**`.env`** — Added credential placeholder blocks for all three gateways:

```dotenv
# Phase 1 — Safepay (Visa/Mastercard debit & credit cards)
SAFEPAY_API_KEY=""
SAFEPAY_SECRET_KEY=""
SAFEPAY_ENVIRONMENT="sandbox"

# Phase 1 — JazzCash (Mobile wallet payments)
JAZZCASH_MERCHANT_ID=""
JAZZCASH_PASSWORD=""
JAZZCASH_INTEGRITY_SALT=""
JAZZCASH_ENVIRONMENT="sandbox"

# Phase 2 — Raast via PayFast (Instant bank transfer, zero MDR)
PAYFAST_MERCHANT_ID=""
PAYFAST_MERCHANT_KEY=""
PAYFAST_ENVIRONMENT="sandbox"
```

### Migration required
```bash
npx prisma migrate dev --name replace_payment_methods_with_gateways
```

---

## 2. Domain Correction — Branch Locations

### What changed
The seed data contained three incorrect branches: Karachi South Central, Lahore DHA Cantt, and Islamabad Blue Area. The actual business operates two locations: **Islamabad Headquarters** and **Tordher Branch**. Every reference to Karachi and Lahore was removed from the codebase.

### Files modified

**`packages/prisma/seed.ts`** — Complete rewrite of the branches section:

| Old | New |
|-----|-----|
| Karachi South Central | ❌ Removed |
| Lahore DHA Cantt | ❌ Removed |
| Islamabad Blue Area | Islamabad Headquarters (F-10 Markaz) |
| *(new)* | Tordher Branch (Main GT Road, KPK) |

**Users updated:**

| Old email | New email | Role | Branch |
|-----------|-----------|------|--------|
| `khi.manager@khan.com` | `isb.manager@khan.com` | MANAGER | Islamabad HQ |
| `lhr.manager@khan.com` | `tordher.manager@khan.com` | MANAGER | Tordher Branch |
| `khi.staff@khan.com` | `tordher.staff@khan.com` | SALES_STAFF | Tordher Branch |
| `admin@khan.com` | `admin@khan.com` | ADMIN | — (unchanged, global) |

**Bike unit branch assignments updated:**

| Unit | Old branch | New branch |
|------|-----------|-----------|
| Evee C1 Pro #1 | Karachi | Islamabad HQ |
| Evee C1 Pro #2 | Karachi | Tordher |
| Evee E5 | Karachi | Islamabad HQ |
| Evee Thunder | Lahore | Tordher |
| Evee City Rider | Islamabad | Islamabad HQ |
| Roadking RK 125 #1 | Karachi | Islamabad HQ |
| Roadking RK 150 | Lahore | Tordher |
| Roadking RK Cruiser | Islamabad | Islamabad HQ |
| Roadking RK 70 | Tordher | Tordher |
| Roadking RK 125 #2 | Islamabad | Islamabad HQ |

**Part inventory** — all records moved from Karachi to Islamabad HQ or Tordher as appropriate.

**`docs/sprint1_finalized.md`** — Seed table and sample API responses updated to reflect correct branch names.

**`docs/khan_enterprises_full_project_explained.md`** — "Branches & staff" bullet and "Seed data" paragraph updated.

---

## 3. Domain Correction — Vendors & Bike Catalog

### What changed
Honda Atlas, Yamaha Motor Pakistan, and Suzuki Motor Pakistan were replaced with the two actual vendors the dealership works with: **Evee Pakistan** (electric bikes) and **Roadking Motors** (petrol bikes).

### Files modified

**`packages/prisma/seed.ts`** — Vendors section completely replaced:

| Field | Evee Pakistan | Roadking Motors |
|-------|--------------|-----------------|
| Phone | +92 325 2292290 | +92 328 6225737 |
| Email | sales@evee.pk | contact@roadking.com.pk |
| Address | 19-KM, Baghdadi Street, Off Multan Road, Lahore | Industrial Area, Chak No. 209, Jaranwala Road, Faisalabad |

Note: `contactPerson` field left null — it is optional in the schema and was not provided.

**Bike models replaced** — 3 old models (Honda CG 125, Yamaha YBR 125G, Suzuki GR 150) replaced with 8 real models:

| Brand | Model | Year | Engine | Base Price |
|-------|-------|------|--------|-----------|
| Evee | C1 Pro | 2025 | Electric | 285,000 |
| Evee | E5 | 2025 | Electric | 195,000 |
| Evee | Thunder | 2025 | Electric | 345,000 |
| Evee | City Rider | 2024 | Electric | 165,000 |
| Roadking | RK 125 | 2025 | 125cc | 185,000 |
| Roadking | RK 150 | 2025 | 150cc | 245,000 |
| Roadking | RK Cruiser | 2024 | 250cc | 425,000 |
| Roadking | RK 70 | 2025 | 70cc | 135,000 |

**Bike units** — 4 old units replaced with 10 real serialized units (5 Evee, 5 Roadking) with real chassis/engine/serial numbers. Status distribution: 7 AVAILABLE, 2 RESERVED (48h expiry), 1 SOLD.

**Parts catalog** — 2 old generic parts replaced with 9 brand-specific parts:

| Part | SKU | Category | Price | Branch |
|------|-----|----------|-------|--------|
| Evee C1 Fast Charger | PRT-EV-C1CHG | Electrical | 8,500 | Islamabad HQ |
| Evee Lithium Battery Pack | PRT-EV-BAT5 | Electrical | 65,000 | Tordher |
| Evee LED Headlight | PRT-EV-LHD | Accessories | 4,200 | Islamabad HQ |
| Evee Floor Mat Set | PRT-EV-MAT | Accessories | 1,800 | Islamabad HQ |
| Roadking RK Oil Filter | PRT-RK-OILF | Maintenance | 650 | Islamabad HQ |
| Roadking 125cc Spark Plug | PRT-RK-SP125 | Electrical | 450 | Tordher |
| Roadking Alloy Wheel | PRT-RK-WHL150 | Mechanical | 18,500 | Islamabad HQ |
| Roadking Seat Cover | PRT-RK-SEAT | Accessories | 2,800 | Tordher |
| Roadking Chain Sprocket Kit | PRT-RK-CHAIN150 | Mechanical | 5,200 | Islamabad HQ |

**`docs/sprint1_finalized.md`** — Seed table updated to reflect new vendors, models, units, and parts counts.

---

## 4. First Database Migration

### What changed
The first migration was created and applied. Prior to this, the database had tables but no migration history — causing Prisma to detect "drift" and refuse to proceed.

### Steps taken
```bash
npx prisma migrate reset          # dropped all tables, cleared drift
npm run db:seed                   # failed — tables didn't exist yet
npx prisma migrate dev --name init  # created migrations/ folder, applied schema
npm run db:seed                   # succeeded
```

### Files created
`packages/prisma/migrations/20260530110322_init/migration.sql` — the full SQL for all 15 tables, enums, indexes, and foreign keys. This file is committed to git and represents the authoritative schema history.

---

## 5. Seed Script — Environment & Runtime Fixes

### What changed
The seed script failed with `DATABASE_URL is not defined` because `tsx seed.ts` runs outside NestJS and has no env loader. Multiple approaches were tried before landing on the correct architecture.

### Final architecture

**`packages/prisma/index.ts`** — dotenv loading **removed**. This file is a shared library module. It should be pure — NestJS and Next.js both load env vars before any module is imported, so dotenv here was redundant and caused runtime errors.

**`packages/prisma/seed.ts`** — dotenv loading **added at the top**, before any imports:

```typescript
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

import { prisma } from "./index";
```

The two `config()` calls handle both cases: running from `packages/prisma/` (loads `../../.env` = repo root) and running from the repo root (loads `.env` directly).

**`packages/prisma/package.json`** — `"main"` and `"types"` corrected:

```json
// Before
"main": "./index.ts",
"types": "./index.ts",

// After
"main": "./index.js",
"types": "./index.d.ts"
```

Pointing `main` to the TypeScript source caused Node to load `.ts` directly at runtime, which failed because Node cannot execute TypeScript natively. The compiled `index.js` (CommonJS) is the correct runtime entry point.

**`packages/prisma/seed.ts`** — also added real bcrypt password hashing to replace the old placeholder hash string:

```typescript
// Before — static placeholder
const mockPasswordHash = "$2b$10$EPf91Yu...";

// After — real bcrypt hashes
const adminPasswordHash   = await bcrypt.hash("admin123",   10);
const managerPasswordHash = await bcrypt.hash("manager123", 10);
const salesPasswordHash   = await bcrypt.hash("sales123",   10);
```

---

## 6. JWT Authentication — Full Implementation

### What changed
Complete JWT authentication system implemented from scratch. The auth module went from two unprotected read endpoints to a full login/refresh/logout/RBAC system.

### New files created

#### `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
Passport strategy that runs on every protected request. Extracts the Bearer token from the `Authorization` header, verifies the signature against `JWT_SECRET`, then hits the database to confirm the user is still `ACTIVE`. Returns `{ id, email, role, status, branchId }` which becomes `request.user`.

```typescript
export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: string;
  branchId: string | null;
}
```

#### `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`
One-liner guard that activates the JWT strategy. Add `@UseGuards(JwtAuthGuard)` to any route to require authentication.

#### `apps/api/src/modules/auth/guards/roles.guard.ts`
Reads the `@Roles()` decorator metadata from the route handler and checks `request.user.role` against the allowed roles. Must always be used after `JwtAuthGuard` (which populates `request.user`). Returns `403 Forbidden` if the role doesn't match.

#### `apps/api/src/modules/auth/decorators/roles.decorator.ts`
```typescript
@Roles('ADMIN')                    // single role
@Roles('ADMIN', 'MANAGER')         // multiple roles
```

#### `apps/api/src/modules/auth/decorators/current-user.decorator.ts`
```typescript
async me(@CurrentUser() user: Express.User) { ... }
```
Pulls `request.user` into a controller parameter cleanly.

#### `apps/api/src/modules/auth/dto/refresh.dto.ts`
Validates the refresh token body with `class-validator`. Requires `refreshToken` to be a non-empty string.

### Modified files

#### `apps/api/src/modules/auth/auth.service.ts`
Three new methods added:

**`login(dto)`**
1. Finds user by email (includes `passwordHash` in select)
2. Checks `status === "ACTIVE"`
3. Runs `bcrypt.compare(password, passwordHash)`
4. Calls `issueTokens()` — returns access + refresh token pair
5. Strips `passwordHash` from the response before returning

**`refresh(rawRefreshToken)`**
1. SHA-256 hashes the incoming token
2. Looks up the hash in `RefreshToken` table
3. Checks expiry
4. Deletes the old token (rotation — each refresh token is single-use)
5. Issues a new pair

**`logout(rawRefreshToken)`**
1. Hashes the token
2. Deletes it from `RefreshToken` table
3. Silently succeeds even if token not found (idempotent)

**Private helpers:**
- `issueTokens()` — signs the JWT with `crypto.randomBytes(64)` refresh token, stores SHA-256 hash in DB
- `hashToken()` — SHA-256 via Node's built-in `crypto` module (no extra dependency)
- `parseDurationSeconds()` — converts `"15m"`, `"7d"`, `"1h"` to seconds for `jwt.sign()`
- `parseDuration()` — same but returns milliseconds for `Date` arithmetic

**Why SHA-256 for refresh tokens?** The raw token is sent over the wire. If the database is ever compromised, attackers get hashes — not the tokens themselves. The raw token is never stored.

#### `apps/api/src/modules/auth/auth.controller.ts`
Three new endpoints added. Two existing endpoints protected:

| Route | Change |
|-------|--------|
| `POST /api/auth/login` | New — public |
| `POST /api/auth/refresh` | New — public |
| `POST /api/auth/logout` | New — public |
| `GET /api/auth/me` | New — requires `JwtAuthGuard` |
| `GET /api/auth/users` | Now protected — `JwtAuthGuard + RolesGuard + @Roles("ADMIN")` |
| `GET /api/auth/check` | Now protected — `JwtAuthGuard + RolesGuard + @Roles("ADMIN")` |

#### `apps/api/src/modules/auth/auth.module.ts`
Registered `PassportModule` and `JwtModule`. Added `JwtStrategy` as a provider. Exports `JwtAuthGuard` and `RolesGuard` so other modules can use them without re-importing `AuthModule`.

#### `apps/api/src/main.ts`
Added global `ValidationPipe`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // strips unknown fields from body
  forbidNonWhitelisted: true, // throws 400 if unknown fields are sent
  transform: true,           // auto-converts types (e.g. string "true" → boolean)
}));
```

### New dependencies installed (already in `package.json`)
- `@nestjs/jwt` — JWT signing and verification
- `@nestjs/passport` — Passport integration for NestJS
- `passport` — authentication middleware
- `passport-jwt` — JWT Passport strategy
- `bcrypt` — password hashing
- `class-validator` — DTO validation decorators
- `class-transformer` — type transformation for ValidationPipe

---

## 7. TypeScript & Build Infrastructure Fixes

Several compilation and runtime issues were resolved during the JWT implementation. Documented here in full for future reference.

### Issue 1 — `rootDir` vs monorepo path alias conflict

**Problem:** `apps/api/tsconfig.json` had `"rootDir": "./src"` but the `@khan/prisma` path alias pointed to `packages/prisma/index.ts` — a file outside `src`. TypeScript rejected this with `TS6059: File is not under rootDir`.

**Fix:** Changed the path alias to point at the compiled declaration file instead of the TypeScript source:

```jsonc
// Before
"paths": { "@khan/prisma": ["../../packages/prisma"] }

// After
"paths": { "@khan/prisma": ["../../packages/prisma/index.d.ts"] }
```

TypeScript reads types from the `.d.ts` file without pulling the source `.ts` files into the compilation. Runtime resolution uses the workspace symlink → `package.json` `"main"` → `index.js`.

### Issue 2 — Incremental build cache producing wrong output structure

**Problem:** After removing `rootDir` temporarily (to fix Issue 1 via a different approach), the incremental build cache (`tsconfig.tsbuildinfo`) recorded the broken output structure. Subsequent builds reported "0 errors" but wrote nothing to `dist/` — or wrote to a nested path like `dist/apps/api/src/main.js` instead of `dist/main.js`.

**Fix:**
1. Deleted `dist/` and `tsconfig.tsbuildinfo` manually
2. Removed `"incremental": true` from `apps/api/tsconfig.json` — watch mode doesn't benefit from incremental compilation and the cache was causing more problems than it solved

### Issue 3 — `packages/prisma/package.json` pointing to TypeScript source

**Problem:** `"main": "./index.ts"` caused Node to load the TypeScript source at runtime. Node executed it as an ES module (due to `import` statements), then tried to resolve `./generated/client` with no file extension — which ESM requires but the file doesn't have.

**Fix:** Changed to `"main": "./index.js"` and `"types": "./index.d.ts"`.

### Issue 4 — `tsconfig.base.json` path alias pointing to TypeScript source

**Problem:** Root `tsconfig.base.json` had `"@khan/prisma": ["packages/prisma/index.ts"]`. When `nest start --watch` resolved this alias via `ts-node`, it compiled `index.ts` under the root's `"module": "NodeNext"` setting (ESM), then tried to `require("./generated/client")` — which fails because you can't synchronously `require()` an ESM module in Node 24.

**Fix:** Changed to `"@khan/prisma": ["packages/prisma/index.js"]`.

### Issue 5 — dotenv in `index.ts` causing `path.resolve` TypeError

**Problem:** `index.ts` used `import path from "path"` (ESM default import). When loaded via `ts-node` in a CommonJS context without `esModuleInterop` being applied, `path` resolved to `undefined`, causing `TypeError: Cannot read properties of undefined (reading 'resolve')`.

**Fix:** Removed dotenv loading from `index.ts` entirely (see Section 5 above). The library module should never load env vars — that's the responsibility of the application entry point.

### Summary of `tsconfig` state after all fixes

**`apps/api/tsconfig.json`** (NestJS compiler):
- `module: "commonjs"` — NestJS requires CommonJS
- `rootDir: "./src"` — output structure anchored to `src/`
- `outDir: "./dist"` — compiled output goes to `dist/`
- `paths: { "@khan/prisma": ["../../packages/prisma/index.d.ts"] }` — types only, no source compilation
- `incremental` removed — prevents stale cache issues

**`tsconfig.base.json`** (shared, used by Next.js apps):
- `module: "NodeNext"` — ESM for Next.js
- `paths: { "@khan/prisma": ["packages/prisma/index.js"] }` — points to compiled CJS output

---

## 8. New Documentation Created

| File | Contents |
|------|----------|
| `docs/api_routes.md` | Complete API reference — all routes, HTTP methods, request/response shapes, curl examples, seeded credentials, planned Sprint 3+ routes |
| `docs/sprint2.md` | This file |

---

## Current Seeded Credentials

| Email | Password | Role | Branch |
|-------|----------|------|--------|
| `admin@khan.com` | `admin123` | ADMIN | — (global) |
| `isb.manager@khan.com` | `manager123` | MANAGER | Islamabad HQ |
| `tordher.manager@khan.com` | `manager123` | MANAGER | Tordher Branch |
| `tordher.staff@khan.com` | `sales123` | SALES_STAFF | Tordher Branch |

---

## Sprint 3 Backlog

- Apply `JwtAuthGuard` to inventory and branch routes
- `POST /api/offers` — submit a price offer on a bike
- `PATCH /api/offers/:id` — counter / accept / reject
- `POST /api/orders` — create order from accepted offer
- `PATCH /api/orders/:id/status` — update order lifecycle
- `POST /api/payments` — record a payment transaction
- Bike status transitions enforced in service layer (AVAILABLE → RESERVED → SOLD)
- `reservedUntil` expiry cleanup job (cron)

## 9. Postman JWT Test Suite — Ready

### What changed

A Postman collection under [`postman/collections/Khan Enterprises API/`](../postman/collections/Khan%20Enterprises%20API/) supports end-to-end testing of Sprint 2 authentication. Collection fixes applied:

| Fix | Detail |
|-----|--------|
| Login password | Body uses `admin123` (matches seed) |
| Get Me tests | Asserts `user.id` and `user.status === "ACTIVE"` (not `sub`) |
| Request order | Login → Me → Users → Check → Refresh → Logout (`order` 1000–7000) |
| Refresh test | Asserts refresh token rotation only (access JWT may match within the same second) |

The collection chains state via environment variables and collection-level Bearer auth (`{{accessToken}}`).

### Collection Structure

#### Auth (6 requests)

| Method | Route                    | Purpose                                          |
| ------ | ------------------------ | ------------------------------------------------ |
| POST   | `/api/auth/login`        | Authenticate user and save tokens to environment |
| GET    | `/api/auth/me`           | Verify JWT authentication and user payload       |
| POST   | `/api/auth/refresh`      | Rotate refresh token and issue new access token  |
| POST   | `/api/auth/logout`       | Invalidate refresh token                         |
| GET    | `/api/auth/users`        | Verify ADMIN-only access                         |
| GET    | `/api/auth/check?email=` | Verify ADMIN-only access and user lookup         |

#### Branches (2 requests)

| Method | Route               | Purpose                              |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/branches`     | Save first branch ID for later tests |
| GET    | `/api/branches/:id` | Verify branch lookup functionality   |

#### Inventory (4 requests)

| Method | Route                            | Purpose                      |
| ------ | -------------------------------- | ---------------------------- |
| GET    | `/api/inventory/bikes`           | Validate BikeUnit responses  |
| GET    | `/api/inventory/bikes?branchId=` | Verify branch filtering      |
| GET    | `/api/inventory/parts`           | Validate inventory responses |
| GET    | `/api/inventory/parts?branchId=` | Verify branch filtering      |

### Environment Variables

The collection is configured to automatically store:

* `accessToken`
* `refreshToken`
* `userId`
* `branchId`
* `bikeId`
* `productId`

These values are populated by earlier requests and reused by later requests.

### Collection-Level Authentication

Bearer authentication is configured at the collection level using:

Authorization: Bearer {{accessToken}}

This allows authenticated requests to automatically use the latest token generated by the Login request.

### Planned Validation Coverage

Each request includes automated assertions for:

* HTTP status codes
* Response shape validation
* Required field presence
* Response time (< 2000 ms)
* Environment variable extraction
* Sensitive field leakage checks
* Enum validation
* Branch-scoping validation
* Token rotation validation

### How to run in Postman

1. Start the stack (from repo root):

```bash
npm run db:up
npm run prisma:generate
npm run db:seed
npm run dev --workspace=api
```

2. In Postman, select environment **Local Development** (`baseUrl` = `http://localhost:4000`).
3. Open collection **Khan Enterprises API** → folder **Auth**.
4. **Run folder** (or run requests manually in this order):

| Step | Request | Expected |
|------|---------|----------|
| 1 | Login | 200; env vars `accessToken`, `refreshToken` set |
| 2 | Get Me | 200; user has `id`, `role`, `status` |
| 3 | List Users (Admin) | 200; `users` array, no `passwordHash` |
| 4 | Check User by Email (Admin) | 200; `exists: true` |
| 5 | Refresh Token | 200; new `refreshToken` (rotated) |
| 6 | Logout | 200; message contains `Logged out` |

5. Optional: run **Branches** and **Inventory** folders (still public routes; no JWT required).

Login, Refresh, and Logout use **noauth** at the request level so they do not send a stale Bearer token.

### Recommended full collection order

1. Auth folder (steps above)
2. GET `/api/branches` and `/api/branches/:id`
3. Inventory endpoints

### Verified (API + auth flow)

Tested against local API (`npm run dev --workspace=api`) with admin credentials:

* Login returns `accessToken`, `refreshToken`, and user profile (no `passwordHash`)
* bcrypt password verification works (`admin123`)
* JWT guard protects `/api/auth/me`
* ADMIN-only routes (`/users`, `/check`) return 200 for admin
* Refresh rotates refresh token (old refresh token rejected on reuse)
* Logout invalidates refresh token

### API runtime notes

If the API fails to start with `exports is not defined` or `DATABASE_URL` errors:

* Prisma client uses `moduleFormat = "cjs"` in [`packages/prisma/schema.prisma`](../packages/prisma/schema.prisma)
* [`apps/api/src/main.ts`](../apps/api/src/main.ts) loads root `.env` from the monorepo
* [`AuthModule`](../apps/api/src/modules/auth/auth.module.ts) registers `JwtAuthGuard` and `RolesGuard` as providers

Use `npm run dev --workspace=api` (not `node dist/main.js`) for local testing.
