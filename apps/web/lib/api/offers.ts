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
}

export async function createOffer(data: CreateOfferData) {
  const response = await api.post("/offers", data);
  return response.data;
}

export async function getOfferById(id: string) {
  const response = await api.get(`/offers/${id}`);
  return response.data;
}

export async function acceptCounterOffer(id: string) {
  const response = await api.post(`/offers/${id}/accept-counter`);
  return response.data;
}

export async function rejectCounterOffer(id: string, data: { message: string }) {
  const response = await api.post(`/offers/${id}/reject-counter`, data);
  return response.data;
}
