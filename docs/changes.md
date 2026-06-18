# Updated Implementation Plan for Khan Enterprises

---

## DATABASE SCHEMA CHANGES

### 1. Payment Verification System
**Changes to `PaymentTransaction` and `PartPaymentTransaction`:**
- Add `paymentProofUrl` (String?) - for customer-uploaded payment proof
- Add `verifiedAt` (DateTime?) - timestamp when admin verifies payment
- Add `verifiedById` (String?) - admin who verified the payment
- Add new enum value `VERIFICATION_PENDING` to `PaymentStatus` 

**Changes to `Order` and `PartOrder`:**
- Add `paymentVerified` (Boolean @default(false))
- Add `orderType` (Enum: ONLINE, ONSITE)
- Add `reservationExpiry` (DateTime?) - for 2-day cash reservation buffer
- Add `pickupType` (Enum: DELIVERY, ONSITE_PICKUP)

### 2. Remove Refund Functionality
**Changes to enums:**
- Remove `REFUNDED` from `PaymentStatus` 
- Remove `REFUND` from `AuditAction` 

### 3. Sales Registration
**Changes to `BikeUnit`:**
- Add `onlineDiscountPercent` (Decimal @default(2))
- Add `actualSalePrice` (Decimal?) - for onsite sales override

**Changes to `Order`:**
- Add `isOnlineOrder` (Boolean)
- Add `appliedDiscount` (Decimal?)

### 4. Order Alerts
**New model `OrderAlert`:**
```prisma
model OrderAlert {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  isRead      Boolean  @default(false)
  alertType   String   // NEW_ORDER, PAYMENT_PENDING, EXPIRY_WARNING
  createdAt   DateTime @default(now())
  
  @@index([userId, isRead])
}
```

**Add relation to `User`:**
- Add `orderAlerts OrderAlert[]` 

---

## BACKEND API CHANGES

### 1. Payment Verification Endpoints
**New endpoints in [orders.controller.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.controller.ts:0:0-0:0):**
- `POST /orders/:id/upload-payment-proof` - Upload payment proof image
- `POST /orders/:id/verify-payment` - Admin verifies payment
- `GET /orders/pending-verification` - Get orders awaiting verification

**Service changes in [orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:0:0-0:0):**
- Modify [recordPayment()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:402:2-508:3) to not auto-verify for non-cash payments
- Add [verifyPayment()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:889:2-993:3) method
- Add [uploadPaymentProof()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:840:2-887:3) method
- Update order status flow: PENDING_PAYMENT → PAYMENT_VERIFICATION_PENDING → PAID

**Payment proof routing:**
- Branch Managers receive alerts for their branch orders
- Super Admins receive alerts for all orders

### 2. Remove Refund Logic
**Changes to [orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:0:0-0:0):**
- Remove refund-related audit log entries in [cancelOrder()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:311:2-400:3)
- Remove `REFUNDED` status handling
- Update payment transaction status transitions

### 3. Sales Registration Logic
**Modify [orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:0:0-0:0):**
- Update [createManualOrder()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:563:2-647:3) to accept `orderType` (ONLINE/ONSITE)
- For ONLINE: auto-apply 2% discount from base price
- For ONSITE: allow any price via `actualSalePrice` field (no validation)
- Add `registerOnlineSale()` method
- Add `registerOnsiteSale()` method

### 4. Order Alerts System (Real-time via WebSockets)
**New module `order-alerts.module.ts`:**
- `GET /order-alerts` - Get alerts for current user
- `PUT /order-alerts/:id/read` - Mark alert as read
- WebSocket gateway for real-time alert delivery
- Service creates alerts based on user role/domain

**WebSocket Gateway:**
- Real-time push of alerts to connected clients
- Filter alerts by user role and branch
- Handle connection/disconnection events

**Modify [orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:0:0-0:0):**
- Trigger alert creation on order creation
- Trigger alert on payment verification pending
- Trigger alert on reservation expiry

**Alert logic by role:**
- ADMIN: All orders across all branches
- MANAGER: Orders for their branch only
- SALES_STAFF: Orders for their branch + their assigned vendor

### 5. Revenue Filtering
**Modify [orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/orders/orders.service.ts:0:0-0:0):**
- Add `revenueSummary` method with filters:
  - `duration`: WEEKLY, MONTHLY, ANNUAL, CUSTOM
  - `dateFrom`, `dateTo` for custom range
  - `branchId` for branch-specific revenue
- Add similar method for [part-orders.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/part-orders/part-orders.service.ts:0:0-0:0)

**New DTO `RevenueQueryDto`:**
```typescript
duration: 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'CUSTOM'
dateFrom?: Date
dateTo?: Date
branchId?: string
```

### 6. Reservation Expiry
**New scheduler task in [scheduler.module.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/scheduler/scheduler.module.ts:0:0-0:0):**
- Check every hour for expired reservations (2-day buffer for cash)
- Auto-expire: Order status → CANCELLED, Bike status → AVAILABLE
- Create audit log for expiry
- Send real-time alert to relevant admins via WebSocket

