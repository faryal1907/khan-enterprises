import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load root .env FIRST
config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

// Use dynamic import to ensure env is loaded before PrismaClient initialization
async function getPrismaClient() {
  const { PrismaClient } = await import("../../node_modules/@prisma/client");
  return new PrismaClient();
}

async function main() {
  const prisma = await getPrismaClient();

  console.log("📦 Exporting data from local database...");

  const exportData: any = {};

  // Export in dependency order (child tables first for import)
  
  // 1. Branches
  console.log("🏢 Exporting Branches...");
  exportData.branches = await prisma.branch.findMany();
  console.log(`✅ Exported ${exportData.branches.length} branches`);

  // 2. Vendors
  console.log("🏭 Exporting Vendors...");
  exportData.vendors = await prisma.vendor.findMany();
  console.log(`✅ Exported ${exportData.vendors.length} vendors`);

  // 3. Users
  console.log("👥 Exporting Users...");
  exportData.users = await prisma.user.findMany();
  console.log(`✅ Exported ${exportData.users.length} users`);

  // 4. Bike Models
  console.log("🏍️ Exporting Bike Models...");
  exportData.bikeModels = await prisma.bikeModel.findMany();
  console.log(`✅ Exported ${exportData.bikeModels.length} bike models`);

  // 5. Bike Units
  console.log("🏷️ Exporting Bike Units...");
  exportData.bikeUnits = await prisma.bikeUnit.findMany();
  console.log(`✅ Exported ${exportData.bikeUnits.length} bike units`);

  // 6. Parts
  console.log("⚙️ Exporting Parts...");
  exportData.parts = await prisma.part.findMany();
  console.log(`✅ Exported ${exportData.parts.length} parts`);

  // 7. Part Inventory
  console.log("📦 Exporting Part Inventory...");
  exportData.partInventory = await prisma.partInventory.findMany();
  console.log(`✅ Exported ${exportData.partInventory.length} part inventory records`);

  // 8. Stock Movements
  console.log("📊 Exporting Stock Movements...");
  exportData.stockMovements = await prisma.stockMovement.findMany();
  console.log(`✅ Exported ${exportData.stockMovements.length} stock movements`);

  // 9. Offers
  console.log("💰 Exporting Offers...");
  exportData.offers = await prisma.offer.findMany();
  console.log(`✅ Exported ${exportData.offers.length} offers`);

  // 10. Orders
  console.log("📋 Exporting Orders...");
  exportData.orders = await prisma.order.findMany();
  console.log(`✅ Exported ${exportData.orders.length} orders`);

  // 11. Part Orders
  console.log("📋 Exporting Part Orders...");
  exportData.partOrders = await prisma.partOrder.findMany();
  console.log(`✅ Exported ${exportData.partOrders.length} part orders`);

  // 12. Payment Transactions
  console.log("💳 Exporting Payment Transactions...");
  exportData.paymentTransactions = await prisma.paymentTransaction.findMany();
  console.log(`✅ Exported ${exportData.paymentTransactions.length} payment transactions`);

  // 13. Part Payment Transactions
  console.log("💳 Exporting Part Payment Transactions...");
  exportData.partPaymentTransactions = await prisma.partPaymentTransaction.findMany();
  console.log(`✅ Exported ${exportData.partPaymentTransactions.length} part payment transactions`);

  // 14. Delivery Requests
  console.log("🚚 Exporting Delivery Requests...");
  exportData.deliveryRequests = await prisma.deliveryRequest.findMany();
  console.log(`✅ Exported ${exportData.deliveryRequests.length} delivery requests`);

  // 15. Documents
  console.log("📄 Exporting Documents...");
  exportData.documents = await prisma.document.findMany();
  console.log(`✅ Exported ${exportData.documents.length} documents`);

  // 16. Refresh Tokens
  console.log("🔑 Exporting Refresh Tokens...");
  exportData.refreshTokens = await prisma.refreshToken.findMany();
  console.log(`✅ Exported ${exportData.refreshTokens.length} refresh tokens`);

  // 17. Audit Logs
  console.log("📝 Exporting Audit Logs...");
  exportData.auditLogs = await prisma.auditLog.findMany();
  console.log(`✅ Exported ${exportData.auditLogs.length} audit logs`);

  // Write to file
  const outputPath = path.resolve(process.cwd(), "data-export.json");
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  
  console.log(`\n Data export complete! Saved to: ${outputPath}`);
}

main()
  .catch((e) => {
    console.error("❌ Export failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
