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
      bikesSold,
      availableBikes,
      availablePartsAgg,
      lowStockAlerts,
      pendingDeliveries,
      bikeOrdersWaitingPayment,
      partOrdersWaitingPayment,
      cancelledBikeOrders,
      cancelledPartOrders,
    ] = await Promise.all([
      branchId
        ? this.prisma.client.branch.findUnique({
            where: { id: branchId },
            select: { id: true, name: true, city: true },
          })
        : Promise.resolve(null),
      // Offers module removed - always return 0
      Promise.resolve(0),
      this.prisma.client.paymentTransaction.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          order: branchId ? { branchId } : undefined,
        },
        _sum: { amount: true },
      }),
      this.prisma.client.partPaymentTransaction.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          partOrder: branchId ? { branchId } : undefined,
        },
        _sum: { amount: true },
      }),
      this.prisma.client.bikeUnit.count({
        where: { ...branchFilter, status: BikeStatus.SOLD },
      }),
      this.prisma.client.bikeUnit.count({
        where: { ...branchFilter, status: BikeStatus.AVAILABLE },
      }),
      this.prisma.client.partInventory.aggregate({
        where: branchFilter,
        _sum: { quantity: true, reservedQuantity: true },
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
      this.prisma.client.order.count({
        where: { ...branchFilter, status: OrderStatus.PENDING_PAYMENT },
      }),
      this.prisma.client.partOrder.count({
        where: { ...branchFilter, status: OrderStatus.PENDING_PAYMENT },
      }),
      this.prisma.client.order.count({
        where: { ...branchFilter, status: OrderStatus.CANCELLED },
      }),
      this.prisma.client.partOrder.count({
        where: { ...branchFilter, status: OrderStatus.CANCELLED },
      }),
    ]);

    const totalRevenue =
      Number(bikePayments._sum.amount ?? 0) + Number(partPayments._sum.amount ?? 0);
    const availableParts =
      (availablePartsAgg._sum.quantity ?? 0) -
      (availablePartsAgg._sum.reservedQuantity ?? 0);
    const ordersWaitingPayment = bikeOrdersWaitingPayment + partOrdersWaitingPayment;
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
      cancelledOrders,
    };

    if (user.role === UserRole.SALES_STAFF) {
      return commonStats;
    }

    return {
      ...commonStats,
      totalRevenue,
      bikesSold,
    };
  }
}