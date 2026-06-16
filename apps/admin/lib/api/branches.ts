import { api } from "../api-client";

export async function getBranches() {
  const response = await api.get("/branches");
  return response.data;
}

export async function getBranchById(id: string) {
  const response = await api.get(`/branches/${id}`);
  return response.data;
}

export async function getBranchMetrics(id: string) {
  const response = await api.get(`/branches/${id}/metrics`);
  return response.data;
}

export async function createBranch(data: {
  name: string;
  city: string;
  address: string;
  phoneNumber?: string;
  managerId?: string;
}) {
  const response = await api.post("/branches", data);
  return response.data;
}

export async function updateBranch(id: string, data: {
  name: string;
  city: string;
  address: string;
  phoneNumber?: string;
  managerId: string | null;
}) {
  const response = await api.patch(`/branches/${id}`, data);
  return response.data;
}

export async function deleteBranch(id: string) {
  const response = await api.delete(`/branches/${id}`);
  return response.data;
}
