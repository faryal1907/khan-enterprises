const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
async function run() {
  const models = await prisma.bikeModel.findMany({ take: 2 });
  console.log('Models:', models.map(m => m.id));
  const vendors = await prisma.vendor.findMany({ take: 2 });
  console.log('Vendors:', vendors.map(v => v.id));
}
run().finally(() => prisma.$disconnect());
