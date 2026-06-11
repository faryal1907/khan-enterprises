import { Module } from "@nestjs/common";
import { PartOrdersService } from "./part-orders.service";
import { PartOrdersController } from "./part-orders.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PartOrdersController],
  providers: [PartOrdersService],
  exports: [PartOrdersService],
})
export class PartOrdersModule {}
