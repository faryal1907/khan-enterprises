# Sprint 4 & 5 — Implementation Plan
**Khan Enterprises Platform**
_Generated from codebase audit · 2026-06-05_

---

## Audit Summary

Before planning, the full codebase was reviewed. The table below is the honest state of things:

| Layer | What exists | Gap |
|---|---|---|
| **Prisma schema** | All models complete: `BikeUnit`, `BikeModel`, `Vendor`, `Part`, `PartInventory`, `StockMovement`, `Document`, `AuditLog`, all enums | ⚠️ Admin/web pages use `DAMAGED`, `MAINTENANCE` statuses that **don't exist** in the schema — schema only has `AVAILABLE`, `RESERVED`, `SOLD`, `IN_DELIVERY` |
| **Backend** | `GET /inventory/bikes` (branchId only) · `GET /inventory/parts` (branchId only) | All write endpoints, multi-filter, document upload, Cloudinary, stock adjustment, role guards — **all missing** |
| **Admin — bikes** | UI shells exist: list page, `new/`, `[id]/` — all with correct layout & modals | **Zero API wiring** · all data shows `—` · file upload is a static placeholder div · dropdowns hardcoded with fake IDs |
| **Admin — parts** | UI shells exist: list page, `new/`, `[id]/`, `[id]/edit/` | **Zero API wiring** · low-stock logic only visual placeholder · stock movement table empty |
| **Web (customer)** | Home page + login only | **Entire Sprint 5 is missing** |

---

## ⚠️ Pre-Work: Schema Enum Fix (Do First)

The admin UI currently references `DAMAGED` and `MAINTENANCE` as bike statuses. The actual Prisma schema defines:

```
AVAILABLE · RESERVED · SOLD · IN_DELIVERY
```

**Decision required before writing any API code:**

- **Option A** — Add `DAMAGED` and `MAINTENANCE` to the `BikeStatus` enum in the schema and run a migration.
- **Option B** — Fix the admin UI pages to only use the 4 enum values that exist.

> [!IMPORTANT]
> Whichever option you choose, it must be resolved before Sprint 4 backend work begins, or your DTOs and API responses will be inconsistent with the frontend.

---

## Sprint 4 — Inventory System

### Phase 1 · Backend (NestJS API)

#### 1.1 DTOs — Create all missing DTOs

**File:** `apps/api/src/modules/inventory/dto/`

These don't exist at all yet. Create:

| DTO file | Fields |
|---|---|
| `create-bike-unit.dto.ts` | `chassisNumber`, `engineNumber`, `branchId`, `modelId`, `vendorId`, `serialNumber?` |
| `query-bikes.dto.ts` | `branchId?`, `status?`, `modelId?`, `vendorId?`, `search?`, `page?`, `limit?` |
| `update-bike-status.dto.ts` | `status` (enum: BikeStatus) |
| `transfer-bike.dto.ts` | `branchId` (target branch UUID) |
| `create-part.dto.ts` | `name`, `sku`, `category`, `description?`, `sellingPrice`, `branchId`, `quantity`, `reorderLevel` |
| `update-part.dto.ts` | All fields optional (Partial) |
| `adjust-stock.dto.ts` | `quantity` (signed int), `movementType` (InventoryMovementType enum), `reason?` |
| `attach-document.dto.ts` | `fileUrl`, `fileName`, `mimeType`, `fileSize`, `fileType` (FileType enum) |

Use `class-validator` decorators (`@IsString()`, `@IsUUID()`, `@IsEnum()`, etc.) on all DTOs.

---

#### 1.2 Extend InventoryService — Bike Methods

**File:** `apps/api/src/modules/inventory/inventory.service.ts`

Add the following methods (service currently only has `getAllBikes` and `getAllParts`):

```
getAllBikes(query: QueryBikesDto)      ← extend existing to support status/modelId/vendorId/search + pagination
getBikeById(id: string)               ← fetch single unit with documents[]
createBike(dto: CreateBikeUnitDto)    ← create BikeUnit, status defaults to AVAILABLE
updateBikeStatus(id, dto)             ← PATCH status only
transferBike(id, dto)                 ← PATCH branchId
attachDocument(bikeId, dto, userId)   ← create Document record linked to BikeUnit
```

