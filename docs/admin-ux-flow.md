# Khan Enterprises Admin UX Flow Diagram

## Overview

Complete admin dashboard UX flow from login through inventory, offers, orders, sales, delivery, and analytics. Designed for ADMIN role with CEO-only features.

---

## Authentication

### Login Screen
**Route:** `/login`
**Auth Required:** No
**Visibility:** Public (only public page in admin app)

**Flow:**
1. User enters email + password
2. Submit to `POST /api/auth/login`
3. On success: access token + refresh token stored in httpOnly cookies
4. Redirect to `/dashboard`
5. On failure: inline error message (no page redirect)
6. After 3 failures: rate limiter kicks in

**States:**
- Idle: Form ready for input
- Submitting: Loading state during API call
- Error: Inline error message displayed
- Success: Redirect to dashboard

**Navigation:**
- Success → `/dashboard`
- Failure → Stay on `/login` with error

---

## Home

### Dashboard
**Route:** `/`
**Auth Required:** Yes
**Visibility:** Always visible (Entry point after login)

**Features:**
- KPIs + charts
- Revenue metrics
- Sales metrics
- Inventory counts
- Low stock alerts
- Pending items count

**Navigation:**
- To Bikes: `/bikes`
- To Parts: `/parts`
- To Offers: `/offers`
- To Orders: `/orders`
- To Sales: `/sales`
- To Delivery: `/deliveries`
- To Transactions: `/transactions` (CEO/Admin only)
- To Audit Logs: `/audit-logs` (CEO/Admin only)
- To Users: `/users` (CEO/Admin only)
- To Branches: `/branches` (CEO/Admin only)

---

## Inventory Management

### Bike Inventory List
**Route:** `/bikes`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- All serialized bike units
- Filterable by:
  - Status (AVAILABLE, SOLD, RESERVED, DAMAGED, MAINTENANCE)
  - Branch
  - Model
  - Vendor
- View unit detail
- Add new unit button

**Navigation:**
- To Bike Detail: `/bikes/:id`
- To Add Bike: `/bikes/new`
- Back to Dashboard: `/`

---

### Bike Unit Detail
**Route:** `/bikes/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Single serialized unit view
- Chassis number
- Engine number
- Model
- Vendor
- Branch
- Status
- Documents:
  - Supplier invoice (downloadable)
  - Warranty document (downloadable)
  - Registration papers (downloadable)
- Change status manually (ADMIN only)

**Navigation:**
- Back to Bike List: `/bikes`
- Edit Bike: `/bikes/:id/edit` (ADMIN only)

---

### Add Bike Unit
**Route:** `/bikes/new`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Register new stock
- Fields:
  - Chassis number (required, unique)
  - Engine number (required, unique)
  - Branch (required)
  - Model (required)
  - Vendor (required)
  - Status (default: AVAILABLE)
- File uploads:
  - Supplier invoice
  - Warranty document
  - Registration papers
- Assign to branch

**Navigation:**
- Submit → Bike Detail: `/bikes/:id`
- Cancel → Bike List: `/bikes`

---

### Parts Inventory
**Route:** `/parts`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Stock by branch
- Low stock flagged in red (quantity < reorder level)
- Restock quantity
- Transfer between branches
- Filter by branch
- Search by part name

**Navigation:**
- To Part Detail: `/parts/:id`
- To Add Part: `/parts/new`
- Back to Dashboard: `/`

---

### Part Detail
**Route:** `/parts/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Part information
- Current quantity
- Reorder level
- Branch
- Adjust stock form:
  - Quantity change (positive/negative)
  - Reason (sale, restock, damage, transfer, adjustment)
- Stock movement history table:
  - Date
  - Quantity change
  - Reason
  - User

**Navigation:**
- Back to Parts List: `/parts`
- Edit Part: `/parts/:id/edit`

---

### Add/Edit Part
**Route:** `/parts/new` or `/parts/:id/edit`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Part name (required)
- Branch (required)
- Initial quantity (required, min 0)
- Reorder level (required, default 10)
- Alert when quantity falls below reorder level

