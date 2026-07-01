import { api } from "../api-client";

export interface BikeFilters {
  modelId?: string;
  priceMin?: number;
  priceMax?: number;
  branchId?: string;
  availability?: string;
}

export interface PartFilters {
  category?: string;
  search?: string;
}

export interface OfferData {
  bikeId: string;
  amount: number;
}

export async function getCatalogBikes(filters: BikeFilters = {}) {
  const params: any = {};
  if (filters.modelId) params.modelId = filters.modelId;
  if (filters.priceMin) params.priceMin = filters.priceMin;
  if (filters.priceMax) params.priceMax = filters.priceMax;
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.availability) params.availability = filters.availability;

  const response = await api.get("/catalog/bikes", { params });
  return response.data;
}

export async function getCatalogBikeById(id: string) {
  const response = await api.get(`/catalog/bikes/${id}`);
  return response.data;
}

export async function getCatalogParts(filters: PartFilters = {}) {
  const params: any = {};
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;

  const response = await api.get("/catalog/parts", { params });
  return response.data;
}

export async function getCatalogPartById(id: string) {
  const response = await api.get(`/catalog/parts/${id}`);
  return response.data;
}

export async function searchCatalog(q: string) {
  if (!q) {
    return { bikes: [], parts: [] };
  }

  const response = await api.get("/catalog/search", { params: { q } });
  return response.data;
}

export async function getCatalogModels() {
  const response = await api.get("/catalog/models");
  return response.data;
}

export async function getCatalogBranches() {
  const response = await api.get("/catalog/branches");
  return response.data;
}

export interface PaymentAccount {
  id: string;
  name: string;
  subtype: string;
  accountNumber: string | null;
}

export async function getPaymentAccounts(): Promise<PaymentAccount[]> {
  const response = await api.get("/catalog/payment-accounts");
  return response.data;
}

// Stub for Sprint 6 backend
export async function submitOffer(data: OfferData) {
  // TODO: Implement when Sprint 6 backend is ready
  console.log("submitOffer stub called with:", data);
  throw new Error("Offer submission not yet implemented - Sprint 6");
}