Key implementation notes:
- `getBikeById` must `include: { documents: true, model: true, vendor: true, branch: true }`
- `createBike` must verify `chassisNumber` and `engineNumber` uniqueness and return a `409` if duplicated
- `transferBike` should be an `ADMIN` only operation

---

#### 1.3 Extend InventoryService — Parts Methods

Add to the same service:

```
createPart(dto: CreatePartDto)                 ← creates Part + PartInventory in a transaction
getPartById(id: string)                        ← Part + PartInventory records per branch
updatePart(id, dto: UpdatePartDto)             ← update Part metadata (name, sku, price, etc.)
adjustStock(inventoryId, dto, userId)          ← update quantity + create StockMovement log
getStockMovements(inventoryId, page, limit)    ← paginated movement history
getLowStockItems(branchId?)                    ← PartInventory where quantity < reorderLevel
getBranchStockView(partId)                     ← all PartInventory rows for a given Part
```

Key implementation notes:
- `createPart` must create both `Part` and `PartInventory` atomically using `prisma.$transaction()`
- `adjustStock` must update `quantity` by the signed delta AND create a `StockMovement` record with `performedById`, `reason`, and `movementType` — all in one transaction
- `getLowStockItems` returns `PartInventory` rows where `quantity < reorderLevel`

---

#### 1.4 Update InventoryController

**File:** `apps/api/src/modules/inventory/inventory.controller.ts`

Add all new routes and apply guards. Full required route map:

```
# Bikes
POST   /inventory/bikes                        @Roles(ADMIN)
GET    /inventory/bikes                        (all authenticated — extend filters)
GET    /inventory/bikes/:id                    (all authenticated)
PATCH  /inventory/bikes/:id/status             @Roles(ADMIN, MANAGER)
PATCH  /inventory/bikes/:id/branch             @Roles(ADMIN)
POST   /inventory/bikes/:id/documents          @Roles(ADMIN)

# Parts
POST   /inventory/parts                        @Roles(ADMIN, MANAGER)
GET    /inventory/parts                        (all authenticated — extend filters)
GET    /inventory/parts/:id                    (all authenticated)
PUT    /inventory/parts/:id                    @Roles(ADMIN, MANAGER)
GET    /inventory/parts/low-stock              @Roles(ADMIN, MANAGER)
GET    /inventory/parts/:id/branch-stock       (all authenticated)

# Stock Movements
POST   /inventory/parts/:inventoryId/adjust-stock   @Roles(ADMIN, MANAGER)
GET    /inventory/parts/:inventoryId/movements      (all authenticated)
```

> [!NOTE]
> Check `apps/api/src/modules/auth/guards/` for the existing `RolesGuard` and `@Roles()` decorator from Sprint 1/2 before creating new ones.

---

#### 1.5 Upload Module (Cloudinary)

This module is **entirely missing**. Create from scratch:

**Files to create:**
```
apps/api/src/modules/upload/
├── upload.module.ts
├── upload.service.ts       ← Cloudinary SDK wrapper
└── upload.controller.ts    ← POST /upload endpoint
```

