import { api } from "../api-client";

export type TransactionFilters = {
  status?: string;
  method?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TransactionRecord = {
  id: string;
  amount: number;
  method: string;
  status: string;
  gatewayReference?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
  type: "BIKE" | "PART";
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    branch?: {
      id: string;
      name: string;
      city?: string;
    };
  } | null;
};

export async function getTransactions(filters: TransactionFilters = {}) {
  const response = await api.get("/transactions", { params: filters });
  return response.data as { count: number; transactions: TransactionRecord[] };
}


export async function downloadReceipt(id: string) {
  const response = await api.get(`/transactions/${id}/receipt`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
