import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { BranchModule } from "./modules/branch/branch.module";

@Module({
  imports: [PrismaModule, AuthModule, InventoryModule, BranchModule],
})
export class AppModule {}
