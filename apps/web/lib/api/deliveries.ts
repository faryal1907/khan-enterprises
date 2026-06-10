import { api } from "../api-client";

export interface CreateDeliveryData {
  deliveryAddress: string;
  preferredTimeWindow?: string;
  contactNumber: string;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  deliveryAddress: string;
  preferredTimeWindow?: string;
  contactNumber: string;
  status: "REQUESTED" | "UNDER_REVIEW" | "APPROVED" | "IN_TRANSIT" | "DELIVERED";
  approvedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    customerName: string;
    customerPhone: string;
    negotiatedAmount: number;
    bike: {
      id: string;
      chassisNumber: string;
      model: {
        brand: string;
        modelName: string;
        year: number;
      };
    };
    branch: {
      id: string;
      name: string;
      city: string;
    };
  };
}

export async function createDeliveryRequest(orderId: string, data: CreateDeliveryData) {
  const response = await api.post(`/deliveries/order/${orderId}`, data);
  return response.data;
}

export async function getDeliveries(params?: {
  status?: string;
  branchId?: string;
  orderId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  const response = await api.get("/deliveries", { params });
  return response.data;
}

export async function getDeliveryById(id: string) {
  const response = await api.get(`/deliveries/${id}`);
  return response.data;
}

export async function getDeliveryByOrderId(orderId: string) {
  const response = await api.get(`/deliveries/order/${orderId}`);
  return response.data;
}
