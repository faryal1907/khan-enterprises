# Customer Notification System Implementation Plan

## Overview
This plan outlines the implementation of Firebase push notifications for customers on the web app, mirroring the admin notification system. Customers will receive notifications when their order status, payment status, or delivery status changes.

## Current State Analysis

### Admin Side (Reference Implementation)
- **Firebase Client**: `apps/admin/hooks/usePushNotifications.ts`, `apps/admin/lib/firebase.ts`
- **Service Worker**: `apps/admin/public/firebase-messaging-sw.js`
- **Backend Service**: `apps/api/src/modules/firebase/firebase.service.ts`
- **Token Registration**: `POST /firebase/register-token`
- **Alert Service**: `apps/api/src/modules/order-alerts/order-alerts.service.ts`

### Web App (Customer Side)
- **Current Status**: No Firebase implementation exists
- **Target**: Replicate admin pattern for customer notifications

### Backend Status Update Endpoints (Notification Triggers)
1. **Order Status**: `PATCH /api/orders/:id/status` - `orders.service.ts:updateOrderStatus()`
2. **Payment Verification**: `POST /api/orders/:id/verify-payment` - `orders.service.ts:verifyPayment()`
3. **Delivery Status**: `PATCH /api/deliveries/:id/status` - `deliveries.service.ts:updateDeliveryStatus()`
4. **Part Order Status**: Similar endpoints in `part-orders.service.ts`

## Implementation Plan

### Phase 1: Web App Firebase Setup

#### 1.1 Install Firebase Dependencies
```bash
cd apps/web
npm install firebase
```

#### 1.2 Create Firebase Configuration File
**File**: `apps/web/lib/firebase.ts`
- Initialize Firebase app with environment variables
- Export `requestForToken()` function
- Export `onMessageListener()` function
- Mirror `apps/admin/lib/firebase.ts` structure

#### 1.3 Create Push Notification Hook
**File**: `apps/web/hooks/usePushNotifications.ts`
- Register service worker on mount
- Request FCM token when user authenticated
- Send token to backend via `POST /firebase/register-token`
- Listen for foreground messages and display toasts
- Mirror `apps/admin/hooks/usePushNotifications.ts` structure

#### 1.4 Create Service Worker
**File**: `apps/web/public/firebase-messaging-sw.js`
- Handle background messages
- Show notifications when app is closed/minimized
- Handle notification clicks to navigate to order details
- Mirror `apps/admin/public/firebase-messaging-sw.js` structure

#### 1.5 Create Notification Provider Component
**File**: `apps/web/components/push-notification-provider.tsx`
- Wrap the hook in a provider component
- Add to root layout

#### 1.6 Add to Root Layout
**File**: `apps/web/app/layout.tsx`
- Import and render `PushNotificationProvider`

#### 1.7 Add Environment Variables
**File**: `apps/web/.env.local`
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

### Phase 2: Backend Notification Triggers

#### 2.1 Extend Alert Types
**File**: `apps/api/src/modules/order-alerts/dto/get-alerts.dto.ts`
Add new alert types for customers:
```typescript
export enum AlertType {
  // Existing
  NEW_ORDER = "NEW_ORDER",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  DELIVERY_REQUEST = "DELIVERY_REQUEST",
  
  // New customer-specific alerts
  ORDER_STATUS_UPDATED = "ORDER_STATUS_UPDATED",
  PAYMENT_VERIFIED = "PAYMENT_VERIFIED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  DELIVERY_STATUS_UPDATED = "DELIVERY_STATUS_UPDATED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  ORDER_DELIVERED = "ORDER_DELIVERED",
}
```

#### 2.2 Add Customer Notification Method to OrderAlertsService
**File**: `apps/api/src/modules/order-alerts/order-alerts.service.ts`

