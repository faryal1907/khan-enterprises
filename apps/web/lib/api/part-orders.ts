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

export async function getPartOrders(filters: any = {}) {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.isCompleted !== undefined) params.isCompleted = filters.isCompleted;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await api.get("/part-orders", { params });
  return response.data;
}
