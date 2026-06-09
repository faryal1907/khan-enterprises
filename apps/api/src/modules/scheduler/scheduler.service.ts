import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { OfferStatus, BikeStatus, OrderStatus } from "@khan/prisma";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Task 1 — Expire stale offers (every hour)
   * Find all offers where status IN [PENDING, COUNTERED] AND expiresAt < now
   * → Set those offers: status → EXPIRED
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireOffers() {
    this.logger.log("Running expireOffers cron job...");

    try {
      const now = new Date();

      const expiredOffers = await this.prisma.client.offer.findMany({
        where: {
          status: {
            in: [OfferStatus.PENDING, OfferStatus.COUNTERED],
          },
          expiresAt: {
            lt: now,
          },
        },
      });

      if (expiredOffers.length === 0) {
        this.logger.log("No expired offers found.");
        return;
      }

      const updatedOffers = await this.prisma.client.offer.updateMany({
        where: {
          id: {
            in: expiredOffers.map((offer) => offer.id),
          },
        },
        data: {
          status: OfferStatus.EXPIRED,
        },
      });

      this.logger.log(`Expired ${updatedOffers.count} offers.`);
    } catch (error) {
      this.logger.error("Error in expireOffers cron job:", error);
    }
  }

  /**
   * Task 2 — Release expired reservations (every 15 minutes)
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
}
