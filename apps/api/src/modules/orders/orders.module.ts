import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { PdfModule } from "../pdf/pdf.module";

@Module({
  imports: [PrismaModule, PdfModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
