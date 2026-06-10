# Delivery Management System - Implementation Guide

## Overview
This document provides a comprehensive overview of the Delivery Management System implementation for Phase 6 of the Khan Dealership Platform.

## Architecture

### Database Schema
The delivery system uses the following Prisma models:

#### DeliveryRequest Model
```prisma
model DeliveryRequest {
  id                   String        @id @default(uuid())
  orderId              String        @unique
  order                Order         @relation(fields: [orderId], references: [id])
  deliveryAddress      String
  preferredTimeWindow  String?
  contactNumber        String
  status               DeliveryStatus @default(REQUESTED)
  approvedAt           DateTime?
  deliveredAt          DateTime?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
}
```

#### DeliveryStatus Enum
```prisma
enum DeliveryStatus {
  REQUESTED
  UNDER_REVIEW
  APPROVED
  IN_TRANSIT
  DELIVERED
}
```

### State Transitions
The system enforces valid state transitions:
- **REQUESTED** → UNDER_REVIEW → APPROVED
- **REQUESTED** → APPROVED (fast-track)
- **UNDER_REVIEW** → REQUESTED (return for review)
- **UNDER_REVIEW** → APPROVED
- **APPROVED** → IN_TRANSIT
- **APPROVED** → UNDER_REVIEW (revoke approval)
- **IN_TRANSIT** → DELIVERED
- **IN_TRANSIT** → APPROVED (return to approved)
- **DELIVERED** → (terminal state)

## Backend Implementation

### API Endpoints

#### 1. Create Delivery Request
- **Endpoint**: `POST /api/deliveries/order/:orderId`
- **Roles**: CUSTOMER
- **Description**: Creates a delivery request for a confirmed order
- **Request Body**:
  ```typescript
  {
    deliveryAddress: string;
    preferredTimeWindow?: string;
    contactNumber: string;
  }
  ```
- **Side Effects**:
  - Creates DeliveryRequest with status REQUESTED
  - Updates Order status to READY_FOR_DELIVERY
  - Updates Bike status to IN_DELIVERY

#### 2. Get Deliveries List
- **Endpoint**: `GET /api/deliveries`
- **Roles**: ADMIN, MANAGER, SALES_STAFF, CUSTOMER
- **Query Parameters**:
  - `status`: Filter by delivery status
  - `branchId`: Filter by branch (ADMIN/MANAGER only)
  - `orderId`: Filter by order ID
  - `dateFrom`: Filter by creation date (from)
  - `dateTo`: Filter by creation date (to)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response**: Paginated list of delivery requests with order details

#### 3. Get Delivery Statistics
- **Endpoint**: `GET /api/deliveries/stats`
- **Roles**: ADMIN, MANAGER
- **Query Parameters**:
  - `branchId`: Optional branch filter
- **Response**:
  ```typescript
  {
    total: number;
    requested: number;
    underReview: number;
    approved: number;
    inTransit: number;
    delivered: number;
  }
  ```

#### 4. Get Delivery by ID
- **Endpoint**: `GET /api/deliveries/:id`
- **Roles**: ADMIN, MANAGER, SALES_STAFF, CUSTOMER
- **Response**: Full delivery details with order, bike, branch information

#### 5. Get Delivery by Order ID
- **Endpoint**: `GET /api/deliveries/order/:orderId`
- **Roles**: ADMIN, MANAGER, SALES_STAFF, CUSTOMER
- **Response**: Delivery details for specific order

#### 6. Update Delivery Status
- **Endpoint**: `PATCH /api/deliveries/:id/status`
- **Roles**: ADMIN, MANAGER
- **Request Body**:
  ```typescript
  {
    status: DeliveryStatus;
    notes?: string;
  }
  ```
- **Side Effects**:
  - Updates delivery status
  - Sets approvedAt timestamp when status becomes APPROVED
  - Sets deliveredAt timestamp when status becomes DELIVERED
  - When DELIVERED: updates Order status to DELIVERED and Bike status to SOLD
  - Creates audit log entry for status change

### Backend Files Structure
```
apps/api/src/modules/deliveries/
├── dto/
│   ├── create-delivery.dto.ts
│   ├── update-delivery-status.dto.ts
│   └── query-deliveries.dto.ts
├── deliveries.controller.ts
├── deliveries.service.ts
└── deliveries.module.ts
```

## Frontend Implementation

### Customer Web App (apps/web)

#### Delivery Request Flow
**Location**: `apps/web/app/orders/[orderNumber]/page.tsx`

**Customer Flow**:
1. Customer views order status page
2. When order status is CONFIRMED and no delivery exists, "Request Delivery" button appears
3. Customer clicks button to open delivery form
4. Customer fills in:
   - Delivery Address (required)
   - Preferred Time Window (optional)
   - Contact Number (required)
5. Submission creates delivery request in REQUESTED state
6. Order status updates to READY_FOR_DELIVERY
7. Delivery timeline shows delivery status

**API Client**: `apps/web/lib/api/deliveries.ts`

### Admin Dashboard (apps/admin)

#### Delivery Queue
**Location**: `apps/admin/app/deliveries/page.tsx`

**Features**:
- Statistics cards showing delivery counts by status
- Filterable table by status and branch
- Branch filtering restricted to user's branch for non-admins
- Real-time data fetching
- Status badges with color coding
- Click to review individual delivery

#### Delivery Detail Management
**Location**: `apps/admin/app/deliveries/[id]/page.tsx`

**Features**:
- Complete delivery information display
- Order details (number, date, status)
- Customer information (name, phone, address)
- Delivery information (address, time window, contact number)
- Current status with visual indicator
- Dynamic action buttons based on current status
- Status transition validation
- Notes modal for status changes
- Contact customer button (tel: link)
- Navigation to order details

