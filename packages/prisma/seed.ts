import { prisma } from "./index";

async function main() {
  console.log("🌱 Starting database seeding...");

  // ============================================================================
  // CLEAN DB
  // ============================================================================
  console.log("🧹 Cleaning existing database entities...");
  // Truncate tables in reverse order to avoid FK constraints
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "AuditLog" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Document" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "DeliveryRequest" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PaymentTransaction" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Order" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Offer" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "StockMovement" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "PartInventory" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Part" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "BikeUnit" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "BikeModel" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Vendor" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Branch" CASCADE;');

  console.log("✨ Database is now sparkling clean.");

  // ============================================================================
  // 1. SEED BRANCHES
  // ============================================================================
  console.log("🏢 Seeding Branches...");
  const branchKhi = await prisma.branch.create({
    data: {
      name: "Karachi South Central",
      city: "Karachi",
      address: "Plot 43-B, Main Shahrah-e-Faisal, Block 6, PECHS",
      phoneNumber: "+922134542671",
    },
  });

  const branchLhr = await prisma.branch.create({
    data: {
      name: "Lahore DHA Cantt",
      city: "Lahore",
      address: "Building 12, Sector CCA, Phase 5 DHA, Cantt",
      phoneNumber: "+924235742672",
    },
  });

  const branchIsb = await prisma.branch.create({
    data: {
      name: "Islamabad Blue Area",
      city: "Islamabad",
      address: "Shop 4, AKM Fazal-ul-Haq Road, Blue Area",
      phoneNumber: "+92512822673",
    },
  });

  console.log(`✅ Seeded ${[branchKhi, branchLhr, branchIsb].length} branches.`);

  // ============================================================================
  // 2. SEED USERS (SYSTEM STAFF)
  // ============================================================================
  console.log("👥 Seeding System Users...");
  const mockPasswordHash = "$2b$10$EPf91Yu.4p3U.gZ.9i3Hee3Zl5d9i23J2123Yd8349283"; // placeholder bcrypt hash for "password"

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@khan.com",
      passwordHash: mockPasswordHash,
      fullName: "Muhammad Ali Khan",
      phoneNumber: "+923001234567",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const khiManager = await prisma.user.create({
    data: {
      email: "khi.manager@khan.com",
      passwordHash: mockPasswordHash,
      fullName: "Kamran Shah Khi Manager",
      phoneNumber: "+923331234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchKhi.id,
    },
  });

  const lhrManager = await prisma.user.create({
    data: {
      email: "lhr.manager@khan.com",
      passwordHash: mockPasswordHash,
      fullName: "Bilal Butt Lhr Manager",
      phoneNumber: "+923211234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchLhr.id,
    },
  });

  await prisma.branch.update({ where: { id: branchKhi.id }, data: { managerId: khiManager.id } });
  await prisma.branch.update({ where: { id: branchLhr.id }, data: { managerId: lhrManager.id } });

  const khiStaff = await prisma.user.create({
    data: {
      email: "khi.staff@khan.com",
      passwordHash: mockPasswordHash,
      fullName: "Siddique Ahmed Khi Agent",
      phoneNumber: "+923451234567",
      role: "SALES_STAFF",
      status: "ACTIVE",
      branchId: branchKhi.id,
    },
  });

  console.log("✅ Seeded user roles (ADMIN, MANAGER, SALES_STAFF).");

  // ============================================================================
  // 3. SEED VENDORS (MANUFACTURERS)
  // ============================================================================
  console.log("🏭 Seeding Manufacturers & Vendors...");
  const vendorHonda = await prisma.vendor.create({
    data: {
      name: "Honda Atlas Motorcycles",
      contactPerson: "Mr. Asif Honda",
      phoneNumber: "+9221111333444",
      email: "sales@atlas.com.pk",
      address: "F-36, Mauripur Link Road, S.I.T.E., Karachi",
    },
  });

  const vendorYamaha = await prisma.vendor.create({
    data: {
      name: "Yamaha Motor Pakistan",
      contactPerson: "Mr. Kenji Yamaha",
      phoneNumber: "+9221111444555",
      email: "info@yamaha.com.pk",
      address: "Sector 27, Korangi Industrial Area, Karachi",
    },
  });

  const vendorSuzuki = await prisma.vendor.create({
    data: {
      name: "Suzuki Motor Pakistan",
      contactPerson: "Mr. Tariq Suzuki",
      phoneNumber: "+9221111555666",
      email: "sales@suzuki.com.pk",
      address: "DSU-12, Bin Qasim Industrial Park, Karachi",
    },
  });

  console.log(`✅ Seeded ${[vendorHonda, vendorYamaha, vendorSuzuki].length} manufacturers.`);

  // ============================================================================
  // 4. SEED BIKE CATALOG MODELS
  // ============================================================================
  console.log("🏍️ Seeding Motorcycle Catalog Models...");
  const modelHonda125 = await prisma.bikeModel.create({
    data: {
      brand: "Honda",
      modelName: "CG 125 Self-Start",
      year: 2026,
      engineCapacity: "125cc",
      color: "Red",
      description: "Euro II self-start edition standard Pakistani commuter icon with unparalleled engine response.",
      basePrice: 285000.00,
    },
  });

  const modelYamaha125G = await prisma.bikeModel.create({
    data: {
      brand: "Yamaha",
      modelName: "YBR 125G",
      year: 2026,
      engineCapacity: "125cc",
      color: "Matte Black",
      description: "Dual-sport sports edition commuter with high ground clearance, engine balance, and sporty fairings.",
      basePrice: 485000.00,
    },
  });

  const modelSuzuki150 = await prisma.bikeModel.create({
    data: {
      brand: "Suzuki",
      modelName: "GR 150",
      year: 2026,
      engineCapacity: "150cc",
      color: "Blue",
      description: "Premium long-route tourer featuring front shock gaiters, ergonomic seating, and absolute ride comfort.",
      basePrice: 545000.00,
    },
  });

  console.log(`✅ Seeded ${[modelHonda125, modelYamaha125G, modelSuzuki150].length} catalog models.`);

  // ============================================================================
  // 5. SEED SERIALIZED BIKE UNITS (BIKEUNIT)
  // ============================================================================
  console.log("🏷️ Seeding Serialized Bike Units (Chassis/Engine Unique Units)...");
  const bike1 = await prisma.bikeUnit.create({
    data: {
      vendorId: vendorHonda.id,
      branchId: branchKhi.id,
      modelId: modelHonda125.id,
      chassisNumber: "HON125CG2026X9001",
      engineNumber: "HON-ENG-9001",
      serialNumber: "SN-HON-001",
      status: "AVAILABLE",
    },
  });

  const bike2 = await prisma.bikeUnit.create({
    data: {
      vendorId: vendorYamaha.id,
      branchId: branchKhi.id,
      modelId: modelYamaha125G.id,
      chassisNumber: "YAM125G2026Y8002",
      engineNumber: "YAM-ENG-8002",
      serialNumber: "SN-YAM-002",
      status: "AVAILABLE",
    },
  });

  const bike3 = await prisma.bikeUnit.create({
    data: {
      vendorId: vendorSuzuki.id,
      branchId: branchLhr.id,
      modelId: modelSuzuki150.id,
      chassisNumber: "SUZ150GR2026Z7003",
      engineNumber: "SUZ-ENG-7003",
      serialNumber: "SN-SUZ-003",
      status: "AVAILABLE",
    },
  });

  const reservedExpiry = new Date();
  reservedExpiry.setHours(reservedExpiry.getHours() + 48);

  const bike4 = await prisma.bikeUnit.create({
    data: {
      vendorId: vendorHonda.id,
      branchId: branchIsb.id,
      modelId: modelHonda125.id,
      chassisNumber: "HON125CG2026X9004",
      engineNumber: "HON-ENG-9004",
      serialNumber: "SN-HON-004",
      status: "RESERVED",
      negotiatedPrice: 280000.00,
      reservedUntil: reservedExpiry,
    },
  });

  console.log(`✅ Seeded ${[bike1, bike2, bike3, bike4].length} serialized units.`);

  // ============================================================================
  // 6. SEED PARTS & SPARES
  // ============================================================================
  console.log("⚙️ Seeding Parts Catalog & Stock Quantities...");
  const partPlug = await prisma.part.create({
    data: {
      name: "NGK Spark Plug C7HSA",
      sku: "PRT-NGK-C7HSA",
      category: "Electrical",
      description: "High durability Japanese spark plug ensuring optimized combustion firing.",
      sellingPrice: 450.00,
    },
  });

  const partFilter = await prisma.part.create({
    data: {
      name: "Yamaha YBR Original Air Filter",
      sku: "PRT-YAM-AIRFLT",
      category: "Filter",
      description: "High-density fiber air intake filter for optimal filtration.",
      sellingPrice: 1200.00,
    },
  });

  await prisma.partInventory.create({
    data: { partId: partPlug.id, branchId: branchKhi.id, quantity: 50, reservedQuantity: 0, reorderLevel: 10 },
  });
  await prisma.partInventory.create({
    data: { partId: partFilter.id, branchId: branchKhi.id, quantity: 25, reservedQuantity: 2, reorderLevel: 5 },
  });

  console.log("✅ Seeded parts catalog and matching branch inventory metrics.");

  console.log("🚀 Database Seeding complete! Workspace is fully ready for development.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
