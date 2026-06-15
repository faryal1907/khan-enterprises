import 'dotenv/config';
import { prisma } from '@khan/prisma';

async function setOrderExpiry() {
  console.log('Setting expiresAt for existing orders...');

  // Set expiresAt for bike orders in PENDING_PAYMENT status that don't have it
  const bikeOrders = await prisma.order.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      expiresAt: null,
    },
  });

  for (const order of bikeOrders) {
    const expiresAt = new Date(order.createdAt);
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.order.update({
      where: { id: order.id },
      data: { expiresAt },
    });

    console.log(`Updated bike order ${order.orderNumber} with expiresAt: ${expiresAt.toISOString()}`);
  }

  // Set expiresAt for part orders in PENDING_PAYMENT status that don't have it
  const partOrders = await prisma.partOrder.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      expiresAt: null,
    },
  });

  for (const order of partOrders) {
    const expiresAt = new Date(order.createdAt);
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.partOrder.update({
      where: { id: order.id },
      data: { expiresAt },
    });

    console.log(`Updated part order ${order.orderNumber} with expiresAt: ${expiresAt.toISOString()}`);
  }

  console.log(`Updated ${bikeOrders.length} bike orders and ${partOrders.length} part orders`);
}

setOrderExpiry()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
