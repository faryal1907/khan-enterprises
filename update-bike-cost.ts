import 'dotenv/config';
import { prisma } from '@khan/prisma';

async function updateBikeCost() {
  const chassisNumber = 'EVTHN-2025-67281';
  const purchaseCost = 0; // REPLACE THIS WITH THE ACTUAL COST

  if (purchaseCost === 0) {
    console.error('ERROR: Please set the actual purchaseCost in the script before running');
    console.log('Edit this file and replace the purchaseCost value with the actual cost');
    process.exit(1);
  }

  try {
    const bike = await prisma.bikeUnit.findUnique({
      where: { chassisNumber }
    });

    if (!bike) {
      console.error(`Bike with chassis ${chassisNumber} not found`);
      process.exit(1);
    }

    console.log(`Current bike data:`);
    console.log(`- Chassis: ${bike.chassisNumber}`);
    console.log(`- Current purchaseCost: ${bike.purchaseCost}`);
    console.log(`- Current purchasePrice: ${bike.purchasePrice}`);
    console.log(`- Status: ${bike.status}`);

    const updated = await prisma.bikeUnit.update({
      where: { chassisNumber },
      data: { purchaseCost }
    });

    console.log(`\nBike updated successfully:`);
    console.log(`- New purchaseCost: ${updated.purchaseCost}`);

    // Now run the backfill
    console.log('\nRunning backfill...');
    const backfillResult = await prisma.journalEntry.create({
      data: {
        entryNo: `JV-COGS-ORD-MAN-1783954641598`,
        date: updated.createdAt,
        description: `Cost of Goods Sold for ORD-MAN-1783954641598`,
        sourceRef: 'ORD-MAN-1783954641598',
        notes: 'Backfilled COGS entry - missing due to purchasePrice/purchaseCost bug',
        status: 'POSTED',
        isManual: true,
        lines: {
          create: [
            {
              accountId: 'f96099a2-37a6-436e-a5fd-8bffc7a08d96', // COGS account
              debit: purchaseCost,
              credit: 0
            },
            {
              accountId: '110a2b57-9679-40f5-b2e5-5413fe121bef', // Inventory account
              debit: 0,
              credit: purchaseCost
            }
          ]
        }
      }
    });

    console.log(`COGS journal entry created: ${backfillResult.entryNo}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBikeCost()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