Add new method:
```typescript
async createCustomerAlertForOrder(
  orderId: string, 
  customerId: string, 
  alertType: AlertType,
  message?: string
) {
  const order = await this.prisma.client.order.findUnique({
    where: { id: orderId },
    include: { bike: { include: { model: true } } },
  });

  if (!order) return;

  // Get customer user record
  const customer = await this.prisma.client.user.findUnique({
    where: { id: customerId },
  });

  if (!customer) return;

  // Create alert
  const alert = await this.prisma.client.orderAlert.create({
    data: {
      orderId,
      userId: customerId,
      alertType,
      isRead: false,
    },
  });

  // Dispatch to Gateway (if customer is online)
  this.gateway.sendAlertToUser(customerId, alert);

  // Send push notification
  let title = "Order Update";
  let body = message || `Your order ${order.orderNumber} has been updated.`;
  
  if (alertType === AlertType.PAYMENT_VERIFIED) {
    title = "Payment Verified";
    body = `Your payment for order ${order.orderNumber} has been verified.`;
  } else if (alertType === AlertType.PAYMENT_FAILED) {
    title = "Payment Failed";
    body = `Your payment for order ${order.orderNumber} could not be verified. Please try again.`;
  } else if (alertType === AlertType.ORDER_STATUS_UPDATED) {
    title = "Order Status Updated";
    body = `Your order ${order.orderNumber} status is now ${order.status}.`;
  } else if (alertType === AlertType.ORDER_CANCELLED) {
    title = "Order Cancelled";
    body = `Your order ${order.orderNumber} has been cancelled.`;
  } else if (alertType === AlertType.ORDER_DELIVERED) {
    title = "Order Delivered";
    body = `Your order ${order.orderNumber} has been delivered successfully!`;
  }

  await this.dispatchPushNotification(
    customer,
    title,
    body,
    { url: `/orders/${order.id}` }
  );

  return alert;
}
```

#### 2.3 Add Customer Notification Method for Part Orders
**File**: `apps/api/src/modules/order-alerts/order-alerts.service.ts`

Similar method for part orders:
```typescript
async createCustomerAlertForPartOrder(
  partOrderId: string,
  customerId: string,
  alertType: AlertType,
  message?: string
) {
  // Similar implementation for part orders
  // URL should be `/part-orders/${partOrderId}`
}
```

#### 2.4 Add Customer Notification Method for Delivery Status
**File**: `apps/api/src/modules/order-alerts/order-alerts.service.ts`

```typescript
async createCustomerAlertForDeliveryStatus(
  deliveryRequestId: string,
  customerId: string,
  newStatus: DeliveryStatus
) {
  const delivery = await this.prisma.client.deliveryRequest.findUnique({
    where: { id: deliveryRequestId },
    include: {
      order: true,
      partOrder: true,
    },
  });

  if (!delivery) return;

  const customer = await this.prisma.client.user.findUnique({
    where: { id: customerId },
  });

  if (!customer) return;

  // Create alert
  const alert = await this.prisma.client.orderAlert.create({
    data: {
      orderId: delivery.orderId,
      partOrderId: delivery.partOrderId,
      userId: customerId,
      alertType: AlertType.DELIVERY_STATUS_UPDATED,
      isRead: false,
    },
  });

  this.gateway.sendAlertToUser(customerId, alert);

  const orderNumber = delivery.order?.orderNumber || delivery.partOrder?.orderNumber;
  const url = delivery.orderId ? `/orders/${delivery.orderId}` : `/part-orders/${delivery.partOrderId}`;

  let title = "Delivery Update";
  let body = `Delivery status for order ${orderNumber} is now ${newStatus}.`;

  if (newStatus === DeliveryStatus.APPROVED) {
    title = "Delivery Approved";
    body = `Your delivery for order ${orderNumber} has been approved.`;
  } else if (newStatus === DeliveryStatus.IN_TRANSIT) {
    title = "Out for Delivery";
    body = `Your order ${orderNumber} is out for delivery.`;
  } else if (newStatus === DeliveryStatus.DELIVERED) {
    title = "Delivered";
    body = `Your order ${orderNumber} has been delivered!`;
  }

  await this.dispatchPushNotification(
    customer,
    title,
    body,
    { url }
  );

  return alert;
}
```

### Phase 3: Integrate Notification Triggers

#### 3.1 Order Status Updates
**File**: `apps/api/src/modules/orders/orders.service.ts`

Modify `updateOrderStatus()` method to trigger customer notifications:

```typescript
async updateOrderStatus(id: string, dto: UpdateOrderStatusDto, user: any) {
  const order = await this.getOrderById(id, user);
  const currentStatus = order.status as OrderStatus;
  const newStatus = dto.status;

  // ... existing validation and transaction logic ...

  const updatedOrder = await this.prisma.client.$transaction(async (tx) => {
    // ... existing update logic ...
    return updatedOrder;
  });

  // AFTER transaction commits, send customer notification
  if (order.customerId && currentStatus !== newStatus) {
    let alertType = AlertType.ORDER_STATUS_UPDATED;
    
    if (newStatus === OrderStatus.CANCELLED) {
      alertType = AlertType.ORDER_CANCELLED;
    } else if (newStatus === OrderStatus.DELIVERED) {
      alertType = AlertType.ORDER_DELIVERED;
    }

    await this.orderAlertsService.createCustomerAlertForOrder(
      id,
      order.customerId,
      alertType
    );
  }

  return updatedOrder;
}
```

