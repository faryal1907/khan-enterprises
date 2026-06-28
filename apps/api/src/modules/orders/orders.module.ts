import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersCronService } from "./orders.cron";
import { PrismaModule } from "../../prisma/prisma.module";
import { PdfModule } from "../pdf";
import { OrderAlertsModule } from "../order-alerts/order-alerts.module";

@Module({
  imports: [PrismaModule, PdfModule, OrderAlertsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersCronService],
  exports: [OrdersService],
})
export class OrdersModule {}
