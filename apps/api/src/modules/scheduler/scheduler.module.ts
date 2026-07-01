import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerService } from "./scheduler.service";
import { OrdersModule } from "../orders/orders.module";
import { AccountingModule } from "../accounting/accounting.module";

@Module({
  imports: [ScheduleModule.forRoot(), OrdersModule, AccountingModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
