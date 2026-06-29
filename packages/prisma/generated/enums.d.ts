export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly MANAGER: "MANAGER";
    readonly SALES_STAFF: "SALES_STAFF";
    readonly CUSTOMER: "CUSTOMER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly SUSPENDED: "SUSPENDED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BikeStatus: {
    readonly PENDING_SETUP: "PENDING_SETUP";
    readonly AVAILABLE: "AVAILABLE";
    readonly RESERVED: "RESERVED";
    readonly SOLD: "SOLD";
    readonly IN_DELIVERY: "IN_DELIVERY";
};
export type BikeStatus = (typeof BikeStatus)[keyof typeof BikeStatus];
export declare const OrderStatus: {
    readonly PENDING_PAYMENT: "PENDING_PAYMENT";
    readonly PAID: "PAID";
    readonly CONFIRMED: "CONFIRMED";
    readonly READY_FOR_DELIVERY: "READY_FOR_DELIVERY";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const DeliveryStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly IN_TRANSIT: "IN_TRANSIT";
    readonly DELIVERED: "DELIVERED";
};
export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly SUCCESS: "SUCCESS";
    readonly FAILED: "FAILED";
    readonly VERIFICATION_PENDING: "VERIFICATION_PENDING";
    readonly CANCELLED: "CANCELLED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly ONLINE_TRANSFER: "ONLINE_TRANSFER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const OrderType: {
    readonly ONLINE: "ONLINE";
    readonly ONSITE: "ONSITE";
};
export type OrderType = (typeof OrderType)[keyof typeof OrderType];
export declare const PickupType: {
    readonly DELIVERY: "DELIVERY";
    readonly ONSITE_PICKUP: "ONSITE_PICKUP";
};
export type PickupType = (typeof PickupType)[keyof typeof PickupType];
export declare const AuditAction: {
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly DELETE: "DELETE";
    readonly LOGIN: "LOGIN";
    readonly LOGOUT: "LOGOUT";
    readonly APPROVE: "APPROVE";
    readonly REJECT: "REJECT";
    readonly PAYMENT: "PAYMENT";
};
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
export declare const InventoryMovementType: {
    readonly STOCK_IN: "STOCK_IN";
    readonly STOCK_OUT: "STOCK_OUT";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly TRANSFER: "TRANSFER";
    readonly RESERVED: "RESERVED";
    readonly RELEASED: "RELEASED";
};
export type InventoryMovementType = (typeof InventoryMovementType)[keyof typeof InventoryMovementType];
export declare const FileType: {
    readonly SUPPLIER_INVOICE: "SUPPLIER_INVOICE";
    readonly WARRANTY_DOCUMENT: "WARRANTY_DOCUMENT";
    readonly REGISTRATION_DOCUMENT: "REGISTRATION_DOCUMENT";
    readonly SALES_INVOICE: "SALES_INVOICE";
    readonly PAYMENT_RECEIPT: "PAYMENT_RECEIPT";
    readonly SALE_AGREEMENT: "SALE_AGREEMENT";
};
export type FileType = (typeof FileType)[keyof typeof FileType];
export declare const ExpenseCategory: {
    readonly UTILITIES: "UTILITIES";
    readonly RENT: "RENT";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly SALARY: "SALARY";
    readonly MARKETING: "MARKETING";
    readonly OTHER: "OTHER";
};
export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
export declare const AccountCategory: {
    readonly ASSET: "ASSET";
    readonly LIABILITY: "LIABILITY";
    readonly EQUITY: "EQUITY";
    readonly REVENUE: "REVENUE";
    readonly EXPENSE: "EXPENSE";
};
export type AccountCategory = (typeof AccountCategory)[keyof typeof AccountCategory];
export declare const AccountSubtype: {
    readonly CASH: "CASH";
    readonly BANK: "BANK";
    readonly EWALLET: "EWALLET";
    readonly AR: "AR";
    readonly AP: "AP";
    readonly INVENTORY: "INVENTORY";
    readonly COGS: "COGS";
    readonly SALARY: "SALARY";
    readonly EXPENSE: "EXPENSE";
    readonly EQUITY: "EQUITY";
    readonly REVENUE: "REVENUE";
    readonly OTHER: "OTHER";
};
export type AccountSubtype = (typeof AccountSubtype)[keyof typeof AccountSubtype];
export declare const JournalStatus: {
    readonly POSTED: "POSTED";
    readonly VOIDED: "VOIDED";
    readonly DRAFT: "DRAFT";
};
export type JournalStatus = (typeof JournalStatus)[keyof typeof JournalStatus];
export declare const POStatus: {
    readonly PENDING: "PENDING";
    readonly RECEIVED: "RECEIVED";
    readonly VOIDED: "VOIDED";
};
export type POStatus = (typeof POStatus)[keyof typeof POStatus];
export declare const PayableType: {
    readonly SUPPLIER: "SUPPLIER";
    readonly EXPENSE: "EXPENSE";
    readonly SALARY: "SALARY";
    readonly LOAN: "LOAN";
    readonly OTHER: "OTHER";
};
export type PayableType = (typeof PayableType)[keyof typeof PayableType];
export declare const PaymentState: {
    readonly DUE: "DUE";
    readonly PARTIAL: "PARTIAL";
    readonly PAID: "PAID";
    readonly OVERDUE: "OVERDUE";
};
export type PaymentState = (typeof PaymentState)[keyof typeof PaymentState];
