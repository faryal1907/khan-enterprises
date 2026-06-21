# Notification System Implementation Plan

## Executive Summary

This document outlines the comprehensive plan for implementing real-time alerts and push notifications for the Khan Enterprises platform. The goal is to provide instant notifications to admin users (based on roles and scopes) when orders and deliveries occur, and to customers when their order or payment status is updated.

## Current State Analysis

### Existing Infrastructure

**Backend (API):**
- ✅ Socket.IO gateway implemented (`apps/api/src/modules/order-alerts/order-alerts.gateway.ts`)
- ✅ OrderAlertsService with role-based alert logic (ADMIN, MANAGER, SALES_STAFF)
- ✅ OrderAlert Prisma model with proper indexing
- ✅ Socket.IO installed (v4.8.3)
- ✅ OrderAlertsModule integrated in app.module.ts
- ✅ Basic alert types: NEW_ORDER, PAYMENT_PENDING, EXPIRY_WARNING
- ✅ OrdersService calls createAlertsForOrder in some methods

**Frontend (Admin & Web):**
- ✅ Next.js 16.2.6 with React 19
- ✅ AuthProvider for authentication
- ✅ Admin app has Sonner toast library for notifications
- ❌ No Socket.IO client integration
- ❌ No web push notification support
- ❌ No notification UI components
- ❌ No real-time alert display

### Gaps Identified

1. **Limited Alert Types:** Only 3 alert types exist, need comprehensive coverage
2. **No Part Order Alerts:** PartOrder events don't trigger notifications
3. **No Delivery Alerts:** Delivery status changes don't trigger notifications
4. **No Customer Notifications:** Current system only alerts admin/staff
5. **No Payment Status Alerts:** Payment verification/failure events not covered
6. **No Order Status Change Alerts:** Status transitions not notified
7. **No Real-time Socket Integration:** Gateway exists but not used for real-time delivery
8. **No Web Push:** Browser push notifications not implemented
9. **No Frontend Integration:** No Socket.IO clients or notification UI

## Implementation Plan

### Phase 1: Backend Enhancement (Priority: HIGH)

#### 1.1 Expand Alert Types

**File:** `apps/api/src/modules/order-alerts/dto/get-alerts.dto.ts`

Add comprehensive alert types:

```typescript
export enum AlertType {
  // Order Events
  NEW_ORDER = 'NEW_ORDER',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_READY_FOR_DELIVERY = 'ORDER_READY_FOR_DELIVERY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  
  // Payment Events
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_VERIFICATION_PENDING = 'PAYMENT_VERIFICATION_PENDING',
  
  // Delivery Events
  DELIVERY_REQUESTED = 'DELIVERY_REQUESTED',
  DELIVERY_UNDER_REVIEW = 'DELIVERY_UNDER_REVIEW',
  DELIVERY_APPROVED = 'DELIVERY_APPROVED',
  DELIVERY_IN_TRANSIT = 'DELIVERY_IN_TRANSIT',
  DELIVERY_DELIVERED = 'DELIVERY_DELIVERED',
  
  // Part Order Events
  NEW_PART_ORDER = 'NEW_PART_ORDER',
  PART_ORDER_CONFIRMED = 'PART_ORDER_CONFIRMED',
  PART_ORDER_READY = 'PART_ORDER_READY',
  PART_ORDER_DELIVERED = 'PART_ORDER_DELIVERED',
  
  // System Events
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  LOW_STOCK = 'LOW_STOCK',
}
```

#### 1.2 Enhance OrderAlertsService

**File:** `apps/api/src/modules/order-alerts/order-alerts.service.ts`

Add methods:
- `createAlertsForPartOrder(partOrderId: string, alertType: AlertType)` - Mirror of createAlertsForOrder
- `createAlertsForDelivery(deliveryId: string, alertType: AlertType)` - For delivery events
- `createCustomerAlert(userId: string, alertType: AlertType, orderId?: string, partOrderId?: string)` - Customer-specific alerts
- `sendRealtimeAlert(alert: any)` - Integrate with gateway for real-time delivery

