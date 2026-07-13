import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, OrderStatus, BikeStatus, DeliveryStatus, PaymentStatus } from '@khan/prisma';

type DashboardUser = {
  role: UserRole;
  branchId: string | null;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(user: DashboardUser) {
    // Assigned operational users are branch-scoped; unassigned users intentionally
    // operate globally. Admins are always global.
    const branchId = user.role === UserRole.ADMIN ? undefined : user.branchId ?? undefined;
    const branchFilter = branchId ? { branchId } : {};
    const relatedBranchFilter = branchId ? { branchId } : {};

    const [
      branch,
      pendingOffers,
      bikePayments,
      partPayments,
      availablePartsAgg,
      bikeStatusStats,
      orderStatusStats,
      partOrderStatusStats,
      lowStockAlerts,
      pendingDeliveries,
      bikePendingVerifications,
      partPendingVerifications,
    ] = await Promise.all([
      branchId
        ? this.prisma.client.branch.findUnique({
            where: { id: branchId },
            select: { id: true, name: true, city: true },
          })
        : Promise.resolve(null),
      // Offers module removed - always return 0
      Promise.resolve(0),
      this.prisma.client.journalEntryLine.aggregate({
        where: {
          account: { category: 'REVENUE' },
          journalEntry: { status: 'POSTED' },
        },
        _sum: { credit: true, debit: true },
      }),
      this.prisma.client.journalEntryLine.aggregate({
        where: {
          account: { category: 'EXPENSE' },
          journalEntry: { status: 'POSTED' },
        },
        _sum: { debit: true, credit: true },
      }),
      this.prisma.client.partInventory.aggregate({
        where: branchFilter,
        _sum: { quantity: true, reservedQuantity: true },
      }),
      this.prisma.client.bikeUnit.groupBy({
        by: ['status'],
        where: branchFilter,
        _count: { id: true },
      }),
      this.prisma.client.order.groupBy({
        by: ['status'],
        where: branchFilter,
        _count: { id: true },
      }),
      this.prisma.client.partOrder.groupBy({
        by: ['status'],
        where: branchFilter,
        _count: { id: true },
      }),
      this.prisma.client.partInventory.findMany({
        where: branchFilter,
        select: {
          quantity: true,
          reservedQuantity: true,
          reorderLevel: true,
        },
      }).then(inventories => 
        inventories.filter(inv => inv.quantity - inv.reservedQuantity < inv.reorderLevel).length
      ),
      this.prisma.client.deliveryRequest.count({
        where: {
          order: relatedBranchFilter,
          status: {
            in: [
              DeliveryStatus.REQUESTED,
              DeliveryStatus.UNDER_REVIEW,
              DeliveryStatus.APPROVED,
              DeliveryStatus.IN_TRANSIT,
            ],
          },
        },
      }),
      this.prisma.client.paymentTransaction.count({
        where: {
          status: PaymentStatus.VERIFICATION_PENDING,
          order: branchId ? { branchId } : undefined,
        },
      }),
      this.prisma.client.partPaymentTransaction.count({
        where: {
          status: PaymentStatus.VERIFICATION_PENDING,
          partOrder: branchId ? { branchId } : undefined,
        },
      }),
    ]);

    // Extract counts from grouped results
    const bikesSold = bikeStatusStats.find(s => s.status === BikeStatus.SOLD)?._count.id ?? 0;
    const availableBikes = bikeStatusStats.find(s => s.status === BikeStatus.AVAILABLE)?._count.id ?? 0;
    
    const bikeOrdersWaitingPayment = orderStatusStats.find(s => s.status === OrderStatus.PENDING_PAYMENT)?._count.id ?? 0;
    const cancelledBikeOrders = orderStatusStats.find(s => s.status === OrderStatus.CANCELLED)?._count.id ?? 0;
    
    const partOrdersWaitingPayment = partOrderStatusStats.find(s => s.status === OrderStatus.PENDING_PAYMENT)?._count.id ?? 0;
    const cancelledPartOrders = partOrderStatusStats.find(s => s.status === OrderStatus.CANCELLED)?._count.id ?? 0;

    const totalRevenue =
      Number(bikePayments._sum.credit ?? 0) - Number(bikePayments._sum.debit ?? 0);
    const totalExpenses =
      Number(partPayments._sum.debit ?? 0) - Number(partPayments._sum.credit ?? 0);
    const totalProfit = totalRevenue - totalExpenses;
    const availableParts =
      (availablePartsAgg._sum.quantity ?? 0) -
      (availablePartsAgg._sum.reservedQuantity ?? 0);
    const ordersWaitingPayment = bikeOrdersWaitingPayment + partOrdersWaitingPayment;
    const pendingVerifications = bikePendingVerifications + partPendingVerifications;
    const cancelledOrders = cancelledBikeOrders + cancelledPartOrders;
    const commonStats = {
      scope: branch
        ? { type: 'BRANCH' as const, branch }
        : { type: 'GLOBAL' as const, branch: null },
      pendingOffers,
      availableBikes,
      availableParts,
      lowStockAlerts,
      pendingDeliveries,
      ordersWaitingPayment,
      bikeOrdersWaitingPayment,
      partOrdersWaitingPayment,
      pendingVerifications,
      cancelledOrders,
    };

    if (user.role === UserRole.SALES_STAFF) {
      return commonStats;
    }

    return {
      ...commonStats,
      totalRevenue,
      totalExpenses,
      totalProfit,
      bikesSold,
    };
  }
}
