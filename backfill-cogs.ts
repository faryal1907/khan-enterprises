import 'dotenv/config';
import { prisma } from '@khan/prisma';

async function backfillCogs() {
  console.log('Starting COGS backfill...');

  try {
    // Step 1: Check what we're working with (dry run)
    console.log('\n=== DRY RUN: Checking orders missing COGS ===');
    const missingCogsOrders = await prisma.$queryRaw`
      SELECT 
        o.id as order_id,
        o."orderNumber",
        o."createdAt" as order_date,
        b."chassisNumber",
        b."purchaseCost",
        b."purchasePrice",
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM "JournalEntry" je 
            WHERE je."sourceRef" = o."orderNumber" 
            AND je."entryNo" LIKE 'JV-COGS-%'
          ) THEN 'HAS COGS'
          ELSE 'MISSING COGS'
        END as cogs_status
      FROM "Order" o
      JOIN "BikeUnit" b ON o."bikeId" = b.id
      WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
        AND EXISTS (
          SELECT 1 FROM "JournalEntry" je 
          WHERE je."sourceRef" = o."orderNumber" 
          AND je."entryNo" LIKE 'JV-SALE-%'
        )
      ORDER BY o."createdAt" DESC
    `;
    
    console.log(`Found ${(missingCogsOrders as any[]).length} orders to check`);
    const missingCount = (missingCogsOrders as any[]).filter((o: any) => o.cogs_status === 'MISSING COGS').length;
    console.log(`Orders missing COGS: ${missingCount}`);

    // Show details of orders missing COGS
    const missingOrders = (missingCogsOrders as any[]).filter((o: any) => o.cogs_status === 'MISSING COGS');
    if (missingOrders.length > 0) {
      console.log('\nOrders missing COGS details:');
      missingOrders.forEach((o: any) => {
        console.log(`- Order: ${o.orderNumber}, Chassis: ${o.chassisNumber}, PurchaseCost: ${o.purchaseCost}, PurchasePrice: ${o.purchasePrice}`);
      });
    }

    if (missingCount === 0) {
      console.log('No orders missing COGS entries. Nothing to do.');
      return;
    }

    // Step 2: Get account IDs
    console.log('\n=== Getting account IDs ===');
    const cogsAccount = await prisma.account.findUnique({ where: { code: '5001' } });
    const inventoryAccount = await prisma.account.findUnique({ where: { code: '1003' } });

    if (!cogsAccount || !inventoryAccount) {
      console.error('Required accounts not found:');
      if (!cogsAccount) console.error('- COGS account (5001) missing');
      if (!inventoryAccount) console.error('- Inventory account (1003) missing');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log(`COGS Account ID: ${cogsAccount.id}`);
    console.log(`Inventory Account ID: ${inventoryAccount.id}`);

    // Step 3: Find orders missing COGS
    console.log('\n=== Finding orders to backfill ===');
    const ordersToBackfill = await prisma.$queryRaw`
      SELECT 
        o.id as order_id,
        o."orderNumber",
        o."createdAt",
        b."purchaseCost"
      FROM "Order" o
      JOIN "BikeUnit" b ON o."bikeId" = b.id
      WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
        AND b."purchaseCost" IS NOT NULL 
        AND b."purchaseCost" > 0
        AND EXISTS (
          SELECT 1 FROM "JournalEntry" je 
          WHERE je."sourceRef" = o."orderNumber" 
          AND je."entryNo" LIKE 'JV-SALE-%'
        )
        AND NOT EXISTS (
          SELECT 1 FROM "JournalEntry" je 
          WHERE je."sourceRef" = o."orderNumber" 
          AND je."entryNo" LIKE 'JV-COGS-%'
        )
    `;

    console.log(`Orders to backfill: ${(ordersToBackfill as any[]).length}`);

    // Step 4: Create journal entries
    console.log('\n=== Creating COGS journal entries ===');
    let createdCount = 0;
    let totalCogsAmount = 0;

    for (const order of ordersToBackfill as any[]) {
      const entryNo = `JV-COGS-${order.orderNumber}`;
      const costOfGoods = Number(order.purchaseCost);

      // Check if entry already exists (avoid duplicates)
      const existing = await prisma.journalEntry.findFirst({
        where: { entryNo }
      });

      if (existing) {
        console.log(`Skipping ${order.orderNumber} - entry already exists`);
        continue;
      }

      // Create journal entry
      const journalEntry = await prisma.journalEntry.create({
        data: {
          entryNo,
          date: order.createdAt,
          description: `Cost of Goods Sold for ${order.orderNumber}`,
          sourceRef: order.orderNumber,
          notes: 'Backfilled COGS entry - missing due to purchasePrice/purchaseCost bug',
          status: 'POSTED',
          isManual: true,
          lines: {
            create: [
              {
                accountId: cogsAccount.id,
                debit: costOfGoods,
                credit: 0
              },
              {
                accountId: inventoryAccount.id,
                debit: 0,
                credit: costOfGoods
              }
            ]
          }
        }
      });

      createdCount++;
      totalCogsAmount += costOfGoods;
      console.log(`Created entry for ${order.orderNumber} - COGS: ${costOfGoods}`);
    }

    console.log('\n=== BACKFILL COMPLETE ===');
    console.log(`Total orders backfilled: ${createdCount}`);
    console.log(`Total COGS amount: ${totalCogsAmount.toFixed(2)}`);

  } catch (error) {
    console.error('Error during backfill:', error);
    throw error;
  }
}

backfillCogs()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
