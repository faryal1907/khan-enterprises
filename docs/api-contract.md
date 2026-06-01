# API Contract Document

## Base URL

```
http://localhost:4000/api
```

## Authentication

All endpoints (except login, refresh, and logout) require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 15 minutes. Use the refresh endpoint to obtain a new token pair.

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid request body or parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error |

## Endpoints

### Authentication

#### GET /api/auth
Health check endpoint.

**Authentication:** None

**Request:** None

**Response:**
```json
{
  "message": "API is running 🚀"
}
```

---

#### POST /api/auth/login
Authenticates a user and returns access and refresh tokens.

**Authentication:** None

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string (min 6 characters)"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "string (JWT, expires in 15min)",
  "refreshToken": "string (JWT, expires in 7 days)",
  "user": {
    "id": "string",
    "email": "string",
    "role": "ADMIN | MANAGER | SALES_STAFF",
    "branchId": "string | null",
    "status": "string"
  }
}
```

**Error Responses:**
- 400: Invalid email or password format
- 401: Invalid credentials

---

#### POST /api/auth/refresh
Exchanges a valid refresh token for a new access and refresh token pair.

**Authentication:** None

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "string (JWT, expires in 15min)",
  "refreshToken": "string (JWT, expires in 7 days)"
}
```

**Error Responses:**
- 400: Invalid or expired refresh token

---

#### POST /api/auth/logout
Invalidates the refresh token. Access token expires naturally after 15 minutes.

**Authentication:** None

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

**Error Responses:**
- 400: Invalid refresh token

---

#### GET /api/auth/me
Returns the currently authenticated user's profile.

**Authentication:** Required (JWT)

**Request:** None

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "role": "ADMIN | MANAGER | SALES_STAFF",
    "branchId": "string | null",
    "status": "string"
  }
}
```

**Error Responses:**
- 401: Missing or invalid token

---

#### GET /api/auth/users
Returns all registered staff users. ADMIN only.

**Authentication:** Required (JWT, ADMIN role)

**Request:** None

**Response (200 OK):**
```json
{
  "count": "number",
  "users": [
    {
      "id": "string",
      "email": "string",
      "role": "ADMIN | MANAGER | SALES_STAFF",
      "branchId": "string | null",
      "status": "string"
    }
  ]
}
```

**Error Responses:**
- 401: Missing or invalid token
- 403: Insufficient permissions (not ADMIN)

---

#### GET /api/auth/check
Dev/admin utility - verify a user exists by email. ADMIN only.

**Authentication:** Required (JWT, ADMIN role)

**Query Parameters:**
- `email` (string, required): User email to check

**Request:**
```
GET /api/auth/check?email=user@example.com
```

**Response (200 OK):**
```json
{
  "exists": true,
  "user": {
    "id": "string",
    "email": "string",
    "role": "ADMIN | MANAGER | SALES_STAFF",
    "branchId": "string | null",
    "status": "string"
  }
}
```

**Error Responses:**
- 401: Missing or invalid token
- 403: Insufficient permissions (not ADMIN)
- 404: User not found

---

### Branches

#### GET /api/branches
Returns all branches with manager info and inventory/staff counts.

**Authentication:** Required (JWT)

**Request:** None

**Response (200 OK):**
```json
{
  "count": "number",
  "branches": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "manager": {
        "id": "string",
        "email": "string",
        "role": "MANAGER"
      },
      "inventoryCount": "number",
      "staffCount": "number"
    }
  ]
}
```

**Error Responses:**
- 401: Missing or invalid token

---

#### GET /api/branches/:id
Returns a single branch with full detail including staff list.

**Authentication:** Required (JWT)

**Path Parameters:**
- `id` (string, required): Branch ID

**Request:**
```
GET /api/branches/123
```

**Response (200 OK):**
```json
{
  "branch": {
    "id": "string",
    "name": "string",
    "location": "string",
    "manager": {
      "id": "string",
      "email": "string",
      "role": "MANAGER"
    },
    "staff": [
      {
        "id": "string",
        "email": "string",
        "role": "SALES_STAFF"
      }
    ],
    "inventory": [
      {
        "id": "string",
        "type": "BIKE | PART",
        "name": "string",
        "quantity": "number"
      }
    ]
  }
}
```

**Error Responses:**
- 401: Missing or invalid token
- 404: Branch not found

---

### Inventory

#### GET /api/inventory/bikes
Returns all motorcycle units, optionally filtered by branch.

**Authentication:** Required (JWT)

**Query Parameters:**
- `branchId` (string, optional): Filter by branch ID

**Request:**
```
GET /api/inventory/bikes
GET /api/inventory/bikes?branchId=123
```

**Response (200 OK):**
```json
{
  "count": "number",
  "bikes": [
    {
      "id": "string",
      "make": "string",
      "model": "string",
      "year": "number",
      "price": "number",
      "status": "AVAILABLE | SOLD | RESERVED",
      "branchId": "string",
      "branchName": "string"
    }
  ]
}
```

**Error Responses:**
- 401: Missing or invalid token

---

#### GET /api/inventory/parts
Returns all parts inventory records, optionally filtered by branch.

**Authentication:** Required (JWT)

**Query Parameters:**
- `branchId` (string, optional): Filter by branch ID

**Request:**
```
GET /api/inventory/parts
GET /api/inventory/parts?branchId=123
```

**Response (200 OK):**
```json
{
  "count": "number",
  "parts": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "quantity": "number",
      "branchId": "string",
      "branchName": "string"
    }
  ]
}
```

**Error Responses:**
- 401: Missing or invalid token

---

## User Roles

| Role | Description |
|------|-------------|
| ADMIN | Global access to all features, can manage users across all branches |
| MANAGER | Branch-specific access, can manage branch inventory and orders |
| SALES_STAFF | Limited to branch operations, can view and manage inventory |

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production deployments.

## Pagination

Currently pagination is not implemented. All endpoints return full result sets. Consider adding pagination for large datasets in production.

## Versioning

Current API version: v1
Version is not included in the URL. Future versions may include versioning in the URL path.

## Testing

Use the following test credentials (from Sprint 2 documentation):

| Email | Password | Role | Branch |
|-------|----------|------|--------|
| `admin@khan.com` | `admin123` | ADMIN | — (global) |
| `isb.manager@khan.com` | `manager123` | MANAGER | Islamabad HQ |
| `tordher.manager@khan.com` | `manager123` | MANAGER | Tordher Branch |
| `tordher.staff@khan.com` | `sales123` | SALES_STAFF | Tordher Branch |

## Example cURL Commands

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khan.com","password":"admin123"}'
```

### Get Current User
```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Get All Branches
```bash
curl http://localhost:4000/api/branches \
  -H "Authorization: Bearer <access_token>"
```

### Get Bikes (filtered by branch)
```bash
curl "http://localhost:4000/api/inventory/bikes?branchId=123" \
  -H "Authorization: Bearer <access_token>"
```

### Refresh Token
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

### Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```
