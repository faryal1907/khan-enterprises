"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentState = exports.PayableType = exports.POStatus = exports.JournalStatus = exports.AccountSubtype = exports.AccountCategory = exports.ReceivablePartyType = exports.PayeeType = exports.ExpenseCategory = exports.FileType = exports.InventoryMovementType = exports.AuditAction = exports.PickupType = exports.OrderType = exports.PaymentMethod = exports.PaymentStatus = exports.DeliveryStatus = exports.OrderStatus = exports.BikeStatus = exports.UserStatus = exports.UserRole = void 0;
exports.UserRole = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    SALES_STAFF: 'SALES_STAFF',
    CUSTOMER: 'CUSTOMER'
};
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED'
};
exports.BikeStatus = {
    PENDING_SETUP: 'PENDING_SETUP',
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    SOLD: 'SOLD',
    IN_DELIVERY: 'IN_DELIVERY'
};
exports.OrderStatus = {
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    PAID: 'PAID',
    CONFIRMED: 'CONFIRMED',
    READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};
exports.DeliveryStatus = {
    REQUESTED: 'REQUESTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED'
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    VERIFICATION_PENDING: 'VERIFICATION_PENDING',
    CANCELLED: 'CANCELLED'
};
exports.PaymentMethod = {
    CASH: 'CASH',
    ONLINE_TRANSFER: 'ONLINE_TRANSFER'
};
exports.OrderType = {
    ONLINE: 'ONLINE',
    ONSITE: 'ONSITE'
};
exports.PickupType = {
    DELIVERY: 'DELIVERY',
    ONSITE_PICKUP: 'ONSITE_PICKUP'
};
exports.AuditAction = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    PAYMENT: 'PAYMENT',
    DEFECTIVE_RETURN: 'DEFECTIVE_RETURN'
};
exports.InventoryMovementType = {
    STOCK_IN: 'STOCK_IN',
    STOCK_OUT: 'STOCK_OUT',
    ADJUSTMENT: 'ADJUSTMENT',
    TRANSFER: 'TRANSFER',
    RESERVED: 'RESERVED',
    RELEASED: 'RELEASED'
};
exports.FileType = {
    SUPPLIER_INVOICE: 'SUPPLIER_INVOICE',
    WARRANTY_DOCUMENT: 'WARRANTY_DOCUMENT',
    REGISTRATION_DOCUMENT: 'REGISTRATION_DOCUMENT',
    SALES_INVOICE: 'SALES_INVOICE',
    PAYMENT_RECEIPT: 'PAYMENT_RECEIPT',
    SALE_AGREEMENT: 'SALE_AGREEMENT'
};
exports.ExpenseCategory = {
    UTILITIES: 'UTILITIES',
    RENT: 'RENT',
    MAINTENANCE: 'MAINTENANCE',
    SALARY: 'SALARY',
    MARKETING: 'MARKETING',
    OTHER: 'OTHER'
};
exports.PayeeType = {
    VENDOR: 'VENDOR',
    EMPLOYEE: 'EMPLOYEE',
    SUPPLIER: 'SUPPLIER',
    LANDLORD: 'LANDLORD',
    UTILITY_COMPANY: 'UTILITY_COMPANY',
    CONTRACTOR: 'CONTRACTOR',
    OTHER: 'OTHER'
};
exports.ReceivablePartyType = {
    CUSTOMER: 'CUSTOMER',
    VENDOR: 'VENDOR',
    EMPLOYEE: 'EMPLOYEE',
    SUPPLIER: 'SUPPLIER',
    LANDLORD: 'LANDLORD',
    UTILITY_COMPANY: 'UTILITY_COMPANY',
    BUSINESS_PARTNER: 'BUSINESS_PARTNER',
    OTHER: 'OTHER'
};
exports.AccountCategory = {
    ASSET: 'ASSET',
    LIABILITY: 'LIABILITY',
    EQUITY: 'EQUITY',
    REVENUE: 'REVENUE',
    EXPENSE: 'EXPENSE'
};
exports.AccountSubtype = {
    CASH: 'CASH',
    BANK: 'BANK',
    EWALLET: 'EWALLET',
    AR: 'AR',
    AP: 'AP',
    INVENTORY: 'INVENTORY',
    COGS: 'COGS',
    SALARY: 'SALARY',
    EXPENSE: 'EXPENSE',
    EQUITY: 'EQUITY',
    DRAWINGS: 'DRAWINGS',
    REVENUE: 'REVENUE',
    VENDOR_PREPAID: 'VENDOR_PREPAID',
    OTHER: 'OTHER'
};
exports.JournalStatus = {
    POSTED: 'POSTED',
    VOIDED: 'VOIDED',
    DRAFT: 'DRAFT'
};
exports.POStatus = {
    PENDING: 'PENDING',
    RECEIVED: 'RECEIVED',
    VOIDED: 'VOIDED'
};
exports.PayableType = {
    SUPPLIER: 'SUPPLIER',
    EXPENSE: 'EXPENSE',
    SALARY: 'SALARY',
    LOAN: 'LOAN',
    OTHER: 'OTHER'
};
exports.PaymentState = {
    DUE: 'DUE',
    PARTIAL: 'PARTIAL',
    PAID: 'PAID',
    OVERDUE: 'OVERDUE'
};
//# sourceMappingURL=enums.js.map