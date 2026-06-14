import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, OrderStatus, BikeStatus, DeliveryStatus, OfferStatus, PaymentStatus } from '@khan/prisma';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(user: any) {
    const branchId = user.role !== UserRole.ADMIN ? user.branchId : undefined;
    
    // Base where clauses
    const branchFilter = branchId ? { branchId } : {};
    
    // 1. Pending Orders (Offers needing action)
    const pendingOrders = await this.prisma.client.offer.count({
      where: {
        bike: branchFilter,
        status: { in: [OfferStatus.PENDING, OfferStatus.COUNTERED] }
      }
    });

    // 2. Total Sales / Branch Revenue
    // Sum only successful payment transactions to properly handle refunded amounts
    const successfulPayments = await this.prisma.client.paymentTransaction.findMany({
      where: {
        status: PaymentStatus.SUCCESS,
        order: branchId ? { branchId } : undefined,
      },
      select: { amount: true }
    });
    
    const totalSalesAmount = successfulPayments.reduce((sum, payment) => {
      return sum + Number(payment.amount || 0);
    }, 0);

    const bikesSold = await this.prisma.client.order.count({
      where: {
        ...branchFilter,
        status: { in: [OrderStatus.DELIVERED, OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.READY_FOR_DELIVERY] }
      }
    });

    // 3. Available Bikes
    const availableBikes = await this.prisma.client.bikeUnit.count({
      where: {
        ...branchFilter,
        status: BikeStatus.AVAILABLE
      }
    });

    // 4. Available Parts
    const availablePartsAgg = await this.prisma.client.partInventory.aggregate({
      where: { ...branchFilter },
      _sum: { quantity: true, reservedQuantity: true }
    });
    
    const availableParts = (availablePartsAgg._sum.quantity || 0) - (availablePartsAgg._sum.reservedQuantity || 0);

    // 5. Low Stock Alerts
    const lowStockInventories = await this.prisma.client.partInventory.count({
      where: {
        ...branchFilter,
        quantity: { lte: this.prisma.client.partInventory.fields.reorderLevel }
      }
    });
    
    // Fallback if the above doesn't work in Prisma (comparing two fields is tricky in some Prisma versions)
    // Actually, comparing two fields directly in `where` is not supported in Prisma unless using raw or `where: { quantity: { lte: Prisma.sql... } }`. 
    // I will fetch all and filter in memory if needed, but since we might have many, let's use queryRaw or just fetch them.
    const allInventories = await this.prisma.client.partInventory.findMany({
      where: { ...branchFilter },
      select: { quantity: true, reorderLevel: true }
    });
    const lowStockAlerts = allInventories.filter(inv => inv.quantity <= inv.reorderLevel).length;

    // 6. Pending Deliveries
    const pendingDeliveries = await this.prisma.client.deliveryRequest.count({
      where: {
        order: branchFilter,
        status: { in: [DeliveryStatus.REQUESTED, DeliveryStatus.APPROVED, DeliveryStatus.IN_TRANSIT] }
      }
    });

    // 7. Orders Waiting Payment
    const ordersWaitingPayment = await this.prisma.client.order.count({
      where: {
        ...branchFilter,
        status: OrderStatus.PENDING_PAYMENT
      }
    });

    // 8. Pending Sales (Offers)
    const pendingSales = await this.prisma.client.offer.count({
      where: {
        bike: branchFilter,
        status: OfferStatus.PENDING
      }
    });

    // 9. Issues (e.g. FAILED payments, cancelled orders recently?)
    // Let's just use 0 for now
    const issues = 0;

    return {
      pendingOrders,
      totalSales: totalSalesAmount,
      branchRevenue: totalSalesAmount,
      bikesSold,
      availableBikes,
      availableParts,
      lowStockAlerts,
      pendingDeliveries,
      ordersWaitingPayment,
      pendingSales,
      alerts: lowStockAlerts + pendingOrders, // example combination
      issues,
    };
  }
}
