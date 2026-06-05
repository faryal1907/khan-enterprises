import { api } from "../api-client";

// ============================================================================
// BIKES
// ============================================================================

export async function getBikes(params?: { branchId?: string }) {
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
}) {
  const response = await api.post("/inventory/bikes", data);
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

export async function getParts(params?: { branchId?: string }) {
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
  },
) {
  const response = await api.put(`/inventory/parts/${id}`, data);
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
