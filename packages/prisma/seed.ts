import { config } from "dotenv";
import path from "path";

// Load root .env — seed runs standalone outside NestJS so env vars aren't pre-loaded
config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });
import bcrypt from "bcrypt";

// expose prisma to the module scope so the finally block can disconnect
let prisma: any;

async function main() {
  const mod = await import("./index.js");
  prisma = mod.prisma;

  console.log("🌱 Starting database seeding...");

  // ============================================================================
  // CLEAN DB
  // ============================================================================
  console.log("🧹 Cleaning existing database entities...");
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "AuditLog" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Document" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "DeliveryRequest" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PartPaymentTransaction" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PaymentTransaction" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "OrderAlert" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PartOrder" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Order" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "StockMovement" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PartInventory" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Part" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "BikeUnit" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "BikeModel" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Vendor" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Branch" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "JournalEntryLine" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "JournalEntry" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Account" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PurchaseOrderItem" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PurchaseOrder" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Expense" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "VendorAllocationPartLine" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "VendorAllocation" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "VendorPayment" CASCADE;');
  console.log("✨ Database is now sparkling clean.");


  // ============================================================================
  console.log("🏢 Seeding Branches...");

  const branchHQ = await prisma.branch.create({
    data: {
      name: "Islamabad Branch",
      city: "Islamabad",
      address: "Nogazi Shop, Fateh Jang Road, Near Faisal Town, Islamabad",
      phoneNumber: "+923119143977",
    },
  });

  const branchTordher = await prisma.branch.create({
    data: {
      name: "Tordher Branch",
      city: "Tordher",
      address: "Near Byco Petrol Pump, Swabi, Jhangira Road, Tordher, District Swabi",
      phoneNumber: "+923119143977",
    },
  });

  console.log(`✅ Seeded 2 branches.`);

  // ============================================================================
  // 2. USERS
  // ============================================================================
  console.log("👥 Seeding System Users...");

  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  // ADMIN — global, no branch
  await prisma.user.create({
    data: {
      email: "admin@khan.com",
      passwordHash: adminPasswordHash,
      fullName: "Muhammad Ali Khan",
      phoneNumber: "+923001234567",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("✅ Seeded 1 ADMIN user.");

  // ============================================================================
  // 3. VENDORS
  // ============================================================================
  console.log("📦 Seeding Vendors...");

  const vendorEvee = await prisma.vendor.create({
    data: {
      name: "evee",
      contactPerson: "Evee Motors",
      phoneNumber: "+923001234567",
      email: "info@evee.com.pk",
      address: "Evee Showroom, Main Road, Islamabad",
    },
  });

  const vendorRoadking = await prisma.vendor.create({
    data: {
      name: "roadking",
      contactPerson: "Roadking Auto",
      phoneNumber: "+923009876543",
      email: "contact@roadking.com.pk",
      address: "Roadking Motors, GT Road, Lahore",
    },
  });

  console.log("✅ Seeded 2 vendors.");

  // ============================================================================
  // SALES STAFF
  // ============================================================================
  // SKIPPED - No sales staff in minimal seed

  // ============================================================================
  // 4. BIKE MODELS
  // ============================================================================
  // SKIPPED - No bike models in minimal seed

  // ============================================================================
  // 5. SERIALIZED BIKE UNITS
  // ============================================================================
  // SKIPPED - No bike units in minimal seed

  // ============================================================================
  // 6. PARTS & ACCESSORIES
  // ============================================================================
  // SKIPPED - No parts in minimal seed

  // ============================================================================
  // 7. INVENTORY ACCOUNT UPDATE
  // ============================================================================
  // SKIPPED - No inventory in minimal seed

  // ============================================================================
  // 8. CHART OF ACCOUNTS (required for all accounting features)
  // ============================================================================
  console.log("📊 Seeding Chart of Accounts...");
  const defaultAccounts = [
    { code: '1001', name: 'Cash',                       category: 'ASSET',     subtype: 'CASH',          isSystem: true },
    { code: '1002', name: 'Bank - Main',                category: 'ASSET',     subtype: 'BANK',          isSystem: true },
    { code: '1003', name: 'Inventory',                  category: 'ASSET',     subtype: 'INVENTORY',     isSystem: true },
    { code: '1004', name: 'Accounts Receivable',        category: 'ASSET',     subtype: 'AR',            isSystem: true },
    { code: '1500', name: 'Vendor Advance / Prepaid',   category: 'ASSET',     subtype: 'VENDOR_PREPAID',isSystem: true },
    { code: '2001', name: 'Accounts Payable',           category: 'LIABILITY', subtype: 'AP',            isSystem: true },
    { code: '3001', name: 'Owner Capital',              category: 'EQUITY',    subtype: 'EQUITY',        isSystem: true },
    { code: '3002', name: 'Owner Drawings',             category: 'EQUITY',    subtype: 'DRAWINGS',      isSystem: true },
    { code: '3003', name: 'Retained Earnings',          category: 'EQUITY',    subtype: 'EQUITY',        isSystem: true },
    { code: '4001', name: 'Sales Revenue',              category: 'REVENUE',   subtype: 'REVENUE',       isSystem: true },
    { code: '5001', name: 'Cost of Goods Sold',         category: 'EXPENSE',   subtype: 'COGS',          isSystem: true },
    { code: '5002', name: 'Salary Expense',             category: 'EXPENSE',   subtype: 'SALARY',        isSystem: true },
    { code: '5003', name: 'General Expense',            category: 'EXPENSE',   subtype: 'EXPENSE',       isSystem: true },
  ];
  for (const acc of defaultAccounts) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
  }
  console.log("✅ Seeded 13 system accounts (Chart of Accounts, incl. Vendor Advance).");

  console.log("🚀 Seeding complete! Database flushed and reseeded with minimal data.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
