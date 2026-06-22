import { Module } from "@nestjs/common";
import { DeliveriesController } from "./deliveries.controller";
import { DeliveriesService } from "./deliveries.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { OrderAlertsModule } from "../order-alerts/order-alerts.module";

@Module({
  imports: [PrismaModule, OrderAlertsModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
