"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorDefectiveReturnScalarFieldEnum = exports.VendorAllocationPartLineScalarFieldEnum = exports.VendorAllocationScalarFieldEnum = exports.VendorPaymentScalarFieldEnum = exports.PaymentAllocationScalarFieldEnum = exports.PayableScalarFieldEnum = exports.PurchaseOrderItemScalarFieldEnum = exports.PurchaseOrderScalarFieldEnum = exports.JournalEntryLineScalarFieldEnum = exports.JournalEntryScalarFieldEnum = exports.AccountScalarFieldEnum = exports.SystemSettingScalarFieldEnum = exports.AuditLogScalarFieldEnum = exports.DocumentScalarFieldEnum = exports.DeliveryRequestScalarFieldEnum = exports.ExpenseScalarFieldEnum = exports.PartPaymentTransactionScalarFieldEnum = exports.PaymentTransactionScalarFieldEnum = exports.PartOrderScalarFieldEnum = exports.OrderAlertScalarFieldEnum = exports.OrderScalarFieldEnum = exports.StockMovementScalarFieldEnum = exports.PartInventoryScalarFieldEnum = exports.PartScalarFieldEnum = exports.BikeUnitScalarFieldEnum = exports.BikeModelScalarFieldEnum = exports.VendorScalarFieldEnum = exports.BranchScalarFieldEnum = exports.PasswordResetTokenScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.SortOrder = exports.ReceivablesAlertScalarFieldEnum = exports.VendorDefectiveReturnPartLineScalarFieldEnum = exports.VendorDefectiveReturnBikeScalarFieldEnum = void 0;
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
    PasswordResetToken: 'PasswordResetToken',
    Branch: 'Branch',
    Vendor: 'Vendor',
    BikeModel: 'BikeModel',
    BikeUnit: 'BikeUnit',
    Part: 'Part',
    PartInventory: 'PartInventory',
    StockMovement: 'StockMovement',
    Order: 'Order',
    OrderAlert: 'OrderAlert',
    PartOrder: 'PartOrder',
    PaymentTransaction: 'PaymentTransaction',
    PartPaymentTransaction: 'PartPaymentTransaction',
    Expense: 'Expense',
    DeliveryRequest: 'DeliveryRequest',
    Document: 'Document',
    AuditLog: 'AuditLog',
    SystemSetting: 'SystemSetting',
    Account: 'Account',
    JournalEntry: 'JournalEntry',
    JournalEntryLine: 'JournalEntryLine',
    PurchaseOrder: 'PurchaseOrder',
    PurchaseOrderItem: 'PurchaseOrderItem',
    Payable: 'Payable',
    PaymentAllocation: 'PaymentAllocation',
    VendorPayment: 'VendorPayment',
    VendorAllocation: 'VendorAllocation',
    VendorAllocationPartLine: 'VendorAllocationPartLine',
    VendorDefectiveReturn: 'VendorDefectiveReturn',
    VendorDefectiveReturnBike: 'VendorDefectiveReturnBike',
    VendorDefectiveReturnPartLine: 'VendorDefectiveReturnPartLine',
    ReceivablesAlert: 'ReceivablesAlert'
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
    updatedAt: 'updatedAt',
    fcmTokens: 'fcmTokens'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    userId: 'userId',
    createdAt: 'createdAt'
};
exports.PasswordResetTokenScalarFieldEnum = {
    id: 'id',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    userId: 'userId',
    createdAt: 'createdAt'
};
exports.BranchScalarFieldEnum = {
    id: 'id',
    name: 'name',
    city: 'city',
    address: 'address',
    phoneNumber: 'phoneNumber',
    latitude: 'latitude',
    longitude: 'longitude',
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
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BikeModelScalarFieldEnum = {
    id: 'id',
    brand: 'brand',
    modelName: 'modelName',
    year: 'year',
    engineCapacity: 'engineCapacity',
    colors: 'colors',
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
    purchasePrice: 'purchasePrice',
    purchaseCost: 'purchaseCost',
    color: 'color',
    media: 'media',
    onlineDiscountPercent: 'onlineDiscountPercent',
    actualSalePrice: 'actualSalePrice',
    reservedUntil: 'reservedUntil',
    soldAt: 'soldAt',
    vendorAllocationId: 'vendorAllocationId',
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
    onlineDiscountPercent: 'onlineDiscountPercent',
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
exports.OrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    bikeId: 'bikeId',
    branchId: 'branchId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    customerCNIC: 'customerCNIC',
    customerAddress: 'customerAddress',
    isOnlineOrder: 'isOnlineOrder',
    appliedDiscount: 'appliedDiscount',
    paymentMethod: 'paymentMethod',
    paymentAccountId: 'paymentAccountId',
    status: 'status',
    paymentVerified: 'paymentVerified',
    orderType: 'orderType',
    reservationExpiry: 'reservationExpiry',
    pickupType: 'pickupType',
    expiresAt: 'expiresAt',
    processedById: 'processedById',
    customerId: 'customerId',
    totalAmount: 'totalAmount',
    paidAmount: 'paidAmount',
    balanceDue: 'balanceDue',
    isInstallmentPlan: 'isInstallmentPlan',
    paymentState: 'paymentState',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OrderAlertScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    partOrderId: 'partOrderId',
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
    paymentAccountId: 'paymentAccountId',
    status: 'status',
    paymentVerified: 'paymentVerified',
    orderType: 'orderType',
    reservationExpiry: 'reservationExpiry',
    pickupType: 'pickupType',
    expiresAt: 'expiresAt',
    processedById: 'processedById',
    customerId: 'customerId',
    paidAmount: 'paidAmount',
    balanceDue: 'balanceDue',
    isInstallmentPlan: 'isInstallmentPlan',
    paymentState: 'paymentState',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentTransactionScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    accountId: 'accountId',
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
    accountId: 'accountId',
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
exports.ExpenseScalarFieldEnum = {
    id: 'id',
    amount: 'amount',
    date: 'date',
    category: 'category',
    description: 'description',
    branchId: 'branchId',
    recordedById: 'recordedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.DeliveryRequestScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    partOrderId: 'partOrderId',
    deliveryAddress: 'deliveryAddress',
    preferredTimeWindow: 'preferredTimeWindow',
    contactNumber: 'contactNumber',
    latitude: 'latitude',
    longitude: 'longitude',
    distanceFromBranch: 'distanceFromBranch',
    deliveryCost: 'deliveryCost',
    status: 'status',
    approvedAt: 'approvedAt',
    deliveredAt: 'deliveredAt',
    notes: 'notes',
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
exports.SystemSettingScalarFieldEnum = {
    id: 'id',
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
};
exports.AccountScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    category: 'category',
    subtype: 'subtype',
    accountNumber: 'accountNumber',
    openingBalance: 'openingBalance',
    isActive: 'isActive',
    isSystem: 'isSystem'
};
exports.JournalEntryScalarFieldEnum = {
    id: 'id',
    entryNo: 'entryNo',
    date: 'date',
    description: 'description',
    sourceRef: 'sourceRef',
    notes: 'notes',
    status: 'status',
    isManual: 'isManual'
};
exports.JournalEntryLineScalarFieldEnum = {
    id: 'id',
    journalEntryId: 'journalEntryId',
    accountId: 'accountId',
    debit: 'debit',
    credit: 'credit'
};
exports.PurchaseOrderScalarFieldEnum = {
    id: 'id',
    poNumber: 'poNumber',
    vendorId: 'vendorId',
    type: 'type',
    totalCost: 'totalCost',
    status: 'status'
};
exports.PurchaseOrderItemScalarFieldEnum = {
    id: 'id',
    purchaseOrderId: 'purchaseOrderId',
    modelId: 'modelId',
    partId: 'partId',
    branchId: 'branchId',
    quantity: 'quantity',
    purchasePrice: 'purchasePrice',
    salePrice: 'salePrice'
};
exports.PayableScalarFieldEnum = {
    id: 'id',
    ref: 'ref',
    type: 'type',
    partyName: 'partyName',
    description: 'description',
    total: 'total',
    paid: 'paid',
    remaining: 'remaining',
    dueDate: 'dueDate',
    status: 'status',
    poId: 'poId'
};
exports.PaymentAllocationScalarFieldEnum = {
    id: 'id',
    paymentId: 'paymentId',
    orderId: 'orderId',
    partOrderId: 'partOrderId',
    payableId: 'payableId',
    allocatedAmount: 'allocatedAmount',
    partPaymentTransactionId: 'partPaymentTransactionId'
};
exports.VendorPaymentScalarFieldEnum = {
    id: 'id',
    vendorId: 'vendorId',
    fromAccountId: 'fromAccountId',
    amount: 'amount',
    date: 'date',
    notes: 'notes',
    journalEntryId: 'journalEntryId',
    recordedById: 'recordedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VendorAllocationScalarFieldEnum = {
    id: 'id',
    vendorId: 'vendorId',
    totalAmount: 'totalAmount',
    date: 'date',
    notes: 'notes',
    journalEntryId: 'journalEntryId',
    recordedById: 'recordedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VendorAllocationPartLineScalarFieldEnum = {
    id: 'id',
    allocationId: 'allocationId',
    partId: 'partId',
    branchId: 'branchId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    totalCost: 'totalCost'
};
exports.VendorDefectiveReturnScalarFieldEnum = {
    id: 'id',
    vendorId: 'vendorId',
    totalAmount: 'totalAmount',
    date: 'date',
    notes: 'notes',
    journalEntryId: 'journalEntryId',
    recordedById: 'recordedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.VendorDefectiveReturnBikeScalarFieldEnum = {
    id: 'id',
    returnId: 'returnId',
    chassisNumber: 'chassisNumber',
    modelBrand: 'modelBrand',
    modelName: 'modelName',
    unitCost: 'unitCost'
};
exports.VendorDefectiveReturnPartLineScalarFieldEnum = {
    id: 'id',
    returnId: 'returnId',
    partInventoryId: 'partInventoryId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    totalCost: 'totalCost'
};
exports.ReceivablesAlertScalarFieldEnum = {
    id: 'id',
    customerPhone: 'customerPhone',
    customerName: 'customerName',
    lastNotifiedAt: 'lastNotifiedAt',
    notificationCount: 'notificationCount',
    outstandingAmount: 'outstandingAmount',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
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