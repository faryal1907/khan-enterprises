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
  pendingOffers: number;
  availableBikes: number;
  availableParts: number;
  lowStockAlerts: number;
  pendingDeliveries: number;
  ordersWaitingPayment: number;
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

export interface BikeUnit {
  id: string;
  chassisNumber: string;
  engineNumber: string;
  serialNumber: string;
  status: string;
  model: BikeModel;
  vendor: Vendor;
  branch: Branch;
  documents: Document[];
  createdAt: string;
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
  BANK_TRANSFER = "BANK_TRANSFER",
  SAFEPAY = "SAFEPAY",
  JAZZCASH = "JAZZCASH",
  RAAST = "RAAST",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Order {
  id: string;
  orderNumber: string;
  bikeId: string;
  bike: BikeUnit;
  offerId: string | null;
  offer: any;
  branchId: string;
  branch: Branch;
  customerName: string;
  customerPhone: string;
  customerCNIC: string;
  customerAddress: string;
  negotiatedAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
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
