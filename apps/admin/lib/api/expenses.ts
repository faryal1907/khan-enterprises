import { api } from "../api-client";
import { Expense } from "../types";

export interface CreateExpensePayload {
  amount: number;
  date: string;
  category: string;
  description?: string;
  branchId: string;
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
