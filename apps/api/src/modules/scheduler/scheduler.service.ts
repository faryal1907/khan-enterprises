import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { BikeStatus, OrderStatus } from "@khan/prisma";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private isExpiringCashReservations = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}



  /**
   * Expire cash reservations (every hour)
   * Find all orders where reservationExpiry < now AND status in [PAID, PENDING_PAYMENT]
   * → Cancel orders and return bikes to AVAILABLE
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireCashReservations() {
    if (this.isExpiringCashReservations) {
      this.logger.warn("expireCashReservations is already running, skipping this execution.");
      return;
    }

    this.isExpiringCashReservations = true;
    this.logger.log("Running expireCashReservations cron job...");

    try {
      const result = await this.ordersService.expireReservations();
      this.logger.log(
        `Expired ${result.processed}/${result.total} cash reservation(s).`,
      );
    } catch (error) {
      this.logger.error("Error in expireCashReservations cron job:", error);
    } finally {
      this.isExpiringCashReservations = false;
    }
  }
}
