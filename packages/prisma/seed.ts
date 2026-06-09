import { config } from "dotenv";
import path from "path";

// Load root .env — seed runs standalone outside NestJS so env vars aren't pre-loaded
config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

import { prisma } from "./index";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Starting database seeding...");

  // ============================================================================
  // CLEAN DB
  // ============================================================================
  console.log("🧹 Cleaning existing database entities...");
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
  // 1. BRANCHES
  // ============================================================================
  console.log("🏢 Seeding Branches...");

  const branchHQ = await prisma.branch.create({
    data: {
      name: "Islamabad Headquarters",
      city: "Islamabad",
      address: "Plot 12, Street 4, F-10 Markaz, Islamabad",
      phoneNumber: "+925188001001",
    },
  });

  const branchTordher = await prisma.branch.create({
    data: {
      name: "Tordher Branch",
      city: "Tordher",
      address: "Main GT Road, Near Tordher Chowk, Tordher, KPK",
      phoneNumber: "+929876543210",
    },
  });

  console.log(`✅ Seeded 2 branches.`);

  // ============================================================================
  // 2. USERS
  // ============================================================================
  console.log("👥 Seeding System Users...");

  const adminPasswordHash   = await bcrypt.hash("admin123",   10);
  const managerPasswordHash = await bcrypt.hash("manager123", 10);
  const salesPasswordHash   = await bcrypt.hash("sales123",   10);

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

  // MANAGER — Islamabad HQ
  const hqManager = await prisma.user.create({
    data: {
      email: "isb.manager@khan.com",
      passwordHash: managerPasswordHash,
      fullName: "Kamran Shah",
      phoneNumber: "+923331234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchHQ.id,
    },
  });

  // MANAGER — Tordher Branch
  const tordherManager = await prisma.user.create({
    data: {
      email: "tordher.manager@khan.com",
      passwordHash: managerPasswordHash,
      fullName: "Bilal Khan",
      phoneNumber: "+923211234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchTordher.id,
    },
  });

  // Assign managers to their branches
  await prisma.branch.update({ where: { id: branchHQ.id },      data: { managerId: hqManager.id } });
  await prisma.branch.update({ where: { id: branchTordher.id }, data: { managerId: tordherManager.id } });

  // SALES_STAFF — Tordher Branch — assigned to Roadking vendor
  await prisma.user.create({
    data: {
      email: "tordher.staff@khan.com",
      passwordHash: salesPasswordHash,
      fullName: "Siddique Ahmed",
      phoneNumber: "+923451234567",
      role: "SALES_STAFF",
      status: "ACTIVE",
      branchId: branchTordher.id,
      vendorId: vendorRoadking.id,
    },
  });

  // SALES_STAFF — Islamabad HQ — assigned to Evee vendor
  await prisma.user.create({
    data: {
      email: "isb.staff@khan.com",
      passwordHash: salesPasswordHash,
      fullName: "Zubair Ali",
      phoneNumber: "+923061234567",
      role: "SALES_STAFF",
      status: "ACTIVE",
      branchId: branchHQ.id,
      vendorId: vendorEvee.id,
    },
  });

  console.log("✅ Seeded users: 1 ADMIN, 2 MANAGERs, 2 SALES_STAFF (1 per vendor).");

    // TEST CUSTOMER (Non-Admin)
  const customerPasswordHash = await bcrypt.hash("customer123", 10);

  await prisma.user.create({
    data: {
      email: "customer1@khan.com",
      passwordHash: customerPasswordHash,
      fullName: "Ahmed Hassan",
      phoneNumber: "+923001112233",
      role: "CUSTOMER",           // Important: Use CUSTOMER role
      status: "ACTIVE",
      // No branchId for regular customers
    },
  });

  console.log("✅ Seeded 1 Test Customer: customer1@khan.com");

  // ============================================================================
  // 3. VENDORS
  // Real contact details used. Contact person names are placeholders.
  // ============================================================================
  console.log("🏭 Seeding Vendors...");

  const vendorEvee = await prisma.vendor.create({
    data: {
      name: "Evee Pakistan",
      phoneNumber: "+923252292290",
      email: "sales@evee.pk",
      address: "19-KM, Baghdadi Street, Off Multan Road, Lahore, Punjab, Pakistan",
    },
  });

  const vendorRoadking = await prisma.vendor.create({
    data: {
      name: "Roadking Motors",
      phoneNumber: "+923286225737",
      email: "contact@roadking.com.pk",
      address: "Industrial Area, Chak No. 209, Jaranwala Road, Faisalabad, Pakistan",
    },
  });

  console.log("✅ Seeded 2 vendors: Evee Pakistan, Roadking Motors.");

  // ============================================================================
  // 4. BIKE MODELS
  // ============================================================================
  console.log("🏍️ Seeding Bike Models...");

  // --- Evee (Electric) ---
  const modelEveeC1Pro = await prisma.bikeModel.create({
    data: {
      brand: "Evee",
      modelName: "C1 Pro",
      year: 2025,
      engineCapacity: "Electric",
      color: "Pearl White / Matte Black / Red",
      description: "Premium electric scooter with fast charging and a refined urban riding experience.",
      basePrice: 285000,
    },
  });

  const modelEveeE5 = await prisma.bikeModel.create({
    data: {
      brand: "Evee",
      modelName: "E5",
      year: 2025,
      engineCapacity: "Electric",
      color: "Blue / Silver / Green",
      description: "Family commuter electric bike with high mileage per charge and a comfortable posture.",
      basePrice: 195000,
    },
  });

  const modelEveeThunder = await prisma.bikeModel.create({
    data: {
      brand: "Evee",
      modelName: "Thunder",
      year: 2025,
      engineCapacity: "Electric",
      color: "Black / Orange",
      description: "Sporty electric bike with powerful torque and aggressive styling.",
      basePrice: 345000,
    },
  });

  const modelEveeCityRider = await prisma.bikeModel.create({
    data: {
      brand: "Evee",
      modelName: "City Rider",
      year: 2024,
      engineCapacity: "Electric",
      color: "White / Grey",
      description: "Budget-friendly daily commuter electric bike for short city routes.",
      basePrice: 165000,
    },
  });

  // --- Roadking (Petrol) ---
  const modelRK125 = await prisma.bikeModel.create({
    data: {
      brand: "Roadking",
      modelName: "RK 125",
      year: 2025,
      engineCapacity: "125cc",
      color: "Black / Red / Blue",
      description: "Reliable entry-level commuter motorcycle built for everyday city and town use.",
      basePrice: 185000,
    },
  });

  const modelRK150 = await prisma.bikeModel.create({
    data: {
      brand: "Roadking",
      modelName: "RK 150",
      year: 2025,
      engineCapacity: "150cc",
      color: "Matte Black / Silver",
      description: "Powerful mid-range bike suited for both highway cruising and city commuting.",
      basePrice: 245000,
    },
  });

  const modelRKCruiser = await prisma.bikeModel.create({
    data: {
      brand: "Roadking",
      modelName: "RK Cruiser",
      year: 2024,
      engineCapacity: "250cc",
      color: "Deep Green / Brown",
      description: "Classic cruiser-style motorcycle with an ergonomic seat and long-distance comfort.",
      basePrice: 425000,
    },
  });

  const modelRK70 = await prisma.bikeModel.create({
    data: {
      brand: "Roadking",
      modelName: "RK 70",
      year: 2025,
      engineCapacity: "70cc",
      color: "Red / Black",
      description: "Light and fuel-efficient bike ideal for students and beginner riders.",
      basePrice: 135000,
    },
  });

  console.log("✅ Seeded 8 bike models: 4 Evee, 4 Roadking.");

  // ============================================================================
  // 5. SERIALIZED BIKE UNITS
  // ============================================================================
  console.log("🏷️ Seeding Bike Units...");

  // --- Evee Units ---
  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorEvee.id,
      branchId: branchHQ.id,
      modelId: modelEveeC1Pro.id,
      chassisNumber: "EVC1P-2025-78492",
      engineNumber: "EMOT-78492-EV25",
      serialNumber: "SR-EV-C1P-001",
      status: "AVAILABLE",
    },
  });

  const reservedExpiry = new Date();
  reservedExpiry.setHours(reservedExpiry.getHours() + 48);

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorEvee.id,
      branchId: branchTordher.id,
      modelId: modelEveeC1Pro.id,
      chassisNumber: "EVC1P-2025-78493",
      engineNumber: "EMOT-78493-EV25",
      serialNumber: "SR-EV-C1P-002",
      status: "RESERVED",
      reservedUntil: reservedExpiry,
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorEvee.id,
      branchId: branchHQ.id,
      modelId: modelEveeE5.id,
      chassisNumber: "EVE5-2025-31904",
      engineNumber: "EMOT-31904-EV25",
      serialNumber: "SR-EV-E5-003",
      status: "AVAILABLE",
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorEvee.id,
      branchId: branchTordher.id,
      modelId: modelEveeThunder.id,
      chassisNumber: "EVTHN-2025-67281",
      engineNumber: "EMOT-67281-EV25",
      serialNumber: "SR-EV-THN-001",
      status: "AVAILABLE",
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorEvee.id,
      branchId: branchHQ.id,
      modelId: modelEveeCityRider.id,
      chassisNumber: "EVCR-2024-55123",
      engineNumber: "EMOT-55123-EV24",
      serialNumber: "SR-EV-CR-004",
      status: "SOLD",
      soldAt: new Date("2025-03-15"),
    },
  });

  // --- Roadking Units ---
  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorRoadking.id,
      branchId: branchHQ.id,
      modelId: modelRK125.id,
      chassisNumber: "RK125-2025-44871",
      engineNumber: "RK125ENG-44871",
      serialNumber: "SR-RK-125-005",
      status: "AVAILABLE",
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorRoadking.id,
      branchId: branchTordher.id,
      modelId: modelRK150.id,
      chassisNumber: "RK150-2025-22904",
      engineNumber: "RK150ENG-22904",
      serialNumber: "SR-RK-150-001",
      status: "AVAILABLE",
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorRoadking.id,
      branchId: branchHQ.id,
      modelId: modelRKCruiser.id,
      chassisNumber: "RKC-2024-77192",
      engineNumber: "RKC250ENG-77192",
      serialNumber: "SR-RK-CRS-002",
      status: "RESERVED",
      reservedUntil: reservedExpiry,
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorRoadking.id,
      branchId: branchTordher.id,
      modelId: modelRK70.id,
      chassisNumber: "RK70-2025-11234",
      engineNumber: "RK70ENG-11234",
      serialNumber: "SR-RK-70-006",
      status: "AVAILABLE",
    },
  });

  await prisma.bikeUnit.create({
    data: {
      vendorId: vendorRoadking.id,
      branchId: branchHQ.id,
      modelId: modelRK125.id,
      chassisNumber: "RK125-2025-44872",
      engineNumber: "RK125ENG-44872",
      serialNumber: "SR-RK-125-007",
      status: "AVAILABLE",
    },
  });

  console.log("✅ Seeded 10 bike units: 5 Evee, 5 Roadking.");

  // ============================================================================
  // 6. PARTS & ACCESSORIES
  // ============================================================================
  console.log("⚙️ Seeding Parts & Accessories...");

  // --- Evee Parts ---
  const partEveeCharger = await prisma.part.create({
    data: {
      name: "Evee C1 Fast Charger",
      sku: "PRT-EV-C1CHG",
      category: "Electrical",
      description: "Original fast charger for Evee C1 Pro. Compatible with standard 220V outlets.",
      sellingPrice: 8500,
    },
  });

  const partEveeBattery = await prisma.part.create({
    data: {
      name: "Evee Lithium Battery Pack",
      sku: "PRT-EV-BAT5",
      category: "Electrical",
      description: "Replacement lithium-ion battery pack for Evee E5 and compatible models.",
      sellingPrice: 65000,
    },
  });

  const partEveeHeadlight = await prisma.part.create({
    data: {
      name: "Evee LED Headlight",
      sku: "PRT-EV-LHD",
      category: "Accessories",
      description: "High-brightness LED headlight unit for Evee electric scooters.",
      sellingPrice: 4200,
    },
  });

  const partEveeFloorMat = await prisma.part.create({
    data: {
      name: "Evee Floor Mat Set",
      sku: "PRT-EV-MAT",
      category: "Accessories",
      description: "Anti-slip rubber floor mat set for Evee scooter footboard.",
      sellingPrice: 1800,
    },
  });

  // --- Roadking Parts ---
  const partRKOilFilter = await prisma.part.create({
    data: {
      name: "Roadking RK Oil Filter",
      sku: "PRT-RK-OILF",
      category: "Maintenance",
      description: "Genuine oil filter for Roadking 125cc and 150cc engines.",
      sellingPrice: 650,
    },
  });

  const partRKSparkPlug = await prisma.part.create({
    data: {
      name: "Roadking 125cc Spark Plug",
      sku: "PRT-RK-SP125",
      category: "Electrical",
      description: "OEM spark plug for Roadking RK 125 engine.",
      sellingPrice: 450,
    },
  });

  const partRKWheel = await prisma.part.create({
    data: {
      name: "Roadking Alloy Wheel",
      sku: "PRT-RK-WHL150",
      category: "Mechanical",
      description: "Lightweight alloy wheel compatible with Roadking RK 150.",
      sellingPrice: 18500,
    },
  });

  const partRKSeatCover = await prisma.part.create({
    data: {
      name: "Roadking Seat Cover",
      sku: "PRT-RK-SEAT",
      category: "Accessories",
      description: "Durable waterproof seat cover for all Roadking models.",
      sellingPrice: 2800,
    },
  });

  const partRKChain = await prisma.part.create({
    data: {
      name: "Roadking Chain Sprocket Kit",
      sku: "PRT-RK-CHAIN150",
      category: "Mechanical",
      description: "Complete chain and sprocket replacement kit for Roadking RK 150.",
      sellingPrice: 5200,
    },
  });

  // --- Part Inventory (stock per branch) ---
  // Evee parts — Islamabad HQ
  await prisma.partInventory.create({ data: { partId: partEveeCharger.id,   branchId: branchHQ.id,      quantity: 12, reservedQuantity: 0, reorderLevel: 3  } });
  await prisma.partInventory.create({ data: { partId: partEveeHeadlight.id, branchId: branchHQ.id,      quantity: 18, reservedQuantity: 0, reorderLevel: 5  } });
  await prisma.partInventory.create({ data: { partId: partEveeFloorMat.id,  branchId: branchHQ.id,      quantity: 25, reservedQuantity: 0, reorderLevel: 5  } });
  // Evee battery — Tordher
  await prisma.partInventory.create({ data: { partId: partEveeBattery.id,   branchId: branchTordher.id, quantity: 5,  reservedQuantity: 0, reorderLevel: 2  } });

  // Roadking parts — Islamabad HQ
  await prisma.partInventory.create({ data: { partId: partRKOilFilter.id,   branchId: branchHQ.id,      quantity: 45, reservedQuantity: 0, reorderLevel: 10 } });
  await prisma.partInventory.create({ data: { partId: partRKWheel.id,       branchId: branchHQ.id,      quantity: 8,  reservedQuantity: 0, reorderLevel: 2  } });
  await prisma.partInventory.create({ data: { partId: partRKChain.id,       branchId: branchHQ.id,      quantity: 10, reservedQuantity: 0, reorderLevel: 3  } });
  // Roadking parts — Tordher
  await prisma.partInventory.create({ data: { partId: partRKSparkPlug.id,   branchId: branchTordher.id, quantity: 30, reservedQuantity: 0, reorderLevel: 8  } });
  await prisma.partInventory.create({ data: { partId: partRKSeatCover.id,   branchId: branchTordher.id, quantity: 15, reservedQuantity: 0, reorderLevel: 4  } });

  console.log("✅ Seeded 9 parts with inventory across both branches.");

  // ============================================================================
  // 8. SAMPLE ORDER & TRANSACTION (for testing transaction detail page)
  // ============================================================================
  console.log("💳 Seeding sample order and transaction...");

  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "ORD-2025-001",
      bikeId: (await prisma.bikeUnit.findFirst({ where: { status: "SOLD" } }))!.id,
      branchId: branchHQ.id,
      customerName: "Ahmed Khan",
      customerPhone: "+923001234567",
      customerCNIC: "12345-6789012-3",
      customerAddress: "House 123, Street 5, F-8 Islamabad",
      negotiatedAmount: 175000,
      paymentMethod: "BANK_TRANSFER",
      status: "PAID",
    },
  });

  const sampleTransaction = await prisma.paymentTransaction.create({
    data: {
      orderId: sampleOrder.id,
      gatewayReference: "TXN-2025-001",
      amount: 175000,
      method: "BANK_TRANSFER",
      status: "SUCCESS",
      gatewayResponse: { status: "success", message: "Payment completed" },
      webhookReceivedAt: new Date(),
    },
  });

  console.log("✅ Seeded sample order and transaction.");

  // ============================================================================
  // 9. SAMPLE AUDIT LOG (for testing audit log detail page)
  // ============================================================================
  console.log("📝 Seeding sample audit log...");

  await prisma.auditLog.create({
    data: {
      userId: (await prisma.user.findFirst({ where: { role: "ADMIN" } }))!.id,
      userRole: "ADMIN",
      action: "UPDATE",
      entityType: "BIKE_UNIT",
      entityId: (await prisma.bikeUnit.findFirst())!.id,
      oldValue: { status: "AVAILABLE" },
      newValue: { status: "SOLD" },
      ipAddress: "192.168.1.100",
    },
  });

  console.log("✅ Seeded sample audit log.");

  console.log("🚀 Seeding complete! Khan Enterprises database is fully stocked.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
