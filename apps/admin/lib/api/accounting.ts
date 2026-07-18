import { api } from "@/lib/api-client";

export const getAccounts = async () => {
  const { data } = await api.get('/accounting/accounts');
  return data;
};

export const getJournalEntries = async (filters?: {
  dateFrom?: string;
  dateTo?: string;
  journalType?: string;
  accountId?: string;
  vendorId?: string;
  customerId?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  if (filters?.journalType) params.append('journalType', filters.journalType);
  if (filters?.accountId) params.append('accountId', filters.accountId);
  if (filters?.vendorId) params.append('vendorId', filters.vendorId);
  if (filters?.customerId) params.append('customerId', filters.customerId);
  const query = params.toString();
  const { data } = await api.get(`/accounting/journals${query ? `?${query}` : ''}`);
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

export const payPayable = async (id: string, payload: { amount: number; paymentMethod: string; accountId?: string }) => {
  const { data } = await api.post(`/accounting/payables/${id}/pay`, payload);
  return data;
};

export const payPayablesByPayee = async (
  payeeAccountId: string,
  payload: { amount: number; paymentMethod: string; accountId?: string }
) => {
  const { data } = await api.post(`/accounting/payables/payee/${payeeAccountId}/pay`, payload);
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

export const deleteAccount = async (id: string, transferAccountId?: string) => {
  const { data } = await api.delete(`/accounting/accounts/${id}`, {
    data: { transferAccountId },
  });
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

// ─── Receivables ──────────────────────────────────────────────────────────────

export type ReceivablePartyType =
  | 'CUSTOMER' | 'VENDOR' | 'EMPLOYEE' | 'SUPPLIER'
  | 'LANDLORD' | 'UTILITY_COMPANY' | 'BUSINESS_PARTNER' | 'OTHER';

export const RECEIVABLE_PARTY_TYPE_LABELS: Record<ReceivablePartyType, string> = {
  CUSTOMER: 'Customer',
  VENDOR: 'Vendor',
  EMPLOYEE: 'Employee',
  SUPPLIER: 'Supplier',
  LANDLORD: 'Landlord',
  UTILITY_COMPANY: 'Utility Company',
  BUSINESS_PARTNER: 'Business Partner',
  OTHER: 'Other',
};

export const getReceivables = async () => {
  const { data } = await api.get('/accounting/receivables');
  return data;
};

export const getReceivableParties = async () => {
  const { data } = await api.get('/accounting/receivables/parties');
  return data;
};

export const createReceivableParty = async (payload: {
  name: string; partyType?: ReceivablePartyType; phone?: string; email?: string; address?: string; notes?: string;
}) => {
  const { data } = await api.post('/accounting/receivables/parties', payload);
  return data;
};

export const createReceivableEntry = async (payload: {
  partyId: string; amount: number; description: string; date: string; dueDate?: string; vendorId?: string;
}) => {
  const { data } = await api.post('/accounting/receivables/entries', payload);
  return data;
};

export const getPartyLedger = async (partyId: string) => {
  const { data } = await api.get(`/accounting/receivables/parties/${partyId}/ledger`);
  return data;
};

export const collectFromParty = async (
  partyId: string,
  payload: { amount: number; paymentMethod: string; notes?: string; accountId?: string }
) => {
  const { data } = await api.post(`/accounting/receivables/parties/${partyId}/collect`, payload);
  return data;
};

export const getPaymentAccounts = async () => {
  const { data } = await api.get('/accounting/receivables/payment-accounts');
  return data;
};

// Legacy phone-based (used by existing order flows)
export const getCustomerLedger = async (customerPhone: string) => {
  const { data } = await api.get(`/accounting/receivables/${encodeURIComponent(customerPhone)}/ledger`);
  return data;
};

export const getCustomerStatement = async (customerPhone: string) => {
  const { data } = await api.get(`/accounting/receivables/${encodeURIComponent(customerPhone)}/statement`);
  return data;
};

export const collectReceivable = async (
  customerPhone: string,
  payload: { amount: number; paymentMethod: string; notes?: string; accountId?: string }
) => {
  const { data } = await api.post(`/accounting/receivables/${encodeURIComponent(customerPhone)}/collect`, payload);
  return data;
};

// ─── Undo Operations ─────────────────────────────────────────────────────────────

export const undoPayablePayment = async (paymentId: string) => {
  const { data } = await api.post(`/accounting/payables/payments/${paymentId}/undo`);
  return data;
};

export const undoPayableAllPayments = async (payableId: string) => {
  const { data } = await api.post(`/accounting/payables/${payableId}/undo-all`);
  return data;
};

export const undoPayablePaymentsByPayeeAccountId = async (payeeAccountId: string) => {
  const { data } = await api.post(`/accounting/payables/payee/${payeeAccountId}/undo-all`);
  return data;
};

export const undoReceivablePayment = async (receivablePaymentId: string) => {
  const { data } = await api.post(`/accounting/receivables/payments/${receivablePaymentId}/undo`);
  return data;
};

export const undoReceivablePaymentsByPartyId = async (partyId: string) => {
  const { data } = await api.post(`/accounting/receivables/parties/${partyId}/undo-all`);
  return data;
};

export const undoOrderPayment = async (orderId: string, paymentId: string) => {
  const { data } = await api.post(`/accounting/receivables/orders/${orderId}/payments/${paymentId}/undo`);
  return data;
};

export const undoPartOrderPayment = async (partOrderId: string, paymentId: string) => {
  const { data } = await api.post(`/accounting/receivables/part-orders/${partOrderId}/payments/${paymentId}/undo`);
  return data;
};

// ─── Delete Operations ─────────────────────────────────────────────────────────────

export const deletePayable = async (payableId: string) => {
  const { data } = await api.delete(`/accounting/payables/${payableId}`);
  return data;
};

export const deletePayablesByPayee = async (payeeId: string) => {
  const { data } = await api.delete(`/accounting/payables/payee/${payeeId}`);
  return data;
};

export const deleteReceivableParty = async (partyId: string) => {
  const { data } = await api.delete(`/accounting/receivables/parties/${partyId}`);
  return data;
};

export const deleteReceivableEntry = async (entryId: string) => {
  const { data } = await api.delete(`/accounting/receivables/entries/${entryId}`);
  return data;
};
