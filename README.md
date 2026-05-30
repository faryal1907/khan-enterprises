# 🏍️ Khan Enterprises — Motorcycle Sales & ERP Platform

Khan Enterprises is a next-generation, local-first enterprise platform designed to manage the entire lifecycle of a motorcycle dealership. The platform facilitates everything from customer discovery, online negotiations, secure payments, and digital invoicing to vehicle delivery and after-sales relationship management. Additionally, it integrates a comprehensive Admin ERP dashboard to empower sales agents, branch managers, and C-level executives with real-time operational insights.

---

## 🏗️ 1. Architecture & Tech Stack

The system is built as a **TypeScript Monorepo** powered by **Turborepo** for build orchestration, using a robust, decoupled architecture separating customer-facing frontends, administrative ERP tools, and a unified enterprise API.

```
                  ┌──────────────────────┐      ┌──────────────────────┐
                  │   Customer Portal    │      │   Admin ERP Portal   │
                  │   (Next.js App)      │      │   (Next.js App)      │
                  └──────────┬───────────┘      └──────────┬───────────┘
                             │                             │
                             └──────────────┬──────────────┘
                                            │ HTTP / REST
                                            ▼
                              ┌───────────────────────────┐
                              │    Unified Backend API    │
                              │     (NestJS Backend)      │
                              └─────────────┬─────────────┘
                                            │ Prisma ORM
                                            ▼
                              ┌───────────────────────────┐
                              │    PostgreSQL Database    │
                              └───────────────────────────┘
```

### 1.1 Frontend Layer
*   **Framework:** `Next.js 14+ (App Router)` — Server-Side Rendering (SSR) for SEO-optimized customer discovery, Static Site Generation (SSG) for high performance, and Client-Side Hydration for dynamic forms and dashboards.
*   **Styling:** `Tailwind CSS` — Core design system utility layer ensuring rapid development, responsive grids, and design token consistency.
*   **Component Library:** `shadcn/ui` — Accessible, customizable, and headless components built on Radix UI and Tailwind CSS primitives.
*   **Form Management:** `React Hook Form` + `Zod` — Schema-first client-side validations, strongly typed inputs, and declarative form state.
*   **Data Grids:** `TanStack Table` (React Table) — High-performance data tables with column sorting, server-side pagination, global filters, and customizable cell renderers for the Admin ERP.
*   **Visualization:** `Recharts` — Declarative, responsive SVG charting for executive financial summaries, inventory levels, and branch conversions.

### 1.2 Backend Layer (Enterprise Architecture)
*   **Core Framework:** `NestJS` — An enterprise-ready node framework implementing an architectural pattern of clean modules, controllers, providers, guards (for RBAC), pipes (validation), and interceptors (logging & transformations).
*   **ORM:** `Prisma` — Schema-first database abstraction supporting strong typing, declarative migrations, relational modeling, and built-in transaction pooling.
*   **Database:** `PostgreSQL` — Standard relational database providing ACID compliance, row-level locking (crucial for serialized inventory reservation), advanced index types, and comprehensive audit log triggers.
*   **Authentication:** `JWT + HTTP-Only Refresh Tokens` — Secure, stateless, role-aware authorization with cryptographically signed tokens.
*   **Storage:** `Cloudinary` (Phase 1 Local/Dev) / `Amazon S3` (Phase 2 Production) — Secure storage for physical invoices, warranties, bike inspection reports, and media assets.
*   **PDF Generation:** `PDFKit` / `React-PDF` — Server-side engine for generating standardized legal invoices, purchase agreements, and tax receipts.

