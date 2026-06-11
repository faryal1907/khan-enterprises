import { config } from "dotenv";
import path from "path";

// Load root .env — seed runs standalone outside NestJS so env vars aren't pre-loaded
config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

import { prisma } from "./index";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Starting non-destructive database seeding for Supabase...");

  // ============================================================================
  // 1. BRANCHES (upsert - won't delete existing)
  // ============================================================================
  console.log("🏢 Seeding Branches...");

  const branchHQ = await prisma.branch.upsert({
    where: { name_city: { name: "Islamabad Headquarters", city: "Islamabad" } },
    update: {},
    create: {
      name: "Islamabad Headquarters",
      city: "Islamabad",
      address: "Plot 12, Street 4, F-10 Markaz, Islamabad",
      phoneNumber: "+925188001001",
    },
  });

  const branchTordher = await prisma.branch.upsert({
    where: { name_city: { name: "Tordher Branch", city: "Tordher" } },
    update: {},
    create: {
      name: "Tordher Branch",
      city: "Tordher",
      address: "Main GT Road, Near Tordher Chowk, Tordher, KPK",
      phoneNumber: "+929876543210",
    },
  });

  console.log(`✅ Seeded 2 branches.`);

  // ============================================================================
  // 2. USERS (upsert - won't delete existing)
  // ============================================================================
  console.log("👥 Seeding System Users...");

  const adminPasswordHash   = await bcrypt.hash("admin123",   10);
  const managerPasswordHash = await bcrypt.hash("manager123", 10);
  const salesPasswordHash   = await bcrypt.hash("sales123",   10);
  const customerPasswordHash = await bcrypt.hash("customer123", 10);

  // ADMIN — global, no branch
  await prisma.user.upsert({
    where: { email: "admin@khan.com" },
    update: {
      passwordHash: adminPasswordHash,
      fullName: "Muhammad Ali Khan",
      phoneNumber: "+923001234567",
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      email: "admin@khan.com",
      passwordHash: adminPasswordHash,
      fullName: "Muhammad Ali Khan",
      phoneNumber: "+923001234567",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // MANAGER — Islamabad HQ
  const hqManager = await prisma.user.upsert({
    where: { email: "isb.manager@khan.com" },
    update: {
      passwordHash: managerPasswordHash,
      fullName: "Kamran Shah",
      phoneNumber: "+923331234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchHQ.id,
    },
    create: {
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
  const tordherManager = await prisma.user.upsert({
    where: { email: "tordher.manager@khan.com" },
    update: {
      passwordHash: managerPasswordHash,
      fullName: "Bilal Khan",
      phoneNumber: "+923211234567",
      role: "MANAGER",
      status: "ACTIVE",
      branchId: branchTordher.id,
    },
    create: {
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

  // TEST CUSTOMER
  await prisma.user.upsert({
    where: { email: "customer1@khan.com" },
    update: {
      passwordHash: customerPasswordHash,
      fullName: "Ahmed Hassan",
      phoneNumber: "+923001112233",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
    create: {
      email: "customer1@khan.com",
      passwordHash: customerPasswordHash,
      fullName: "Ahmed Hassan",
      phoneNumber: "+923001112233",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });

  console.log("✅ Seeded users: 1 ADMIN, 2 MANAGERs, 1 CUSTOMER (sales staff added after vendors).");

  // ============================================================================
  // 3. VENDORS (upsert - won't delete existing)
  // ============================================================================
  console.log("🏭 Seeding Vendors...");

  const vendorEvee = await prisma.vendor.upsert({
    where: { id: "vendor-evee-pk" },
    update: {},
    create: {
      id: "vendor-evee-pk",
      name: "Evee Pakistan",
      phoneNumber: "+923252292290",
      email: "sales@evee.pk",
      address: "19-KM, Baghdadi Street, Off Multan Road, Lahore, Punjab, Pakistan",
    },
  });

  const vendorRoadking = await prisma.vendor.upsert({
    where: { id: "vendor-roadking-motors" },
    update: {},
    create: {
      id: "vendor-roadking-motors",
      name: "Roadking Motors",
      phoneNumber: "+923286225737",
      email: "contact@roadking.com.pk",
      address: "Industrial Area, Chak No. 209, Jaranwala Road, Faisalabad, Pakistan",
    },
  });

  console.log("✅ Seeded 2 vendors: Evee Pakistan, Roadking Motors.");

  // ============================================================================
  // SALES STAFF (upsert - won't delete existing)
  // ============================================================================
  console.log("👷 Seeding Sales Staff...");

  // Tordher Branch — Roadking vendor
  await prisma.user.upsert({
    where: { email: "tordher.staff@khan.com" },
    update: {
      passwordHash: salesPasswordHash,
      fullName: "Siddique Ahmed",
      phoneNumber: "+923451234567",
      role: "SALES_STAFF",
      status: "ACTIVE",
      branchId: branchTordher.id,
      vendorId: vendorRoadking.id,
    },
    create: {
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

  // Islamabad HQ — Evee vendor
  await prisma.user.upsert({
    where: { email: "isb.staff@khan.com" },
    update: {
      passwordHash: salesPasswordHash,
      fullName: "Zubair Ali",
      phoneNumber: "+923061234567",
      role: "SALES_STAFF",
      status: "ACTIVE",
      branchId: branchHQ.id,
      vendorId: vendorEvee.id,
    },
    create: {
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

  console.log("✅ Seeded 2 SALES_STAFF: tordher.staff (Roadking), isb.staff (Evee).");

  console.log("🚀 Non-destructive seeding complete! Admin user and all seed data now exist in Supabase.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