#### 1.3 Integrate Gateway with Service

**File:** `apps/api/src/modules/order-alerts/order-alerts.service.ts`

Inject OrderAlertsGateway and call it after alert creation:

```typescript
constructor(
  private readonly prisma: PrismaService,
  private readonly orderAlertsGateway: OrderAlertsGateway,
) {}

async createAlertsForOrder(orderId: string, alertType: AlertType) {
  // ... existing code ...
  
  // Send real-time notifications
  alerts.forEach(alert => {
    this.orderAlertsGateway.sendAlertToUser(alert.userId, alert);
    this.orderAlertsGateway.sendUnreadCountUpdate(alert.userId, /* updated count */);
  });
}
```

#### 1.4 Add Alerts to Order Status Changes

**File:** `apps/api/src/modules/orders/orders.service.ts`

Add alert triggers in:
- `updateOrderStatus()` - Trigger ORDER_CONFIRMED, ORDER_READY_FOR_DELIVERY, ORDER_DELIVERED, ORDER_CANCELLED
- `recordPayment()` - Trigger PAYMENT_VERIFIED
- `verifyPayment()` - Trigger PAYMENT_VERIFICATION_PENDING, PAYMENT_VERIFIED
- `cancelOrder()` - Trigger ORDER_CANCELLED

#### 1.5 Add Alerts to Payment Events

**File:** `apps/api/src/modules/transactions/transactions.service.ts`

Add alert triggers in:
- Payment verification success/failure
- Payment status changes

#### 1.6 Add Alerts to Delivery Events

**File:** `apps/api/src/modules/deliveries/deliveries.service.ts`

Add alert triggers in:
- `createDeliveryRequest()` - Trigger DELIVERY_REQUESTED
- `updateDeliveryStatus()` - Trigger DELIVERY_UNDER_REVIEW, DELIVERY_APPROVED, DELIVERY_IN_TRANSIT, DELIVERY_DELIVERED

#### 1.7 Add Part Order Alerts

**File:** `apps/api/src/modules/part-orders/part-orders.service.ts`

Add alert triggers similar to bike orders:
- NEW_PART_ORDER
- PART_ORDER_CONFIRMED
- PART_ORDER_READY
- PART_ORDER_DELIVERED

#### 1.8 Add Customer Notification Logic

**File:** `apps/api/src/modules/order-alerts/order-alerts.service.ts`

Enhance alert creation to include customers:
- When order status changes, alert the customer (customerId)
- When payment is verified, alert the customer
- When delivery status changes, alert the customer

#### 1.9 Add Web Push Support 

**File:** `apps/api/src/modules/notifications/` (new module)

Create web push notification service using:
- Web Push Protocol (VAPID keys)
- Service worker registration endpoint
- Push subscription management
- Notification payload formatting

### Phase 2: Frontend Integration (Priority: HIGH)

#### 2.1 Install Socket.IO Client

**Files:** `apps/admin/package.json`, `apps/web/package.json`

Add dependency:
```json
"socket.io-client": "^4.8.3"
```

#### 2.2 Create Socket Hook