**Steps:**
1. Install: `npm install cloudinary multer @types/multer` in `apps/api`
2. Add env vars to root `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
3. `UploadService.uploadFile(buffer, folder, mimeType)` → returns `{ url, publicId }`
4. `POST /upload` accepts `multipart/form-data` with a `file` field, validates MIME type (PDF, images only), enforces 10MB max size, uploads to Cloudinary, returns `{ fileUrl, publicId, fileName, fileSize, mimeType }`
5. Register `UploadModule` in `AppModule`

---

#### 1.6 Reference Data Endpoints (Needed for Dropdowns)

The admin forms hardcode branch/model/vendor options. The API needs to expose them:

```
GET /branches          ← already exists (check branch module)
GET /vendors           ← check if it exists; create if not
GET /bike-models       ← check if it exists; create if not
```

These are simple read-only list endpoints — add to their respective modules if missing.

---

### Phase 2 · Admin Frontend — Wire Up Existing UI Shells

All pages exist with correct structure. The work here is **purely API integration** — no layout changes needed.

#### 2.1 Add Shared Types

**File:** `apps/admin/lib/types.ts` — extend with:

```typescript
interface BikeUnit { id, chassisNumber, engineNumber, serialNumber, status, model, vendor, branch, documents, createdAt }
interface BikeModel { id, brand, modelName, year, engineCapacity, color, basePrice }
interface Vendor { id, name }
interface Document { id, fileName, fileUrl, mimeType, fileSize, fileType, createdAt }
interface Part { id, name, sku, category, sellingPrice, description }
interface PartInventory { id, quantity, reservedQuantity, reorderLevel, part, branch, updatedAt }
interface StockMovement { id, movementType, quantity, reason, performedBy, createdAt }
```

---

#### 2.2 Add API Call Functions

**File:** `apps/admin/lib/api/inventory.ts` _(create new file)_

```typescript
// Bikes
getBikes(params)            → GET /inventory/bikes?...
getBikeById(id)             → GET /inventory/bikes/:id
createBike(data)            → POST /inventory/bikes
updateBikeStatus(id, s)     → PATCH /inventory/bikes/:id/status
transferBike(id, branchId)  → PATCH /inventory/bikes/:id/branch
attachDocument(bikeId, d)   → POST /inventory/bikes/:id/documents

// Parts
getParts(params)                → GET /inventory/parts?...
getPartById(id)                 → GET /inventory/parts/:id
createPart(data)                → POST /inventory/parts
updatePart(id, data)            → PUT /inventory/parts/:id
adjustStock(invId, data)        → POST /inventory/parts/:invId/adjust-stock
getStockMovements(invId, page)  → GET /inventory/parts/:invId/movements
getLowStockItems(branchId?)     → GET /inventory/parts/low-stock

// Upload
uploadFile(file: File)          → POST /upload (multipart/form-data)