#### 3.2 Payment Verification
**File**: `apps/api/src/modules/orders/orders.service.ts`

Modify `verifyPayment()` method to trigger customer notifications:

```typescript
async verifyPayment(orderId: string, dto: VerifyPaymentDto, user: any) {
  // ... existing transaction logic ...

  const result = await this.prisma.client.$transaction(async (tx) => {
    // ... existing verification logic ...
    return { order, transaction };
  });

  // AFTER transaction commits, send customer notification
  if (result.order.customerId) {
    const alertType = verified 
      ? AlertType.PAYMENT_VERIFIED 
      : AlertType.PAYMENT_FAILED;
    
    await this.orderAlertsService.createCustomerAlertForOrder(
      orderId,
      result.order.customerId,
      alertType
    );
  }

  return result;
}
```

#### 3.3 Delivery Status Updates
**File**: `apps/api/src/modules/deliveries/deliveries.service.ts`

Modify `updateDeliveryStatus()` method to trigger customer notifications:

```typescript
async updateDeliveryStatus(
  id: string,
  dto: UpdateDeliveryStatusDto,
  adminId: string
) {
  const delivery = await this.getDeliveryById(id);
  const currentStatus = delivery.status as DeliveryStatus;
  const newStatus = dto.status;

  // ... existing validation and transaction logic ...

  const updatedDelivery = await this.prisma.client.$transaction(async (tx) => {
    // ... existing update logic ...
    return updatedDelivery;
  });

  // AFTER transaction commits, send customer notification
  const customerId = delivery.order?.customerId || delivery.partOrder?.customerId;
  if (customerId && currentStatus !== newStatus) {
    await this.orderAlertsService.createCustomerAlertForDeliveryStatus(
      id,
      customerId,
      newStatus
    );
  }

  return updatedDelivery;
}
```

#### 3.4 Part Order Status Updates
**File**: `apps/api/src/modules/part-orders/part-orders.service.ts`

Apply similar changes to:
- `updatePartOrderStatus()`
- `verifyPartOrderPayment()`

### Phase 4: Customer Alert UI (Optional Enhancement)

#### 4.1 Add Customer Alerts Endpoint
**File**: `apps/api/src/modules/order-alerts/order-alerts.controller.ts`

Add endpoint for customers to fetch their alerts:
```typescript
@Get('my-alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("CUSTOMER")
async getMyAlerts(@CurrentUser() user: any, @Query() query: GetAlertsDto) {
  return this.orderAlertsService.getAlerts(user.id, user.role, query);
}
```

#### 4.2 Add Alerts Badge to Web App
- Display unread alert count in header
- Create alerts page/modal for customers
- Allow customers to mark alerts as read

## Implementation Order

1. **Phase 1**: Web app Firebase setup (frontend work, independent)
2. **Phase 2**: Backend notification methods (backend work, independent)
3. **Phase 3**: Integrate triggers (backend work, depends on Phase 2)
4. **Phase 4**: Customer alert UI (optional, can be done later)

## Key Considerations

### Token Management
- Customers may have multiple devices (web + mobile)
- Use the same `fcmTokens` array approach as admin
- Clean up failed tokens automatically

### Notification Frequency
- Avoid spamming customers with too many notifications
- Consider batching status updates if they happen quickly
- Allow customers to opt-out of certain notification types

### Security
- Ensure customers can only receive notifications for their own orders
- Validate `customerId` matches the order's customer
- Use existing JWT authentication

### Testing
- Test with different order status transitions
- Test payment verification success/failure scenarios
- Test delivery status updates
- Test background vs foreground notifications
- Test notification click navigation

## Files to Create/Modify

### New Files
- `apps/web/lib/firebase.ts`
- `apps/web/hooks/usePushNotifications.ts`
- `apps/web/public/firebase-messaging-sw.js`
- `apps/web/components/push-notification-provider.tsx`

### Modified Files
- `apps/web/app/layout.tsx`
- `apps/web/.env.local`
- `apps/api/src/modules/order-alerts/dto/get-alerts.dto.ts`
- `apps/api/src/modules/order-alerts/order-alerts.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/deliveries/deliveries.service.ts`
- `apps/api/src/modules/part-orders/part-orders.service.ts`

## Success Criteria

- [ ] Customers can register FCM tokens on web app
- [ ] Customers receive notifications when order status changes
- [ ] Customers receive notifications when payment is verified/failed
- [ ] Customers receive notifications when delivery status changes
- [ ] Notifications work in both foreground and background
- [ ] Clicking notifications navigates to correct order page
- [ ] Failed tokens are cleaned up automatically
- [ ] Customers only receive notifications for their own orders
