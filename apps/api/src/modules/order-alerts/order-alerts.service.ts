import { Injectable, NotFoundException, forwardRef, Inject, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { GetAlertsDto, AlertType } from "./dto/get-alerts.dto";
import { UserRole } from "@khan/prisma";
import { FirebaseService } from "../firebase/firebase.service";
import { OrderAlertsGateway } from "./order-alerts.gateway";

@Injectable()
export class OrderAlertsService {
  private readonly logger = new Logger(OrderAlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => OrderAlertsGateway)) private readonly gateway: OrderAlertsGateway,
  ) {}

  /**
   * Get alerts for current user based on role and filters
   */
  async getAlerts(userId: string, userRole: UserRole, query: GetAlertsDto) {
    const where: any = { userId };

    if (query.alertType) {
      where.alertType = query.alertType;
    }

    if (query.unreadOnly) {
      where.isRead = false;
    }

    const alerts = await this.prisma.client.orderAlert.findMany({
      where,
      include: {
        order: {
          include: {
            bike: {
              include: {
                model: true,
                branch: true,
              },
            },
            branch: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return alerts;
  }

  /**
   * Mark an alert as read
   */
  async markAsRead(alertId: string, userId: string) {
    const alert = await this.prisma.client.orderAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    if (alert.userId !== userId) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return this.prisma.client.orderAlert.update({
      where: { id: alertId },
      data: { isRead: true },
    });
  }

  /**
   * Create alerts for users based on their role and the order
   * Alert logic by role:
   * - ADMIN: All orders across all branches
   * - MANAGER: Orders for their branch only
   * - SALES_STAFF: Orders for their branch + their assigned vendor
   */
  async createAlertsForOrder(orderId: string, alertType: AlertType) {
    // Fetch the order with branch and bike info
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
      include: {
        branch: true,
        bike: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Find users to alert based on role
    const usersToAlert = await this.prisma.client.user.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          // ADMIN: All orders across all branches
          { role: "ADMIN" },
          // MANAGER: Orders for their branch only
          {
            AND: [
              { role: "MANAGER" },
              { branchId: order.branchId },
            ],
          },
          // SALES_STAFF: Orders for their branch + their assigned vendor
          {
            AND: [
              { role: "SALES_STAFF" },
              { branchId: order.branchId },
              { vendorId: order.bike.vendorId },
            ],
          },
        ],
      },
    });

    // Create alerts for each user
    const alerts = await Promise.all(
      usersToAlert.map(async (user) => {
        const alert = await this.prisma.client.orderAlert.create({
          data: {
            orderId,
            userId: user.id,
            alertType,
            isRead: false,
          },
        });
        
        // Dispatch to Gateway
        this.gateway.sendAlertToUser(user.id, alert);
        
        let title = "New Alert";
        let body = "You have a new alert.";
        if (alertType === AlertType.NEW_ORDER) {
           title = "New Order Received";
           body = `Order ${order.orderNumber} has been placed.`;
        } else if (alertType === AlertType.PAYMENT_PENDING) {
           title = "Payment Pending";
           body = `Order ${order.orderNumber} is pending payment.`;
        }
        
        await this.dispatchPushNotification(
           user,
           title,
           body,
           { url: `/orders/${order.id}` }
        );
        
        return alert;
      })
    );

    return alerts;
  }

  /**
   * Get unread alert count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.client.orderAlert.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  async createAlertsForDeliveryRequest(deliveryRequestId: string) {
    const delivery = await this.prisma.client.deliveryRequest.findUnique({
      where: { id: deliveryRequestId },
      include: {
        order: { include: { branch: true } },
        partOrder: { include: { branch: true } },
      },
    });

    if (!delivery) return;

    const branchId = delivery.order?.branchId || delivery.partOrder?.branchId;
    if (!branchId) return;

    const usersToAlert = await this.prisma.client.user.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { role: "ADMIN" },
          {
            AND: [
              { role: "MANAGER" },
              { branchId },
            ],
          },
        ],
      },
    });

    const alerts = await Promise.all(
      usersToAlert.map(async (user) => {
        const alert = await this.prisma.client.orderAlert.create({
          data: {
            orderId: delivery.orderId,
            partOrderId: delivery.partOrderId,
            userId: user.id,
            alertType: AlertType.DELIVERY_REQUEST,
            isRead: false,
          },
        });
        
        this.gateway.sendAlertToUser(user.id, alert);
        
        const orderNumber = delivery.order?.orderNumber || delivery.partOrder?.orderNumber;
        await this.dispatchPushNotification(
           user,
           "New Delivery Request",
           `A new delivery request has been made for Order ${orderNumber}.`,
           { url: delivery.orderId ? `/orders/${delivery.orderId}` : `/part-orders/${delivery.partOrderId}` }
        );
        
        return alert;
      })
    );

    return alerts;
  }

  async createAlertsForPartOrder(partOrderId: string, alertType: AlertType) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id: partOrderId },
      include: {
        branch: true,
      },
    });

    if (!order) return;

    const usersToAlert = await this.prisma.client.user.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { role: "ADMIN" },
          {
            AND: [
              { role: "MANAGER" },
              { branchId: order.branchId },
            ],
          },
          {
            AND: [
              { role: "SALES_STAFF" },
              { branchId: order.branchId },
            ],
          },
        ],
      },
    });

    const alerts = await Promise.all(
      usersToAlert.map(async (user) => {
        const alert = await this.prisma.client.orderAlert.create({
          data: {
            partOrderId: order.id,
            userId: user.id,
            alertType,
            isRead: false,
          },
        });
        
        this.gateway.sendAlertToUser(user.id, alert);
        
        let title = "New Part Alert";
        let body = "You have a new part order alert.";
        if (alertType === AlertType.NEW_ORDER) {
           title = "New Part Order Received";
           body = `Part Order ${order.orderNumber} has been placed.`;
        } else if (alertType === AlertType.PAYMENT_PENDING) {
           title = "Part Payment Pending";
           body = `Part Order ${order.orderNumber} is pending payment.`;
        }
        
        await this.dispatchPushNotification(
           user,
           title,
           body,
           { url: `/part-orders/${order.id}` }
        );
        
        return alert;
      })
    );

    return alerts;
  }

  private async dispatchPushNotification(user: any, title: string, body: string, data: Record<string, string>) {
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      // 1. Remove duplicate tokens before sending so the user doesn't get duplicate notifications
      const uniqueTokens = [...new Set(user.fcmTokens as string[])];
      
      // 2. Send push notification and capture failed tokens
      const failedTokens = await this.firebaseService.sendPushNotification(
        uniqueTokens,
        title,
        body,
        data
      );

      // 3. If there were duplicates OR failed tokens, update the DB to clean it up
      if (uniqueTokens.length !== user.fcmTokens.length || (failedTokens && failedTokens.length > 0)) {
        const validTokens = uniqueTokens.filter(t => !failedTokens?.includes(t));
        
        await this.prisma.client.user.update({
          where: { id: user.id },
          data: { fcmTokens: validTokens },
        });
      }
    }
  }

  /**
   * Create customer-specific alert for order status updates
   */
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

  /**
   * Create customer-specific alert for part order status updates
   */
  async createCustomerAlertForPartOrder(
    partOrderId: string,
    customerId: string,
    alertType: AlertType,
    message?: string
  ) {
    const order = await this.prisma.client.partOrder.findUnique({
      where: { id: partOrderId },
      include: { part: true },
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
        partOrderId,
        userId: customerId,
        alertType,
        isRead: false,
      },
    });

    // Dispatch to Gateway
    this.gateway.sendAlertToUser(customerId, alert);

    // Send push notification
    let title = "Part Order Update";
    let body = message || `Your part order ${order.orderNumber} has been updated.`;
    
    if (alertType === AlertType.PAYMENT_VERIFIED) {
      title = "Payment Verified";
      body = `Your payment for part order ${order.orderNumber} has been verified.`;
    } else if (alertType === AlertType.PAYMENT_FAILED) {
      title = "Payment Failed";
      body = `Your payment for part order ${order.orderNumber} could not be verified. Please try again.`;
    } else if (alertType === AlertType.ORDER_STATUS_UPDATED) {
      title = "Order Status Updated";
      body = `Your part order ${order.orderNumber} status is now ${order.status}.`;
    } else if (alertType === AlertType.ORDER_CANCELLED) {
      title = "Order Cancelled";
      body = `Your part order ${order.orderNumber} has been cancelled.`;
    } else if (alertType === AlertType.ORDER_DELIVERED) {
      title = "Order Delivered";
      body = `Your part order ${order.orderNumber} has been delivered successfully!`;
    }

    await this.dispatchPushNotification(
      customer,
      title,
      body,
      { url: `/part-orders/${order.id}` }
    );

    return alert;
  }

  /**
   * Create customer-specific alert for delivery status updates
   */
  async createCustomerAlertForDeliveryStatus(
    deliveryRequestId: string,
    customerId: string,
    newStatus: string
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

    if (newStatus === 'APPROVED') {
      title = "Delivery Approved";
      body = `Your delivery for order ${orderNumber} has been approved.`;
    } else if (newStatus === 'IN_TRANSIT') {
      title = "Out for Delivery";
      body = `Your order ${orderNumber} is out for delivery.`;
    } else if (newStatus === 'DELIVERED') {
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

  /**
   * Create admin-only alerts for receivables partial payment reminders
   * This is called by the scheduled job to notify admins about customers
   * who have been in PARTIAL payment status for 48+ hours
   */
  async createAlertsForReceivables(
    customerPhone: string,
    customerName: string,
    outstandingAmount: number,
    duration: string
  ) {
    // Find only ADMIN users (exclude MANAGER and SALES_STAFF)
    const adminUsers = await this.prisma.client.user.findMany({
      where: {
        status: "ACTIVE",
        role: "ADMIN",
      },
    });

    if (adminUsers.length === 0) {
      this.logger.warn(`No active admin users found to notify about receivables`);
      return [];
    }

    const alerts = await Promise.all(
      adminUsers.map(async (admin) => {
        const alert = await this.prisma.client.orderAlert.create({
          data: {
            userId: admin.id,
            alertType: AlertType.RECEIVABLES_PARTIAL_REMINDER,
            isRead: false,
          },
        });

        // Dispatch to Gateway
        this.gateway.sendAlertToUser(admin.id, alert);

        const title = "Partial Payment Reminder";
        const body = `Customer ${customerName} (${customerPhone}) has been in partial payment status for ${duration}. Outstanding: Rs. ${outstandingAmount.toLocaleString()}`;

        await this.dispatchPushNotification(
          admin,
          title,
          body,
          { url: `/accounts?tab=receivables` }
        );

        return alert;
      })
    );

    return alerts;
  }
}
