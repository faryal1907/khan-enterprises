import { api } from "../api-client";

export type UserFilters = {
  role?: string;
  status?: string;
  branchId?: string;
  search?: string;
};

export async function getUsers(filters: UserFilters = {}) {
  const response = await api.get("/auth/users", { params: filters });
  return response.data;
}

export async function getUserById(id: string) {
  const response = await api.get(`/auth/users/${id}`);
  return response.data;
}

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  branchId?: string;
  vendorId?: string;
}) {
  const response = await api.post("/auth/users", data);
  return response.data;
}

export async function updateUser(id: string, data: {
  fullName: string;
  phoneNumber: string;
  role: string;
  branchId: string | null;
  vendorId: string | null;
}) {
  const response = await api.put(`/auth/users/${id}`, data);
  return response.data;
}

export async function deactivateUser(id: string) {
  const response = await api.delete(`/auth/users/${id}`);
  return response.data;
}

export async function activateUser(id: string) {
  const response = await api.post(`/auth/users/${id}/activate`);
  return response.data;
}
