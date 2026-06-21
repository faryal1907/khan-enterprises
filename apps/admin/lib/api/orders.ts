import { api } from "../api-client";

export interface OrderFilters {
  status?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  processedById?: string;
  page?: number;
  limit?: number;
  partId?: string;
  orderType?: string;
  pickupType?: string;
}

export async function getOrders(filters: OrderFilters = {}) {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.search) params.search = filters.search;
  if (filters.processedById) params.processedById = filters.processedById;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.orderType) params.orderType = filters.orderType;
  if (filters.pickupType) params.pickupType = filters.pickupType;

  const response = await api.get("/orders", { params });
  return response.data;
}

export async function getPartOrders(filters: OrderFilters = {}) {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.search) params.search = filters.search;
  if (filters.processedById) params.processedById = filters.processedById;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.partId) params.partId = filters.partId;
  if (filters.orderType) params.orderType = filters.orderType;
  if (filters.pickupType) params.pickupType = filters.pickupType;

  const response = await api.get("/part-orders", { params });
  return response.data;
}

export async function getOrderById(id: string) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function getPartOrderById(id: string) {
  const response = await api.get(`/part-orders/id/${id}`);
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

export async function updatePartOrderStatus(id: string, status: string) {
  const response = await api.patch(`/part-orders/${id}/status`, { status });
  return response.data;
}

export async function cancelPartOrder(id: string) {
  const response = await api.patch(`/part-orders/${id}/cancel`);
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

export async function verifyPayment(id: string, transactionId: string, isApproved: boolean = true, reason?: string) {
  const response = await api.post(`/orders/${id}/verify-payment`, { transactionId, isApproved, reason });
  return response.data;
}

export async function createManualOrder(data: any) {
  const response = await api.post("/orders/manual", data);
  return response.data;
}

export async function createManualPartOrder(data: any) {
  const response = await api.post("/part-orders/manual", data);
  return response.data;
}

export async function downloadInvoice(id: string, isPart: boolean = false) {
  const endpoint = isPart ? `/part-orders/${id}/invoice` : `/orders/${id}/invoice`;
  const response = await api.get(endpoint, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export async function markAsPickedByCustomer(id: string) {
  const response = await api.patch(`/orders/${id}/picked-up`);
  return response.data;
}

export async function markPartOrderAsPickedByCustomer(id: string) {
  const response = await api.patch(`/part-orders/${id}/picked-up`);
  return response.data;
}
