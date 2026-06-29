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
