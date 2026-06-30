import { Module } from '@nestjs/common';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PayablesService } from './payables.service';

@Module({
  controllers: [AccountingController],
  providers: [AccountingService, PurchaseOrdersService, PayablesService],
  exports: [AccountingService, PurchaseOrdersService, PayablesService],
})
export class AccountingModule {}
