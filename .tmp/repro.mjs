import { prisma } from "@khan/prisma";

const revCount = await prisma.journalEntry.count({ where: { entryNo: { startsWith: "JV-REV" } } });
console.log("total JV-REV* entries:", revCount);

const revpCount = await prisma.journalEntry.count({ where: { entryNo: { startsWith: "JV-REVPAY" } } });
console.log("total JV-REVPAY* entries:", revpCount);

const revcCount = await prisma.journalEntry.count({ where: { entryNo: { startsWith: "JV-REVCOGS" } } });
console.log("total JV-REVCOGS* entries:", revcCount);

// Partial bike orders and whether they already have a JV-REV-<orderNumber> entry
const bikeOrders = await prisma.order.findMany({
  where: { status: { not: "CANCELLED" } },
  include: { transactions: { where: { status: { not: "FAILED" } } } },
  take: 300,
});
const partialBikes = bikeOrders.filter(o => o.transactions.filter(t => t.status === "SUCCESS").length >= 1 && Number(o.balanceDue) > 0);
console.log("\npartial bike orders:", partialBikes.length);
for (const o of partialBikes) {
  const hasRev = await prisma.journalEntry.count({ where: { entryNo: `JV-REV-${o.orderNumber}` } });
  const hasRevCogs = await prisma.journalEntry.count({ where: { entryNo: `JV-REVCOGS-${o.orderNumber}` } });
  console.log(o.orderNumber, "txns:", o.transactions.length, "has JV-REV:", hasRev, "has JV-REVCOGS:", hasRevCogs);
}

await prisma.$disconnect();
