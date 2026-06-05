export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SALES_STAFF = "SALES_STAFF",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  branchId: string | null;
  status: string;
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