**Files:** 
- `apps/admin/hooks/use-socket.ts`
- `apps/web/hooks/use-socket.ts`

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to notification server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from notification server');
    });

    socketInstance.on('new_alert', (alert) => {
      // Handle new alert
      console.log('New alert received:', alert);
    });

    socketInstance.on('unread_count', ({ count }) => {
      // Update unread count
      console.log('Unread count:', count);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
}
```

#### 2.3 Create Notification Context

**Files:**
- `apps/admin/contexts/notification-context.tsx`
- `apps/web/contexts/notification-context.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { toast } from 'sonner'; // For admin app

interface NotificationContextType {
  alerts: any[];
  unreadCount: number;
  markAsRead: (alertId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.success(`New ${alert.alertType.replace(/_/g, ' ').toLowerCase()}`, {
        description: getAlertMessage(alert),
      });
    });

    socket.on('unread_count', ({ count }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.off('new_alert');
      socket.off('unread_count');
    };
  }, [socket]);

  const markAsRead = async (alertId: string) => {
    // API call to mark as read
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
```

#### 2.4 Create Notification Bell Component

**Files:**
- `apps/admin/components/notification-bell.tsx`
- `apps/web/components/notification-bell.tsx`

```typescript
import { useNotifications } from '@/contexts/notification-context';
import { Bell } from 'lucide-react';

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
```

#### 2.5 Create Notification Panel

**Files:**
- `apps/admin/components/notification-panel.tsx`
- `apps/web/components/notification-panel.tsx`

Dropdown panel showing recent alerts with mark as read functionality.

#### 2.6 Integrate in Layout

**Files:**
- `apps/admin/app/layout.tsx`
- `apps/web/app/layout.tsx`

Wrap with NotificationProvider and add NotificationBell to Navigation.

### Phase 3: Web Push Notifications (Priority: HIGH)

#### 3.1 Install Web Push Dependencies

**File:** `apps/api/package.json`

Add dependency:
```json
"web-push": "^3.6.7"
```

#### 3.2 Generate VAPID Keys

Generate VAPID keys for web push authentication:
```bash
npx web-push generate-vapid-keys
```

Store in environment variables:
```
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@khanenterprises.com
```

Add to `.env` files for both development and production.

#### 3.3 Add PushSubscription Model

**File:** `packages/prisma/schema.prisma`

Add to User model relation and create PushSubscription model:

```prisma
model User {
  // ... existing fields ...
  pushSubscriptions PushSubscription[]
}

model PushSubscription {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  endpoint  String   @unique
  keys      Json
  userAgent String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([isActive])
}
```

Run migration:
```bash
cd packages/prisma
npx prisma migrate dev --name add_push_subscriptions
```

#### 3.4 Create Web Push Service

**File:** `apps/api/src/modules/notifications/web-push.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import webpush from 'web-push';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebPushService {
  private readonly logger = new Logger(WebPushService.name);

  constructor(private readonly prisma: PrismaService) {
    // Configure VAPID keys
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  /**
   * Send push notification to a specific user
   */
  async sendToUser(userId: string, payload: any) {
    const subscriptions = await this.prisma.client.pushSubscription.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (subscriptions.length === 0) {
      this.logger.warn(`No active push subscriptions found for user ${userId}`);
      return;
    }

    const results = await Promise.allSettled(
      subscriptions.map(sub => this.sendPushNotification(sub, payload))
    );

    // Handle failed subscriptions
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(`Failed to send push to subscription ${subscriptions[index].id}:`, result.reason);
        // Deactivate failed subscription
        this.deactivateSubscription(subscriptions[index].id);
      }
    });
  }

  /**
   * Send push notification to multiple users based on roles and scopes
   */
  async sendToUsersByRoleAndScope(
    alertType: string,
    orderId?: string,
    partOrderId?: string,
    deliveryId?: string
  ) {
    let userIds: string[] = [];

    // Fetch users based on alert type and scope
    if (orderId) {
      const order = await this.prisma.client.order.findUnique({
        where: { id: orderId },
        include: { branch: true, bike: { include: { vendor: true } } },
      });

      if (!order) return;

      // Get users based on role and branch/vendor scope
      const users = await this.prisma.client.user.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { role: 'ADMIN' },
            { AND: [{ role: 'MANAGER' }, { branchId: order.branchId }] },
            { AND: [{ role: 'SALES_STAFF' }, { branchId: order.branchId }, { vendorId: order.bike.vendorId }] },
          ],
        },
        select: { id: true },
      });

      userIds = users.map(u => u.id);
    }

    if (partOrderId) {
      const partOrder = await this.prisma.client.partOrder.findUnique({
        where: { id: partOrderId },
        include: { branch: true },
      });

      if (!partOrder) return;

      const users = await this.prisma.client.user.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { role: 'ADMIN' },
            { AND: [{ role: 'MANAGER' }, { branchId: partOrder.branchId }] },
            { AND: [{ role: 'SALES_STAFF' }, { branchId: partOrder.branchId }] },
          ],
        },
        select: { id: true },
      });

      userIds = users.map(u => u.id);
    }

    if (deliveryId) {
      const delivery = await this.prisma.client.deliveryRequest.findUnique({
        where: { id: deliveryId },
        include: {
          order: { include: { branch: true } },
          partOrder: { include: { branch: true } },
        },
      });

      if (!delivery) return;

      const branchId = delivery.order?.branchId || delivery.partOrder?.branchId;
      if (!branchId) return;

      const users = await this.prisma.client.user.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { role: 'ADMIN' },
            { AND: [{ role: 'MANAGER' }, { branchId }] },
            { AND: [{ role: 'SALES_STAFF' }, { branchId }] },
          ],
        },
        select: { id: true },
      });

      userIds = users.map(u => u.id);
    }

    // Send to all relevant users
    await Promise.all(
      userIds.map(userId => this.sendToUser(userId, { alertType, orderId, partOrderId, deliveryId }))
    );
  }

  /**
   * Send push notification to customer
   */
  async sendToCustomer(customerId: string, alertType: string, orderId?: string, partOrderId?: string) {
    await this.sendToUser(customerId, {
      alertType,
      orderId,
      partOrderId,
      target: 'customer',
    });
  }

  /**
   * Send individual push notification
   */
  private async sendPushNotification(subscription: any, payload: any) {
    const pushPayload = JSON.stringify({
      notification: {
        title: this.getNotificationTitle(payload.alertType),
        body: this.getNotificationBody(payload),
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: `${payload.alertType}-${payload.orderId || payload.partOrderId || payload.deliveryId}`,
        data: payload,
        actions: this.getNotificationActions(payload.alertType),
      },
    });

    await webpush.sendNotification(subscription, pushPayload);
  }

  /**
   * Deactivate failed subscription
   */
  private async deactivateSubscription(subscriptionId: string) {
    await this.prisma.client.pushSubscription.update({
      where: { id: subscriptionId },
      data: { isActive: false },
    });
  }

  /**
   * Get notification title based on alert type
   */
  private getNotificationTitle(alertType: string): string {
    const titles: Record<string, string> = {
      NEW_ORDER: 'New Order Received',
      NEW_PART_ORDER: 'New Part Order Received',
      ORDER_CONFIRMED: 'Order Confirmed',
      ORDER_READY_FOR_DELIVERY: 'Order Ready for Delivery',
      ORDER_DELIVERED: 'Order Delivered',
      ORDER_CANCELLED: 'Order Cancelled',
      PAYMENT_PENDING: 'Payment Pending',
      PAYMENT_VERIFIED: 'Payment Verified',
      PAYMENT_FAILED: 'Payment Failed',
      PAYMENT_VERIFICATION_PENDING: 'Payment Verification Pending',
      DELIVERY_REQUESTED: 'Delivery Requested',
      DELIVERY_UNDER_REVIEW: 'Delivery Under Review',
      DELIVERY_APPROVED: 'Delivery Approved',
      DELIVERY_IN_TRANSIT: 'Delivery In Transit',
      DELIVERY_DELIVERED: 'Delivery Delivered',
      PART_ORDER_CONFIRMED: 'Part Order Confirmed',
      PART_ORDER_READY: 'Part Order Ready',
      PART_ORDER_DELIVERED: 'Part Order Delivered',
      EXPIRY_WARNING: 'Order Expiring Soon',
      LOW_STOCK: 'Low Stock Alert',
    };

    return titles[alertType] || 'New Notification';
  }

  /**
   * Get notification body based on payload
   */
  private getNotificationBody(payload: any): string {
    if (payload.target === 'customer') {
      return this.getCustomerNotificationBody(payload);
    }
    return this.getAdminNotificationBody(payload);
  }

  private getCustomerNotificationBody(payload: any): string {
    const messages: Record<string, string> = {
      ORDER_CONFIRMED: 'Your order has been confirmed and is being processed.',
      PAYMENT_VERIFIED: 'Your payment has been verified successfully.',
      ORDER_READY_FOR_DELIVERY: 'Your order is ready for delivery.',
      DELIVERY_APPROVED: 'Your delivery request has been approved.',
      DELIVERY_IN_TRANSIT: 'Your order is out for delivery.',
      ORDER_DELIVERED: 'Your order has been delivered successfully.',
      ORDER_CANCELLED: 'Your order has been cancelled.',
      PAYMENT_FAILED: 'Your payment verification failed. Please try again.',
    };

    return messages[payload.alertType] || 'You have a new notification.';
  }

  private getAdminNotificationBody(payload: any): string {
    const messages: Record<string, string> = {
      NEW_ORDER: 'A new bike order has been placed.',
      NEW_PART_ORDER: 'A new part order has been placed.',
      ORDER_CONFIRMED: 'Order has been confirmed.',
      PAYMENT_PENDING: 'Payment is pending for this order.',
      PAYMENT_VERIFICATION_PENDING: 'Payment verification is pending.',
      DELIVERY_REQUESTED: 'A new delivery request has been submitted.',
      DELIVERY_UNDER_REVIEW: 'Delivery request is under review.',
      DELIVERY_APPROVED: 'Delivery request has been approved.',
      DELIVERY_IN_TRANSIT: 'Delivery is in transit.',
      EXPIRY_WARNING: 'An order is expiring soon.',
      LOW_STOCK: 'Inventory is running low.',
    };

    return messages[payload.alertType] || 'You have a new notification.';
  }

  /**
   * Get notification actions based on alert type
   */
  private getNotificationActions(alertType: string): any[] {
    if (['NEW_ORDER', 'NEW_PART_ORDER', 'DELIVERY_REQUESTED'].includes(alertType)) {
      return [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ];
    }
    return [{ action: 'dismiss', title: 'Dismiss' }];
  }
}
```

#### 3.5 Create Notifications Module

**File:** `apps/api/src/modules/notifications/notifications.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { WebPushService } from './web-push.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [WebPushService],
  exports: [WebPushService],
})
export class NotificationsModule {}
```

**File:** `apps/api/src/modules/notifications/notifications.controller.ts`

```typescript
import { Controller, Post, Body, UseGuards, Request, Delete, Get } from '@nestjs/common';
import { WebPushService } from './web-push.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscribeDto, UnsubscribeDto } from './dto/subscribe.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly webPushService: WebPushService) {}

  /**
   * Subscribe to push notifications
   */
  @Post('subscribe')
  async subscribe(@Request() req, @Body() dto: SubscribeDto) {
    // Check if subscription already exists
    const existing = await this.prisma.client.pushSubscription.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      // Update existing subscription
      return this.prisma.client.pushSubscription.update({
        where: { id: existing.id },
        data: {
          userId: req.user.id,
          keys: dto.keys,
          userAgent: req.headers['user-agent'],
          isActive: true,
        },
      });
    }

    // Create new subscription
    return this.prisma.client.pushSubscription.create({
      data: {
        userId: req.user.id,
        endpoint: dto.endpoint,
        keys: dto.keys,
        userAgent: req.headers['user-agent'],
      },
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  @Delete('unsubscribe')
  async unsubscribe(@Request() req, @Body() dto: UnsubscribeDto) {
    return this.prisma.client.pushSubscription.updateMany({
      where: {
        userId: req.user.id,
        endpoint: dto.endpoint,
      },
      data: { isActive: false },
    });
  }

  /**
   * Get VAPID public key for frontend
   */
  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY };
  }

  /**
   * Test push notification (for development)
   */
  @Post('test')
  async testPush(@Request() req) {
    await this.webPushService.sendToUser(req.user.id, {
      alertType: 'TEST',
      title: 'Test Notification',
      body: 'This is a test push notification',
    });
    return { success: true };
  }
}
```

**File:** `apps/api/src/modules/notifications/dto/subscribe.dto.ts`

```typescript
import { IsString, IsObject } from 'class-validator';

