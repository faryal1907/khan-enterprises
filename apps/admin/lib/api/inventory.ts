import { api } from "../api-client";
import type { BikeInventoryResponse } from "../types";

// ============================================================================
// BIKES
// ============================================================================

export async function getBikes(params?: {
  branchId?: string;
  search?: string;
  status?: string;
  modelId?: string;
  vendorId?: string;
  page?: number;
  limit?: number;
}): Promise<BikeInventoryResponse> {
  const response = await api.get("/inventory/bikes", { params });
  return response.data;
}

export async function getBikeById(id: string) {
  const response = await api.get(`/inventory/bikes/${id}`);
  return response.data;
}

export async function createBike(data: {
  chassisNumber: string;
  engineNumber: string;
  serialNumber: string;
  modelId: string;
  vendorId: string;
  branchId: string;
  price?: number;
  purchaseCost?: number;
  color?: string;
  media?: string[];
}) {
  const response = await api.post("/inventory/bikes", data);
  return response.data;
}

export async function deleteBike(id: string) {
  const response = await api.delete(`/inventory/bikes/${id}`);
  return response.data;
}

export async function updateBike(id: string, data: {
  branchId?: string;
  vendorId?: string;
  status?: string;
  price?: number;
  purchaseCost?: number;
  actualSalePrice?: number;
  color?: string;
  media?: string[];
  onlineDiscountPercent?: number;
  chassisNumber?: string;
  engineNumber?: string;
}) {
  const response = await api.put(`/inventory/bikes/${id}`, data);
  return response.data;
}

export async function updateBikeStatus(id: string, status: string) {
  const response = await api.patch(`/inventory/bikes/${id}/status`, { status });
  return response.data;
}

export async function transferBike(id: string, branchId: string) {
  const response = await api.patch(`/inventory/bikes/${id}/branch`, { branchId });
  return response.data;
}

export async function updateBulkDiscount(discountPercent: number) {
  const response = await api.patch(`/inventory/bikes/discount/bulk`, { discountPercent });
  return response.data;
}

export async function attachDocument(
  bikeId: string,
  data: {
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    fileType: string;
  },
) {
  const response = await api.post(`/inventory/bikes/${bikeId}/documents`, data);
  return response.data;
}

// ============================================================================
// PARTS
// ============================================================================

export async function getParts(params?: { branchId?: string; search?: string; category?: string }) {
  const response = await api.get("/inventory/parts", { params });
  return response.data;
}

export async function getPartById(id: string) {
  const response = await api.get(`/inventory/parts/${id}`);
  return response.data;
}

export async function createPart(data: {
  name: string;
  sku: string;
  category: string;
  description?: string;
  sellingPrice: number;
  branchId: string;
  quantity: number;
  reorderLevel: number;
}) {
  const response = await api.post("/inventory/parts", data);
  return response.data;
}

export async function updatePart(
  id: string,
  data: {
    name?: string;
    sku?: string;
    category?: string;
    description?: string;
    sellingPrice?: number;
    purchaseCost?: number;
  },
) {
  const response = await api.put(`/inventory/parts/${id}`, data);
  return response.data;
}

export async function deletePart(id: string) {
  const response = await api.delete(`/inventory/parts/${id}`);
  return response.data;
}

export async function adjustStock(
  inventoryId: string,
  data: {
    quantity: number;
    movementType: string;
    reason?: string;
  },
) {
  const response = await api.post(`/inventory/parts/${inventoryId}/adjust-stock`, data);
  return response.data;
}

export async function updatePartInventoryDiscount(
  inventoryId: string,
  onlineDiscountPercent: number,
) {
  const response = await api.patch(`/inventory/parts/inventory/${inventoryId}/discount`, { onlineDiscountPercent });
  return response.data;
}

export async function updatePartInventoryReorderLevel(
  inventoryId: string,
  reorderLevel: number,
) {
  const response = await api.patch(`/inventory/parts/inventory/${inventoryId}/reorder-level`, { reorderLevel });
  return response.data;
}

export async function transferPart(data: {
  partId: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
}) {
  const response = await api.post(`/inventory/parts/transfer`, data);
  return response.data;
}

export async function getStockMovements(
  inventoryId: string,
  page: number = 1,
  limit: number = 20,
) {
  const response = await api.get(`/inventory/parts/${inventoryId}/movements`, {
    params: { page, limit },
  });
  return response.data;
}

export async function getLowStockItems(branchId?: string) {
  const response = await api.get("/inventory/parts/low-stock", {
    params: branchId ? { branchId } : undefined,
  });
  return response.data;
}

// ============================================================================
// UPLOAD
// ============================================================================

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// ============================================================================
// REFERENCE DATA
// ============================================================================

export async function getBranches() {
  const response = await api.get("/branches");
  return response.data;
}

export async function getVendors() {
  const response = await api.get("/vendors");
  return response.data;
}

export async function getBikeModels() {
  const response = await api.get("/bike-models");
  return response.data;
}

export async function getBikeModelById(id: string) {
  const response = await api.get(`/bike-models/${id}`);
  return response.data;
}

export async function createBikeModel(data: {
  brand: string;
  modelName: string;
  year: number;
  engineCapacity?: string;
  color?: string;
  description?: string;
  basePrice: number;
}) {
  const response = await api.post("/bike-models", data);
  return response.data;
}

export async function updateBikeModel(
  id: string,
  data: {
    brand?: string;
    modelName?: string;
    year?: number;
    engineCapacity?: string;
    color?: string;
    description?: string;
    basePrice?: number;
  }
) {
  const response = await api.put(`/bike-models/${id}`, data);
  return response.data;
}

export async function deleteBikeModel(id: string) {
  const response = await api.delete(`/bike-models/${id}`);
  return response.data;
}
