# Admin App — Complete Todo List

Generated from full codebase audit on 2026-06-10.
Covers all incomplete work across existing pages plus Sprint 12 (Analytics Dashboard) and Sprint 13 (Audit Logs & Branch Management).

---

## How to read this doc

Each item has:
- **File** — exact file to edit or create
- **What** — what is broken or missing
- **How** — exactly what to do

---

## 1. Auth Store Hydration on Refresh

**Affects:** Every page that reads `useAuthStore().user`

### Problem
`useAuthStore` stores the `user` object in Zustand (in-memory only). On a hard page refresh, `user` is `null` even though the `accessToken` cookie is still valid. This means the dashboard renders blank stat cards and role-based UI breaks.

### Fix
**File:** `apps/admin/components/auth-provider.tsx`

Add a `GET /auth/me` call on mount. If the cookie exists but `user` is null, fetch the current user and call `setAuth`.

```tsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import Cookies from "js-cookie";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setAuth } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && !user) {
      api.get("/auth/me")
        .then((res) => setAuth(res.data, token))
        .catch(() => Cookies.remove("accessToken"));
    }
  }, []);

  return <>{children}</>;
}
```

**Backend:** Confirm `GET /api/auth/me` exists and returns the full user object. If not, add it to `apps/api/src/modules/auth/auth.controller.ts`.

---

## 2. Dashboard KPI Cards (`/`)

**File:** `apps/admin/app/page.tsx`

### Problem
Every stat card in all three role views (Admin, Manager, Sales Staff) shows `—`. There are zero API calls in this file.

### Fix — wire each card with a real fetch

Add a `useEffect` on mount that fires these calls in parallel using `Promise.all`:

| Card | API call |
|---|---|
| Pending Orders | `GET /api/orders?status=PENDING_PAYMENT` |
| Total Sales (count) | `GET /api/orders?status=DELIVERED` — use `.length` |
| Available Bikes | `GET /api/inventory/bikes?status=AVAILABLE` — use `.length` |
| Available Parts | derived from `GET /api/inventory/parts` — count items where `quantity > 0` |
| Low Stock Alerts | `GET /api/inventory/parts/low-stock` — use `response.count` |
| Pending Deliveries | `GET /api/deliveries?status=REQUESTED` — use `.length` |
| Active Negotiations | `GET /api/offers?status=PENDING` — use `.length` |
| Branch Revenue | `GET /api/branches/:branchId/metrics` — use `metrics.revenue.total` |
| Bikes Sold | `GET /api/branches/:branchId/metrics` — use `metrics.orders.completed` |

For non-Admin roles, always pass the user's `branchId` as a query param.

Add a **period selector** (Today / This Week / This Month) above the cards that sets `dateFrom`/`dateTo` state and is passed to each fetch call that supports it (orders, deliveries).

---

## 3. Analytics Charts — Sprint 12

### Install Recharts

Recharts is **not installed**. Run this first:

```
cd apps/admin
npm install recharts
npm install --save-dev @types/recharts
```

### Create the analytics page or add charts section to dashboard

Recommended: add a `<AnalyticsDashboard />` component rendered below the KPI cards in `app/page.tsx`, or create a dedicated `app/analytics/page.tsx` and add it to the navigation.

---

### 3a. Revenue Over Time — Line Chart

**What:** Daily/weekly revenue, filterable by date range.

**Backend work needed:**
No aggregation endpoint exists. Add to `apps/api/src/modules/orders/orders.controller.ts`:

```
GET /api/analytics/revenue?period=week&branchId=&dateFrom=&dateTo=
```

Returns: `{ data: [{ date: "2026-06-01", revenue: 150000 }, ...] }`

Aggregate by summing `negotiatedAmount` from DELIVERED orders grouped by date. Can be done with a raw Prisma `groupBy` on `createdAt`.

**Frontend:**
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// data shape: [{ date: "Jun 1", revenue: 150000 }]
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
    <Line type="monotone" dataKey="revenue" stroke={theme.accents.primary} strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

---

### 3b. Sales by Branch — Bar Chart

**What:** Bikes sold per branch per period.

