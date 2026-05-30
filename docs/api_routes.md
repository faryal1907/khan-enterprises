# Khan Enterprises — API Routes Reference

**Base URL (local):** `http://localhost:4000/api`

All routes are prefixed with `/api` — set globally in `apps/api/src/main.ts`.
The NestJS server runs on **Port 4000**.

---

## How a URL is built

```
http://localhost:4000  /api        /auth       /login
└── server address     └── global  └── module  └── route
                           prefix     prefix
```

- The global prefix `/api` comes from `app.setGlobalPrefix("api")` in `main.ts`
- The module prefix (e.g. `/auth`, `/inventory`) comes from `@Controller("auth")` on the controller class
- The route suffix (e.g. `/login`, `/me`) comes from `@Post("login")`, `@Get("me")` on the method

---

## HTTP Methods

| Method | Meaning | When used |
|--------|---------|-----------|
| `GET` | Read data, no side effects | Fetching bikes, branches, users |
| `POST` | Create something or trigger an action | Login, logout, refresh, future: create order |
| `PATCH` | Partially update an existing record | Future: update bike status, offer counter |
| `DELETE` | Remove a record | Future: delete a document |

---

## How data travels in a request

| Mechanism | Decorator | Where it appears | Example |
|-----------|-----------|-----------------|---------|
| **Request body** | `@Body()` | JSON payload with POST/PATCH | `{ "email": "...", "password": "..." }` |
| **URL parameter** | `@Param()` | Embedded in the path, identifies a record | `/api/branches/:id` → `:id` is the UUID |
| **Query string** | `@Query()` | After `?`, used for optional filters | `/api/inventory/bikes?branchId=<uuid>` |

---

## Authentication

Protected routes require a valid JWT access token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

| Response | Meaning |
|----------|---------|
| `401 Unauthorized` | Token missing, invalid, or expired |
| `403 Forbidden` | Token valid but role not permitted |

After login you receive two tokens:

- **Access token** — short-lived (15 min), sent with every protected request
- **Refresh token** — long-lived (7 days), used only to get a new access token when it expires

---

## Current Routes

### Auth — `/api/auth`

| Method | Route | Protected | Role | Description |
|--------|-------|-----------|------|-------------|
| `POST` | `/api/auth/login` | ❌ Public | — | Authenticate with email + password. Returns `accessToken`, `refreshToken`, and user profile. |
| `POST` | `/api/auth/refresh` | ❌ Public | — | Exchange a valid refresh token for a new access + refresh token pair. Old token is invalidated. |
| `POST` | `/api/auth/logout` | ❌ Public | — | Invalidate a refresh token. Access token expires naturally after 15 min. |
| `GET` | `/api/auth/me` | ✅ JWT | Any | Returns the currently authenticated user's profile. |
| `GET` | `/api/auth/users` | ✅ JWT | ADMIN | List all staff users with branch info. |
| `GET` | `/api/auth/check?email=` | ✅ JWT | ADMIN | Verify a user exists by email. Dev/admin utility. |

#### `POST /api/auth/login`

Request body:
```json
{
  "email": "admin@khan.com",
  "password": "admin123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "a3f9c2...",
  "user": {
    "id": "...",
    "email": "admin@khan.com",
    "fullName": "Muhammad Ali Khan",
    "role": "ADMIN",
    "status": "ACTIVE",
    "branchId": null,
    "branch": null
  }
}
```

#### `POST /api/auth/refresh`

Request body:
```json
{
  "refreshToken": "a3f9c2..."
}
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "b7d1e4..."
}
```

#### `POST /api/auth/logout`

Request body:
```json
{
  "refreshToken": "b7d1e4..."
}
```

Response:
```json
{
  "message": "Logged out successfully."
}
```

#### `GET /api/auth/me`

Headers: `Authorization: Bearer <accessToken>`

Response:
```json
{
  "user": {
    "id": "...",
    "email": "isb.manager@khan.com",
    "role": "MANAGER",
    "status": "ACTIVE",
    "branchId": "..."
  }
}
```

---

### Inventory — `/api/inventory`

> Currently unprotected. JWT guards will be added in Sprint 2.

| Method | Route | Protected | Description |
|--------|-------|-----------|-------------|
| `GET` | `/api/inventory/bikes` | ❌ Open | All serialized bike units across both branches. |
| `GET` | `/api/inventory/bikes?branchId=<uuid>` | ❌ Open | Bike units at one specific branch. |
| `GET` | `/api/inventory/parts` | ❌ Open | All parts inventory across both branches. |
| `GET` | `/api/inventory/parts?branchId=<uuid>` | ❌ Open | Parts inventory at one specific branch. |

#### `GET /api/inventory/bikes`

