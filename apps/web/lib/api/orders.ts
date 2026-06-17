import { api } from "../api-client";

export async function getOrders(filters: any = {}) {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.isCompleted !== undefined) params.isCompleted = filters.isCompleted;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await api.get("/orders", { params });
  return response.data;
}

export async function getOrderByNumber(orderNumber: string) {
  const response = await api.get(`/orders/number/${orderNumber}`);
  return response.data;
}
