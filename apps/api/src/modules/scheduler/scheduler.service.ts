import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { BikeStatus, OrderStatus } from "@khan/prisma";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Task 1 — Release expired reservations (every 15 minutes)
   * Find all bikes where status = RESERVED AND reservedUntil < now
   * → For each bike:
   *     Check if it has an Order with status = PENDING_PAYMENT and offerId linked
   *     If yes → update Order status → CANCELLED
   *     Update bike: status → AVAILABLE, reservedUntil → null
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async releaseExpiredReservations() {
    this.logger.log("Running releaseExpiredReservations cron job...");

    try {
      const now = new Date();

      const expiredReservations = await this.prisma.client.bikeUnit.findMany({
        where: {
          status: BikeStatus.RESERVED,
          reservedUntil: {
            lt: now,
          },
        },
        include: {
          orders: {
            where: {
              status: OrderStatus.PENDING_PAYMENT,
            },
          },
        },
      });

      if (expiredReservations.length === 0) {
        this.logger.log("No expired reservations found.");
        return;
      }

      for (const bike of expiredReservations) {
        await this.prisma.client.$transaction(async (tx) => {
          // Cancel any pending payment orders linked to this bike
          if (bike.orders.length > 0) {
            await tx.order.updateMany({
              where: {
                id: {
                  in: bike.orders.map((order) => order.id),
                },
              },
              data: {
                status: OrderStatus.CANCELLED,
              },
            });

            const offerIds = bike.orders
              .map((order) => order.offerId)
              .filter((offerId): offerId is string => Boolean(offerId));

            if (offerIds.length > 0) {
              await tx.offer.updateMany({
                where: {
                  id: { in: offerIds },
                  status: OfferStatus.ACCEPTED,
                },
                data: {
                  status: OfferStatus.EXPIRED,
                  expiresAt: null,
                },
              });
            }
            this.logger.log(
              `Cancelled ${bike.orders.length} order(s) for bike ${bike.id}`,
            );
          }

          // Release the bike reservation
          await tx.bikeUnit.update({
            where: {
              id: bike.id,
            },
            data: {
              status: BikeStatus.AVAILABLE,
              reservedUntil: null,
            },
          });

          this.logger.log(`Released reservation for bike ${bike.id}`);
        });
      }

      this.logger.log(
        `Released ${expiredReservations.length} expired reservation(s).`,
      );
    } catch (error) {
      this.logger.error("Error in releaseExpiredReservations cron job:", error);
    }
  }

  /**
   * Task 3 — Expire orders with pending payment timeout (every hour)
   * Find all orders (bike and part) where status = PENDING_PAYMENT AND expiresAt < now
   * → Cancel those orders and return items to inventory
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expirePendingPaymentOrders() {
    this.logger.log("Running expirePendingPaymentOrders cron job...");

    try {
      const now = new Date();

      // Find expired bike orders
      const expiredBikeOrders = await this.prisma.client.order.findMany({
        where: {
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt: {
            lt: now,
          },
        },
        include: {
          bike: true,
        },
      });

      // Find expired part orders
      const expiredPartOrders = await this.prisma.client.partOrder.findMany({
        where: {
          status: OrderStatus.PENDING_PAYMENT,
          expiresAt: {
            lt: now,
          },
        },
        include: {
          partInventory: true,
        },
      });

      if (expiredBikeOrders.length === 0 && expiredPartOrders.length === 0) {
        this.logger.log("No expired orders found.");
        return;
      }

      // Cancel expired bike orders
      for (const order of expiredBikeOrders) {
        await this.prisma.client.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });

          // Return bike to AVAILABLE status
          await tx.bikeUnit.update({
            where: { id: order.bikeId },
            data: {
              status: BikeStatus.AVAILABLE,
              reservedUntil: null,
              soldAt: null,
            },
          });

          this.logger.log(`Cancelled expired bike order ${order.orderNumber}`);
        });
      }

      // Cancel expired part orders
      for (const order of expiredPartOrders) {
        await this.prisma.client.$transaction(async (tx) => {
          await tx.partOrder.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });

          // Release reserved stock
          await tx.partInventory.update({
            where: { id: order.partInventoryId },
            data: {
              reservedQuantity: {
                decrement: order.quantity,
              },
            },
          });

          this.logger.log(`Cancelled expired part order ${order.orderNumber}`);
        });
      }

      this.logger.log(
        `Expired ${expiredBikeOrders.length} bike order(s) and ${expiredPartOrders.length} part order(s).`,
      );
    } catch (error) {
      this.logger.error("Error in expirePendingPaymentOrders cron job:", error);
    }
  }
}
