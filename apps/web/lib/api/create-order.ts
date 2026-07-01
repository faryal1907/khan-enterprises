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
  /** Amount the customer is paying now (minimum 50% of online price). Defaults to 50% if omitted. */
  initialPaymentAmount?: number;
  /** ID of the bank/wallet account the customer transferred to. */
  paymentAccountId?: string;
}

export async function createCustomerOrder(payload: CreateOrderPayload) {
  const response = await api.post("/orders/create", payload);
  return response.data;
}