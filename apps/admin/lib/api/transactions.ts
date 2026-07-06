import { api } from "../api-client";

export type TransactionFilters = {
  status?: string;
  method?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
};

/** Shared party info for payable/receivable transactions */
export type TransactionParty = {
  name: string;
  ref?: string | null;
  description?: string | null;
  payableType?: string | null;
  partyType?: string | null;
  phone?: string | null;
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
  type: "BIKE" | "PART" | "PAYABLE" | "RECEIVABLE" | "VENDOR_PAYMENT";
  /** Present for BIKE and PART transactions */
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
  /** Present for PAYABLE, RECEIVABLE, and VENDOR_PAYMENT transactions */
  party?: TransactionParty | null;
  /** User who processed the transaction */
  processedBy?: {
    id: string;
    fullName: string;
    email: string;
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
