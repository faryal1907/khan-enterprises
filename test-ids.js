const { PrismaClient } = require('./node_modules/@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
prisma.bikeModel.findFirst().then(console.log).finally(() => prisma.$disconnect());
prisma.vendor.findFirst().then(console.log);
