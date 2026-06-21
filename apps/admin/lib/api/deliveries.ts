import { api } from "../api-client";

export interface CreateDeliveryData {
  deliveryAddress: string;
  preferredTimeWindow?: string;
  contactNumber: string;
}

export interface UpdateDeliveryStatusData {
  status: "REQUESTED" | "UNDER_REVIEW" | "APPROVED" | "IN_TRANSIT" | "DELIVERED";
  notes?: string;
  deliveryCost?: number;
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
  notes?: string;
  latitude?: number;
  longitude?: number;
  distanceFromBranch?: number;
  deliveryCost?: number;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: string;
    bike: {
      id: string;
      actualSalePrice?: number;
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
      address: string;
      phoneNumber: string | null;
    };
    processedBy: {
      id: string;
      fullName: string;
      email: string;
    } | null;
  };
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

export async function getDeliveryStats(branchId?: string) {
  const response = await api.get("/deliveries/stats", { params: { branchId } });
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

export async function updateDeliveryStatus(id: string, data: UpdateDeliveryStatusData) {
  const response = await api.patch(`/deliveries/${id}/status`, data);
  return response.data;
}

export async function approveDelivery(id: string) {
  const response = await api.patch(`/deliveries/${id}/approve`);
  return response.data;
}

export async function rejectDelivery(id: string, reason?: string) {
  const response = await api.patch(`/deliveries/${id}/reject`, { reason });
  return response.data;
}
