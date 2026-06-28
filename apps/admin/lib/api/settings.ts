import { api } from "../api-client";

export async function getSettings(): Promise<Record<string, string>> {
  const response = await api.get("/settings");
  return response.data;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await api.patch("/settings", { key, value });
}