**Navigation:**
- Submit → Part Detail: `/parts/:id`
- Cancel → Parts List: `/parts`

---

## Negotiation

### Offers Inbox
**Route:** `/offers`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- All incoming offers
- Filter by:
  - Status (PENDING, ACCEPTED, REJECTED, COUNTERED, EXPIRED)
  - Branch
- Expiry timer visible on each offer
- Open offer thread button

**Navigation:**
- To Offer Thread: `/offers/:id`
- Back to Dashboard: `/`

---

### Offer Thread
**Route:** `/offers/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Full negotiation view
- Offer history
- Current price
- Customer information
- Bike information
- Actions:
  - Accept → bike reserved
  - Reject with reason
  - Counter with new price
- Expiry countdown

**Navigation:**
- Back to Offers Inbox: `/offers`
- To Bike Detail: `/bikes/:bikeId`

---

## Orders

### Orders List
**Route:** `/orders`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- All orders, all branches
- Filter by:
  - Status (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  - Date range
  - Branch
- Open order detail button
- Export CSV button

**Navigation:**
- To Order Detail: `/orders/:id`
- Back to Dashboard: `/`

---

### Order Detail
**Route:** `/orders/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Full order record
- Customer information
- Order items
- Payment status
- Payment gateway reference
- Download invoice PDF
- Cancel order button (if cancellable)

**Navigation:**
- Back to Orders List: `/orders`
- To Delivery Detail: `/deliveries/:deliveryId` (if applicable)

---

## Sales Registration

### Sales Records
**Route:** `/sales`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- All registered sales
- Filter by:
  - Date range
  - Staff
  - Branch
- View sale agreement button
- Register new sale button

**Navigation:**
- To Sale Detail: `/sales/:id`
- To Register Sale: `/sales/new`
- Back to Dashboard: `/`

---

### Register Sale
**Route:** `/sales/new`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Manual sale entry
- Chassis lookup → autofill bike details
- Customer CNIC
- Customer name
- Customer phone
- Customer address
- Sale price
- Payment method
- Auto-generate PDFs:
  - Sale agreement
  - Invoice

**Navigation:**
- Submit → Sale Detail: `/sales/:id`
- Cancel → Sales Records: `/sales`

---