export class SubscribeDto {
  @IsString()
  endpoint: string;

  @IsObject()
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class UnsubscribeDto {
  @IsString()
  endpoint: string;
}
```

#### 3.6 Integrate Notifications Module

**File:** `apps/api/src/app.module.ts`

```typescript
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // ... existing imports
    NotificationsModule,
  ],
})
export class AppModule {}
```

#### 3.7 Integrate Web Push with OrderAlertsService

**File:** `apps/api/src/modules/order-alerts/order-alerts.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAlertsDto, AlertType } from './dto/get-alerts.dto';
import { UserRole } from '@khan/prisma';
import { WebPushService } from '../notifications/web-push.service';

@Injectable()
export class OrderAlertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAlertsGateway: OrderAlertsGateway,
    private readonly webPushService: WebPushService,
  ) {}

  async createAlertsForOrder(orderId: string, alertType: AlertType) {
    // ... existing alert creation logic ...

    // Send real-time Socket.IO notifications
    alerts.forEach(alert => {
      this.orderAlertsGateway.sendAlertToUser(alert.userId, alert);
      this.orderAlertsGateway.sendUnreadCountUpdate(alert.userId, /* updated count */);
    });

    // Send web push notifications
    await this.webPushService.sendToUsersByRoleAndScope(alertType, orderId);

    // Also send to customer if applicable
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
      select: { customerId: true },
    });

    if (order.customerId) {
      await this.webPushService.sendToCustomer(order.customerId, alertType, orderId);
    }

    return alerts;
  }

  // Similar updates for createAlertsForPartOrder, createAlertsForDelivery, etc.
}
```

#### 3.8 Create Service Worker

**File:** `apps/admin/public/sw.js`

```javascript
const CACHE_NAME = 'khan-admin-v1';
const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.notification.body,
    icon: data.notification.icon,
    badge: data.notification.badge,
    vibrate: [200, 100, 200],
    data: data.notification.data,
    actions: data.notification.actions,
    tag: data.notification.tag,
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.notification.title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view') {
    // Navigate to relevant page based on data
    let url = '/dashboard';
    if (data.orderId) url = `/orders/${data.orderId}`;
    if (data.partOrderId) url = `/part-orders/${data.partOrderId}`;
    if (data.deliveryId) url = `/deliveries/${data.deliveryId}`;

    event.waitUntil(clients.openWindow(url));
  } else if (action === 'dismiss') {
    // Just close the notification
  } else {
    // Default: open dashboard
    event.waitUntil(clients.openWindow('/dashboard'));
  }
});
```

**File:** `apps/web/public/sw.js`

```javascript
const CACHE_NAME = 'khan-web-v1';
const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.notification.body,
    icon: data.notification.icon,
    badge: data.notification.badge,
    vibrate: [200, 100, 200],
    data: data.notification.data,
    actions: data.notification.actions,
    tag: data.notification.tag,
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.notification.title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view') {
    // Navigate to relevant page based on data
    let url = '/orders';
    if (data.orderId) url = `/orders/${data.orderId}`;
    if (data.partOrderId) url = `/part-orders/${data.partOrderId}`;

    event.waitUntil(clients.openWindow(url));
  } else if (action === 'dismiss') {
    // Just close the notification
  } else {
    // Default: open orders page
    event.waitUntil(clients.openWindow('/orders'));
  }
});
```

#### 3.9 Create Push Permission Hook

**Files:** 
- `apps/admin/hooks/use-push-permission.ts`
- `apps/web/hooks/use-push-permission.ts`

```typescript
import { useState, useEffect } from 'react';

