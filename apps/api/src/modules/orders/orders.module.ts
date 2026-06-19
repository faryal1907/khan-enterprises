import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { PdfModule } from "../pdf/pdf.module";
import { OrderAlertsModule } from "../order-alerts/order-alerts.module";

@Module({
  imports: [PrismaModule, PdfModule, OrderAlertsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
