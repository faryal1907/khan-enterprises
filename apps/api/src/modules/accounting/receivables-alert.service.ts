import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentState } from "@khan/prisma";
import { OrderAlertsService } from "../order-alerts/order-alerts.service";

@Injectable()
export class ReceivablesAlertService {
  private readonly logger = new Logger(ReceivablesAlertService.name);
  private readonly NOTIFICATION_INTERVAL_HOURS = 48;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAlertsService: OrderAlertsService,
  ) {}

  /**
   * Check for customers in PARTIAL status for 48+ hours and send notifications to admins
   * This should be called by a scheduled job (e.g., every hour)
   */
  async checkAndNotifyPartialPayments() {
    this.logger.log("Checking for partial payment reminders...");

    try {
      // Get all customers with PARTIAL status by querying orders and partOrders directly
      const partialCustomers = await this.getPartialPaymentCustomers();

      const fortyEightHoursAgo = new Date();
      fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - this.NOTIFICATION_INTERVAL_HOURS);

      let notificationsSent = 0;

      for (const customer of partialCustomers) {
        // Check if customer has a receivables alert record
        const existingAlert = await this.prisma.client.receivablesAlert.findUnique({
          where: { customerPhone: customer.customerPhone },
        });

        const shouldNotify = this.shouldSendNotification(
          existingAlert,
          customer.lastPaymentDate,
          fortyEightHoursAgo,
        );

        if (shouldNotify) {
          // Calculate duration since last payment
          const duration = this.calculateDuration(customer.lastPaymentDate);

          // Send notification to all admin users
          await this.orderAlertsService.createAlertsForReceivables(
            customer.customerPhone,
            customer.customerName,
            customer.totalOutstanding,
            duration,
          );

          // Update or create receivables alert record
          if (existingAlert) {
            await this.prisma.client.receivablesAlert.update({
              where: { customerPhone: customer.customerPhone },
              data: {
                lastNotifiedAt: new Date(),
                notificationCount: { increment: 1 },
                outstandingAmount: customer.totalOutstanding,
                status: PaymentState.PARTIAL,
              },
            });
          } else {
            await this.prisma.client.receivablesAlert.create({
              data: {
                customerPhone: customer.customerPhone,
                customerName: customer.customerName,
                lastNotifiedAt: new Date(),
                notificationCount: 1,
                outstandingAmount: customer.totalOutstanding,
                status: PaymentState.PARTIAL,
              },
            });
          }

          notificationsSent++;
          this.logger.log(
            `Sent partial payment reminder for customer ${customer.customerPhone} (${customer.customerName})`,
          );
        }
      }

      this.logger.log(`Partial payment reminders sent: ${notificationsSent}`);
      return { notificationsSent };
    } catch (error) {
      this.logger.error("Error checking partial payment reminders:", error);
      throw error;
    }
  }

  /**
   * Get all customers with PARTIAL payment status
   * This replicates the logic from ReceivablesService.getReceivables() but only for PARTIAL status
   */
  private async getPartialPaymentCustomers() {
    // Fetch bike orders with PARTIAL status
    const orders = await this.prisma.client.order.findMany({
      where: {
        paymentVerified: true,
        status: { notIn: ["CANCELLED"] as any },
        paymentState: PaymentState.PARTIAL,
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerId: true,
        totalAmount: true,
        paidAmount: true,
        balanceDue: true,
        paymentState: true,
        status: true,
        createdAt: true,
      },
    });

    // Fetch part orders with PARTIAL status
    const partOrders = await this.prisma.client.partOrder.findMany({
      where: {
        paymentVerified: true,
        status: { notIn: ["CANCELLED"] as any },
        paymentState: PaymentState.PARTIAL,
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerId: true,
        amount: true,
        paidAmount: true,
        balanceDue: true,
        paymentState: true,
        status: true,
        createdAt: true,
      },
    });

    // Group by customer
    const customerMap = new Map<string, any>();

    const mergeItem = (item: any, isPartOrder: boolean) => {
      const key = item.customerPhone;
      const existing = customerMap.get(key);

      const billed = isPartOrder ? Number(item.amount) : Number(item.totalAmount);
      const paid = Number(item.paidAmount);
      const outstanding = Number(item.balanceDue);

      if (existing) {
        existing.totalOutstanding += outstanding;
        existing.totalBilled += billed;
        existing.totalPaid += paid;
        existing.orderCount += 1;
        if (item.createdAt > existing.latestOrderDate) {
          existing.latestOrderDate = item.createdAt;
        }
      } else {
        customerMap.set(key, {
          customerPhone: item.customerPhone,
          customerName: item.customerName,
          customerId: item.customerId,
          totalOutstanding: outstanding,
          totalBilled: billed,
          totalPaid: paid,
          orderCount: 1,
          latestOrderDate: item.createdAt,
          status: "PARTIAL",
        });
      }
    };

    for (const order of orders) {
      mergeItem(order, false);
    }

    for (const po of partOrders) {
      mergeItem(po, true);
    }

    // Get last payment dates for all customers
    const customerPhones = Array.from(customerMap.keys());

    const bikeLastPayments = customerPhones.length > 0
      ? await this.prisma.client.paymentTransaction.findMany({
          where: {
            order: {
              customerPhone: { in: customerPhones },
              status: { notIn: ["CANCELLED"] as any },
            },
            status: "SUCCESS",
            verifiedAt: { not: null },
          },
          select: {
            verifiedAt: true,
            order: { select: { customerPhone: true } },
          },
          orderBy: { verifiedAt: "desc" },
        })
      : [];

    const partLastPayments = customerPhones.length > 0
      ? await this.prisma.client.partPaymentTransaction.findMany({
          where: {
            partOrder: {
              customerPhone: { in: customerPhones },
              status: { notIn: ["CANCELLED"] as any },
            },
            status: "SUCCESS",
            verifiedAt: { not: null },
          },
          select: {
            verifiedAt: true,
            partOrder: { select: { customerPhone: true } },
          },
          orderBy: { verifiedAt: "desc" },
        })
      : [];

    const customerLastPayment = new Map<string, Date>();
    for (const tx of bikeLastPayments) {
      const phone = tx.order!.customerPhone;
      if (!customerLastPayment.has(phone)) customerLastPayment.set(phone, tx.verifiedAt!);
    }
    for (const tx of partLastPayments) {
      const phone = tx.partOrder!.customerPhone;
      if (!customerLastPayment.has(phone)) customerLastPayment.set(phone, tx.verifiedAt!);
    }

    return Array.from(customerMap.entries()).map(([phone, data]) => ({
      customerPhone: phone,
      customerId: data.customerId,
      customerName: data.customerName,
      totalOutstanding: data.totalOutstanding,
      totalBilled: data.totalBilled,
      totalPaid: data.totalPaid,
      orderCount: data.orderCount,
      latestOrderDate: data.latestOrderDate,
      lastPaymentDate: customerLastPayment.get(phone) || null,
      status: data.totalOutstanding <= 0 ? "PAID" : data.status,
    }));
  }

  /**
   * Determine if a notification should be sent based on:
   * 1. No previous notification exists AND last payment was 48+ hours ago
   * 2. Previous notification was 48+ hours ago
   */
  private shouldSendNotification(
    existingAlert: any,
    lastPaymentDate: Date | null,
    fortyEightHoursAgo: Date,
  ): boolean {
    // If no last payment date, don't notify (edge case)
    if (!lastPaymentDate) {
      return false;
    }

    const lastPayment = new Date(lastPaymentDate);

    // If no existing alert, check if last payment was 48+ hours ago
    if (!existingAlert) {
      return lastPayment < fortyEightHoursAgo;
    }

    // If existing alert, check if last notification was 48+ hours ago
    const lastNotified = new Date(existingAlert.lastNotifiedAt);
    return lastNotified < fortyEightHoursAgo;
  }

  /**
   * Calculate human-readable duration since last payment
   */
  private calculateDuration(lastPaymentDate: Date | null): string {
    if (!lastPaymentDate) {
      return "unknown";
    }

    const now = new Date();
    const lastPayment = new Date(lastPaymentDate);
    const diffMs = now.getTime() - lastPayment.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return "less than an hour";
    }
  }

  /**
   * Reset alert tracking when customer status changes (e.g., from PARTIAL to PAID)
   * This should be called when payment is collected
   */
  async resetCustomerAlert(customerPhone: string, newStatus: PaymentState) {
    if (newStatus !== PaymentState.PARTIAL) {
      await this.prisma.client.receivablesAlert.deleteMany({
        where: { customerPhone },
      });
      this.logger.log(`Reset alert tracking for customer ${customerPhone} (status changed to ${newStatus})`);
    }
  }
}
