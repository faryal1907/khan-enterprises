import { api } from "../api-client";

export interface OrderFilters {
  status?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getOrders(filters: OrderFilters = {}) {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await api.get("/orders", { params });
  return response.data;
}

export async function getOrderById(id: string) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string, status: string) {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
}

export async function cancelOrder(id: string, reason: string) {
  const response = await api.post(`/orders/${id}/cancel`, { reason });
  return response.data;
}

export async function recordPayment(id: string, data: {
  method: string;
  amount: number;
  referenceNumber?: string;
}) {
  const response = await api.post(`/orders/${id}/payment`, data);
  return response.data;
}
