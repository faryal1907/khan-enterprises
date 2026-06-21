import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, BikeStatus, AuditAction, PaymentStatus } from '@khan/prisma';

@Injectable()
export class OrdersCronService {
  private readonly logger = new Logger(OrdersCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every hour to expire unfulfilled cash reservations
  @Cron(CronExpression.EVERY_HOUR)
  async handleOrderExpirations() {
    this.logger.log('Running order expiration check...');
    try {
      const now = new Date();
      
      // Find orders that are pending, cash, have reservation expiry, and are past the expiry time
      const expiredOrders = await this.prisma.client.order.findMany({
        where: {
          status: OrderStatus.PENDING_PAYMENT,
          reservationExpiry: {
            lt: now,
          },
        },
        include: {
          transactions: true,
        }
      });

      if (expiredOrders.length === 0) {
        return;
      }

      this.logger.log(`Found ${expiredOrders.length} expired orders. Processing cancellations...`);

      for (const order of expiredOrders) {
        await this.prisma.client.$transaction(async (tx) => {
          // 1. Update order to CANCELLED
          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED }
          });

          // 2. Release bike
          await tx.bikeUnit.update({
            where: { id: order.bikeId },
            data: {
              status: BikeStatus.AVAILABLE,
              reservedUntil: null,
              soldAt: null,
            }
          });

          // 3. Mark related pending transactions as failed
          await tx.paymentTransaction.updateMany({
            where: {
              orderId: order.id,
              status: PaymentStatus.PENDING
            },
            data: {
              status: PaymentStatus.CANCELLED,
              failureReason: 'Reservation expired automatically',
            }
          });

          // 4. Audit log
          await tx.auditLog.create({
            data: {
              action: AuditAction.UPDATE,
              entityType: 'ORDER',
              entityId: order.id,
              oldValue: JSON.stringify({ status: order.status }),
              newValue: JSON.stringify({ status: OrderStatus.CANCELLED, reason: 'Auto-expired reservation' }),
            }
          });
        });
      }

      this.logger.log(`Successfully cancelled ${expiredOrders.length} expired orders.`);
    } catch (error) {
      this.logger.error('Failed to process order expirations', error);
    }
  }
}
