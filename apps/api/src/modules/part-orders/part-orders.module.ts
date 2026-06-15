import { Module } from "@nestjs/common";
import { PartOrdersService } from "./part-orders.service";
import { PartOrdersController } from "./part-orders.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { PdfModule } from "../pdf/pdf.module";

@Module({
  imports: [PrismaModule, PdfModule],
  controllers: [PartOrdersController],
  providers: [PartOrdersService],
  exports: [PartOrdersService],
})
export class PartOrdersModule {}
