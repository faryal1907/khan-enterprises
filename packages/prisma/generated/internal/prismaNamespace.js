"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.SortOrder = exports.AuditLogScalarFieldEnum = exports.DocumentScalarFieldEnum = exports.DeliveryRequestScalarFieldEnum = exports.DeliveryPricingScalarFieldEnum = exports.PartPaymentTransactionScalarFieldEnum = exports.PaymentTransactionScalarFieldEnum = exports.PartOrderScalarFieldEnum = exports.OrderAlertScalarFieldEnum = exports.OrderScalarFieldEnum = exports.OfferScalarFieldEnum = exports.StockMovementScalarFieldEnum = exports.PartInventoryScalarFieldEnum = exports.PartScalarFieldEnum = exports.BikeUnitScalarFieldEnum = exports.BikeModelScalarFieldEnum = exports.VendorScalarFieldEnum = exports.BranchScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = require("@prisma/client/runtime/client");
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Branch: 'Branch',
    Vendor: 'Vendor',
    BikeModel: 'BikeModel',
    BikeUnit: 'BikeUnit',
    Part: 'Part',
    PartInventory: 'PartInventory',
    StockMovement: 'StockMovement',
    Offer: 'Offer',
    Order: 'Order',
    OrderAlert: 'OrderAlert',
    PartOrder: 'PartOrder',
    PaymentTransaction: 'PaymentTransaction',
    PartPaymentTransaction: 'PartPaymentTransaction',
    DeliveryPricing: 'DeliveryPricing',
    DeliveryRequest: 'DeliveryRequest',
    Document: 'Document',
    AuditLog: 'AuditLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    fullName: 'fullName',
    phoneNumber: 'phoneNumber',
    role: 'role',
    status: 'status',
    branchId: 'branchId',
    vendorId: 'vendorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    userId: 'userId',
    createdAt: 'createdAt'
};
exports.BranchScalarFieldEnum = {
    id: 'id',
    name: 'name',
    city: 'city',
    address: 'address',
    phoneNumber: 'phoneNumber',
    managerId: 'managerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VendorScalarFieldEnum = {
    id: 'id',
    name: 'name',
    contactPerson: 'contactPerson',
    phoneNumber: 'phoneNumber',
    email: 'email',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BikeModelScalarFieldEnum = {
    id: 'id',
    brand: 'brand',
    modelName: 'modelName',
    year: 'year',
    engineCapacity: 'engineCapacity',
    color: 'color',
    description: 'description',
    basePrice: 'basePrice',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BikeUnitScalarFieldEnum = {
    id: 'id',
    vendorId: 'vendorId',
    branchId: 'branchId',
    modelId: 'modelId',
    chassisNumber: 'chassisNumber',
    engineNumber: 'engineNumber',
    serialNumber: 'serialNumber',
    status: 'status',
    price: 'price',
    color: 'color',
    media: 'media',
    negotiatedPrice: 'negotiatedPrice',
    onlineDiscountPercent: 'onlineDiscountPercent',
    actualSalePrice: 'actualSalePrice',
    reservedUntil: 'reservedUntil',
    soldAt: 'soldAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PartScalarFieldEnum = {
    id: 'id',
    name: 'name',
    sku: 'sku',
    category: 'category',
    description: 'description',
    sellingPrice: 'sellingPrice',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PartInventoryScalarFieldEnum = {
    id: 'id',
    partId: 'partId',
    branchId: 'branchId',
    quantity: 'quantity',
    reservedQuantity: 'reservedQuantity',
    reorderLevel: 'reorderLevel',
    updatedAt: 'updatedAt'
};
exports.StockMovementScalarFieldEnum = {
    id: 'id',
    inventoryId: 'inventoryId',
    movementType: 'movementType',
    quantity: 'quantity',
    reason: 'reason',
    performedById: 'performedById',
    createdAt: 'createdAt'
};
exports.OfferScalarFieldEnum = {
    id: 'id',
    bikeId: 'bikeId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    customerEmail: 'customerEmail',
    customerCNIC: 'customerCNIC',
    customerAddress: 'customerAddress',
    offerAmount: 'offerAmount',
    counterAmount: 'counterAmount',
    message: 'message',
    adminResponse: 'adminResponse',
    status: 'status',
    paymentMethod: 'paymentMethod',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    bikeId: 'bikeId',
    offerId: 'offerId',
    branchId: 'branchId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    customerCNIC: 'customerCNIC',
    customerAddress: 'customerAddress',
    negotiatedAmount: 'negotiatedAmount',
    isOnlineOrder: 'isOnlineOrder',
    appliedDiscount: 'appliedDiscount',
    paymentMethod: 'paymentMethod',
    status: 'status',
    paymentVerified: 'paymentVerified',
    orderType: 'orderType',
    reservationExpiry: 'reservationExpiry',
    pickupType: 'pickupType',
    expiresAt: 'expiresAt',
    processedById: 'processedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OrderAlertScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    userId: 'userId',
    isRead: 'isRead',
    alertType: 'alertType',
    createdAt: 'createdAt'
};
exports.PartOrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    partId: 'partId',
    partInventoryId: 'partInventoryId',
    branchId: 'branchId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    customerAddress: 'customerAddress',
    quantity: 'quantity',
    amount: 'amount',
    paymentMethod: 'paymentMethod',
    status: 'status',
    paymentVerified: 'paymentVerified',
    orderType: 'orderType',
    reservationExpiry: 'reservationExpiry',
    pickupType: 'pickupType',
    expiresAt: 'expiresAt',
    processedById: 'processedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentTransactionScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    gatewayReference: 'gatewayReference',
    idempotencyKey: 'idempotencyKey',
    amount: 'amount',
    method: 'method',
    status: 'status',
    gatewayResponse: 'gatewayResponse',
    failureReason: 'failureReason',
    paymentProofUrl: 'paymentProofUrl',
    verifiedAt: 'verifiedAt',
    verifiedById: 'verifiedById',
    webhookReceivedAt: 'webhookReceivedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PartPaymentTransactionScalarFieldEnum = {
    id: 'id',
    partOrderId: 'partOrderId',
    gatewayReference: 'gatewayReference',
    idempotencyKey: 'idempotencyKey',
    amount: 'amount',
    method: 'method',
    status: 'status',
    gatewayResponse: 'gatewayResponse',
    failureReason: 'failureReason',
    paymentProofUrl: 'paymentProofUrl',
    verifiedAt: 'verifiedAt',
    verifiedById: 'verifiedById',
    webhookReceivedAt: 'webhookReceivedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DeliveryPricingScalarFieldEnum = {
    id: 'id',
    freeDistanceKm: 'freeDistanceKm',
    ratePerKm: 'ratePerKm',
    effectiveFrom: 'effectiveFrom',
    effectiveTo: 'effectiveTo'
};
exports.DeliveryRequestScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    partOrderId: 'partOrderId',
    deliveryAddress: 'deliveryAddress',
    preferredTimeWindow: 'preferredTimeWindow',
    contactNumber: 'contactNumber',
    status: 'status',
    approvedAt: 'approvedAt',
    deliveredAt: 'deliveredAt',
    notes: 'notes',
    distanceKm: 'distanceKm',
    deliveryFee: 'deliveryFee',
    calculatedAt: 'calculatedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DocumentScalarFieldEnum = {
    id: 'id',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    mimeType: 'mimeType',
    fileSize: 'fileSize',
    fileType: 'fileType',
    bikeId: 'bikeId',
    orderId: 'orderId',
    uploadedById: 'uploadedById',
    createdAt: 'createdAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    userRole: 'userRole',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    oldValue: 'oldValue',
    newValue: 'newValue',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map