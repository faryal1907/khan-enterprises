import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { POStatus, PayableType, PaymentState, JournalStatus, AccountSubtype, BikeStatus } from "@khan/prisma";

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchaseOrder(data: { vendorId: string; type: string; totalCost: number; items: any[] }) {
    const poNumber = `PO-${Date.now()}`;
    return this.prisma.client.purchaseOrder.create({
      data: {
        poNumber,
        vendorId: data.vendorId,
        type: data.type,
        totalCost: data.totalCost,
        items: {
          create: data.items
        }
      },
      include: { items: true }
    });
  }

  async markAsReceived(poId: string, userId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id: poId },
        include: { items: true, vendor: true }
      });

      if (!po) throw new NotFoundException('PO not found');
      if (po.status !== POStatus.PENDING) throw new BadRequestException('PO already processed');

      // Update PO Status
      await tx.purchaseOrder.update({
        where: { id: poId },
        data: { status: POStatus.RECEIVED }
      });

      // Add to Inventory
      for (const item of po.items) {
        if (item.modelId) {
          // It's a bike - create blank bikes
          for (let i = 0; i < item.quantity; i++) {
            await tx.bikeUnit.create({
              data: {
                vendorId: po.vendorId,
                branchId: item.branchId,
                modelId: item.modelId,
                chassisNumber: `PENDING-${Date.now()}-${i}`,
                engineNumber: `PENDING-${Date.now()}-${i}`,
                price: item.salePrice,
                purchasePrice: item.purchasePrice,
                status: BikeStatus.PENDING_SETUP
              }
            });
          }
        }
        if (item.partId) {
          // Update part inventory
          await tx.partInventory.upsert({
            where: {
              partId_branchId: { partId: item.partId, branchId: item.branchId }
            },
            update: { quantity: { increment: item.quantity } },
            create: {
              partId: item.partId,
              branchId: item.branchId,
              quantity: item.quantity,
            }
          });
        }
      }

      // Create Payable
      const payable = await tx.payable.create({
        data: {
          ref: `PAY-${po.poNumber}`,
          type: PayableType.SUPPLIER,
          partyName: po.vendor.name,
          description: `Payable for PO ${po.poNumber}`,
          total: po.totalCost,
          remaining: po.totalCost,
          poId: po.id,
        }
      });

      // Journal Entry: Debit Inventory, Credit AP
      const invAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.INVENTORY } });
      const apAcc = await tx.account.findFirst({ where: { subtype: AccountSubtype.AP } });

      if (invAcc && apAcc) {
        await tx.journalEntry.create({
          data: {
            entryNo: `JV-PO-${po.poNumber}`,
            description: `Inventory received from PO ${po.poNumber}`,
            sourceRef: po.id,
            status: JournalStatus.POSTED,
            lines: {
              create: [
                { accountId: invAcc.id, debit: po.totalCost, credit: 0 },
                { accountId: apAcc.id, debit: 0, credit: po.totalCost },
              ]
            }
          }
        });
      }

      return payable;
    });
  }
}
