import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerService } from "./scheduler.service";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [ScheduleModule.forRoot(), OrdersModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