**Modify `offers.service.ts`:**
- Update `acceptOffer()` to set 2-day expiry for cash onsite pickup
- For online paid orders: no expiry (late pickup allowed)

---

## FRONTEND ADMIN CHANGES

### 1. Layout Fix for Collapsible Sidebar
**File: `apps/admin/app/layout.tsx`**
- Modify main content area to use `ml-0 lg:ml-[260px]` transition
- Add responsive margin based on sidebar state
- Ensure content adjusts smoothly when sidebar collapses

**File: `apps/admin/components/navigation.tsx`**
- Already has collapse logic - ensure parent layout responds to `collapsed` state
- Consider using context or state management for sidebar width

### 2. Payment Verification UI
**New page: `apps/admin/app/orders/verification/page.tsx`**
- List orders with pending payment verification
- Show payment proof images
- Approve/Reject buttons for each
- Filter by branch/domain

**Modify: `apps/admin/app/orders/page.tsx`**
- Add badge for "Payment Verification Pending"
- Add verification status column
- Quick action to verify payment

### 3. Sales Registration Form
**Modify: `apps/admin/app/sales/page.tsx`**
- Add radio button: Online vs Onsite sale
- If Online: Auto-calculate price at 2% discount (read-only)
- If Onsite: Show editable "Actual Sale Price" field (allow any price)
- Show base price for reference
- No price validation for onsite sales

### 4. Order Alerts UI (Real-time)
**Add notification bell in navigation:**
- Show unread count badge
- Dropdown to show recent alerts
- Click to mark as read and navigate to relevant order
- WebSocket connection for real-time updates

**New page: `apps/admin/app/alerts/page.tsx`**
- Full list of alerts with filters
- Mark all as read button
- Filter by alert type
- Real-time updates via WebSocket

**WebSocket Integration:**
- Connect to WebSocket gateway on app load
- Handle incoming alert messages
- Update UI in real-time
- Reconnect on disconnect

### 5. Revenue Dashboard with Filters
**Modify: `apps/admin/app/page.tsx` (Dashboard)**
- Add duration filter dropdown: Weekly, Monthly, Annual, Custom Range
- Add date range picker for custom filter
- Show revenue charts based on selected duration
- Break down by branch if user is MANAGER/ADMIN
- Show comparison with previous period

### 6. Remove Refund UI
**Modify: `apps/admin/app/orders/[id]/page.tsx`**
- Remove refund button/option
- Remove refund status indicators
- Update order status flow to exclude refund states

### 7. Reservation Expiry Dashboard
**Modify: `apps/admin/app/page.tsx`**
- Add section for "Expiring Reservations" (next 24 hours)
- Show cancelled reservations count
- Link to view expired/cancelled orders
- Real-time updates via WebSocket

---

## FRONTEND CUSTOMER CHANGES

### 1. Branch Info on Item Cards
**Modify: `apps/web/app/bikes/page.tsx`**
- Add branch name to bike card (already shown on line 280)
- Add branch city/location
- Make branch filter more prominent

**Modify: `apps/web/app/parts/page.tsx`**
- Add branch filter to parts page (currently missing)
- Show branch info on part cards
- Add branch availability indicator

### 2. Remove Negotiation, Add 2% Online Offer
**Modify: `apps/web/app/bikes/[id]/page.tsx`**
- Remove negotiation form/counter-offer UI
- Replace with "Buy Online" button showing 2% discounted price
- Show: "Online Price: PKR X (2% discount applied)"
- Keep "Visit Branch" option for onsite purchases

**Modify: `apps/web/app/offers/page.tsx`**
- Remove offer creation functionality
- Show message: "Online orders receive automatic 2% discount"
- Redirect to direct order flow

### 3. Payment Proof Upload
**Modify: Order confirmation page**
- After order creation, show payment proof upload
- Upload screenshot/image of transaction
- Show status: "Awaiting verification"
- Disable order completion until verified

### 4. Reservation Display
**Modify: Customer orders page**
- Show reservation expiry date for cash orders
- Show "Paid - Ready for pickup" for online orders
- Hide reserved items from inventory browsing
- Show pickup deadline for cash reservations

### 5. Remove Refund Requests
**Modify: Customer order detail page**
- Remove refund request button
- Update status display to exclude refund states

---

## IMPLEMENTATION PRIORITY ORDER

### Phase 1: Database & Core Backend (Critical)
1. Database schema changes (Prisma migration)
2. Payment verification system
3. Remove refund logic
4. Sales registration logic

### Phase 2: Admin Frontend (High Priority)
5. Admin layout fix for sidebar
6. Payment verification UI
7. Sales registration form updates
8. Revenue filters on dashboard

### Phase 3: Customer Frontend (High Priority)
9. Branch info and filtering on item cards
10. Remove negotiation, add 2% discount
11. Payment proof upload

### Phase 4: Advanced Features (Medium Priority)
12. Order alerts system with WebSocket gateway
13. Reservation expiry scheduler
14. Real-time alert UI integration