**Backend work needed:**
Add endpoint:
```
GET /api/analytics/sales-by-branch?period=month
```
Returns: `{ data: [{ branch: "Islamabad HQ", sold: 12 }, { branch: "Tordher", sold: 7 }] }`

Aggregate DELIVERED orders grouped by `order.branchId`, join with branch name.

**Frontend:**
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="branch" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="sold" fill={theme.accents.primary} radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

### 3c. Inventory Status Breakdown — Pie Chart

**What:** AVAILABLE vs RESERVED vs SOLD vs IN_DELIVERY counts.

**No new backend endpoint needed.** Derive from `GET /api/inventory/bikes` response — group by `status` client-side.

```tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { AVAILABLE: "#22c55e", RESERVED: "#f59e0b", SOLD: "#ef4444", IN_DELIVERY: "#6366f1" };

const data = [
  { name: "Available", value: availableCount },
  { name: "Reserved", value: reservedCount },
  { name: "Sold", value: soldCount },
  { name: "In Delivery", value: inDeliveryCount },
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
      {data.map((entry) => (
        <Cell key={entry.name} fill={COLORS[entry.name.replace(" ", "_").toUpperCase()]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

---

### 3d. Negotiation Conversion Rate — Bar Chart

**What:** Offers received vs accepted vs rejected.

**No new backend endpoint needed.** Fetch `GET /api/offers` with no status filter (or fetch all statuses in parallel), group by status client-side.

```tsx
const data = [
  { status: "Received", count: total },
  { status: "Accepted", count: accepted },
  { status: "Countered", count: countered },
  { status: "Rejected", count: rejected },
  { status: "Expired", count: expired },
];
```

Use `<BarChart>` same pattern as 3b.

---

### 3e. Top Selling Models — Horizontal Bar Chart

**What:** Count of bikes sold grouped by model name.

**Backend work needed:**
```
GET /api/analytics/top-models?period=month&limit=10
```
Returns: `{ data: [{ model: "Honda CD 70", sold: 15 }, ...] }`

Aggregate DELIVERED orders, join `order.bike.model`, group by `modelId`, sort desc, limit 10.

**Frontend:** Use `<BarChart layout="vertical">` with `<XAxis type="number">` and `<YAxis type="category" dataKey="model">`.

---

### 3f. Payment Method Mix — Pie Chart

**What:** Transactions grouped by payment method.

**No new backend endpoint needed.** Derive from `GET /api/transactions` — group by `method` (or `gateway`) client-side.

```tsx
const data = Object.entries(
  transactions.reduce((acc, t) => {
    acc[t.gateway] = (acc[t.gateway] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([name, value]) => ({ name, value }));
```

Use same `<PieChart>` pattern as 3c.

---

### Charts layout recommendation

Wrap all 6 charts in a 2-column grid below the KPI cards. Each chart should have a title, optional period selector, and a loading skeleton while fetching. Extract each chart into its own component under `apps/admin/components/charts/`.

---

## 4. Sales Records (`/sales`)

**File:** `apps/admin/app/sales/page.tsx`

### Problems
1. Table renders one hardcoded row of `—` — no API call exists
2. Filter selectors update state but nothing re-fetches
3. Staff dropdown is hardcoded (`value="1"` / `value="2"`)
4. Branch dropdown is hardcoded (`Islamabad HQ` / `Tordher Branch`)
5. Export CSV button has no `onClick` handler

### Fix

**Fetch sales on mount and on filter change:**
```tsx
useEffect(() => {
  const fetchSales = async () => {
    setLoading(true);
    const params: any = {};
    if (filters.branch) params.branchId = filters.branch;
    if (filters.staff) params.processedById = filters.staff;
    if (filters.search) params.search = filters.search;
    // Map dateRange to dateFrom/dateTo
    if (filters.dateRange === "today") params.dateFrom = new Date().toISOString().split("T")[0];
    // etc.
    const data = await fetchOrders({ ...params, status: "DELIVERED" }); // reuse existing getOrders from lib/api/orders.ts
    setSales(data.orders || []);
    setLoading(false);
  };
  fetchSales();
}, [filters]);
```

**Populate Staff dropdown:**
```tsx
useEffect(() => {
  api.get("/auth/users?role=SALES_STAFF").then((res) => setStaffList(res.data.users));
}, []);
// render: staffList.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)
```

**Populate Branch dropdown:**
```tsx
// Already have getBranches() in lib/api/inventory.ts — call it on mount
```

**Wire Export CSV:**
```tsx
const handleExportCSV = () => {
  const headers = ["Order Number", "Customer", "Total", "Status", "Staff", "Date"];
  const rows = sales.map((s) => [s.orderNumber, s.customerName, s.negotiatedAmount, s.status, s.processedBy?.fullName || "—", new Date(s.createdAt).toLocaleDateString()]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sales.csv";
  a.click();
};
```

---

## 5. Register Sale (`/sales/new`)

**File:** `apps/admin/app/sales/new/page.tsx`

### Problems
1. `handleChassisLookup` simulates fake data — no API call
2. Part dropdown has hardcoded options
3. "Register Sale" button has no `onSubmit` handler — clicking it does nothing
4. No loading or error states

### Fix

**Chassis lookup:**
```tsx
const handleChassisLookup = async () => {
  if (!formData.chassisNumber) return;
  try {
    const res = await getBikes({ chassisNumber: formData.chassisNumber });
    const bike = res.bikes[0];
    if (!bike) { alert("Bike not found"); return; }
    setBikeDetails(bike);
    setFormData((prev) => ({
      ...prev,
      bikeId: bike.id,
      bikeModel: `${bike.model.brand} ${bike.model.modelName}`,
      bikePrice: String(bike.model.basePrice),
      salePrice: String(bike.model.basePrice),
    }));
  } catch { alert("Lookup failed"); }
};
```

Note: `GET /api/inventory/bikes` needs to support `?chassisNumber=` param. Add it to `inventory.controller.ts` query params if not already there.

**Populate Parts dropdown:**
```tsx
useEffect(() => {
  const branchId = user?.branchId;
  getParts(branchId ? { branchId } : {}).then((res) => setPartsList(res.parts));
}, []);
// render: partsList.map((p) => <option key={p.part.id} value={p.part.id}>{p.part.name} — {p.quantity} in stock</option>)
```

**Submit handler (Bike sale):**
```tsx
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await api.post("/orders", {
      bikeId: formData.bikeId,
      branchId: user?.branchId,
      customerName: formData.customerName,
      customerCNIC: formData.customerCNIC,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      negotiatedAmount: Number(formData.salePrice),
      paymentMethod: formData.paymentMethod,
    });
    router.push("/sales");
  } catch (e: any) {
    alert(e.response?.data?.message || "Failed to register sale");
  } finally { setSubmitting(false); }
};
```

**Submit handler (Part sale):**
Part sales are part orders, not bike orders. Check if `POST /api/part-orders` exists in the part-orders module. If it does, post there instead. If not, this needs a backend endpoint added.

---

## 6. Add New Part (`/parts/new`)

**File:** `apps/admin/app/parts/new/page.tsx`

### Problems
1. Form is entirely uncontrolled — no `useState` for any field
2. Branch dropdown is hardcoded
3. `sellingPrice` field is missing entirely (it's in the `Part` schema and required by `createPart` in `lib/api/inventory.ts`)
4. Save button has no `onSubmit` handler

### Fix

Add state for all fields:
```tsx
const [formData, setFormData] = useState({
  name: "", sku: "", category: "", vendorId: "", description: "",
  sellingPrice: "", branchId: "", quantity: "", reorderLevel: "",
});
```

Add `sellingPrice` input to the form between Description and Inventory section.

Populate Branch dropdown using `getBranches()` on mount (already available in `lib/api/inventory.ts`).

Wire the form submit:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    await createPart({
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      description: formData.description,
      sellingPrice: Number(formData.sellingPrice),
      branchId: formData.branchId,
      quantity: Number(formData.quantity),
      reorderLevel: Number(formData.reorderLevel),
    });
    router.push("/parts");
  } catch (e: any) {
    alert(e.response?.data?.message || "Failed to create part");
  } finally { setSubmitting(false); }
};
```

Note: `createPart` already exists in `lib/api/inventory.ts` — just call it.

---

## 7. Part Detail (`/parts/:id`)

**File:** `apps/admin/app/parts/[id]/page.tsx`

### Problem
Entire page shows static `—` placeholders. There is no `useEffect`, no state, no data fetch at all.

### Fix

Add state and fetch on mount:
```tsx
const params = useParams();
const partId = params.id as string;
const [partInventory, setPartInventory] = useState<PartInventory[] | null>(null);
const [movements, setMovements] = useState<StockMovement[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    const [partRes, movementsRes] = await Promise.all([
      getPartById(partId),          // returns { part, inventories }
      getStockMovements(partId),    // already in lib/api/inventory.ts
    ]);
    setPartInventory(partRes.inventories);
    setMovements(movementsRes.movements);
    setLoading(false);
  };
  load();
}, [partId]);
```

Replace all `—` placeholders with real values from the response:
- Information section: `part.name`, `part.sku`, `part.category`, `part.sellingPrice`, total quantity (sum across branches), `reorderLevel`
- Stock by Branch table: map over `inventories` array — one row per branch
- Recent Activity table: map over `movements` — `createdAt`, `movementType`, `quantity`, `performedBy.email`

**Backend check:** Verify `GET /api/inventory/parts/:id` returns both the part and its inventory records across branches. If it only returns the `Part` model, update the service to also include `PartInventory` with branch join.

Also verify `GET /api/inventory/parts/:id/movements` exists — `getStockMovements` in the frontend calls this path.

---

## 8. Bike Edit Page — Missing Entirely

**File to create:** `apps/admin/app/bikes/[id]/edit/page.tsx`

### Problem
The "Edit Bike" button on `/bikes/:id` links to `/bikes/:id/edit` which returns a 404. The page does not exist.

### What to build

Pre-populate form from `GET /api/inventory/bikes/:id`. Allow editing: `modelId`, `vendorId`, `branchId`, `status`. Chassis/engine numbers should be read-only after creation.

On submit, call:
```tsx
await api.patch(`/inventory/bikes/${bikeId}`, {
  modelId: formData.modelId,
  vendorId: formData.vendorId,
  branchId: formData.branchId,
  status: formData.status,
});
router.push(`/bikes/${bikeId}`);
```

**Backend check:** Verify `PATCH /api/inventory/bikes/:id` exists with full update support. If only `/status` and `/branch` patch routes exist, add a general update route.

The form structure can follow the same pattern as `/bikes/new` — copy the dropdowns for model, vendor, branch, status and pre-populate them.

---

## 9. Deliveries — Branch Filter Hardcoded

**File:** `apps/admin/app/deliveries/page.tsx`

### Problem
Branch dropdown has hardcoded `<option value="1">Islamabad HQ</option>` etc.

### Fix
```tsx
const [branches, setBranches] = useState<Branch[]>([]);
useEffect(() => {
  getBranches().then((res) => setBranches(res.branches));
}, []);
// render: branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)
```

---

## 10. Deliveries — Timeline Always Empty

**File:** `apps/admin/app/deliveries/[id]/page.tsx`

### Problem
The Delivery Timeline table always shows `—`. There is no `DeliveryStatusHistory` model in the schema, so there's no history to fetch.

### Fix (two options — pick one)

**Option A (simpler):** Remove the table entirely and replace with a visual step indicator built from the delivery's existing timestamps:
```tsx
const steps = [
  { label: "Requested", time: delivery.createdAt, done: true },
  { label: "Approved", time: delivery.approvedAt, done: !!delivery.approvedAt },
  { label: "In Transit", time: null, done: delivery.status === "IN_TRANSIT" || delivery.status === "DELIVERED" },
  { label: "Delivered", time: delivery.deliveredAt, done: !!delivery.deliveredAt },
];
```

**Option B (full history):** Add a `DeliveryStatusLog` model to `schema.prisma`:
```prisma
model DeliveryStatusLog {
  id         String   @id @default(cuid())
  deliveryId String
  delivery   DeliveryRequest @relation(fields: [deliveryId], references: [id])
  status     String
  notes      String?
  changedBy  String?
  createdAt  DateTime @default(now())
}
```
Write a log entry in `deliveries.service.ts` every time `updateDeliveryStatus` is called. Then fetch `GET /api/deliveries/:id/history` from the detail page and render the table.

---

## 11. Orders — Export CSV Button Not Wired

**File:** `apps/admin/app/orders/page.tsx`

### Problem
The Export CSV button renders but has no `onClick` handler.

### Fix
Same pattern as audit-logs which already has working CSV export:
```tsx
const handleExportCSV = () => {
  const headers = ["Order Number", "Customer", "Bike", "Branch", "Amount", "Method", "Status", "Date"];
  const rows = orders.map((o) => [
    o.orderNumber, o.customerName,
    `${o.bike?.model?.brand} ${o.bike?.model?.modelName}`,
    o.branch?.name,
    o.negotiatedAmount,
    o.paymentMethod, o.status,
    new Date(o.createdAt).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "orders.csv"; a.click();
};
```

---

## 12. Audit Logs — Sprint 13

**Frontend file:** `apps/admin/app/audit-logs/page.tsx`
**Backend file:** `apps/api/src/modules/audit-logs/audit-logs.controller.ts` + `audit-logs.service.ts`

### Problems

**Backend:**
1. `GET /api/audit-logs` ignores all query params — the controller method takes no `@Query()` at all
2. `getAllAuditLogs()` in the service omits `oldValue` and `newValue` from the select — needed for the "View Details" modal
3. The service maps `createdAt` as `createdAt` but the frontend type expects `timestamp` — reconcile this

**Frontend:**
1. Filters update state but `fetchAuditLogs` `useEffect` has an empty dependency array `[]` — it never re-runs
2. "View Details" button has no `onClick` handler
3. Export CSV exports unfiltered data regardless of active filters

### Backend fix

**`audit-logs.controller.ts`** — add query params:
```typescript
import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";

@Get()
async getAllAuditLogs(
  @Query("action") action?: string,
  @Query("entityType") entityType?: string,
  @Query("userId") userId?: string,
  @Query("dateFrom") dateFrom?: string,
  @Query("dateTo") dateTo?: string,
) {
  const auditLogs = await this.auditLogsService.getAllAuditLogs({ action, entityType, userId, dateFrom, dateTo });
  return { count: auditLogs.length, auditLogs };
}
```

**`audit-logs.service.ts`** — update `getAllAuditLogs` to accept and apply filters, and include `oldValue`/`newValue`:
```typescript
async getAllAuditLogs(filters: { action?: string; entityType?: string; userId?: string; dateFrom?: string; dateTo?: string; } = {}) {
  const where: any = {};
  if (filters.action) where.action = filters.action;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.userId) where.userId = filters.userId;
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
  }
  return this.prisma.client.auditLog.findMany({
    where,
    select: {
      id: true, action: true, entityType: true, entityId: true,
      ipAddress: true, oldValue: true, newValue: true,
      createdAt: true,
      user: { select: { id: true, email: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}
```

### Frontend fix

**Wire filters to re-fetch:**
```tsx
useEffect(() => {
  const fetchAuditLogs = async () => {
    const params: any = {};
    if (filters.action) params.action = filters.action;
    if (filters.entity) params.entityType = filters.entity;
    if (filters.user) params.userId = filters.user;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    const res = await api.get("/audit-logs", { params });
    setAuditLogs(res.data.auditLogs || []);
  };
  fetchAuditLogs();
}, [filters]); // <-- add filters here
```

**Wire "View Details" button:**
```tsx
const [detailLog, setDetailLog] = useState<any>(null);

const handleViewDetails = async (logId: string) => {
  const res = await api.get(`/audit-logs/${logId}`);
  setDetailLog(res.data);
};

// In the table cell:
<button onClick={() => handleViewDetails(log.id)} style={{ color: theme.accents.primary }}>
  View Details
</button>

// Add a modal that shows detailLog.changes[] as a table with field/oldValue/newValue columns
```

**Fix Export CSV to respect filters:**
Move the CSV generation to use the current `auditLogs` state (already filtered) — it already does this, so this is fine as-is once the fetch is re-wired.

---

## 13. Transactions — Sprint 13

**Frontend file:** `apps/admin/app/transactions/page.tsx`
**Backend file:** `apps/api/src/modules/transactions/transactions.controller.ts`

### Problems

**Backend:**
1. `GET /api/transactions` takes no query params — returns everything unfiltered
2. `POST /api/transactions/:id/refund` does not exist — called from frontend
3. `GET /api/transactions/:id/receipt` does not exist — called from frontend

**Frontend:**
1. Filter `useEffect` has empty dependency array — filters never applied
2. Branch dropdown hardcoded

### Backend fixes

**Add query param support to `getAllTransactions`:**
```typescript
@Get()
async getAllTransactions(
  @Query("status") status?: string,
  @Query("method") method?: string,
  @Query("dateFrom") dateFrom?: string,
  @Query("dateTo") dateTo?: string,
) {
  const transactions = await this.transactionsService.getAllTransactions({ status, method, dateFrom, dateTo });
  return { count: transactions.length, transactions };
}
```

Update `TransactionsService.getAllTransactions` to build a `where` clause from those params (same pattern as audit logs above).

**Add refund endpoint:**
```typescript
@Post(":id/refund")
@Roles("ADMIN")
async refundTransaction(@Param("id") id: string) {
  return this.transactionsService.refundTransaction(id);
}
```

In the service: update `PaymentTransaction.status` to `REFUNDED`, log to audit trail.

**Add receipt endpoint:**
```typescript
@Get(":id/receipt")
async downloadReceipt(@Param("id") id: string, @Res() res: Response) {
  // Generate a simple PDF receipt or return the existing order document URL
  // Minimum viable: redirect to the order's invoice document URL if it exists
  const transaction = await this.transactionsService.getTransactionById(id);
  const invoiceDoc = transaction.order?.documents?.find(d => d.fileType === "INVOICE");
  if (invoiceDoc) return res.redirect(invoiceDoc.fileUrl);
  throw new NotFoundException("Receipt not available");
}
```

### Frontend fixes

**Wire filters to re-fetch:**
```tsx
useEffect(() => {
  const fetchTransactions = async () => {
    const params: any = {};
    if (filters.status) params.status = filters.status;
    if (filters.gateway) params.method = filters.gateway;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    const res = await api.get("/transactions", { params });
    setTransactions(res.data.transactions || []);
  };
  fetchTransactions();
}, [filters]); // add filters here
```

**Populate Branch dropdown:**
```tsx
useEffect(() => {
  getBranches().then((res) => setBranches(res.branches));
}, []);
```

Note: the transactions response doesn't include `branchId` directly — this filter may need to be resolved via the order's branch. Confirm the API supports `?branchId=` before adding it to the frontend.

---

## 14. Branch Management — Sprint 13

### 14a. Create Branch — Manager Dropdown Hardcoded

**File:** `apps/admin/app/branches/new/page.tsx`

Replace:
```tsx
<option value="2">Kamran Shah (Islamabad HQ)</option>
<option value="3">Bilal Khan (Tordher Branch)</option>
```

With:
```tsx
const [managers, setManagers] = useState<User[]>([]);
useEffect(() => {
  api.get("/auth/users?role=MANAGER").then((res) => setManagers(res.data.users));
}, []);
// render:
managers.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)
```

**Backend check:** Verify `GET /api/auth/users` supports `?role=` query param filtering. If not, add it to the auth users controller.

### 14b. Branch Detail — Edit Form Manager Dropdown Also Hardcoded

**File:** `apps/admin/app/branches/[id]/page.tsx`

The `isEditing` form renders branch name/city/address/phone inputs but the Manager field is missing from the edit form entirely. Add it with the same dynamic fetch as above.

### 14c. Branch Metrics — Manager Access Blocked

**File:** `apps/api/src/modules/branch/branch.controller.ts`

`GET /api/branches/:id/metrics` is guarded with `@Roles("ADMIN")` only. Branch managers need to see their own branch metrics.

Change:
```typescript
@Roles("ADMIN")
async getBranchMetrics(@Param("id") id: string) {
```
To:
```typescript
@Roles("ADMIN", "MANAGER")
async getBranchMetrics(@Param("id") id: string, @CurrentUser() user: any) {
  // If MANAGER role, verify they can only access their own branch
  if (user.role === "MANAGER" && user.branchId !== id) {
    throw new ForbiddenException("Access denied");
  }
  return this.branchService.getBranchMetrics(id);
}
```

### 14d. Assign Staff to Branch — Not Implemented

Sprint 13 requires the ability to reassign a staff member's branch from the branch detail page. Currently the staff list is read-only.

**File:** `apps/admin/app/branches/[id]/page.tsx`

Add an "Assign Staff" or "Reassign" button next to each staff member. On click, show a dropdown to pick a new branch (for ADMIN) or confirm removal (to move them to no branch).

On confirm, call:
```tsx
await api.put(`/auth/users/${staffMember.id}`, { branchId: selectedBranchId });
```

Then re-fetch the branch detail to refresh the staff list.

### 14e. Inventory Transfer — Use Proper Endpoint

**File:** `apps/admin/app/parts/page.tsx`

The Transfer Stock modal currently does two separate `adjustStock` calls (stock-out from source, stock-in to destination). This bypasses the audit trail.

Replace with a single call to `POST /api/branches/transfer`:
```tsx
const handleTransferStock = async (e: React.FormEvent) => {
  e.preventDefault();
  await api.post("/branches/transfer", {
    partId: selectedPart?.part.id,
    fromBranchId: transferFromBranch,
    toBranchId: transferToBranch,
    quantity: parseInt(transferQuantity),
  });
  toast.success("Stock transferred successfully");
  // refetch parts...
};
```

**Backend check:** Verify `POST /api/branches/transfer` in `branch.service.ts` handles part inventory transfer and writes an audit log entry. If it only handles bike transfers, extend it to handle parts too.

---

## 15. Audit Trail Coverage

Sprint 13 requires logging for all significant events. Verify each of these writes to `AuditLog` in the API:

| Event | Module | Covered? |
|---|---|---|
| Inventory change (bike status, transfer) | `inventory.service.ts` | Verify |
| Offer state change (accept/reject/counter) | `offers.service.ts` | Verify |
| Order state change | `orders.service.ts` | Verify |
| Payment recorded | `orders.service.ts` | Verify |
| User login | `auth.service.ts` | Verify |
| User created/deactivated/updated | `auth.service.ts` | Verify |
| Branch created/updated/deleted | `branch.service.ts` | Verify |
| Stock adjustment | `inventory.service.ts` | Verify |
| Part created/updated | `inventory.service.ts` | Verify |

For any that are missing, add a call to `AuditLogsService.log(...)` (or equivalent) at the end of the relevant service method, passing `userId`, `action`, `entityType`, `entityId`, `oldValue`, `newValue`, and `ipAddress` (pass from controller via `@Req()`).

---

## Summary of new files to create

| File | Purpose |
|---|---|
| `apps/admin/app/bikes/[id]/edit/page.tsx` | Bike edit form — doesn't exist at all |
| `apps/admin/components/charts/RevenueChart.tsx` | Line chart component |
| `apps/admin/components/charts/SalesByBranchChart.tsx` | Bar chart component |
| `apps/admin/components/charts/InventoryPieChart.tsx` | Pie chart component |
| `apps/admin/components/charts/NegotiationChart.tsx` | Bar chart component |
| `apps/admin/components/charts/TopModelsChart.tsx` | Horizontal bar chart |
| `apps/admin/components/charts/PaymentMixChart.tsx` | Pie chart component |

## Summary of backend endpoints to add

| Method | Path | Module | Purpose |
|---|---|---|---|
| `GET` | `/api/analytics/revenue` | new `analytics` module or add to `orders` | Revenue over time data |
| `GET` | `/api/analytics/sales-by-branch` | same | Sales per branch |
| `GET` | `/api/analytics/top-models` | same | Top selling models |
| `GET` | `/api/auth/me` | `auth` | Rehydrate user on refresh |
| `POST` | `/api/transactions/:id/refund` | `transactions` | Initiate refund |
| `GET` | `/api/transactions/:id/receipt` | `transactions` | Download receipt PDF |
| `PATCH` | `/api/inventory/bikes/:id` | `inventory` | General bike update (not just status/branch) |
| `GET` | `/api/deliveries/:id/history` | `deliveries` | Timeline history (if Option B chosen) |
