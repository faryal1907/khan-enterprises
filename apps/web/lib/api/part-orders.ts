import { api } from "../api-client";

export async function createPartOrder(data: {
  partId: string;
  partInventoryId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
  paymentMethod: string;
}) {
  const response = await api.post("/part-orders", data);
  return response.data;
}

export async function getPartOrderByNumber(orderNumber: string) {
  const response = await api.get(`/part-orders/${orderNumber}`);
  return response.data;
}

export async function getPartOrders() {
  const response = await api.get("/part-orders");
  return response.data;
}
