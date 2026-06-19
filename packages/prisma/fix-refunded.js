require('dotenv').config({ path: '../../.env' });
const { prisma } = require('./index.js');

async function main() {
  console.log('Running cleanup script for PaymentStatus...');
  try {
    await prisma.$executeRawUnsafe(`UPDATE "PaymentTransaction" SET status = 'FAILED' WHERE status::text = 'REFUNDED'`).catch(() => {});
    console.log('Updated PaymentTransaction statuses.');

    await prisma.$executeRawUnsafe(`UPDATE "PartPaymentTransaction" SET status = 'FAILED' WHERE status::text = 'REFUNDED'`).catch(() => {});
    console.log('Updated PartPaymentTransaction statuses.');

    await prisma.$executeRawUnsafe(`UPDATE "Order" SET "paymentMethod" = 'CASH' WHERE "paymentMethod"::text = 'REFUNDED'`).catch(() => {});
    await prisma.$executeRawUnsafe(`UPDATE "Order" SET status = 'CANCELLED' WHERE status::text = 'REFUNDED'`).catch(() => {});

    await prisma.$executeRawUnsafe(`UPDATE "PartOrder" SET "paymentMethod" = 'CASH' WHERE "paymentMethod"::text = 'REFUNDED'`).catch(() => {});
    await prisma.$executeRawUnsafe(`UPDATE "PartOrder" SET status = 'CANCELLED' WHERE status::text = 'REFUNDED'`).catch(() => {});

    console.log('Cleanup complete.');
  } catch (e) {
    console.error('Error during cleanup:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
