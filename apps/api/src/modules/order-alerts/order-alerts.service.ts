import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { GetAlertsDto, AlertType } from "./dto/get-alerts.dto";
import { UserRole } from "@khan/prisma";

@Injectable()
export class OrderAlertsService {
  constructor(private readonly prisma: PrismaService) {}

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
      usersToAlert.map((user) =>
        this.prisma.client.orderAlert.create({
          data: {
            orderId,
            userId: user.id,
            alertType,
            isRead: false,
          },
        })
      )
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
}