export function usePushPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('Notification' in window);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!supported) {
      console.warn('Push notifications not supported');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      // Subscribe to push notifications
      await subscribeToPush();
      return true;
    }

    return false;
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.getKey('p256dh')
              ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!)))
              : '',
            auth: subscription.getKey('auth')
              ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
              : '',
          },
        }),
      });

      console.log('Push subscription successful');
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  };

  return {
    supported,
    permission,
    requestPermission,
  };
}
```

#### 3.10 Register Service Worker and Request Permission

**File:** `apps/admin/app/layout.tsx`

```typescript
import { useEffect } from 'react';
import { usePushPermission } from '@/hooks/use-push-permission';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { supported, requestPermission } = usePushPermission();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('SW registered:', registration),
        (error) => console.error('SW registration failed:', error)
      );
    }

    // Request push permission for admin users
    if (supported && permission === 'default') {
      // Auto-request permission or show a button
      // requestPermission();
    }
  }, [supported]);

  return (
    // ... existing layout
  );
}
```

**File:** `apps/web/app/layout.tsx`

```typescript
import { useEffect } from 'react';
import { usePushPermission } from '@/hooks/use-push-permission';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { supported, permission, requestPermission } = usePushPermission();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('SW registered:', registration),
        (error) => console.error('SW registration failed:', error)
      );
    }
  }, []);

  return (
    // ... existing layout
    // Add a button to request permission if not granted
    {supported && permission === 'default' && (
      <button onClick={requestPermission}>
        Enable Notifications
      </button>
    )}
  );
}
```

#### 3.11 Add Environment Variables

**File:** `apps/admin/.env.local`

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**File:** `apps/web/.env.local`

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**File:** `apps/api/.env`

```
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@khanenterprises.com
```

#### 3.12 Add Push Notification Settings Component

**File:** `apps/admin/components/push-settings.tsx`

```typescript
import { usePushPermission } from '@/hooks/use-push-permission';
import { Bell, BellOff } from 'lucide-react';

