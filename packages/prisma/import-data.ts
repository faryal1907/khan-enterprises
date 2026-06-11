import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load root .env BEFORE importing prisma - this should point to Supabase DATABASE_URL
config({ path: path.resolve(process.cwd(), "../../.env") });
config({ path: path.resolve(process.cwd(), ".env") });

// Import prisma after env vars are loaded
import { prisma } from "./index";

async function main() {
  console.log("📥 Importing data to Supabase...");

  const filePath = path.resolve(process.cwd(), "data-export.json");
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Export file not found: ${filePath}`);
    console.log("Please run export-data.ts first to create the export file.");
    process.exit(1);
  }

  const exportData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Import in dependency order (parent tables first)
  
  // 1. Branches
  console.log("🏢 Importing Branches...");
  for (const branch of exportData.branches || []) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: {
        name: branch.name,
        city: branch.city,
        address: branch.address,
        phoneNumber: branch.phoneNumber,
        managerId: branch.managerId,
        updatedAt: branch.updatedAt,
      },
      create: {
        id: branch.id,
        name: branch.name,
        city: branch.city,
        address: branch.address,
        phoneNumber: branch.phoneNumber,
        managerId: branch.managerId,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.branches?.length || 0} branches`);

  // 2. Vendors
  console.log("🏭 Importing Vendors...");
  for (const vendor of exportData.vendors || []) {
    await prisma.vendor.upsert({
      where: { id: vendor.id },
      update: {
        name: vendor.name,
        contactPerson: vendor.contactPerson,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email,
        address: vendor.address,
        updatedAt: vendor.updatedAt,
      },
      create: {
        id: vendor.id,
        name: vendor.name,
        contactPerson: vendor.contactPerson,
        phoneNumber: vendor.phoneNumber,
        email: vendor.email,
        address: vendor.address,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.vendors?.length || 0} vendors`);

  // 3. Users
  console.log("👥 Importing Users...");
  for (const user of exportData.users || []) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        branchId: user.branchId,
        vendorId: user.vendorId,
        updatedAt: user.updatedAt,
      },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        branchId: user.branchId,
        vendorId: user.vendorId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.users?.length || 0} users`);

  // 4. Bike Models
  console.log("🏍️ Importing Bike Models...");
  for (const model of exportData.bikeModels || []) {
    await prisma.bikeModel.upsert({
      where: { id: model.id },
      update: {
        brand: model.brand,
        modelName: model.modelName,
        year: model.year,
        engineCapacity: model.engineCapacity,
        color: model.color,
        description: model.description,
        basePrice: model.basePrice,
        updatedAt: model.updatedAt,
      },
      create: {
        id: model.id,
        brand: model.brand,
        modelName: model.modelName,
        year: model.year,
        engineCapacity: model.engineCapacity,
        color: model.color,
        description: model.description,
        basePrice: model.basePrice,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.bikeModels?.length || 0} bike models`);

  // 5. Bike Units
  console.log("🏷️ Importing Bike Units...");
  for (const bike of exportData.bikeUnits || []) {
    await prisma.bikeUnit.upsert({
      where: { id: bike.id },
      update: {
        vendorId: bike.vendorId,
        branchId: bike.branchId,
        modelId: bike.modelId,
        chassisNumber: bike.chassisNumber,
        engineNumber: bike.engineNumber,
        serialNumber: bike.serialNumber,
        status: bike.status,
        negotiatedPrice: bike.negotiatedPrice,
        reservedUntil: bike.reservedUntil,
        soldAt: bike.soldAt,
        updatedAt: bike.updatedAt,
      },
      create: {
        id: bike.id,
        vendorId: bike.vendorId,
        branchId: bike.branchId,
        modelId: bike.modelId,
        chassisNumber: bike.chassisNumber,
        engineNumber: bike.engineNumber,
        serialNumber: bike.serialNumber,
        status: bike.status,
        negotiatedPrice: bike.negotiatedPrice,
        reservedUntil: bike.reservedUntil,
        soldAt: bike.soldAt,
        createdAt: bike.createdAt,
        updatedAt: bike.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.bikeUnits?.length || 0} bike units`);

  // 6. Parts
  console.log("⚙️ Importing Parts...");
  for (const part of exportData.parts || []) {
    await prisma.part.upsert({
      where: { id: part.id },
      update: {
        name: part.name,
        sku: part.sku,
        category: part.category,
        description: part.description,
        sellingPrice: part.sellingPrice,
        updatedAt: part.updatedAt,
      },
      create: {
        id: part.id,
        name: part.name,
        sku: part.sku,
        category: part.category,
        description: part.description,
        sellingPrice: part.sellingPrice,
        createdAt: part.createdAt,
        updatedAt: part.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.parts?.length || 0} parts`);

  // 7. Part Inventory
  console.log("📦 Importing Part Inventory...");
  for (const inventory of exportData.partInventory || []) {
    await prisma.partInventory.upsert({
      where: { 
        partId_branchId: {
          partId: inventory.partId,
          branchId: inventory.branchId,
        }
      },
      update: {
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        reorderLevel: inventory.reorderLevel,
        updatedAt: inventory.updatedAt,
      },
      create: {
        id: inventory.id,
        partId: inventory.partId,
        branchId: inventory.branchId,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        reorderLevel: inventory.reorderLevel,
        updatedAt: inventory.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.partInventory?.length || 0} part inventory records`);

  // 8. Stock Movements
  console.log("📊 Importing Stock Movements...");
  for (const movement of exportData.stockMovements || []) {
    await prisma.stockMovement.upsert({
      where: { id: movement.id },
      update: {
        inventoryId: movement.inventoryId,
        movementType: movement.movementType,
        quantity: movement.quantity,
        reason: movement.reason,
        performedById: movement.performedById,
      },
      create: {
        id: movement.id,
        inventoryId: movement.inventoryId,
        movementType: movement.movementType,
        quantity: movement.quantity,
        reason: movement.reason,
        performedById: movement.performedById,
        createdAt: movement.createdAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.stockMovements?.length || 0} stock movements`);

  // 9. Offers
  console.log("💰 Importing Offers...");
  for (const offer of exportData.offers || []) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: {
        bikeId: offer.bikeId,
        customerName: offer.customerName,
        customerPhone: offer.customerPhone,
        customerEmail: offer.customerEmail,
        customerCNIC: offer.customerCNIC,
        customerAddress: offer.customerAddress,
        offerAmount: offer.offerAmount,
        counterAmount: offer.counterAmount,
        message: offer.message,
        adminResponse: offer.adminResponse,
        status: offer.status,
        expiresAt: offer.expiresAt,
        paymentMethod: offer.paymentMethod,
        createdById: offer.createdById,
        updatedAt: offer.updatedAt,
      },
      create: {
        id: offer.id,
        bikeId: offer.bikeId,
        customerName: offer.customerName,
        customerPhone: offer.customerPhone,
        customerEmail: offer.customerEmail,
        customerCNIC: offer.customerCNIC,
        customerAddress: offer.customerAddress,
        offerAmount: offer.offerAmount,
        counterAmount: offer.counterAmount,
        message: offer.message,
        adminResponse: offer.adminResponse,
        status: offer.status,
        expiresAt: offer.expiresAt,
        paymentMethod: offer.paymentMethod,
        createdById: offer.createdById,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.offers?.length || 0} offers`);

  // 10. Orders
  console.log("📋 Importing Orders...");
  for (const order of exportData.orders || []) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {
        bikeId: order.bikeId,
        offerId: order.offerId,
        branchId: order.branchId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerCNIC: order.customerCNIC,
        customerAddress: order.customerAddress,
        negotiatedAmount: order.negotiatedAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        processedById: order.processedById,
        updatedAt: order.updatedAt,
      },
      create: {
        id: order.id,
        orderNumber: order.orderNumber,
        bikeId: order.bikeId,
        offerId: order.offerId,
        branchId: order.branchId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerCNIC: order.customerCNIC,
        customerAddress: order.customerAddress,
        negotiatedAmount: order.negotiatedAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        processedById: order.processedById,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.orders?.length || 0} orders`);

  // 11. Part Orders
  console.log("📋 Importing Part Orders...");
  for (const partOrder of exportData.partOrders || []) {
    await prisma.partOrder.upsert({
      where: { orderNumber: partOrder.orderNumber },
      update: {
        partId: partOrder.partId,
        partInventoryId: partOrder.partInventoryId,
        branchId: partOrder.branchId,
        customerName: partOrder.customerName,
        customerPhone: partOrder.customerPhone,
        customerAddress: partOrder.customerAddress,
        quantity: partOrder.quantity,
        amount: partOrder.amount,
        paymentMethod: partOrder.paymentMethod,
        status: partOrder.status,
        processedById: partOrder.processedById,
        updatedAt: partOrder.updatedAt,
      },
      create: {
        id: partOrder.id,
        orderNumber: partOrder.orderNumber,
        partId: partOrder.partId,
        partInventoryId: partOrder.partInventoryId,
        branchId: partOrder.branchId,
        customerName: partOrder.customerName,
        customerPhone: partOrder.customerPhone,
        customerAddress: partOrder.customerAddress,
        quantity: partOrder.quantity,
        amount: partOrder.amount,
        paymentMethod: partOrder.paymentMethod,
        status: partOrder.status,
        processedById: partOrder.processedById,
        createdAt: partOrder.createdAt,
        updatedAt: partOrder.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.partOrders?.length || 0} part orders`);

  // 12. Payment Transactions
  console.log("💳 Importing Payment Transactions...");
  for (const transaction of exportData.paymentTransactions || []) {
    await prisma.paymentTransaction.upsert({
      where: { id: transaction.id },
      update: {
        orderId: transaction.orderId,
        gatewayReference: transaction.gatewayReference,
        idempotencyKey: transaction.idempotencyKey,
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        gatewayResponse: transaction.gatewayResponse,
        failureReason: transaction.failureReason,
        webhookReceivedAt: transaction.webhookReceivedAt,
        updatedAt: transaction.updatedAt,
      },
      create: {
        id: transaction.id,
        orderId: transaction.orderId,
        gatewayReference: transaction.gatewayReference,
        idempotencyKey: transaction.idempotencyKey,
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        gatewayResponse: transaction.gatewayResponse,
        failureReason: transaction.failureReason,
        webhookReceivedAt: transaction.webhookReceivedAt,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.paymentTransactions?.length || 0} payment transactions`);

  // 13. Part Payment Transactions
  console.log("💳 Importing Part Payment Transactions...");
  for (const transaction of exportData.partPaymentTransactions || []) {
    await prisma.partPaymentTransaction.upsert({
      where: { id: transaction.id },
      update: {
        partOrderId: transaction.partOrderId,
        gatewayReference: transaction.gatewayReference,
        idempotencyKey: transaction.idempotencyKey,
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        gatewayResponse: transaction.gatewayResponse,
        failureReason: transaction.failureReason,
        webhookReceivedAt: transaction.webhookReceivedAt,
        updatedAt: transaction.updatedAt,
      },
      create: {
        id: transaction.id,
        partOrderId: transaction.partOrderId,
        gatewayReference: transaction.gatewayReference,
        idempotencyKey: transaction.idempotencyKey,
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        gatewayResponse: transaction.gatewayResponse,
        failureReason: transaction.failureReason,
        webhookReceivedAt: transaction.webhookReceivedAt,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.partPaymentTransactions?.length || 0} part payment transactions`);

  // 14. Delivery Requests
  console.log("🚚 Importing Delivery Requests...");
  for (const delivery of exportData.deliveryRequests || []) {
    await prisma.deliveryRequest.upsert({
      where: { orderId: delivery.orderId },
      update: {
        deliveryAddress: delivery.deliveryAddress,
        preferredTimeWindow: delivery.preferredTimeWindow,
        contactNumber: delivery.contactNumber,
        status: delivery.status,
        approvedAt: delivery.approvedAt,
        deliveredAt: delivery.deliveredAt,
        notes: delivery.notes,
        updatedAt: delivery.updatedAt,
      },
      create: {
        id: delivery.id,
        orderId: delivery.orderId,
        deliveryAddress: delivery.deliveryAddress,
        preferredTimeWindow: delivery.preferredTimeWindow,
        contactNumber: delivery.contactNumber,
        status: delivery.status,
        approvedAt: delivery.approvedAt,
        deliveredAt: delivery.deliveredAt,
        notes: delivery.notes,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.deliveryRequests?.length || 0} delivery requests`);

  // 15. Documents
  console.log("📄 Importing Documents...");
  for (const document of exportData.documents || []) {
    await prisma.document.upsert({
      where: { id: document.id },
      update: {
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        fileType: document.fileType,
        bikeId: document.bikeId,
        orderId: document.orderId,
        uploadedById: document.uploadedById,
      },
      create: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        fileType: document.fileType,
        bikeId: document.bikeId,
        orderId: document.orderId,
        uploadedById: document.uploadedById,
        createdAt: document.createdAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.documents?.length || 0} documents`);

  // 16. Refresh Tokens
  console.log("🔑 Importing Refresh Tokens...");
  for (const token of exportData.refreshTokens || []) {
    await prisma.refreshToken.upsert({
      where: { tokenHash: token.tokenHash },
      update: {
        expiresAt: token.expiresAt,
      },
      create: {
        id: token.id,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
        userId: token.userId,
        createdAt: token.createdAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.refreshTokens?.length || 0} refresh tokens`);

  // 17. Audit Logs
  console.log("📝 Importing Audit Logs...");
  for (const log of exportData.auditLogs || []) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {
        userId: log.userId,
        userRole: log.userRole,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        oldValue: log.oldValue,
        newValue: log.newValue,
        ipAddress: log.ipAddress,
      },
      create: {
        id: log.id,
        userId: log.userId,
        userRole: log.userRole,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        oldValue: log.oldValue,
        newValue: log.newValue,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
      },
    });
  }
  console.log(`✅ Imported ${exportData.auditLogs?.length || 0} audit logs`);

  console.log("\n🎉 Data import complete! All local data is now in Supabase.");
}

main()
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
