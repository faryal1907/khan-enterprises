import { api } from "../api-client";
import { Expense } from "../types";

// ─── Payee Accounts ───────────────────────────────────────────────────────────

export type PayeeType =
  | 'VENDOR'
  | 'EMPLOYEE'
  | 'SUPPLIER'
  | 'LANDLORD'
  | 'UTILITY_COMPANY'
  | 'CONTRACTOR'
  | 'OTHER';

export interface PayeeAccount {
  id: string;
  name: string;
  type: PayeeType;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  isActive: boolean;
}

export const getPayeeAccounts = async (): Promise<PayeeAccount[]> => {
  const response = await api.get('/expenses/payees');
  return response.data;
};

export const createPayeeAccount = async (payload: {
  name: string;
  type?: PayeeType;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}): Promise<PayeeAccount> => {
  const response = await api.post('/expenses/payees', payload);
  return response.data;
};

export const updatePayeeAccount = async (
  id: string,
  payload: {
    name?: string;
    type?: PayeeType;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  },
): Promise<PayeeAccount> => {
  const response = await api.patch(`/expenses/payees/${id}`, payload);
  return response.data;
};

export const getPayeeLedger = async (payeeAccountId: string) => {
  const response = await api.get(`/expenses/payees/${payeeAccountId}/ledger`);
  return response.data;
};

export const getPayablesByPayee = async (params?: {
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const response = await api.get('/expenses/payables-by-payee', { params });
  return response.data;
};

// ─── Expenses ─────────────────────────────────────────────────────────────────

export interface CreateExpensePayload {
  amount: number;
  date: string;
  category: string;
  description?: string;
  branchId: string;
  /** Required — the payee this expense is owed to */
  payeeAccountId: string;
  /** Payment account. Required when payNow is true. */
  paymentAccountId?: string;
  /** If true, record payment now. If false/omitted, record as unpaid (credit). */
  payNow?: boolean;
}

export const createExpense = async (payload: CreateExpensePayload) => {
  const response = await api.post<Expense>("/expenses", payload);
  return response.data;
};

export const getExpenses = async (params?: { branchId?: string; dateFrom?: string; dateTo?: string }) => {
  const response = await api.get<Expense[]>("/expenses", { params });
  return response.data;
};

export const getExpensePaymentHistory = async (expenseId: string) => {
  const response = await api.get(`/expenses/${expenseId}/payment-history`);
  return response.data;
};
