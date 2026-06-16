import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { OfferStatus, BikeStatus, OrderStatus } from "@khan/prisma";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Offer expiry is handled by reservation cleanup.
   * Pending and countered offers do not have a countdown.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireOffers() {
    this.logger.log("Running expireOffers cron job...");

    this.logger.log("Offer expiry is handled by releaseExpiredReservations for accepted unpaid offers.");
  }

  /**
   * Release expired accepted-unpaid reservations.
   * The pending order is cancelled, the accepted offer expires, and the bike is released.
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
}
