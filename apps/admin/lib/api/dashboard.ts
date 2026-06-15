import { api } from "../api-client";
import type { DashboardStats } from "../types";

export async function getDashboardStats() {
  const response = await api.get<DashboardStats>("/dashboard/stats");
  return response.data;
}
