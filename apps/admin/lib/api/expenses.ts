import { api } from "../api-client";
import { Expense } from "../types";

export interface CreateExpensePayload {
  amount: number;
  date: string;
  category: string;
  description?: string;
  branchId: string;
  paymentAccountId: string;
}

export const createExpense = async (payload: CreateExpensePayload) => {
  const response = await api.post<Expense>("/expenses", payload);
  return response.data;
};

export const getExpenses = async (params?: { branchId?: string; dateFrom?: string; dateTo?: string }) => {
  const response = await api.get<Expense[]>("/expenses", { params });
  return response.data;
};