Response:
```json
{
  "count": 10,
  "bikes": [
    {
      "id": "...",
      "chassisNumber": "EVC1P-2025-78492",
      "engineNumber": "EMOT-78492-EV25",
      "serialNumber": "SR-EV-C1P-001",
      "status": "AVAILABLE",
      "negotiatedPrice": null,
      "reservedUntil": null,
      "soldAt": null,
      "model": {
        "brand": "Evee",
        "modelName": "C1 Pro",
        "year": 2025,
        "engineCapacity": "Electric",
        "color": "Pearl White / Matte Black / Red",
        "basePrice": "285000.00"
      },
      "vendor": { "id": "...", "name": "Evee Pakistan" },
      "branch": { "id": "...", "name": "Islamabad Headquarters", "city": "Islamabad" }
    }
  ]
}
```

#### `GET /api/inventory/parts`

Response:
```json
{
  "count": 9,
  "parts": [
    {
      "id": "...",
      "quantity": 12,
      "reservedQuantity": 0,
      "reorderLevel": 3,
      "part": {
        "name": "Evee C1 Fast Charger",
        "sku": "PRT-EV-C1CHG",
        "category": "Electrical",
        "sellingPrice": "8500.00"
      },
      "branch": { "name": "Islamabad Headquarters", "city": "Islamabad" }
    }
  ]
}
```

---

### Branches — `/api/branches`

> Currently unprotected. JWT guards will be added in Sprint 2.

| Method | Route | Protected | Description |
|--------|-------|-----------|-------------|
| `GET` | `/api/branches` | ❌ Open | All branches with manager info and inventory/staff counts. |
| `GET` | `/api/branches/:id` | ❌ Open | Single branch with full staff list and inventory counts. |

#### `GET /api/branches`

Response:
```json
{
  "count": 2,
  "branches": [
    {
      "id": "...",
      "name": "Islamabad Headquarters",
      "city": "Islamabad",
      "address": "Plot 12, Street 4, F-10 Markaz, Islamabad",
      "phoneNumber": "+925188001001",
      "manager": {
        "id": "...",
        "fullName": "Kamran Shah",
        "email": "isb.manager@khan.com",
        "phoneNumber": "+923331234567"
      },
      "_count": { "users": 2, "bikeInventory": 6, "partInventory": 5 }
    }
  ]
}
```

#### `GET /api/branches/:id`

Response:
```json
{
  "branch": {
    "id": "...",
    "name": "Tordher Branch",
    "city": "Tordher",
    "address": "Main GT Road, Near Tordher Chowk, Tordher, KPK",
    "manager": { "fullName": "Bilal Khan", "email": "tordher.manager@khan.com" },
    "users": [
      { "fullName": "Bilal Khan", "role": "MANAGER", "status": "ACTIVE" },
      { "fullName": "Siddique Ahmed", "role": "SALES_STAFF", "status": "ACTIVE" }
    ],
    "_count": { "bikeInventory": 4, "partInventory": 2, "orders": 0 }
  }
}
```

---

## Testing with curl

```bash
# Login and capture tokens
curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khan.com","password":"admin123"}'

# Get your profile (replace <token> with accessToken from login)
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"

# List all staff users (ADMIN only)
curl http://localhost:4000/api/auth/users \
  -H "Authorization: Bearer <token>"

# All bikes
curl http://localhost:4000/api/inventory/bikes

# Bikes at Islamabad HQ (replace <uuid> with branch id from /api/branches)
curl "http://localhost:4000/api/inventory/bikes?branchId=<uuid>"

# All parts
curl http://localhost:4000/api/inventory/parts

# All branches
curl http://localhost:4000/api/branches

# Single branch
curl http://localhost:4000/api/branches/<uuid>

# Refresh tokens
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# Logout
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## Seeded credentials (dev only)

| Email | Password | Role | Branch |
|-------|----------|------|--------|
| `admin@khan.com` | `admin123` | ADMIN | — (global) |
| `isb.manager@khan.com` | `manager123` | MANAGER | Islamabad HQ |
| `tordher.manager@khan.com` | `manager123` | MANAGER | Tordher Branch |
| `tordher.staff@khan.com` | `sales123` | SALES_STAFF | Tordher Branch |

---

## Planned Routes (Sprint 2+)

These don't exist yet but are fully modeled in the database schema.

```
# Offers (negotiation)
POST   /api/offers                        Submit a price offer on a bike
GET    /api/offers                        List offers (filter by status, branch, bike)
GET    /api/offers/:id                    Get a single offer
PATCH  /api/offers/:id                    Counter / accept / reject an offer

# Orders
POST   /api/orders                        Create an order from an accepted offer
GET    /api/orders                        List orders (filter by status, branch)
GET    /api/orders/:id                    Get order detail
PATCH  /api/orders/:id/status             Update order status

# Payments
POST   /api/payments                      Record a payment transaction
GET    /api/payments/:orderId             Get payment records for an order

# Delivery
POST   /api/delivery                      Create a delivery request
GET    /api/delivery/:id                  Get delivery status
PATCH  /api/delivery/:id/status           Update delivery status

# Vendors (admin)
GET    /api/vendors                       List all vendors
GET    /api/vendors/:id                   Get vendor detail
```