### Sale Detail
**Route:** `/sales/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Sale information
- Bike details
- Customer information
- Sale price
- Payment method
- Download sale agreement PDF
- Download invoice PDF

**Navigation:**
- Back to Sales Records: `/sales`
- To Bike Detail: `/bikes/:bikeId`

---

## Delivery Management

### Delivery Queue
**Route:** `/deliveries`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- All delivery requests
- Filter by:
  - Status (PENDING, APPROVED, IN_TRANSIT, DELIVERED, CANCELLED)
  - Branch
- Review request button
- Sort by date requested

**Navigation:**
- To Delivery Detail: `/deliveries/:id`
- Back to Dashboard: `/`

---

### Delivery Detail
**Route:** `/deliveries/:id`
**Auth Required:** Yes
**Visibility:** Feature screen

**Features:**
- Single delivery record
- Order information
- Customer information
- Delivery address
- Requested date
- Current status
- Actions:
  - Approve → APPROVED
  - Mark in transit → IN_TRANSIT
  - Confirm delivered → DELIVERED
  - Cancel → CANCELLED

**Navigation:**
- Back to Delivery Queue: `/deliveries`
- To Order Detail: `/orders/:orderId`

---

## CEO / Admin Only Features

### Transactions
**Route:** `/transactions`
**Auth Required:** Yes
**Visibility:** CEO/Admin only

**Features:**
- All payment records
- Filter by:
  - Date range
  - Status
  - Payment method
- Initiate refund button
- Download receipt button

**Navigation:**
- Back to Dashboard: `/`

---

### Audit Logs
**Route:** `/audit-logs`
**Auth Required:** Yes
**Visibility:** CEO/Admin only

**Features:**
- Immutable event trail
- Filter by:
  - User
  - Action
  - Date range
- Export CSV button
- Log details:
  - Timestamp
  - User
  - Action
  - Details

**Navigation:**
- Back to Dashboard: `/`

---

### User Management
**Route:** `/users`
**Auth Required:** Yes
**Visibility:** CEO/Admin only

**Features:**
- Staff accounts list
- Create staff account button
- Assign role + branch
- Deactivate user button
- User details:
  - Email
  - Role
  - Branch
  - Status

**Navigation:**
- To User Detail: `/users/:id`
- To Create User: `/users/new`
- Back to Dashboard: `/`

---

### Branch Management
**Route:** `/branches`
**Auth Required:** Yes
**Visibility:** CEO/Admin only

**Features:**
- Locations + managers
- Add branch button
- Branch performance metrics
- Stock transfers between branches
- Branch details:
  - Name
  - Location
  - Manager
  - Inventory count
  - Staff count

**Navigation:**
- To Branch Detail: `/branches/:id`
- To Add Branch: `/branches/new`
- Back to Dashboard: `/`

---

## Navigation Structure

### Always Visible (Navigation Bar)
- Dashboard (`/`)
- Bikes (`/bikes`)
- Parts (`/parts`)
- Offers (`/offers`)
- Orders (`/orders`)
- Sales (`/sales`)
- Delivery (`/deliveries`)
- Transactions (`/transactions`) - CEO/Admin only
- Audit Logs (`/audit-logs`) - CEO/Admin only
- Users (`/users`) - CEO/Admin only
- Branches (`/branches`) - CEO/Admin only
- Logout

### Role-Based Visibility
- **ADMIN**: All features
- **MANAGER**: Dashboard, Bikes, Parts, Offers, Orders, Sales, Delivery
- **SALES_STAFF**: Dashboard, Bikes (view only), Parts (view only), Offers, Orders, Sales, Delivery

---

## Error States

### Login Errors
- Invalid credentials: Inline error message
- Rate limit exceeded: "Too many attempts, please try again later"
- Network error: "Connection failed, please check your internet"

### General Errors
- 401 Unauthorized: Redirect to login
- 403 Forbidden: "You don't have permission to access this page"
- 404 Not Found: "Page not found"
- 500 Server Error: "Something went wrong, please try again"

---

## Loading States

### Form Submission
- Disable submit button
- Show loading spinner
- Display "Submitting..." text

### Data Fetching
- Show skeleton loaders
- Display loading spinner
- Show "Loading..." text

---

## Success States

### Form Submission
- Show success message
- Redirect to appropriate page
- Clear form data

### Actions
- Show success toast notification
- Refresh data
- Update UI state

---

## Responsive Design

### Desktop (1024px+)
- Full navigation bar
- Side-by-side layouts
- Large tables with all columns

### Tablet (768px - 1023px)
- Collapsible navigation
- Stacked layouts
- Scrollable tables

### Mobile (< 768px)
- Hamburger menu
- Single column layouts
- Card-based views instead of tables
- Bottom navigation for key actions

---

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers
- ARIA labels on all interactive elements
- Semantic HTML structure
- Alt text on images
- Focus indicators

### Color Contrast
- WCAG AA compliant color ratios
- Text readable on all backgrounds
- Focus states clearly visible

---

## Performance

### Page Load
- Initial load < 2 seconds
- Subsequent loads < 1 second
- Lazy loading for images
- Code splitting for routes

### Data Fetching
- Optimistic UI updates
- Background refresh for stale data
- Pagination for large lists
- Debounced search inputs

---

## Security

### Authentication
- JWT tokens in httpOnly cookies
- Automatic token refresh
- Logout clears all tokens
- Session timeout after inactivity

### Authorization
- Role-based access control on all routes
- Server-side validation
- Client-side permission checks
- Audit logging for sensitive actions

### Data Protection
- HTTPS only in production
- Input sanitization
- XSS prevention
- CSRF protection

---

## Analytics

### Tracked Events
- Page views
- Feature usage
- Form submissions
- Error occurrences
- Performance metrics

### User Behavior
- Time spent on pages
- Navigation paths
- Feature adoption
- Drop-off points
- Conversion rates