### 1.3 DevOps, CI/CD & Deployments
*   **Local Development:** `Docker Desktop` + `Docker Compose` — Standardizes local PostgreSQL and pgAdmin services.
*   **Version Control:** `Git` + `GitHub` — Protected trunk branching, commit linting, and automated pull requests.
*   **CI/CD Pipeline:** `GitHub Actions` — Automated lints, builds, security checks, and testing suites.
*   **Frontend Hosting:** `Vercel` — Global CDN deployment for both customer-facing and admin Next.js portals.
*   **Backend Hosting:** `Render` / `Railway` — Scalable managed servers for NestJS.
*   **Database Engine:** `Neon.tech` (Serverless PostgreSQL for staging) / Dedicated VPS (Production setup with managed backups).

---

## 📂 2. Monorepo Directory Structure

The project leverages a modern Monorepo structure, powered by workspaces and Turborepo:

```
khan-enterprises/
├── .github/
│   └── workflows/            # GitHub Actions CI/CD workflows
├── apps/
│   ├── web/                  # Customer-facing Next.js website (Port 3000)
│   ├── admin/                # Admin/ERP Next.js dashboard (Port 3001)
│   └── api/                  # NestJS backend API (Port 4000)
├── packages/
│   ├── prisma/               # Prisma Schema, migrations, and database client exports
│   ├── ui/                   # Shared UI component library (shadcn/ui + custom components)
│   ├── types/                # Shared TypeScript models, DTOs, and interface definitions
│   └── utils/                # Shared utility functions (formatting, dates, math, etc.)
├── docker/
│   ├── postgres/             # Custom database configuration and initialization scripts
│   └── docker-compose.yml    # Development infrastructure services (DB, pgAdmin)
├── README.md                 # Project root manual (This file)
├── package.json              # Monorepo workspaces definition
├── turbo.json                # Turborepo task pipeline configuration
└── tsconfig.base.json        # Base TypeScript compiler options
```

---

## 🎯 3. System Modules, Prioritization & Roadmap

The system is compartmentalized into self-contained vertical domains. Every domain maps to its own NestJS module, Prisma model relations, and dedicated frontend pages.

| Module | Priority | Phase | Core Description |
| :--- | :--- | :--- | :--- |
| **Authentication & Session** | `CRITICAL` | Phase 2 | JWT, refresh tokens, login, logout, password resets, and sessions. |
| **Role-Based Access (RBAC)** | `CRITICAL` | Phase 2 | Explicit guards mapped to roles: Customer, Sales Staff, Branch Manager, CEO. |
| **Serialized Bike Inventory** | `CRITICAL` | Phase 2 | Unique bike tracking (Chassis / Engine #) with real-time availability states. |
| **Parts & Accessories Stock** | `CRITICAL` | Phase 2 | Quantity-based catalog tracked by location and reorder threshold levels. |
| **Customer Product Catalog** | `HIGH` | Phase 2 | Public showcase with filters (type, engine capacity, color) and pricing. |
| **Negotiation & Offers** | `CRITICAL` | Phase 3 | Negotiation workflow between customer and sales agent (counter-offers). |
| **Order Lifecycle** | `CRITICAL` | Phase 3 | Tracks states from successful negotiation to payment and fulfillment. |
| **Payment Gateway** | `CRITICAL` | Phase 4 | Safepay (cards) + JazzCash (mobile wallet) in Phase 1; Raast via PayFast (instant bank transfer, zero MDR) in Phase 2. |
| **Transactions & Refunds** | `CRITICAL` | Phase 4 | Ledger balancing, secure refund channels, and financial records. |
| **Sales Staff Registry** | `CRITICAL` | Phase 5 | Internal registration workflow, credentials provisioning, and performance metrics. |
| **PDF Invoice Generator** | `HIGH` | Phase 5 | Dynamic generation of PDF invoices, purchase contracts, and delivery receipts. |
| **Delivery Management** | `HIGH` | Phase 6 | Delivery dispatch, logistics tracking, status updates, and signature collection. |
| **Admin ERP Dashboard** | `MEDIUM` | Phase 7 | Central workspace displaying financial reports, branches metrics, and charts. |
| **Audit Logs & Tracking** | `CRITICAL` | Phase 7 | Database-level and API-level change history of every critical action. |
| **Branch Management** | `HIGH` | Phase 7 | Multi-branch details, stock transfers, and branch-level performance reporting. |
| **Vendor Management** | `MEDIUM` | Post-MVP | Supplier management, bulk orders, procurement history, and payments. |
| **Installment/Financing** | `MEDIUM` | Post-MVP | Installment pricing calculators, payment plans, interest, and dues tracking. |
| **WhatsApp Notifications** | `LOW` | Post-MVP | Automated WhatsApp alerts for negotiation updates, invoices, and delivery. |
| **Mobile App (React Native)**| `LOW` | Post-MVP | Companion app for delivery personnel and customers on the go. |

---

## 🗄️ 4. Database Architecture & Schema Design

PostgreSQL acts as our single source of truth. The schemas are fully optimized for data integrity, avoiding race conditions (such as double-selling a motorcycle unit) through dedicated database states and field parameters.

### 🔑 Key Concept: Dual-Inventory System
1.  **Serialized Bike Units:** Every motorcycle is unique. It is represented by a single row tracked via its physical identifiers (chassis number, engine number). These rows are *never* duplicated or tracked by count.
2.  **Parts & Accessories:** Standard inventory tracked by quantities and stock levels relative to specific branches.

```
                      ┌──────────────────────┐
                      │        Branch        │
                      └──────┬────────┬──────┘
                             │        │
            1-to-Many        │        │        1-to-Many
         ┌───────────────────┘        └───────────────────┐
         ▼                                                ▼
┌──────────────────┐                            ┌──────────────────┐
│  Serialized Bike │                            │  Parts Inventory │
│    Inventory     │                            │    (Quantity)    │
│  (Chassis/Engine)│                            │ (Stock Tracking) │
└──────────────────┘                            └──────────────────┘
```

---

### 4.1 Prisma Schema Layout (Core Entities)

Below is the definitive database design represented as a Prisma schema. This file resides in `packages/prisma/schema.prisma`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  CUSTOMER
  SALES_STAFF
  BRANCH_MANAGER
  CEO_ADMIN
}

