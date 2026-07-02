import { api } from "@/lib/api-client";

// ─── Vendor CRUD ──────────────────────────────────────────────────────────────

export const getVendors = async () => {
  const { data } = await api.get("/vendors");
  return data; // { count, vendors: [..., prepaidBalance] }
};

export const getVendorDetail = async (id: string) => {
  const { data } = await api.get(`/vendors/${id}`);
  return data; // vendor + prepaidBalance + totalPaid + totalAllocated
};

export const getVendorBalance = async (id: string) => {
  const { data } = await api.get(`/vendors/${id}/balance`);
  return data; // { vendorId, prepaidBalance }
};

export const getVendorLedger = async (id: string) => {
  const { data } = await api.get(`/vendors/${id}/ledger`);
  return data; // { vendor, summary, ledger: [] }
};

export const createVendor = async (payload: {
  name: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}) => {
  const { data } = await api.post("/vendors", payload);
  return data;
};

export const updateVendor = async (
  id: string,
  payload: {
    name?: string;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  },
) => {
  const { data } = await api.patch(`/vendors/${id}`, payload);
  return data;
};

export const deleteVendor = async (id: string) => {
  const { data } = await api.delete(`/vendors/${id}`);
  return data;
};

// ─── Payments & Allocations ───────────────────────────────────────────────────

export const recordVendorPayment = async (
  vendorId: string,
  payload: {
    fromAccountId: string;
    amount: number;
    date: string;
    notes?: string;
  },
) => {
  const { data } = await api.post(`/vendors/${vendorId}/pay`, payload);
  return data; // { payment, journalEntry, newPrepaidBalance }
};

export const allocateVendorInventory = async (
  vendorId: string,
  payload: {
    branchId: string;
    date: string;
    notes?: string;
    bikes: { modelId: string; quantity: number; unitCost: number }[];
    parts: { partName: string; quantity: number; unitCost: number }[];
  },
) => {
  const { data } = await api.post(`/vendors/${vendorId}/allocate`, payload);
  return data; // { allocation, journalEntry, bikesCreated, partsProcessed, totalAllocated, newPrepaidBalance }
};

export const returnDefectiveInventory = async (
  vendorId: string,
  payload: {
    bikeIds: string[];
    partReturns: { partInventoryId: string; quantity: number }[];
    date: string;
    notes?: string;
  },
) => {
  const { data } = await api.post(`/vendors/${vendorId}/return-defective`, payload);
  return data; // { return, journalEntry, bikesRemoved, partsProcessed, totalReturned, newPrepaidBalance }
};

export const getVendorReturnableInventory = async (vendorId: string) => {
  const { data } = await api.get(`/vendors/${vendorId}/returnable-inventory`);
  return data; // { bikes: [], parts: [] }
};
