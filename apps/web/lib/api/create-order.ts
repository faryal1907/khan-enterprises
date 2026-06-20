import { api } from "../api-client";

export interface CreateOrderPayload {
  bikeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCNIC?: string;
  customerAddress?: string;
  paymentMethod: "CASH" | "ONLINE_TRANSFER";
  paymentProofUrl?: string;
}

export async function createCustomerOrder(payload: CreateOrderPayload) {
  const response = await api.post("/orders/create", payload);
  return response.data;
}