enum BikeStatus {
  AVAILABLE
  RESERVED
  SOLD
  IN_DELIVERY
}

enum OfferState {
  PENDING
  COUNTERED
  ACCEPTED
  REJECTED
  EXPIRED
  PAID
}

enum OrderState {
  PENDING_PAYMENT
  PAID
  CONFIRMED
  READY_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

enum DeliveryState {
  REQUESTED
  UNDER_REVIEW
  APPROVED
  IN_TRANSIT
  DELIVERED
}

model User {
  id           String        @id @default(uuid()) @db.Uuid
  email        String        @unique
  passwordHash String
  name         String
  role         UserRole      @default(CUSTOMER)
  branchId     String?       @db.Uuid
  branch       Branch?       @relation(fields: [branchId], references: [id])
  offers       Offer[]       @relation("CustomerOffers")
  agentOffers  Offer[]       @relation("AgentOffers")
  orders       Order[]
  auditLogs    AuditLog[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Branch {
  id             String          @id @default(uuid()) @db.Uuid
  name           String
  location       String
  users          User[]
  bikes          Bike[]
  partsInventory PartsInventory[]
  orders         Order[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model Vendor {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  contact   String
  email     String   @unique
  bikes     Bike[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model BikeModel {
  id             String   @id @default(uuid()) @db.Uuid
  make           String
  modelName      String
  year           Int
  engineCapacity Int      // in cc
  color          String
  basePrice      Decimal  @db.Decimal(12, 2)
  bikes          Bike[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Bike {
  id                   String     @id @default(uuid()) @db.Uuid
  vendorId             String     @db.Uuid
  vendor               Vendor     @relation(fields: [vendorId], references: [id])
  branchId             String     @db.Uuid
  branch               Branch     @relation(fields: [branchId], references: [id])
  modelId              String     @db.Uuid
  model                BikeModel  @relation(fields: [modelId], references: [id])
  chassisNumber        String     @unique
  engineNumber         String     @unique
  serialNumber         String
  status               BikeStatus @default(AVAILABLE)
  negotiatedPrice      Decimal?   @db.Decimal(12, 2)
  supplierInvoiceUrl   String?
  warrantyDocumentUrl  String?
  registrationDocUrl   String?
  reservedUntil        DateTime?
  soldAt               DateTime?
  offers               Offer[]
  order                Order?
  createdAt            DateTime   @default(now())
  updatedAt            DateTime   @updatedAt
}

model Product {
  id             String           @id @default(uuid()) @db.Uuid
  name           String
  sku            String           @unique
  description    String?
  price          Decimal          @db.Decimal(12, 2)
  partsInventory PartsInventory[]
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model PartsInventory {
  id               String   @id @default(uuid()) @db.Uuid
  productId        String   @db.Uuid
  product          Product  @relation(fields: [productId], references: [id])
  branchId         String   @db.Uuid
  branch           Branch   @relation(fields: [branchId], references: [id])
  quantity         Int      @default(0)
  reorderLevel     Int      @default(5)
  reservedQuantity Int      @default(0)
  updatedAt        DateTime @updatedAt

  @@unique([productId, branchId])
}

model Offer {
  id              String     @id @default(uuid()) @db.Uuid
  bikeId          String     @db.Uuid
  bike            Bike       @relation(fields: [bikeId], references: [id])
  customerId      String     @db.Uuid
  customer        User       @relation("CustomerOffers", fields: [customerId], references: [id])
  agentId         String?    @db.Uuid
  agent           User?      @relation("AgentOffers", fields: [agentId], references: [id])
  offeredPrice    Decimal    @db.Decimal(12, 2)
  state           OfferState @default(PENDING)
  validUntil      DateTime
  orders          Order[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Order {
  id             String        @id @default(uuid()) @db.Uuid
  customerId     String        @db.Uuid
  customer       User          @relation(fields: [customerId], references: [id])
  branchId       String        @db.Uuid
  branch         Branch        @relation(fields: [branchId], references: [id])
  bikeId         String        @unique @db.Uuid
  bike           Bike          @relation(fields: [bikeId], references: [id])
  offerId        String?       @db.Uuid
  offer          Offer?        @relation(fields: [offerId], references: [id])
  totalAmount    Decimal       @db.Decimal(12, 2)
  state          OrderState    @default(PENDING_PAYMENT)
  invoiceUrl     String?
  deliveries     Delivery[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Delivery {
  id                 String        @id @default(uuid()) @db.Uuid
  orderId            String        @db.Uuid
  order              Order         @relation(fields: [orderId], references: [id])
  state              DeliveryState @default(REQUESTED)
  deliveryAddress    String
  recipientName      String
  recipientContact   String
  trackingNumber     String?
  scheduledDate      DateTime?
  deliveredAt        DateTime?
  signatureUploadUrl String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
}

model AuditLog {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String?  @db.Uuid
  user       User?    @relation(fields: [userId], references: [id])
  action     String
  entityName String
  entityId   String?
  oldValues  Json?
  newValues  Json?
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

---

## 🔄 5. State Machine Lifecycles

To prevent race conditions, double reservations, and financial inconsistencies, the system uses strict state transition flows.

### 5.1 Bike Reservation & Sale Lifecycle
Every physical bike starts in the `AVAILABLE` pool.

```
       [ OFFER ACCEPTED ]                  [ PAYMENT CONFIRMED ]
AVAILABLE  ───────────►  RESERVED  ────────────────►  SOLD
    ▲                       │                           │
    │                       │ [ EXPIRED / CANCELLED ]   │ [ IN DISPATCH ]
    └───────────────────────┘                           ▼
                                                   IN_DELIVERY
```

> [!IMPORTANT]
> **Double-Selling Prevention Rule:**
> When an offer is `ACCEPTED`, the bike's state immediately transitions to `RESERVED` and a `reservedUntil` timestamp is set (default: 48 hours). The database query MUST enforce row locking (`SELECT ... FOR UPDATE`) to prevent simultaneous transactions from booking the same bike. If `reservedUntil` is exceeded without payment confirmation, a cron background job automatically reverts the status back to `AVAILABLE`.

### 5.2 Negotiation Offer States
Negotiations occur directly between the customer and a sales representative.
*   `PENDING`: Initial offer submitted by the customer.
*   `COUNTERED`: Alternative price offered back by the sales staff.
*   `ACCEPTED`: Agreed price. The corresponding bike is immediately placed on reservation.
*   `REJECTED`: Offer turned down. No reservation is held.
*   `EXPIRED`: Offer failed to reach acceptance within the expiration timer.
*   `PAID`: Offer successfully closed with a matching payment transaction.

### 5.3 Order States
*   `PENDING_PAYMENT` ──► `PAID` ──► `CONFIRMED` ──► `READY_FOR_DELIVERY` ──► `DELIVERED`
*   An order can transition to `CANCELLED` from `PENDING_PAYMENT` or `PAID` (if refunded).

### 5.4 Delivery States
*   `REQUESTED` ──► `UNDER_REVIEW` ──► `APPROVED` ──► `IN_TRANSIT` ──► `DELIVERED`

---

## 🔐 6. Permission Matrix (RBAC)

Role-Based Access Control is enforced on the NestJS backend via explicit class decorators and custom execution guards (`@UseGuards(RolesGuard)`). On the frontend Next.js layers, middleware redirects unauthorized requests.

| System Action | Sales Staff | Branch Manager | CEO / Admin |
| :--- | :---: | :---: | :---: |
| **View inventory** | Yes *(own branch only)* | Yes *(own branch only)* | Yes *(all branches)* |
| **Add bike to inventory** | ❌ No | Yes *(own branch only)* | Yes *(all branches)* |
| **Register & process sale** | Yes *(assigned)* | Yes | Yes |
| **Delete sale record** | ❌ No | ❌ No | Yes *(Admin only)* |
| **Accept/counter offer** | Yes | Yes | Yes |
| **Approve delivery request** | ❌ No | Yes *(own branch)* | Yes *(all branches)* |
| **View branch financial reports** | ❌ No | Yes *(own branch only)* | Yes *(all branches)* |
| **Manage users & security settings** | ❌ No | ❌ No | Yes |
| **Access & export audit logs** | ❌ No | ❌ No | Yes |

---

## 🚀 7. Developer Guidelines

For developers continuing active contributions on the codebase:

1.  **Thinking in Modules:**
    Do not build ad-hoc code structures. Always bundle features into a modular package:
    *   *Backend:* Define a directory `apps/api/src/modules/<feature>` with its controller, service, module file, and necessary DTOS. Import this module in `app.module.ts`.
    *   *Frontend:* Organize components by domain routes inside `apps/web/src/app/(routes)/<feature>` or `apps/admin/src/app/(routes)/<feature>`.
2.  **Shared Packages:**
    Keep shared entities clean:
    *   All system-wide TypeScript typings, interfaces, and Enums live in `packages/types`.
    *   Generic validators, string formatting, calculations, and date parsers belong in `packages/utils`.
    *   Reuse existing shadcn elements in `packages/ui` rather than repeating custom markup.
3.  **Strict Commit Rule:**
    Never commit database-destructive operations. Any schema change *must* occur through Prisma migrations:
    ```bash
    npm run prisma:migrate:dev --name description_of_change
    ```
4.  **Local-First Verification:**
    Verify your environment by reviewing the [Detailed Setup & Walkthrough Guide](file:///c:/Users/Laptop/Desktop/khan-enterprises/docs/setup_guide.md).

---

## 📞 Support & Questions
If you have inquiries regarding system flow or architectural choices, please review existing codebase components or reach out to the project architects. Keep this document updated as new phases launch.