**Admin Flow**:
1. Admin views delivery queue
2. Filters by status/branch as needed
3. Clicks "Review" on a delivery
4. Reviews all delivery details
5. Takes action based on current status:
   - REQUESTED: Can move to UNDER_REVIEW or APPROVED
   - UNDER_REVIEW: Can move to APPROVED or return to REQUESTED
   - APPROVED: Can move to IN_TRANSIT or return to UNDER_REVIEW
   - IN_TRANSIT: Can mark DELIVERED or return to APPROVED
   - DELIVERED: No actions (terminal state)
6. Optionally adds notes for status change
7. Can contact customer via phone
8. Can view full order details

**API Client**: `apps/admin/lib/api/deliveries.ts`

## Integration Points

### Order Flow Integration
1. Order created → PENDING_PAYMENT
2. Payment recorded → PAID
3. Order confirmed → CONFIRMED
4. Customer requests delivery → READY_FOR_DELIVERY
5. Delivery approved → APPROVED
6. Delivery in transit → IN_TRANSIT
7. Delivery completed → DELIVERED

### Bike Status Integration
1. Bike available → AVAILABLE
2. Order confirmed → SOLD (if paid)
3. Delivery requested → IN_DELIVERY
4. Delivery completed → SOLD

### Audit Trail
All delivery status changes are logged in the AuditLog table with:
- User ID who made the change
- User role
- Action type (UPDATE)
- Entity type (DeliveryRequest)
- Entity ID
- Old value (previous status)
- New value (new status + notes)

## Security Considerations

### Role-Based Access Control
- **CUSTOMER**: Can only create delivery requests and view their own deliveries
- **SALES_STAFF**: Can view all deliveries in their branch
- **MANAGER**: Can view and manage deliveries in their branch
- **ADMIN**: Can view and manage all deliveries across all branches

### Data Validation
- Delivery requests only allowed for CONFIRMED orders
- Only one delivery request per order
- State transitions validated on backend
- Required fields validated (address, contact number)
- Phone number format validation

### Branch Isolation
- Non-admin users automatically filtered to their branch
- Branch filter disabled for non-admins in UI
- Backend enforces branch access rules

## Testing Checklist

### Backend Testing
- [ ] Create delivery request for confirmed order
- [ ] Prevent duplicate delivery requests
- [ ] Prevent delivery request for non-confirmed orders
- [ ] Test all valid state transitions
- [ ] Test invalid state transitions (should fail)
- [ ] Verify order status updates on delivery completion
- [ ] Verify bike status updates on delivery completion
- [ ] Test audit log creation
- [ ] Test branch filtering for different roles
- [ ] Test pagination and filtering

### Frontend Testing
- [ ] Customer can see "Request Delivery" button for confirmed orders
- [ ] Customer cannot request delivery for non-confirmed orders
- [ ] Delivery form validation works correctly
- [ ] Delivery request submission updates UI
- [ ] Admin dashboard shows correct statistics
- [ ] Admin can filter deliveries by status and branch
- [ ] Admin can view delivery details
- [ ] Admin can update delivery status
- [ ] Status transition buttons show correctly
- [ ] Notes modal works correctly
- [ ] Contact customer button works
- [ ] Navigation to order details works

### End-to-End Testing
- [ ] Complete customer delivery request flow
- [ ] Complete admin approval flow
- [ ] Complete delivery completion flow
- [ ] Verify status updates across customer and admin views
- [ ] Test with multiple branches
- [ ] Test with different user roles

## Future Enhancements

### Notification System
- SMS notifications to customer on status changes
- Email notifications for delivery updates
- In-app notifications for admins
- WhatsApp integration for customer communication

### Advanced Features
- Delivery route optimization
- Real-time delivery tracking
- Delivery driver assignment
- Delivery time slot management
- Delivery cost calculation
- Delivery proof of delivery (photos, signatures)

### Reporting
- Delivery performance metrics
- Average delivery time by branch
- Customer satisfaction ratings
- Delivery delay analysis
- Branch comparison reports

## Troubleshooting

### Common Issues

**Issue**: Customer cannot see "Request Delivery" button
- **Solution**: Verify order status is CONFIRMED and no delivery exists

**Issue**: Admin cannot update delivery status
- **Solution**: Check user role (ADMIN/MANAGER required) and verify state transition is valid

**Issue**: Delivery statistics not showing
- **Solution**: Ensure user has appropriate role and branch filter is correct

**Issue**: Status transition fails
- **Solution**: Verify the transition is valid according to state machine rules

## API Response Examples

### Create Delivery Request
```json
{
  "id": "uuid",
  "orderId": "uuid",
  "deliveryAddress": "123 Main St, City",
  "preferredTimeWindow": "9AM - 12PM",
  "contactNumber": "+923001234567",
  "status": "REQUESTED",
  "approvedAt": null,
  "deliveredAt": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-001",
    "status": "READY_FOR_DELIVERY",
    "customerName": "John Doe",
    "customerPhone": "+923001234567",
    "negotiatedAmount": 150000,
    "bike": {
      "id": "uuid",
      "chassisNumber": "ABC123",
      "model": {
        "brand": "Honda",
        "modelName": "CG125",
        "year": 2024
      }
    },
    "branch": {
      "id": "uuid",
      "name": "Islamabad HQ",
      "city": "Islamabad"
    }
  }
}
```

### Delivery Statistics
```json
{
  "total": 50,
  "requested": 10,
  "underReview": 5,
  "approved": 15,
  "inTransit": 12,
  "delivered": 8
}
```

## Conclusion
The Delivery Management System provides a complete end-to-end solution for managing bike deliveries from customer request to final delivery. The system includes proper state management, role-based access control, audit trails, and integration with the existing order and inventory systems.