// Reference data
getBranches()    → GET /branches
getVendors()     → GET /vendors
getBikeModels()  → GET /bike-models
```

---

#### 2.3 Wire Up Bikes List (`/bikes/page.tsx`)

- On mount: fetch branches, models, vendors → populate dropdown options (remove hardcoded values)
- On mount + filter change: call `getBikes(filters)` → render rows
- Summary cards: compute counts from API response (`total`, `available`, `reserved`, `sold`)
- Transfer modal: on submit call `transferBike(id, branchId)` → show success toast → refetch list
- Status modal: on submit call `updateBikeStatus(id, status)` → show success toast → refetch list
- Add loading skeleton and empty state

---

#### 2.4 Wire Up Add Bike Form (`/bikes/new/page.tsx`)

- On mount: fetch branches, models, vendors → populate selects
- Add `useState` for all form fields
- File drop zones: replace placeholder divs with functional file upload:
  - On file drop/select → call `uploadFile(file)` → store returned `fileUrl` in state
  - Show file name + size after successful upload; show progress indicator during upload
- On form submit: call `createBike(...)` then `attachDocument` for each uploaded file
- Validate required fields before submit
- On success: redirect to `/bikes`

---

#### 2.5 Wire Up Bike Detail (`/bikes/[id]/page.tsx`)

- On mount: call `getBikeById(params.id)` → populate all `—` fields
- Documents section: render actual `documents[]` from API with download link (`fileUrl`)
- **Status History table** — there is no `BikeStatusHistory` model in the schema. Replace with AuditLog entries filtered by `entityId = bikeId` and `action = UPDATE`, OR remove this section for now
- **Transfer History table** — same issue. Replace with AuditLog entries or remove

---

#### 2.6 Wire Up Parts List (`/parts/page.tsx`)

- On mount: fetch branches → populate branch dropdown
- On mount + filter change: call `getParts(filters)` → render rows
- Low-stock highlight: rows where `quantity < reorderLevel` get an amber background/badge on the quantity cell
- Summary cards: compute from API response
- Adjust modal: on submit call `adjustStock(inventoryId, { quantity, movementType, reason })` → refetch
- Transfer Stock modal: call `adjustStock` twice — `STOCK_OUT` on source, `STOCK_IN` on destination
- Add loading state and empty state

---

#### 2.7 Wire Up Add Part Form (`/parts/new/page.tsx`)

- On mount: fetch branches → populate branch select
- Add `useState` for all fields
- On submit: call `createPart(dto)` → redirect to `/parts`
- Validate: quantity ≥ 0, reorder level > 0, SKU uniqueness enforced server-side (API returns 409)

---

#### 2.8 Wire Up Part Detail (`/parts/[id]/page.tsx`)

- On mount: call `getPartById(id)` → show part metadata and per-branch inventory
- Stock Movements table: call `getStockMovements(inventoryId)` → render paginated history
- Inline Adjust Stock form on this page

---

#### 2.9 Wire Up Edit Part (`/parts/[id]/edit/page.tsx`)

- On mount: pre-populate form with existing part data from `getPartById`
- On submit: call `updatePart(id, dto)`

---

### Phase 3 · Schema Fix & Migration

If the team decides to add `DAMAGED` and `MAINTENANCE` to `BikeStatus`:

```prisma
enum BikeStatus {
  AVAILABLE
  RESERVED
  SOLD
  IN_DELIVERY
  DAMAGED       // add
  MAINTENANCE   // add
}
```

Run: `npx prisma migrate dev --name add-bike-status-values`

If NOT, update all admin pages to remove those options from the status dropdowns.

---

### Phase 4 · Low-Stock Alert System

The schema has `reorderLevel` on `PartInventory` but there is no alerting layer yet.

**Minimum viable approach (no background job):**
- `GET /inventory/parts/low-stock` is the "alert" — wire the "Low Stock Items" summary card to its count
- In the parts list, highlight rows where `quantity < reorderLevel` with an amber background or badge

**Optional enhancement:**
- Add count badge to "Parts" link in the admin sidebar navigation
- Add a dedicated alert banner at the top of the parts list page

---

## Sprint 5 — Customer-Facing Product Catalog (`apps/web`)

Sprint 5 is **entirely new work** — the web app currently only has a home page and login.

### Phase 1 · Backend — Public Catalog Endpoints

These endpoints must be **unauthenticated** (no JWT guard):

```
GET /catalog/bikes                ← list: filters for modelId, priceMin, priceMax, branchId; always status=AVAILABLE
GET /catalog/bikes/:id            ← detail: specs, price, branch, public-safe documents only
GET /catalog/parts                ← list: filters for category, search
GET /catalog/parts/:id            ← part detail with per-branch stock
GET /catalog/search?q=            ← search across bikes (modelName, brand) and parts (name, sku)
```

**Public document rule:** `GET /catalog/bikes/:id` must only return documents where `fileType = REGISTRATION_DOCUMENT`. Supplier invoices and warranty docs must never be exposed.

Create a new `CatalogModule` in `apps/api/src/modules/catalog/` rather than reusing `InventoryModule` — this keeps the public/private boundary explicit.

---

### Phase 2 · Web App Pages

#### 5.1 Shared Layout & Navigation

**File:** `apps/web/app/layout.tsx` — add navigation with:
- Logo / brand
- "Bikes" link → `/bikes`
- "Parts & Accessories" link → `/parts`
- Search bar (global, submits to `/search?q=`)

**File:** `apps/web/components/navigation.tsx` — currently minimal, expand it.

---

#### 5.2 Bike Listing Page (`/bikes`)

**File:** `apps/web/app/bikes/page.tsx` _(create)_

- Fetch `GET /catalog/bikes` with query params from filter state
- Filter panel:
  - **Model** — dropdown (fetch `/bike-models`)
  - **Price range** — min/max numeric inputs
  - **Branch** — dropdown (fetch `/branches`)
  - **Availability** — show only AVAILABLE by default
- Results as a **card grid** — each card: model name, brand, year, engine capacity, base price, branch, availability badge
- Click card → `/bikes/:id`

---

#### 5.3 Bike Detail Page (`/bikes/[id]`)

**File:** `apps/web/app/bikes/[id]/page.tsx` _(create)_

Sections:
1. **Hero** — model name, brand, year, color, engine capacity
2. **Pricing** — base price + availability badge
3. **Branch** — which branch holds the unit
4. **Specs** — all BikeModel fields in a readable layout
5. **Documents** — registration papers only (public-safe) with download link
6. **Make Offer button** — visible only if status = `AVAILABLE`. Opens an offer form modal with fields: name, phone, email, offer amount, message. On submit → `POST /offers` (Sprint 6 completes the backend flow; button and modal wired now)

---

#### 5.4 Parts & Accessories Listing (`/parts`)

**File:** `apps/web/app/parts/page.tsx` _(create)_

- Fetch `GET /catalog/parts` with filters
- Filter panel:
  - **Category** — dropdown (e.g. ELECTRICAL, MECHANICAL, ACCESSORIES)
  - **Search** — by name or SKU
  - **Branch** — show availability per branch
- Results as card grid — each card: name, SKU, category, selling price, in/out of stock

---

#### 5.5 Part Detail Page (`/parts/[id]`)

**File:** `apps/web/app/parts/[id]/page.tsx` _(create)_

- Part name, SKU, category, description
- Selling price
- Stock per branch table (branch name · quantity · status)

---

#### 5.6 Global Search (`/search`)

**File:** `apps/web/app/search/page.tsx` _(create)_

- Reads `?q=` from URL
- Calls `GET /catalog/search?q=`
- Two sections: "Bikes" and "Parts" results
- Each result links to its respective detail page

---

### Phase 3 · API Functions for Web

**File:** `apps/web/lib/api/catalog.ts` _(create)_

```typescript
getCatalogBikes(filters)       → GET /catalog/bikes
getCatalogBikeById(id)         → GET /catalog/bikes/:id
getCatalogParts(filters)       → GET /catalog/parts
getCatalogPartById(id)         → GET /catalog/parts/:id
searchCatalog(q: string)       → GET /catalog/search?q=
submitOffer(data)              → POST /offers  (Sprint 6 backend; wire stub now)
```

---

## Implementation Order

```
 1. Resolve BikeStatus enum mismatch (schema or UI fix)
 2. Create all DTOs in inventory module
 3. Extend InventoryService with all missing bike methods
 4. Extend InventoryService with all missing parts methods
 5. Extend InventoryController with new routes + guards
 6. Install Cloudinary, create UploadModule
 7. Add reference data endpoints (vendors, bike-models) if missing
 8. Add types for BikeUnit, Part, etc. in admin lib/types.ts
 9. Create apps/admin/lib/api/inventory.ts
10. Wire admin bikes list → fetch, filters, modals
11. Wire admin add-bike form → form state, file upload, submit
12. Wire admin bike detail → fetch, documents, status modal
13. Wire admin parts list → fetch, filters, low-stock highlight, adjust modal
14. Wire admin add-part form → form state, submit
15. Wire admin part detail → movements history
16. Wire admin edit-part form → pre-populate and submit
17. Create CatalogModule in API (public endpoints, no auth guard)
18. Expand web app layout & navigation
19. Build /bikes listing page (web)
20. Build /bikes/[id] detail page with Make Offer modal stub
21. Build /parts listing page (web)
22. Build /parts/[id] detail page (web)
23. Build /search page (web)
24. Create apps/web/lib/api/catalog.ts
```

---

## Dependencies to Install

### `apps/api`
```bash
npm install cloudinary multer
npm install -D @types/multer
```

### `apps/admin` & `apps/web`
```bash
npm install react-dropzone
npm install react-hot-toast
```

---

## Environment Variables Required

Add to root `.env`:
```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
