import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
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
import { OrdersModule } from "./modules/orders/orders.module";
import { PartOrdersModule } from "./modules/part-orders/part-orders.module";
import { DeliveriesModule } from "./modules/deliveries/deliveries.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { PdfModule } from "./modules/pdf/pdf.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { OrderAlertsModule } from "./modules/order-alerts/order-alerts.module";
import { FirebaseModule } from './modules/firebase/firebase.module';
import { ExpensesModule } from "./modules/expenses/expenses.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { AccountingModule } from "./modules/accounting/accounting.module";
import { HealthController } from "./health/health.controller";

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV === 'production' ? '.production' : ''}`,
    }),
    PrismaModule,
    AuthModule,
    DashboardModule,
    BranchModule,
    VendorModule,
    CatalogModule,
    BikeModelsModule,
    InventoryModule,
    OrdersModule,
    PartOrdersModule,
    TransactionsModule,
    UploadModule,
    PdfModule,
    SchedulerModule,
    OrderAlertsModule,
    DeliveriesModule,
    AuditLogsModule,
    FirebaseModule,
    ExpensesModule,
    SettingsModule,
    AccountingModule,
    // ─── Rate Limiting ────────────────────────────────────────────────────────
    // ThrottlerGuard is registered globally below via APP_GUARD.
    // Individual endpoints can override with @Throttle() or opt-out with @SkipThrottle().
    //
    // Redis-backed store (recommended for multi-instance production):
    //   1. npm install @nestjs-throttler-storage-redis ioredis
    //   2. Replace ThrottlerModule.forRoot([...]) with:
    //        ThrottlerModule.forRootAsync({
    //          useFactory: () => ({
    //            throttlers: [...],
    //            storage: new ThrottlerStorageRedisService(
    //              new Redis(process.env.REDIS_URL)
    //            ),
    //          }),
    //        }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60_000,   // 1 minute window
        limit: 120,    // 120 requests per minute per IP (2 req/sec average)
      },
    ]),
  ],
  providers: [
    // ─── Apply ThrottlerGuard globally ────────────────────────────────────────
    // Without this, ThrottlerModule is configured but never enforced.
    // Use @SkipThrottle() on any route/controller that should be exempt.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
