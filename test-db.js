const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  try {
    const start = Date.now();
    const count = await prisma.user.count();
    console.log(`Successfully connected to DB. Found ${count} users. Took ${Date.now() - start}ms.`);
  } catch (error) {
    console.error('Failed to connect to DB:', error.message);
    if (error.code) console.error('Error Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

main();
