export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SALES_STAFF = "SALES_STAFF",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  branchId: string | null;
  vendorId: string | null;
  status: string;
}

export interface DashboardStats {
  scope: {
    type: "GLOBAL" | "BRANCH";
    branch: Pick<Branch, "id" | "name" | "city"> | null;
  };
  availableBikes: number;
  availableParts: number;
  lowStockAlerts: number;
  pendingDeliveries: number;
  ordersWaitingPayment: number;
  pendingVerifications: number;
  cancelledOrders: number;
  totalRevenue?: number;
  bikesSold?: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export enum BikeStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  IN_DELIVERY = "IN_DELIVERY",
}

export interface BikeUnit {
  id: string;
  chassisNumber: string;
  engineNumber: string;
  serialNumber: string;
  status: BikeStatus;
  price?: number | null;
  actualSalePrice?: number | null;
  reservedUntil?: string | null;
  soldAt?: string | null;
  model: BikeModel;
  vendor: Vendor;
  branch: Branch;
  documents: Document[];
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BikeInventoryResponse {
  bikes: BikeUnit[];
  pagination: Pagination;
  summary: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
    inDelivery: number;
  };
}

export interface BikeModel {
  id: string;
  brand: string;
  modelName: string;
  year: number;
  engineCapacity: string | null;
  color: string | null;
  basePrice: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
}

export interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;
  description: string | null;
}

export interface PartInventory {
  id: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  part: Part;
  branch: Branch;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  movementType: string;
  quantity: number;
  reason: string | null;
  performedBy: User | null;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phoneNumber: string | null;
}

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CASH = "CASH",
  ONLINE_TRANSFER = "ONLINE_TRANSFER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  VERIFICATION_PENDING = "VERIFICATION_PENDING",
  CANCELLED = "CANCELLED",
}

export enum OrderType {
  ONLINE = "ONLINE",
  ONSITE = "ONSITE",
}

export enum PickupType {
  DELIVERY = "DELIVERY",
  ONSITE_PICKUP = "ONSITE_PICKUP",
}

export interface Order {
  id: string;
  orderNumber: string;
  bikeId: string;
  bike: BikeUnit;
  branchId: string;
  branch: Branch;
  customerName: string;
  customerPhone: string;
  customerCNIC: string | null;
  customerAddress: string | null;
  isOnlineOrder: boolean;
  appliedDiscount?: number | null;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentVerified: boolean;
  orderType: OrderType;
  reservationExpiry?: string | null;
  pickupType: PickupType;
  processedById: string | null;
  processedBy: User | null;
  transactions: PaymentTransaction[];
  delivery: DeliveryRequest | null;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  gatewayReference: string | null;
  idempotencyKey: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayResponse: any;
  failureReason: string | null;
  webhookReceivedAt: string | null;
  paymentProofUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  deliveryAddress: string;
  preferredTimeWindow: string | null;
  contactNumber: string;
  status: string;
  approvedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}
