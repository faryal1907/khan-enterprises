import { api } from "../api-client";

export interface CreateOfferData {
  bikeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCNIC?: string;
  customerAddress?: string;
  offerAmount: number;
  message?: string;
  paymentMethod?: string;
}

export async function createOffer(data: CreateOfferData, userId?: string) {
  const response = await api.post("/offers", { ...data, userId });
  return response.data;
}

export async function getOfferById(id: string) {
  const response = await api.get(`/offers/${id}`);
  return response.data;
}

export async function acceptCounterOffer(id: string, paymentMethod?: string) {
  const response = await api.post(`/offers/${id}/accept-counter`, { paymentMethod });
  return response.data;
}

export async function rejectCounterOffer(id: string, data: { message?: string }) {
  const response = await api.post(`/offers/${id}/reject-counter`, data);
  return response.data;
}

export async function cancelOffer(id: string) {
  const response = await api.post(`/offers/${id}/cancel`);
  return response.data;
}

export async function getOffersByCustomer(userId: string, params?: { status?: string; page?: number; limit?: number }) {
  const response = await api.get(`/offers/customer/${userId}`, { params });
  return response.data;
}