export function PushSettings() {
  const { supported, permission, requestPermission } = usePushPermission();

  if (!supported) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <BellOff className="w-4 h-4" />
        <span>Push notifications not supported</span>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Bell className="w-4 h-4" />
        <span>Notifications enabled</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <BellOff className="w-4 h-4" />
        <span>Notifications blocked</span>
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <Bell className="w-4 h-4" />
      <span>Enable Notifications</span>
    </button>
  );
}
```

#### 3.13 Test Web Push Implementation

1. Start the API server
2. Start the admin/web apps
3. Open browser DevTools → Application → Service Workers
4. Verify service worker is registered
5. Click "Enable Notifications" button
6. Grant permission
7. Check Application → Push Notifications for subscription
8. Test by creating an order or updating status
9. Verify notification appears in system tray

### Phase 4: Testing & Optimization (Priority: MEDIUM)

#### 4.1 Unit Tests

- Test alert creation logic
- Test role-based filtering
- Test Socket.IO gateway events

#### 4.2 Integration Tests

- Test end-to-end notification flow
- Test real-time delivery
- Test web push notifications

#### 4.3 Performance Optimization

- Batch alert creation for multiple users
- Implement alert deduplication
- Add alert expiration/cleanup

#### 4.4 Error Handling

- Handle Socket.IO reconnection
- Handle failed push notifications
- Add retry logic for failed deliveries

## Alert Matrix

### Admin/Staff Notifications

| Event | Alert Type | Roles | Scope |
|-------|-----------|-------|-------|
| New Bike Order | NEW_ORDER | ADMIN, MANAGER (branch), SALES_STAFF (branch+vendor) | Branch-specific |
| New Part Order | NEW_PART_ORDER | ADMIN, MANAGER (branch), SALES_STAFF (branch) | Branch-specific |
| Order Confirmed | ORDER_CONFIRMED | ADMIN, MANAGER (branch) | Branch-specific |
| Payment Pending | PAYMENT_PENDING | ADMIN, MANAGER (branch) | Branch-specific |
| Payment Verification Pending | PAYMENT_VERIFICATION_PENDING | ADMIN, MANAGER (branch) | Branch-specific |
| Payment Verified | PAYMENT_VERIFIED | ADMIN, MANAGER (branch) | Branch-specific |
| Payment Failed | PAYMENT_FAILED | ADMIN, MANAGER (branch) | Branch-specific |
| Order Ready for Delivery | ORDER_READY_FOR_DELIVERY | ADMIN, MANAGER (branch) | Branch-specific |
| Delivery Requested | DELIVERY_REQUESTED | ADMIN, MANAGER (branch) | Branch-specific |
| Delivery Under Review | DELIVERY_UNDER_REVIEW | ADMIN, MANAGER (branch) | Branch-specific |
| Delivery Approved | DELIVERY_APPROVED | ADMIN, MANAGER (branch) | Branch-specific |
| Delivery In Transit | DELIVERY_IN_TRANSIT | ADMIN, MANAGER (branch) | Branch-specific |
| Order Delivered | ORDER_DELIVERED | ADMIN, MANAGER (branch) | Branch-specific |
| Order Cancelled | ORDER_CANCELLED | ADMIN, MANAGER (branch) | Branch-specific |
| Order Expiring Soon | EXPIRY_WARNING | ADMIN, MANAGER (branch) | Branch-specific |
| Low Stock | LOW_STOCK | ADMIN, MANAGER (branch) | Branch-specific |

### Customer Notifications

| Event | Alert Type | Trigger |
|-------|-----------|---------|
| Order Confirmed | ORDER_CONFIRMED | Admin confirms order |
| Payment Verified | PAYMENT_VERIFIED | Payment successfully verified |
| Order Ready for Delivery | ORDER_READY_FOR_DELIVERY | Order marked ready |
| Delivery Approved | DELIVERY_APPROVED | Delivery request approved |
| Delivery In Transit | DELIVERY_IN_TRANSIT | Delivery picked up |
| Order Delivered | ORDER_DELIVERED | Order marked delivered |
| Order Cancelled | ORDER_CANCELLED | Order cancelled |
| Payment Failed | PAYMENT_FAILED | Payment verification failed |

## Implementation Order

### Sprint 1 (Week 1-2)
1. Expand alert types in DTO
2. Enhance OrderAlertsService with new methods
3. Integrate gateway with service for real-time delivery
4. Add alerts to order status changes
5. Add alerts to payment events
6. Add alerts to delivery events

### Sprint 2 (Week 3-4)
1. Add Part Order alerts
2. Add customer notification logic
3. Install Socket.IO client in frontend apps
4. Create Socket hook
5. Create notification context
6. Create notification bell component
7. Create notification panel
8. Integrate in layouts

### Sprint 3 (Week 5-6)
1. Generate VAPID keys
2. Create PushSubscription model
3. Create push subscription endpoint
4. Implement web push service
5. Register service worker
6. Request permission on frontend
7. Test web push notifications

### Sprint 4 (Week 7-8)
1. Write unit tests
2. Write integration tests
3. Performance optimization
4. Error handling improvements
5. Documentation
6. Deployment

## Technical Considerations

### Socket.IO Configuration
- Use WebSocket transport for better performance
- Implement reconnection logic
- Handle authentication via JWT
- Use room-based messaging for scalability

### Web Push Considerations
- VAPID keys must be securely stored
- Service worker must be properly registered
- Handle permission denials gracefully
- Provide fallback to in-app notifications

### Database Considerations
- Add indexes on OrderAlert for performance
- Implement alert cleanup/archival strategy
- Consider soft deletes for audit trail

### Security Considerations
- Validate all alert data
- Sanitize notification content
- Rate limit alert creation
- Implement permission checks

## Success Metrics

- **Real-time latency:** < 500ms from event to notification
- **Delivery rate:** > 95% for Socket.IO, > 80% for web push
- **User engagement:** Track notification open rates
- **System performance:** No degradation in order processing
- **Error rate:** < 1% failed notifications

## Dependencies

### Backend
- `@nestjs/platform-socket.io` (already installed)
- `socket.io` (already installed)
- `web-push` (new - for web push)

### Frontend
- `socket.io-client` (new)
- `sonner` (already installed in admin)
- `lucide-react` (already installed for icons)

## Environment Variables

```
# Socket.IO
SOCKET_IO_PORT=3001
SOCKET_IO_CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@khanenterprises.com

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Notes

- Current Socket.IO gateway is well-implemented and only needs integration
- Role-based alert logic is solid and can be extended
- Frontend apps are modern Next.js with good architecture for adding notifications
- Consider using existing Sonner toast library for admin notifications
- Web app may need a similar toast library or custom implementation
