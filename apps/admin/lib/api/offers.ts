import { api } from "../api-client";

// ============================================================================
// OFFERS
// ============================================================================

export async function getOffers(filters?: {
  status?: string;
  bikeId?: string;
  includeConverted?: boolean;
  page?: number;
  limit?: number;
}) {
  const response = await api.get("/offers", { params: filters });
  return response.data;
}

export async function getOfferById(id: string) {
  const response = await api.get(`/offers/admin/${id}`);
  return response.data;
}

export async function acceptOffer(id: string) {
  const response = await api.post(`/offers/${id}/accept`);
  return response.data;
}

export async function rejectOffer(id: string, data: { adminResponse: string }) {
  const response = await api.post(`/offers/${id}/reject`, data);
  return response.data;
}

export async function counterOffer(
  id: string,
  data: { counterAmount: number; adminResponse?: string },
) {
  const response = await api.post(`/offers/${id}/counter`, data);
  return response.data;
}

export async function getOffersByBike(bikeId: string) {
  const response = await api.get(`/offers/bike/${bikeId}`);
  return response.data;
}
