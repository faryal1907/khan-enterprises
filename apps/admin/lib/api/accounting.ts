import { api } from "@/lib/api-client";

export const getAccounts = async () => {
  const { data } = await api.get('/accounting/accounts');
  return data;
};

export const getJournalEntries = async () => {
  const { data } = await api.get('/accounting/journals');
  return data;
};

export const createJournalEntry = async (payload: { description: string, lines: { accountId: string, debit: number, credit: number }[] }) => {
  const { data } = await api.post('/accounting/journals', payload);
  return data;
};

export const getPurchaseOrders = async () => {
  const { data } = await api.get('/accounting/purchase-orders');
  return data;
};

export const createPurchaseOrder = async (payload: any) => {
  const { data } = await api.post('/accounting/purchase-orders', payload);
  return data;
};

export const receivePurchaseOrder = async (id: string) => {
  const { data } = await api.post(`/accounting/purchase-orders/${id}/receive`);
  return data;
};

export const getPayables = async () => {
  const { data } = await api.get('/accounting/payables');
  return data;
};

export const payPayable = async (id: string, payload: { amount: number, paymentMethod: string }) => {
  const { data } = await api.post(`/accounting/payables/${id}/pay`, payload);
  return data;
};

export const createAccount = async (payload: { code: string; name: string; category: string; subtype: string; accountNumber?: string; openingBalance?: number }) => {
  const { data } = await api.post('/accounting/accounts', payload);
  return data;
};

export const updateAccount = async (id: string, payload: { name?: string; code?: string; category?: string; subtype?: string }) => {
  const { data } = await api.patch(`/accounting/accounts/${id}`, payload);
  return data;
};

export const deleteAccount = async (id: string) => {
  const { data } = await api.delete(`/accounting/accounts/${id}`);
  return data;
};

export const getAccountLedger = async (id: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  const { data } = await api.get(`/accounting/accounts/${id}/ledger?${params.toString()}`);
  return data;
};

export const getAccountBalance = async (id: string) => {
  const { data } = await api.get(`/accounting/accounts/${id}/balance`);
  return data;
};

export const recordCapitalContribution = async (payload: { destinationAccountId: string; amount: number; date: string; source?: string; reference?: string; notes?: string }) => {
  const { data } = await api.post('/accounting/capital-contribution', payload);
  return data;
};

export const recordOwnerWithdrawal = async (payload: { sourceAccountId: string; amount: number; date: string; reason?: string; notes?: string }) => {
  const { data } = await api.post('/accounting/owner-withdrawal', payload);
  return data;
};

export const recordInternalTransfer = async (payload: { fromAccountId: string; toAccountId: string; amount: number; date: string; notes?: string }) => {
  const { data } = await api.post('/accounting/internal-transfer', payload);
  return data;
};
