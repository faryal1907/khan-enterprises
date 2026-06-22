import { Injectable, NotFoundException, forwardRef, Inject } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { GetAlertsDto, AlertType } from "./dto/get-alerts.dto";
import { UserRole } from "@khan/prisma";
import { FirebaseService } from "../firebase/firebase.service";
import { OrderAlertsGateway } from "./order-alerts.gateway";

@Injectable()
export class OrderAlertsService {
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
}
