import { Module } from "@nestjs/common";
import { AccountingController } from "./accounting.controller";
import { AccountingService } from "./accounting.service";
import { PayablesService } from "./payables.service";
import { ReceivablesService } from "./receivables.service";
import { ReceivablesAlertService } from "./receivables-alert.service";
import { OrderAlertsModule } from "../order-alerts/order-alerts.module";

@Module({
  imports: [OrderAlertsModule],
  controllers: [AccountingController],
  providers: [
    AccountingService,
    PayablesService,
    ReceivablesService,
    ReceivablesAlertService,
  ],
  exports: [
    AccountingService,
    PayablesService,
    ReceivablesService,
    ReceivablesAlertService,
  ],
})
export class AccountingModule {}
