import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { BranchModule } from "./modules/branch/branch.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { AuditLogsModule } from "./modules/audit-logs/audit-logs.module";
import { UploadModule } from "./modules/upload/upload.module";
import { VendorModule } from "./modules/vendor/vendor.module";
import { BikeModelsModule } from "./modules/bike-models/bike-models.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { OffersModule } from "./modules/offers/offers.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    InventoryModule,
    BranchModule,
    TransactionsModule,
    AuditLogsModule,
    UploadModule,
    VendorModule,
    BikeModelsModule,
    CatalogModule,
    OffersModule,
    OrdersModule,
    SchedulerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 3, // 3 attempts per minute for login
      },
    ]),
  ],
})
export class AppModule {}
