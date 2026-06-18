import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OrderAlertsController } from "./order-alerts.controller";
import { OrderAlertsService } from "./order-alerts.service";
import { OrderAlertsGateway } from "./order-alerts.gateway";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [OrderAlertsController],
  providers: [OrderAlertsService, OrderAlertsGateway],
  exports: [OrderAlertsService],
})
export class OrderAlertsModule {}
