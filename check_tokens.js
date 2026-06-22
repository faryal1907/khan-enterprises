require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@khan/prisma');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, fcmTokens: true }
  });
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
