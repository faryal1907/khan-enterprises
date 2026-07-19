"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { theme } from "@/lib/colors";
import { getAccounts, getJournalEntries, createAccount, updateAccount, deleteAccount, getReceivables, undoPayablePayment, undoPayableAllPayments, undoPayablePaymentsByPayeeAccountId, deletePayable, deletePayablesByPayee, deleteReceivableParty, deleteReceivableEntry, undoReceivablePaymentsByPartyId } from "@/lib/api/accounting";
import { getExpenses, getPayablesByPayee } from "@/lib/api/expenses";
import { getVendors, createVendor, deleteVendor, getVendorLedger, updateVendor } from "@/lib/api/vendors";
import { toast } from "sonner";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/lib/firebase";
import { AsyncButton } from "@/components/async-button";
import { SummaryCard } from "@/components/summary-card";
import { AddExpenseModal } from "@/components/add-expense-modal";
import { PayeeLedgerModal } from "./payee-ledger-modal";
import { PayPayableModal } from "./pay-payable-modal";
import { CreateJournalEntryModal } from "./create-journal-entry-modal";
import { AccountLedgerModal } from "./account-ledger-modal";
import { CapitalContributionModal } from "./capital-contribution-modal";
import { OwnerWithdrawalModal } from "./owner-withdrawal-modal";
import { InternalTransferModal } from "./internal-transfer-modal";
import { CollectReceivableModal } from "./collect-receivable-modal";
import { PartyLedgerModal } from "./party-ledger-modal";
import { AddReceivableModal } from "./add-receivable-modal";
import { UndoConfirmationModal } from "./undo-confirmation-modal";
import { VendorPaymentModal } from "@/app/vendors/vendor-payment-modal";
import { AllocateInventoryModal } from "@/app/vendors/allocate-inventory-modal";
import { ReturnDefectiveInventoryModal } from "@/app/vendors/return-defective-inventory-modal";
import { getBranches } from "@/lib/api/inventory";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

type Tab = 'OVERVIEW' | 'JOURNALS' | 'PAYABLES' | 'RECEIVABLES' | 'OWNER_EQUITY' | 'VENDORS';

// ── Journal type detection ────────────────────────────────────────────────────
type JournalTypeKey =
  | 'Sale' | 'Payment Received' | 'Customer Refund' | 'Purchase'
  | 'Vendor Payment' | 'Vendor Advance' | 'Inventory Receipt' | 'Inventory Return'
  | 'Capital Contribution' | 'Owner Withdrawal' | 'Expense' | 'Depreciation'
  | 'Internal Transfer' | 'Manual Journal' | 'Adjustment';

const JOURNAL_TYPES: { label: JournalTypeKey; match: (je: any) => boolean }[] = [
  { label: 'Sale',                match: (je) => /^JV-SALE-/i.test(je.entryNo) },
  { label: 'Payment Received',    match: (je) => /^JV-PAY-/i.test(je.entryNo) || /^JV-RCVBL-/i.test(je.entryNo) },
  { label: 'Customer Refund',     match: (je) => /^JV-REV-|^JV-REVPAY-/i.test(je.entryNo) },
  { label: 'Purchase',            match: (je) => /^JV-PO-|^PO-/i.test(je.entryNo) },
  { label: 'Vendor Payment',      match: (je) => /vendor payment/i.test(je.description) },
  { label: 'Vendor Advance',      match: (je) => /vendor advance/i.test(je.description) },
  { label: 'Inventory Receipt',   match: (je) => /inventory received/i.test(je.description) },
  { label: 'Inventory Return',    match: (je) => /inventory returned/i.test(je.description) },
  { label: 'Capital Contribution',match: (je) => /capital contribution/i.test(je.description) },
  { label: 'Owner Withdrawal',    match: (je) => /owner withdrawal/i.test(je.description) },
  { label: 'Expense',             match: (je) => /^JV-EXP-/i.test(je.entryNo) || /^JV-OUT-/i.test(je.entryNo) },
  { label: 'Depreciation',        match: (je) => /depreciation/i.test(je.description) },
  { label: 'Internal Transfer',   match: (je) => /internal transfer/i.test(je.description) },
  { label: 'Manual Journal',      match: (je) => je.isManual === true },
  { label: 'Adjustment',          match: (je) => /adjustment/i.test(je.description) },
];

function detectJournalType(je: any): string {
  for (const t of JOURNAL_TYPES) {
    if (t.match(je)) return t.label;
  }
  return 'Other';
}

const JOURNAL_TYPE_COLORS: Record<string, string> = {
  'Sale': 'bg-blue-100 text-blue-800',
  'Payment Received': 'bg-green-100 text-green-800',
  'Customer Refund': 'bg-red-100 text-red-800',
  'Purchase': 'bg-purple-100 text-purple-800',
  'Vendor Payment': 'bg-orange-100 text-orange-800',
  'Vendor Advance': 'bg-yellow-100 text-yellow-800',
  'Inventory Receipt': 'bg-teal-100 text-teal-800',
  'Inventory Return': 'bg-pink-100 text-pink-800',
  'Capital Contribution': 'bg-emerald-100 text-emerald-800',
  'Owner Withdrawal': 'bg-rose-100 text-rose-800',
  'Expense': 'bg-amber-100 text-amber-800',
  'Depreciation': 'bg-gray-100 text-gray-800',
  'Internal Transfer': 'bg-indigo-100 text-indigo-800',
  'Manual Journal': 'bg-violet-100 text-violet-800',
  'Adjustment': 'bg-slate-100 text-slate-800',
  'Other': 'bg-gray-100 text-gray-600',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

const paymentStateBadge = (state?: string) => {
  switch (state) {
    case "PAID":    return "bg-green-100 text-green-800";
    case "PARTIAL": return "bg-orange-100 text-orange-800";
    case "OVERDUE": return "bg-red-100 text-red-800";
    case "DUE":     return "bg-yellow-100 text-yellow-800";
    default:        return "bg-gray-100 text-gray-600";
  }
};

export default function AccountsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isBranchScoped = (!isAdmin && !isManager) ? true : (isManager && Boolean(user?.branchId));

  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [receivables, setReceivables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // ── Journal filter state ──────────────────────────────────────────────────
  const [vendors, setVendors] = useState<any[]>([]);
  const [journalsLoading, setJournalsLoading] = useState(false);
  const [journalFilters, setJournalFilters] = useState({
    quickDate: '' as '' | 'today' | 'yesterday' | 'last7' | 'last30' | 'custom',
    dateFrom: '',
    dateTo: '',
    journalType: '' as JournalTypeKey | '',
    accountId: '',
    vendorId: '',
    customerId: '',
  });

  // Derived date range from quick filter
  const journalDateRange = useMemo(() => {
    const today = new Date();
    const pad = (d: Date) => d.toISOString().slice(0, 10);
    switch (journalFilters.quickDate) {
      case 'today': {
        const s = pad(today);
        return { dateFrom: s, dateTo: s };
      }
      case 'yesterday': {
        const y = new Date(today); y.setDate(y.getDate() - 1);
        const s = pad(y);
        return { dateFrom: s, dateTo: s };
      }
      case 'last7': {
        const s = new Date(today); s.setDate(s.getDate() - 6);
        return { dateFrom: pad(s), dateTo: pad(today) };
      }
      case 'last30': {
        const s = new Date(today); s.setDate(s.getDate() - 29);
        return { dateFrom: pad(s), dateTo: pad(today) };
      }
      case 'custom':
        return { dateFrom: journalFilters.dateFrom, dateTo: journalFilters.dateTo };
      default:
        return { dateFrom: '', dateTo: '' };
    }
  }, [journalFilters.quickDate, journalFilters.dateFrom, journalFilters.dateTo]);

  const fetchJournals = useCallback(async () => {
    setJournalsLoading(true);
    try {
      const data = await getJournalEntries({
        dateFrom: journalDateRange.dateFrom || undefined,
        dateTo: journalDateRange.dateTo || undefined,
        accountId: journalFilters.accountId || undefined,
        vendorId: journalFilters.vendorId || undefined,
      });
      setJournals(data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load journals');
    } finally {
      setJournalsLoading(false);
    }
  }, [journalDateRange.dateFrom, journalDateRange.dateTo, journalFilters.accountId, journalFilters.vendorId]);

  // Client-side filtering for type/customer (description-based)
  const filteredJournals = useMemo(() => {
    let result = journals;
    if (journalFilters.journalType) {
      const typeDef = JOURNAL_TYPES.find(t => t.label === journalFilters.journalType);
      if (typeDef) result = result.filter(je => typeDef.match(je));
    }
    if (journalFilters.customerId) {
      const q = journalFilters.customerId.toLowerCase();
      result = result.filter(je =>
        je.description?.toLowerCase().includes(q) ||
        je.sourceRef?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [journals, journalFilters.journalType, journalFilters.customerId]);

  const hasActiveJournalFilters = useMemo(() =>
    journalFilters.quickDate !== '' ||
    journalFilters.journalType !== '' ||
    journalFilters.accountId !== '' ||
    journalFilters.vendorId !== '' ||
    journalFilters.customerId !== '',
    [journalFilters]
  );

  const resetJournalFilters = () => {
    setJournalFilters({ quickDate: '', dateFrom: '', dateTo: '', journalType: '', accountId: '', vendorId: '', customerId: '' });
  };

  // Account management state
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ code: '', name: '', category: 'ASSET', subtype: 'BANK', accountNumber: '', openingBalance: 0 });
  const [ledgerModalData, setLedgerModalData] = useState<{ isOpen: boolean; accountId: string; code: string; name: string }>({
    isOpen: false, accountId: '', code: '', name: ''
  });
  const [deleteConfirmData, setDeleteConfirmData] = useState<{ isOpen: boolean; accountId: string; accountName: string; accountBalance: number; accountSubtype: string; transferAccountId: string }>({
    isOpen: false, accountId: '', accountName: '', accountBalance: 0, accountSubtype: '', transferAccountId: '',
  });

  // Owner equity modals
  const [isCapitalContributionOpen, setIsCapitalContributionOpen] = useState(false);
  const [isOwnerWithdrawalOpen, setIsOwnerWithdrawalOpen] = useState(false);
  const [isInternalTransferOpen, setIsInternalTransferOpen] = useState(false);

  // Receivables modals
  const [collectModalData, setCollectModalData] = useState<{
    isOpen: boolean;
    party: { partyId: string; partyName: string; partyType: string; totalOutstanding: number } | null;
  }>({ isOpen: false, party: null });
  const [ledgerModalReceivable, setLedgerModalReceivable] = useState<{
    isOpen: boolean; partyId: string; partyName: string; partyType: string;
  }>({ isOpen: false, partyId: '', partyName: '', partyType: '' });
  const [isAddReceivableOpen, setIsAddReceivableOpen] = useState(false);
  const [receivableFilters, setReceivableFilters] = useState({ partySearch: '', partyType: '' });

  // ── Expenses / Payables state ──────────────────────────────────────────────
  const [branches, setBranches] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  // ── Vendors & Inventory state ───────────────────────────────────────────────
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [vendorDetail, setVendorDetail] = useState<any>(null);
  const [vendorDetailLoading, setVendorDetailLoading] = useState(false);
  const [showCreateVendor, setShowCreateVendor] = useState(false);
  const [vendorDeleteTarget, setVendorDeleteTarget] = useState<any>(null);
  const [vendorDeleting, setVendorDeleting] = useState(false);
  const [vendorSaving, setVendorSaving] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: '', contactPerson: '', phoneNumber: '', email: '', address: '', commissionRate: 0 });
  const [vendorEditing, setVendorEditing] = useState(false);
  const [vendorEditForm, setVendorEditForm] = useState({ name: '', contactPerson: '', phoneNumber: '', email: '', address: '', commissionRate: 0 });
  const [vendorEditSaving, setVendorEditSaving] = useState(false);
  const [vendorPayOpen, setVendorPayOpen] = useState(false);
  const [vendorAllocOpen, setVendorAllocOpen] = useState(false);
  const [vendorReturnOpen, setVendorReturnOpen] = useState(false);
  const [payablesByPayee, setPayablesByPayee] = useState<any[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState('');
  const [expenseFilters, setExpenseFilters] = useState({
    branch: isBranchScoped ? user?.branchId || '' : '',
    dateFrom: '',
    dateTo: '',
    payeeType: '',
    payeeSearch: '',
  });
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [payeeLedgerModalData, setPayeeLedgerModalData] = useState<{
    isOpen: boolean; payeeAccountId: string; payeeName: string;
  }>({ isOpen: false, payeeAccountId: '', payeeName: '' });
  const [payPayableModalData, setPayPayableModalData] = useState<{
    isOpen: boolean;
    payee: { payeeAccountId: string; payeeName: string; payeeType: string; totalOutstanding: number } | null;
  }>({ isOpen: false, payee: null });

  // ── Undo modal state ─────────────────────────────────────────────────────────
  const [undoModal, setUndoModal] = useState<{
    isOpen: boolean;
    type: 'payable' | 'receivable';
    title: string;
    description: string;
    details?: { amount?: number; account?: string; date?: string; reference?: string };
    onConfirm: () => Promise<void>;
  }>({ isOpen: false, type: 'payable', title: '', description: '', onConfirm: async () => {} });

  const expenseRequestFilters = useMemo(() => ({
    branchId: expenseFilters.branch || undefined,
    dateFrom: expenseFilters.dateFrom || undefined,
    dateTo: expenseFilters.dateTo || undefined,
  }), [expenseFilters]);

  const fetchExpenses = useCallback(async () => {
    setExpensesLoading(true);
    setExpensesError('');
    try {
      const [byPayee, rawExpenses] = await Promise.all([
        getPayablesByPayee({
          branchId: expenseFilters.branch || undefined,
          dateFrom: expenseFilters.dateFrom || undefined,
          dateTo: expenseFilters.dateTo || undefined,
        }),
        getExpenses({
          branchId: expenseFilters.branch || undefined,
          dateFrom: expenseFilters.dateFrom || undefined,
          dateTo: expenseFilters.dateTo || undefined,
        }),
      ]);
      setPayablesByPayee(byPayee || []);
      setExpenses(rawExpenses || []);
    } catch (err: any) {
      setExpensesError(err.response?.data?.message || 'Failed to load expenses');
      setPayablesByPayee([]);
      setExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  }, [expenseFilters]);

  const filteredReceivables = useMemo(() => {
    let result = receivables;
    if (receivableFilters.partyType) {
      result = result.filter((r: any) => r.partyType === receivableFilters.partyType);
    }
    if (receivableFilters.partySearch.trim()) {
      const q = receivableFilters.partySearch.trim().toLowerCase();
      result = result.filter((r: any) => r.partyName?.toLowerCase().includes(q));
    }
    return result;
  }, [receivables, receivableFilters.partyType, receivableFilters.partySearch]);

  const expenseSummary = useMemo(() => ({
    total: payablesByPayee.reduce((s, g) => s + g.totalExpenses, 0),
    count: payablesByPayee.reduce((s, g) => s + g.expenseCount, 0),
    unpaid: payablesByPayee.reduce((s, g) => s + g.totalOutstanding, 0),
    payeeCount: payablesByPayee.length,
  }), [payablesByPayee]);

  const filteredPayablesByPayee = useMemo(() => {
    let result = payablesByPayee;
    if (expenseFilters.payeeType) {
      result = result.filter((g) => g.payeeType === expenseFilters.payeeType);
    }
    if (expenseFilters.payeeSearch.trim()) {
      const q = expenseFilters.payeeSearch.trim().toLowerCase();
      result = result.filter((g) => g.payeeName.toLowerCase().includes(q));
    }
    return result;
  }, [payablesByPayee, expenseFilters.payeeType, expenseFilters.payeeSearch]);

  // Fetch expenses when PAYABLES tab is active
  useEffect(() => {
    if (activeTab === 'PAYABLES') fetchExpenses();

  // ── Vendor fetch helpers ────────────────────────────────────────────────────
  }, [activeTab, fetchExpenses]);

  const fetchVendors = useCallback(async () => {
    setVendorsLoading(true);
    try {
      const res = await getVendors();
      setVendorsList(res.vendors ?? []);
    } catch {
      toast.error('Failed to load vendors');
    } finally {
      setVendorsLoading(false);
    }
  }, []);

  const fetchVendorDetail = useCallback(async (id: string) => {
    setVendorDetailLoading(true);
    try {
      const res = await getVendorLedger(id);
      setVendorDetail(res);
    } catch {
      toast.error('Failed to load vendor details');
    } finally {
      setVendorDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'VENDORS') fetchVendors();
  }, [activeTab, fetchVendors]);

  useEffect(() => {
    if (selectedVendorId) fetchVendorDetail(selectedVendorId);
  }, [selectedVendorId, fetchVendorDetail]);

  const handleCreateVendor = async () => {
    if (!vendorForm.name.trim()) return toast.error('Vendor name is required');
    setVendorSaving(true);
    try {
      await createVendor({
        name: vendorForm.name.trim(),
        contactPerson: vendorForm.contactPerson.trim() || undefined,
        phoneNumber: vendorForm.phoneNumber.trim() || undefined,
        email: vendorForm.email.trim() || undefined,
        address: vendorForm.address.trim() || undefined,
        commissionRate: Number(vendorForm.commissionRate) || 0,
      });
      toast.success('Vendor created');
      setShowCreateVendor(false);
      setVendorForm({ name: '', contactPerson: '', phoneNumber: '', email: '', address: '', commissionRate: 0 });
      await fetchVendors();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to create vendor');
    } finally {
      setVendorSaving(false);
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendorDeleteTarget) return;
    setVendorDeleting(true);
    try {
      await deleteVendor(vendorDeleteTarget.id);
      toast.success(`${vendorDeleteTarget.name} deactivated`);
      setVendorDeleteTarget(null);
      await fetchVendors();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to deactivate vendor');
    } finally {
      setVendorDeleting(false);
    }
  };

  const handleSaveVendorEdit = async () => {
    if (!selectedVendorId) return;
    setVendorEditSaving(true);
    try {
      await updateVendor(selectedVendorId, {
        name: vendorEditForm.name.trim() || undefined,
        contactPerson: vendorEditForm.contactPerson.trim() || undefined,
        phoneNumber: vendorEditForm.phoneNumber.trim() || undefined,
        email: vendorEditForm.email.trim() || undefined,
        address: vendorEditForm.address.trim() || undefined,
        commissionRate: Number(vendorEditForm.commissionRate),
      });
      toast.success('Vendor updated');
      setVendorEditing(false);
      await fetchVendorDetail(selectedVendorId);
      await fetchVendors();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update vendor');
    } finally {
      setVendorEditSaving(false);
    }
  };

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

  // Load branches once for the filter dropdown
  useEffect(() => {
    getBranches().then((d) => setBranches(d.branches || [])).catch(() => {});
    getVendors().then((d) => setVendors(d.vendors || [])).catch(() => {});
  }, []);

  // Fetch journals when filters change or JOURNALS tab activates
  useEffect(() => {
    if (activeTab === 'JOURNALS') fetchJournals();
  }, [activeTab, fetchJournals]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accData, journalData, receivableData] = await Promise.all([
        getAccounts(),
        getJournalEntries(),
        getReceivables(),
      ]);
      setAccounts(accData);
      setJournals(journalData);
      setReceivables(receivableData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load accounting data");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let unsubscribe: any;
    
    const setupListener = async () => {
      try {
        const supported = await isSupported();
        if (supported) {
          const messaging = getMessaging(app);
          unsubscribe = onMessage(messaging, (payload) => {
            if (payload?.notification) {
              console.log("Push notification received, refreshing accounting data...");
              fetchData();
            }
          });
        }
      } catch (err) {
        console.error("Failed to setup Firebase listener in AccountsPage", err);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleStartEdit = (account: any) => {
    setEditingAccountId(account.id);
    setEditingAccount({ ...account });
  };

  const handleSaveEdit = async () => {
    if (!editingAccountId) return;
    try {
      const result = await updateAccount(editingAccountId, editingAccount);
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success("Account updated successfully");
      }
      setEditingAccountId(null);
      setEditingAccount(null);
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update account");
    }
  };

  const handleCancelEdit = () => {
    setEditingAccountId(null);
    setEditingAccount(null);
  };

  const handleCreateAccount = async () => {
    if (['BANK', 'EWALLET'].includes(newAccount.subtype) && !newAccount.accountNumber.trim()) {
      toast.error("Account number is required for Bank and E-Wallet accounts");
      return;
    }
    try {
      await createAccount(newAccount);
      toast.success("Account created successfully");
      setIsAddingAccount(false);
      setNewAccount({ code: '', name: '', category: 'ASSET', subtype: 'BANK', accountNumber: '', openingBalance: 0 });
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create account");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount(deleteConfirmData.accountId, deleteConfirmData.transferAccountId || undefined);
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success("Account deactivated successfully");
      }
      setDeleteConfirmData({ isOpen: false, accountId: '', accountName: '', accountBalance: 0, accountSubtype: '', transferAccountId: '' });
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to deactivate account");
    }
  };

  if (isInitialLoad) {
    return <div className="p-6 md:p-8 text-center text-gray-500">Loading accounting data...</div>;
  }

  return (
    <div className="px-4 py-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
          Accounting Hub
        </h1>
        <p className="mt-1 md:mt-2 text-sm" style={{ color: theme.text.secondary }}>
          Manage your general ledger, purchase orders, and supplier payables.
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {(['OVERVIEW', 'JOURNALS', 'PAYABLES', 'RECEIVABLES', 'OWNER_EQUITY', 'VENDORS'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{
              borderColor: activeTab === tab ? theme.accents.primary : 'transparent',
              color: activeTab === tab ? theme.accents.primary : undefined,
            }}
          >
            {tab === 'OWNER_EQUITY' ? 'OWNER EQUITY' : tab === 'VENDORS' ? 'VENDORS & INVENTORY' : tab}
          </button>
        ))}
      </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10 rounded-xl">
            <span className="text-sm text-gray-500">Refreshing...</span>
          </div>
        )}
            {activeTab === 'OVERVIEW' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                  <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Chart of Accounts</h2>
                </div>

            {isAddingAccount && (
              <div className="mb-4 p-4 md:p-5 rounded-xl border bg-white shadow-sm" style={{ borderColor: theme.borders.light }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Code"
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                    className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                    style={{ borderColor: theme.borders.light }}
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                    style={{ borderColor: theme.borders.light }}
                  />
                  <select
                    value={newAccount.subtype}
                    onChange={(e) => setNewAccount({ ...newAccount, subtype: e.target.value })}
                    className="px-3 py-2 border rounded-md text-sm text-black"
                    style={{ borderColor: theme.borders.light }}
                  >
                    <option value="BANK">Bank</option>
                    <option value="EWALLET">E-Wallet</option>
                  </select>
                  <input
                    type="text"
                    placeholder={['BANK', 'EWALLET'].includes(newAccount.subtype) ? "Account Number *" : "Account Number"}
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                    style={{ borderColor: theme.borders.light }}
                  />
                </div>
                <div className="flex space-x-2">
                  <AsyncButton
                    onClick={handleCreateAccount}
                    className="text-white px-4 py-2 rounded-md text-sm font-semibold"
                    style={{ backgroundColor: theme.accents.primary }}
                  >
                    Save
                  </AsyncButton>
                  <button
                    onClick={() => setIsAddingAccount(false)}
                    className="px-4 py-2 rounded-md text-sm font-semibold"
                    style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border bg-white shadow-sm overflow-x-auto" style={{ borderColor: theme.borders.light }}>
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead>
                  <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Code</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Name</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Category</th>
                    <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Balance</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        {editingAccountId === acc.id ? (
                          <input
                            type="text"
                            value={editingAccount?.code || acc.code}
                            onChange={(e) => setEditingAccount({ ...editingAccount, code: e.target.value })}
                            className="px-2 py-1 border-2 rounded text-sm w-24 bg-white"
                            style={{ borderColor: theme.accents.primary }}
                          />
                        ) : (
                          <span className="font-medium" style={{ color: theme.text.primary }}>{acc.code}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {editingAccountId === acc.id ? (
                          <input
                            type="text"
                            value={editingAccount?.name || acc.name}
                            onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                            className="px-2 py-1 border-2 rounded text-sm w-full bg-white"
                            style={{ borderColor: theme.accents.primary }}
                          />
                        ) : (
                          <span style={{ color: theme.text.primary }}>{acc.name}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {editingAccountId === acc.id ? (
                          <select
                            value={editingAccount?.category || acc.category}
                            onChange={(e) => setEditingAccount({ ...editingAccount, category: e.target.value })}
                            className="px-2 py-1 border-2 rounded text-sm bg-white"
                            style={{ borderColor: theme.borders.light }}
                          >
                            <option value="ASSET">Asset</option>
                            <option value="LIABILITY">Liability</option>
                            <option value="EQUITY">Equity</option>
                            <option value="REVENUE">Revenue</option>
                            <option value="EXPENSE">Expense</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: theme.accents.primary }}>
                            {acc.category}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold" style={{ color: theme.text.primary }}>{formatCurrency(acc.balance || 0)}</td>
                      <td className="p-3 text-right">
                        {editingAccountId === acc.id ? (
                          <div className="flex justify-end space-x-1">
                            <AsyncButton
                              onClick={handleSaveEdit}
                              className="text-white px-2 py-1 rounded text-xs font-semibold"
                              style={{ backgroundColor: theme.accents.secondary }}
                            >
                              Save
                            </AsyncButton>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 rounded text-xs font-semibold"
                              style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setLedgerModalData({ isOpen: true, accountId: acc.id, code: acc.code, name: acc.name })}
                            className="p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center"
                            style={{ color: theme.text.secondary }}
                            title="Open Ledger"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'JOURNALS' && (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Journal Entries</h2>
              <button
                onClick={() => setIsJournalModalOpen(true)}
                className="text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors w-full sm:w-auto"
                style={{ backgroundColor: theme.accents.primary }}
              >
                + Create Journal Entry
              </button>
            </div>

            {/* Filter Panel */}
            <div className="rounded-lg p-4 mb-5" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              {/* Quick date buttons */}
              <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Date</label>
                <div className="flex flex-wrap gap-2">
                  {(['today', 'yesterday', 'last7', 'last30'] as const).map(qd => (
                    <button
                      key={qd}
                      onClick={() => setJournalFilters(p => ({ ...p, quickDate: p.quickDate === qd ? '' : qd, dateFrom: '', dateTo: '' }))}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${journalFilters.quickDate === qd ? 'text-white border-transparent' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}
                      style={journalFilters.quickDate === qd ? { backgroundColor: theme.accents.primary, borderColor: theme.accents.primary } : {}}
                    >
                      {qd === 'today' ? 'Today' : qd === 'yesterday' ? 'Yesterday' : qd === 'last7' ? 'Last 7 Days' : 'Last 30 Days'}
                    </button>
                  ))}
                  <button
                    onClick={() => setJournalFilters(p => ({ ...p, quickDate: p.quickDate === 'custom' ? '' : 'custom' }))}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${journalFilters.quickDate === 'custom' ? 'text-white border-transparent' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}
                    style={journalFilters.quickDate === 'custom' ? { backgroundColor: theme.accents.primary, borderColor: theme.accents.primary } : {}}
                  >
                    Custom Range
                  </button>
                </div>
                {journalFilters.quickDate === 'custom' && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                    <input
                      type="date"
                      value={journalFilters.dateFrom}
                      onChange={(e) => setJournalFilters(p => ({ ...p, dateFrom: e.target.value }))}
                      className="px-3 py-2 rounded text-sm"
                      style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                    />
                    <span className="self-center text-sm hidden sm:inline" style={{ color: theme.text.secondary }}>to</span>
                    <span className="text-sm sm:hidden text-center" style={{ color: theme.text.secondary }}>To date</span>
                    <input
                      type="date"
                      value={journalFilters.dateTo}
                      onChange={(e) => setJournalFilters(p => ({ ...p, dateTo: e.target.value }))}
                      className="px-3 py-2 rounded text-sm"
                      style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                    />
                  </div>
                )}
              </div>

              {/* Other filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Journal Type */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Journal Type</label>
                  <select
                    value={journalFilters.journalType}
                    onChange={(e) => setJournalFilters(p => ({ ...p, journalType: e.target.value as JournalTypeKey | '' }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  >
                    <option value="">All Types</option>
                    {(['Sale', 'Payment Received','Vendor Payment', 'Inventory Receipt', 'Inventory Return', 'Capital Contribution', 'Owner Withdrawal', 'Expense', 'Internal Transfer', 'Manual Journal'] as JournalTypeKey[]).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                

                {/* Vendor Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Vendor</label>
                  <select
                    value={journalFilters.vendorId}
                    onChange={(e) => setJournalFilters(p => ({ ...p, vendorId: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  >
                    <option value="">All Vendors</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Search */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Customer name</label>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={journalFilters.customerId}
                    onChange={(e) => setJournalFilters(p => ({ ...p, customerId: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                </div>
              </div>

              {hasActiveJournalFilters && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: theme.text.secondary }}>
                    Showing {filteredJournals.length} result{filteredJournals.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={resetJournalFilters}
                    className="text-xs font-semibold px-3 py-1 rounded border transition-colors hover:bg-gray-50"
                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Journal List */}
            <div className="space-y-4 relative">
              {journalsLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
                  <span className="text-sm text-gray-500">Loading journals...</span>
                </div>
              )}
              {!journalsLoading && filteredJournals.length === 0 && (
                <div className="rounded-xl border bg-white p-8 text-center" style={{ borderColor: theme.borders.light, color: theme.text.muted }}>
                  {hasActiveJournalFilters ? 'No journal entries match the current filters.' : 'No journal entries yet.'}
                </div>
              )}
              {filteredJournals.map(je => {
                const jType = detectJournalType(je);
                const typeBadgeClass = JOURNAL_TYPE_COLORS[jType] || JOURNAL_TYPE_COLORS['Other'];
                const createdAt = je.createdAt ? new Date(je.createdAt) : new Date(je.date);
                return (
                  <div key={je.id} className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
                    <div className="p-4" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: theme.text.primary }}>{je.entryNo}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeBadgeClass}`}>{jType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <div className="text-right">
                            <div className="text-xs font-medium" style={{ color: theme.text.secondary }}>
                              {createdAt.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-xs" style={{ color: theme.text.muted }}>
                              {createdAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-1.5" style={{ color: theme.text.secondary }}>{je.description}</p>
                      {je.notes && (
                        <p className="text-xs mt-0.5 italic" style={{ color: theme.text.muted }}>{je.notes}</p>
                      )}
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left" style={{ borderColor: theme.borders.light }}>
                          <th className="pb-2 pl-4 pt-2 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Account</th>
                          <th className="pb-2 pr-4 pt-2 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Debit</th>
                          <th className="pb-2 pr-4 pt-2 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {je.lines.map((line: any) => (
                          <tr key={line.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                            <td className="py-2 pl-4" style={{ color: theme.text.primary }}>{line.account?.code ? `${line.account.code} – ${line.account.name}` : (line.account?.name || line.accountId)}</td>
                            <td className="py-2 pr-4 text-right" style={{ color: Number(line.debit) > 0 ? '#059669' : theme.text.muted }}>{Number(line.debit) > 0 ? formatCurrency(line.debit) : '—'}</td>
                            <td className="py-2 pr-4 text-right" style={{ color: Number(line.credit) > 0 ? '#dc2626' : theme.text.muted }}>{Number(line.credit) > 0 ? formatCurrency(line.credit) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'PAYABLES' && (
          <div>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Payables</h2>
                <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>
                  Money owed to vendors, employees, landlords, and other payees.
                </p>
              </div>
              {(isAdmin || isManager) && (
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 text-white w-full sm:w-auto"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  + Add Expense
                </button>
              )}
            </div>

            {/* Summary Cards */}
            {payablesByPayee.length > 0 && (() => {
              const totalBilled = payablesByPayee.reduce((s, g) => s + g.totalExpenses, 0);
              const totalPaid = payablesByPayee.reduce((s, g) => s + g.totalPaid, 0);
              const totalOutstanding = payablesByPayee.reduce((s, g) => s + g.totalOutstanding, 0);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Billed</div>
                    <div className="text-xl font-bold" style={{ color: theme.text.primary }}>{formatCurrency(totalBilled)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: theme.accents.primary, width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Paid</div>
                    <div className="text-xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: '#10b981', width: totalBilled > 0 ? `${(totalPaid / totalBilled) * 100}%` : '0%' }}></div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Outstanding</div>
                    <div className="text-xl font-bold" style={{ color: totalOutstanding > 0 ? theme.accents.error : theme.text.secondary }}>{formatCurrency(totalOutstanding)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: totalOutstanding > 0 ? theme.accents.error : '#10b981', width: totalBilled > 0 ? `${(totalOutstanding / totalBilled) * 100}%` : '0%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Filters */}
            <div className="rounded-lg p-4 mb-5" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Payee Name</label>
                  <input
                    type="text"
                    placeholder="Search payee..."
                    value={expenseFilters.payeeSearch}
                    onChange={(e) => setExpenseFilters(p => ({ ...p, payeeSearch: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Payee Type</label>
                  <select
                    value={expenseFilters.payeeType}
                    onChange={(e) => setExpenseFilters(p => ({ ...p, payeeType: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  >
                    <option value="">All Types</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="SUPPLIER">Supplier</option>
                    <option value="LANDLORD">Landlord</option>
                    <option value="UTILITY_COMPANY">Utility Company</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Branch</label>
                  <select
                    value={expenseFilters.branch}
                    onChange={(e) => { if (!isBranchScoped) setExpenseFilters(p => ({ ...p, branch: e.target.value })); }}
                    disabled={isBranchScoped}
                    className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  >
                    <option value="">All Branches</option>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>From Date</label>
                  <input type="date" value={expenseFilters.dateFrom}
                    onChange={(e) => setExpenseFilters(p => ({ ...p, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>To Date</label>
                  <input type="date" value={expenseFilters.dateTo}
                    onChange={(e) => setExpenseFilters(p => ({ ...p, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                </div>
              </div>
              {(expenseFilters.payeeSearch || expenseFilters.payeeType) && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: theme.text.secondary }}>
                    {filteredPayablesByPayee.length} of {payablesByPayee.length} payee{payablesByPayee.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setExpenseFilters(p => ({ ...p, payeeSearch: '', payeeType: '' }))}
                    className="text-xs font-semibold px-3 py-1 rounded border hover:bg-gray-50"
                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Payee-grouped table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-x-auto" style={{ borderColor: theme.borders.light }}>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                    {["Payee", "Type", "Expenses", "Total Billed", "Total Paid", "Outstanding", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expensesLoading ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>Loading payables...</td></tr>
                  ) : expensesError ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                      <div className="flex flex-col items-center gap-3">
                        <span>{expensesError}</span>
                        <AsyncButton onClick={fetchExpenses}>Retry</AsyncButton>
                      </div>
                    </td></tr>
                  ) : filteredPayablesByPayee.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center" style={{ color: theme.text.muted }}>
                      {payablesByPayee.length === 0 ? 'No payables found. Add an expense to get started.' : 'No payees match the current filters.'}
                    </td></tr>
                  ) : filteredPayablesByPayee.map((group) => {
                    const outstanding = Number(group.totalOutstanding);
                    const status = outstanding <= 0 ? 'PAID' : group.totalOutstanding < group.totalExpenses ? 'PARTIAL' : 'DUE';
                    return (
                      <tr key={group.payeeId} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                        <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>
                          {group.payeeName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded"
                            style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                            {group.payeeType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>
                          {group.expenseCount}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-red-500">
                          PKR {Number(group.totalExpenses).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                          PKR {Number(group.totalPaid).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: outstanding > 0 ? '#ef4444' : '#22c55e' }}>
                          PKR {outstanding.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStateBadge(status)}`}>{status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {isAdmin && outstanding > 0 && (
                              <button
                                onClick={() => setPayPayableModalData({
                                  isOpen: true,
                                  payee: {
                                    payeeAccountId: group.payeeId,
                                    payeeName: group.payeeName,
                                    payeeType: group.payeeType,
                                    totalOutstanding: outstanding,
                                  },
                                })}
                                className="px-3 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
                                style={{ backgroundColor: theme.accents.primary }}
                              >
                                Pay
                              </button>
                            )}
                            <button
                              onClick={() => setPayeeLedgerModalData({ isOpen: true, payeeAccountId: group.payeeId, payeeName: group.payeeName })}
                              className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm"
                              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}
                            >
                              Ledger
                            </button>
                            {isAdmin && Number(group.totalPaid) > 0 && (
                              <button
                                onClick={() => setUndoModal({
                                  isOpen: true,
                                  type: 'payable',
                                  title: 'Undo All Payments',
                                  description: `This will undo all payments made to ${group.payeeName}. The payable amounts will be restored.`,
                                  details: {
                                    amount: Number(group.totalPaid),
                                    reference: group.payeeName
                                  },
                                  onConfirm: async () => {
                                    await undoPayablePaymentsByPayeeAccountId(group.payeeId);
                                    await fetchExpenses();
                                    await fetchData();
                                  }
                                })}
                                className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm bg-red-50 text-red-700 hover:bg-red-100"
                                style={{ borderColor: '#fecaca' }}
                              >
                                Undo All
                              </button>
                            )}
                            {isAdmin && Number(group.totalPaid) === 0 && (
                              <button
                                onClick={() => setUndoModal({
                                  isOpen: true,
                                  type: 'payable',
                                  title: 'Delete Payable',
                                  description: `This will delete all payables for ${group.payeeName}. This action cannot be undone.`,
                                  details: {
                                    reference: group.payeeName
                                  },
                                  onConfirm: async () => {
                                    await deletePayablesByPayee(group.payeeId);
                                    await fetchExpenses();
                                  }
                                })}
                                className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm bg-gray-50 text-gray-700 hover:bg-gray-100"
                                style={{ borderColor: '#e5e7eb' }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'RECEIVABLES' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Receivables</h2>
                <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>
                  Outstanding balances grouped by party. Updates automatically on every collection.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                {isAdmin && (
                  <button
                    onClick={() => setIsAddReceivableOpen(true)}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 text-white w-full sm:w-auto"
                    style={{ backgroundColor: theme.accents.primary }}>
                    + Add Receivable
                  </button>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            {receivables.length > 0 && (() => {
              const totalBilled = receivables.reduce((s: number, r: any) => s + Number(r.totalBilled), 0);
              const totalCollected = receivables.reduce((s: number, r: any) => s + Number(r.totalPaid), 0);
              const totalOutstanding = receivables.reduce((s: number, r: any) => s + Number(r.totalOutstanding), 0);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Billed</div>
                    <div className="text-xl font-bold" style={{ color: theme.text.primary }}>{formatCurrency(totalBilled)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: theme.accents.primary, width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Collected</div>
                    <div className="text-xl font-bold text-emerald-600">{formatCurrency(totalCollected)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: '#10b981', width: totalBilled > 0 ? `${(totalCollected / totalBilled) * 100}%` : '0%' }}></div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Total Outstanding</div>
                    <div className="text-xl font-bold" style={{ color: totalOutstanding > 0 ? theme.accents.error : theme.text.secondary }}>{formatCurrency(totalOutstanding)}</div>
                    <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <div className="h-1 rounded-full" style={{ backgroundColor: totalOutstanding > 0 ? theme.accents.error : '#10b981', width: totalBilled > 0 ? `${(totalOutstanding / totalBilled) * 100}%` : '0%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Filters */}
            <div className="rounded-lg p-4 mb-5" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Party Name</label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={receivableFilters.partySearch}
                    onChange={(e) => setReceivableFilters(p => ({ ...p, partySearch: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Party Type</label>
                  <select
                    value={receivableFilters.partyType}
                    onChange={(e) => setReceivableFilters(p => ({ ...p, partyType: e.target.value }))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                  >
                    <option value="">All Types</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="SUPPLIER">Supplier</option>
                    <option value="LANDLORD">Landlord</option>
                    <option value="UTILITY_COMPANY">Utility Company</option>
                    <option value="BUSINESS_PARTNER">Business Partner</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              {(receivableFilters.partySearch || receivableFilters.partyType) && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: theme.text.secondary }}>
                    {filteredReceivables.length} of {receivables.length} part{receivables.length !== 1 ? 'ies' : 'y'}
                  </span>
                  <button
                    onClick={() => setReceivableFilters({ partySearch: '', partyType: '' })}
                    className="text-xs font-semibold px-3 py-1 rounded border hover:bg-gray-50"
                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {receivables.length === 0 ? (
              <div className="rounded-xl border bg-white p-8 text-center" style={{ borderColor: theme.borders.light, color: theme.text.muted }}>
                No receivables yet.
              </div>
            ) : (
              <div className="rounded-xl border bg-white shadow-sm overflow-x-auto" style={{ borderColor: theme.borders.light }}>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Party Name</th>
                      <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Party Type</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Cost Price</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Sale Price</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Billed</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Collected</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Outstanding</th>
                      <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Status</th>
                      <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceivables.length === 0 ? (
                      <tr><td colSpan={9} className="px-6 py-10 text-center" style={{ color: theme.text.muted }}>
                        No parties match the current filters.
                      </td></tr>
                    ) : filteredReceivables.map((r: any) => {
                      const outstanding = Number(r.totalOutstanding);
                      const costPrice = Number(r.totalCostPrice || 0);
                      const salePrice = Number(r.totalSalePrice || 0);
                      return (
                        <tr key={r.partyId ?? r.partyName} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                          <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{r.partyName}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold"
                              style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                              {(r.partyType as string).replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right" style={{ color: theme.text.primary }}>{costPrice > 0 ? costPrice.toLocaleString() : '-'}</td>
                          <td className="p-3 text-right" style={{ color: theme.text.primary }}>{salePrice > 0 ? salePrice.toLocaleString() : '-'}</td>
                          <td className="p-3 text-right" style={{ color: theme.text.primary }}>{Number(r.totalBilled).toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-600">{Number(r.totalPaid).toLocaleString()}</td>
                          <td className="p-3 text-right font-semibold" style={{ color: outstanding > 0 ? theme.accents.error : theme.text.secondary }}>
                            {outstanding.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStateBadge(r.status)}`}>{r.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              {outstanding > 0 && r.partyId && (
                                <button
                                  onClick={() => setCollectModalData({ isOpen: true, party: {
                                    partyId: r.partyId, partyName: r.partyName,
                                    partyType: r.partyType, totalOutstanding: outstanding,
                                  }})}
                                  className="text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
                                  style={{ backgroundColor: theme.accents.primary }}>
                                  Collect
                                </button>
                              )}
                              {r.partyId && (
                                <button
                                  onClick={() => setLedgerModalReceivable({ isOpen: true, partyId: r.partyId, partyName: r.partyName, partyType: r.partyType })}
                                  className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm"
                                  style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}>
                                  Ledger
                                </button>
                              )}
                              {isAdmin && Number(r.totalPaid) > 0 && (
                                <button
                                  onClick={() => setUndoModal({
                                    isOpen: true,
                                    type: 'receivable',
                                    title: 'Undo All Payments',
                                    description: `This will undo all payments collected from ${r.partyName}. The receivable amounts will be restored.`,
                                    details: {
                                      amount: Number(r.totalPaid),
                                      reference: r.partyName
                                    },
                                    onConfirm: async () => {
                                      await undoReceivablePaymentsByPartyId(r.partyId);
                                      await getReceivables().then(setReceivables);
                                      await fetchData();
                                    }
                                  })}
                                  className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm bg-red-50 text-red-700 hover:bg-red-100"
                                  style={{ borderColor: '#fecaca' }}>
                                  Undo All
                                </button>
                              )}
                              {isAdmin && Number(r.totalPaid) === 0 && r.partyId && (
                                <button
                                  onClick={() => setUndoModal({
                                    isOpen: true,
                                    type: 'receivable',
                                    title: 'Delete Receivable',
                                    description: `This will delete the receivable party ${r.partyName} and all its entries. This action cannot be undone.`,
                                    details: {
                                      reference: r.partyName
                                    },
                                    onConfirm: async () => {
                                      await deleteReceivableParty(r.partyId);
                                      await getReceivables().then(setReceivables);
                                    }
                                  })}
                                  className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm bg-gray-50 text-gray-700 hover:bg-gray-100"
                                  style={{ borderColor: '#e5e7eb' }}>
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'OWNER_EQUITY' && (          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Owner Equity</h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full w-fit" style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}>Overview</span>
            </div>

            {(() => {
              const ownerCapital = accounts.find((a) => a.code === '3001')?.balance || 0;
              const ownerDrawings = accounts.find((a) => a.code === '3002')?.balance || 0;
              const totalRevenue = accounts.filter((a: any) => a.category === 'REVENUE').reduce((s: number, a: any) => s + (a.balance || 0), 0);
              const totalExpenses = accounts.filter((a: any) => a.category === 'EXPENSE').reduce((s: number, a: any) => s + (a.balance || 0), 0);
              const netProfit = totalRevenue - totalExpenses;
              const netEquity = ownerCapital - ownerDrawings + netProfit;

              return (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                    <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                      <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Owner Capital</div>
                      <div className="text-xl font-bold" style={{ color: theme.text.primary }}>{formatCurrency(ownerCapital)}</div>
                      <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                        <div className="h-1 rounded-full" style={{ backgroundColor: theme.accents.secondary, width: '100%' }}></div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                      <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Owner Drawings</div>
                      <div className="text-xl font-bold" style={{ color: theme.text.primary }}>{formatCurrency(ownerDrawings)}</div>
                      <div className="mt-3 h-1 w-full rounded-full" style={{ backgroundColor: theme.backgrounds.secondary }}>
                        <div className="h-1 rounded-full" style={{ backgroundColor: theme.accents.highlight, width: '100%' }}></div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                      <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Cumulative Net Profit</div>
                      <div className="text-xl font-bold" style={{ color: netProfit >= 0 ? theme.accents.secondary : theme.accents.error }}>{formatCurrency(netProfit)}</div>
                      <div className="mt-2 text-xs space-y-0.5" style={{ color: theme.text.muted }}>
                        <div>Revenue: {formatCurrency(totalRevenue)}</div>
                        <div>Expenses: {formatCurrency(totalExpenses)}</div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
                      <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.text.secondary }}>Net Equity</div>
                      <div className="text-xl font-bold" style={{ color: netEquity >= 0 ? theme.accents.secondary : theme.accents.error }}>{formatCurrency(netEquity)}</div>
                      <div className="mt-2 text-xs" style={{ color: theme.text.muted }}>
                        Capital − Drawings + Net Profit
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm mb-6" style={{ borderColor: theme.borders.light }}>
              <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.text.secondary }}>Actions</div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setIsCapitalContributionOpen(true)}
                  className="flex-1 min-w-[160px] px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all text-white shadow-sm hover:shadow"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  Capital Contribution
                </button>
                <button
                  onClick={() => setIsOwnerWithdrawalOpen(true)}
                  className="flex-1 min-w-[160px] px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all text-white shadow-sm hover:shadow"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  Owner Withdrawal
                </button>
                <button
                  onClick={() => setIsInternalTransferOpen(true)}
                  className="flex-1 min-w-[160px] px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all text-white shadow-sm hover:shadow"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  Internal Transfer
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm overflow-x-auto" style={{ borderColor: theme.borders.light }}>
              {isAddingAccount && (
                <div className="mb-4 p-4 md:p-5 rounded-xl border bg-white shadow-sm" style={{ borderColor: theme.borders.light }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Code"
                      value={newAccount.code}
                      onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                      className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                      style={{ borderColor: theme.borders.light }}
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                      className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                      style={{ borderColor: theme.borders.light }}
                    />
                    <select
                      value={newAccount.subtype}
                      onChange={(e) => setNewAccount({ ...newAccount, subtype: e.target.value })}
                      className="px-3 py-2 border rounded-md text-sm text-black"
                      style={{ borderColor: theme.borders.light }}
                    >
                      <option value="BANK">Bank</option>
                      <option value="EWALLET">E-Wallet</option>
                    </select>
                    <input
                      type="text"
                      placeholder={['BANK', 'EWALLET'].includes(newAccount.subtype) ? "Account Number *" : "Account Number"}
                      value={newAccount.accountNumber}
                      onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                      className="px-3 py-2 border rounded-md text-sm text-black placeholder-gray-600"
                      style={{ borderColor: theme.borders.light }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <AsyncButton
                      onClick={handleCreateAccount}
                      className="text-white px-4 py-2 rounded-md text-sm font-semibold"
                      style={{ backgroundColor: theme.accents.primary }}
                    >
                      Save
                    </AsyncButton>
                    <button
                      onClick={() => setIsAddingAccount(false)}
                      className="px-4 py-2 rounded-md text-sm font-semibold"
                      style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Cash, Bank & E-Wallets</div>
                <button
                  onClick={() => setIsAddingAccount(true)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors text-white w-full sm:w-auto"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  Add Bank/Wallet
                </button>
              </div>
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead className="border-b" style={{ backgroundColor: theme.backgrounds.secondary }}>
                  <tr>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Code</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Name</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Type</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Account Number</th>
                    <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Balance</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.filter((acc: any) => ['BANK', 'EWALLET', 'CASH'].includes(acc.subtype)).map(acc => (
                    <tr key={acc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ opacity: acc.isActive === false ? 0.5 : 1 }}>
                      <td className="p-3">
                        <span className="font-medium" style={{ color: theme.text.primary }}>{acc.code}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span style={{ color: theme.text.primary }}>{acc.name}</span>
                          {acc.isActive === false && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">Deactivated</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}>
                          {acc.subtype}
                        </span>
                      </td>
                      <td className="p-3">
                        <span style={{ color: acc.accountNumber ? theme.text.primary : theme.text.muted }}>
                          {acc.accountNumber || '—'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold" style={{ color: theme.text.primary }}>{formatCurrency(acc.balance || 0)}</td>
                      <td className="p-3 text-right">
                        {acc.isActive !== false && (
                          <button
                            onClick={() => setDeleteConfirmData({ isOpen: true, accountId: acc.id, accountName: acc.name, accountBalance: acc.balance || 0, accountSubtype: acc.subtype, transferAccountId: '' })}
                            className="p-1.5 rounded hover:bg-red-50 transition-colors"
                            style={{ color: theme.accents.error }}
                            title="Deactivate account"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {accounts.filter((acc: any) => ['BANK', 'EWALLET', 'CASH'].includes(acc.subtype)).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center" style={{ color: theme.text.muted }}>No cash/bank/e-wallet accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'VENDORS' && (
          <div>
            {/* ── Vendor list view ── */}
            {!selectedVendorId ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold" style={{ color: theme.text.primary }}>Vendors &amp; Inventory</h2>
                    <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>Manage vendor accounts, prepaid balances, and inventory allocations.</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => setShowCreateVendor(true)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm w-full sm:w-auto"
                      style={{ backgroundColor: theme.accents.primary }}>
                      + Add Vendor
                    </button>
                  )}
                </div>

                {/* Summary strip */}
                {!vendorsLoading && vendorsList.length > 0 && (() => {
                  const totalBalance = vendorsList.reduce((s: number, v: any) => s + v.prepaidBalance, 0);
                  const withBalance = vendorsList.filter((v: any) => v.prepaidBalance > 0).length;
                  return (
                    <div className="rounded-xl border p-4 flex flex-wrap items-center gap-4 md:gap-6 mb-5"
                      style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}>
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>Total Prepaid Outstanding</p>
                        <p className="text-xl font-bold" style={{ color: totalBalance > 0 ? theme.accents.primary : theme.text.secondary }}>
                          {fmtCurrency(totalBalance)}
                        </p>
                      </div>
                      <div className="hidden md:block h-8 w-px" style={{ backgroundColor: theme.borders.light }} />
                      <div>
                        <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>Vendors with balance</p>
                        <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{withBalance}</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="rounded-xl border overflow-x-auto shadow-sm" style={{ borderColor: theme.borders.light }}>
                  {vendorsLoading ? (
                    <div className="p-12 text-center text-sm" style={{ color: theme.text.muted }}>Loading vendors...</div>
                  ) : vendorsList.length === 0 ? (
                    <div className="p-12 text-center text-sm" style={{ color: theme.text.muted }}>
                      No vendors yet.{isAdmin && ' Click "+ Add Vendor" to get started.'}
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                          {['Vendor', 'Contact', 'Phone', 'Prepaid Balance', 'Actions'].map(h => (
                            <th key={h} className={`p-3 font-semibold text-xs uppercase tracking-wider ${h === 'Prepaid Balance' ? 'text-right' : h === 'Actions' ? 'text-center' : 'text-left'}`} style={{ color: theme.text.secondary }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vendorsList.map((v: any) => (
                          <tr key={v.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                            <td className="p-3">
                              <p className="font-semibold" style={{ color: theme.text.primary }}>{v.name}</p>
                              {v.email && <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{v.email}</p>}
                            </td>
                            <td className="p-3" style={{ color: theme.text.secondary }}>{v.contactPerson || <span style={{ color: theme.text.muted }}>—</span>}</td>
                            <td className="p-3" style={{ color: theme.text.secondary }}>{v.phoneNumber || <span style={{ color: theme.text.muted }}>—</span>}</td>
                            <td className="p-3 text-right">
                              <span className="font-bold" style={{ color: v.prepaidBalance > 0 ? '#d97706' : theme.text.secondary }}>
                                {fmtCurrency(v.prepaidBalance)}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setSelectedVendorId(v.id); setVendorEditing(false); }}
                                  className="px-3 py-1 rounded text-xs font-semibold border"
                                  style={{ color: theme.text.primary, borderColor: theme.borders.medium }}>
                                  View
                                </button>
                                {isAdmin && (
                                  <button onClick={() => setVendorDeleteTarget(v)}
                                    className="px-3 py-1 rounded text-xs font-semibold border text-red-600 border-red-200 hover:bg-red-50">
                                    Deactivate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : (
              /* ── Vendor detail view ── */
              <div className="space-y-6">
                 <button onClick={() => { setSelectedVendorId(null); setVendorDetail(null); setVendorEditing(false); }}
                   className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-70 mb-4"
                   style={{ color: theme.text.secondary }}>
                   ← Back to Vendors
                 </button>

                {vendorDetailLoading || !vendorDetail ? (
                  <div className="p-12 text-center text-sm" style={{ color: theme.text.muted }}>Loading vendor...</div>
                ) : (() => {
                  const vendor = vendorDetail.vendor;
                  const summary = vendorDetail.summary;
                  const ledger: any[] = vendorDetail.ledger ?? [];
                  return (
                    <>
                       {/* Vendor card */}
                       <div className="rounded-xl border p-4 md:p-6 shadow-sm" style={{ borderColor: theme.borders.light }}>
                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                           <div className="flex-1 min-w-0">
                            {vendorEditing ? (
                              <div className="space-y-3">
                                {[
                                  { label: 'Name', key: 'name' }, { label: 'Contact Person', key: 'contactPerson' },
                                  { label: 'Phone', key: 'phoneNumber' }, { label: 'Email', key: 'email' }, { label: 'Address', key: 'address' },
                                  { label: 'Commission Rate (%)', key: 'commissionRate' }
                                ].map(({ label, key }) => (
                                  <div key={key} className="flex items-center gap-3">
                                     <span className="w-20 sm:w-28 text-xs font-medium shrink-0" style={{ color: theme.text.muted }}>{label}</span>
                                    <input type={key === "commissionRate" ? "number" : "text"} className="flex-1 border rounded px-2 py-1.5 text-sm outline-none"
                                      style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                                      value={(vendorEditForm as any)[key] ?? ""}
                                      onChange={(e) => setVendorEditForm(f => ({ ...f, [key]: key === "commissionRate" ? Number(e.target.value) : e.target.value }))} />
                                  </div>
                                ))}
                                <div className="flex gap-2 pt-1">
                                  <AsyncButton loading={vendorEditSaving} onClick={handleSaveVendorEdit}
                                    className="px-3 py-1.5 text-xs font-semibold text-white rounded"
                                    style={{ backgroundColor: theme.accents.primary }}>Save</AsyncButton>
                                  <button onClick={() => setVendorEditing(false)}
                                    className="px-3 py-1.5 text-xs font-medium border rounded"
                                    style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                 <h2 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>{vendor.name}</h2>
                                <div className="mt-2 space-y-0.5 text-sm" style={{ color: theme.text.secondary }}>
                                  {vendor.contactPerson && <p>Contact: {vendor.contactPerson}</p>}
                                  {vendor.phoneNumber && <p>Phone: {vendor.phoneNumber}</p>}
                                  {vendor.email && <p>Email: {vendor.email}</p>}
                                </div>
                              </>
                            )}
                          </div>
                          {isAdmin && !vendorEditing && (
                            <button onClick={() => {
                              setVendorEditForm({ name: vendor.name ?? '', contactPerson: vendor.contactPerson ?? '', phoneNumber: vendor.phoneNumber ?? '', email: vendor.email ?? '', address: vendor.address ?? '', commissionRate: vendor.commissionRate ?? 0 });
                              setVendorEditing(true);
                            }} className="px-3 py-1.5 text-xs font-medium border rounded"
                              style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}>Edit</button>
                          )}
                        </div>

                        {/* Balance summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                          {[
                            { label: 'Total Paid', value: summary.totalPaid, color: '#059669' },
                            { label: 'Total Allocated', value: summary.totalAllocated, color: theme.text.primary },
                            { label: 'Outstanding Balance', value: summary.prepaidBalance, color: summary.prepaidBalance > 0 ? '#d97706' : theme.text.secondary },
                          ].map(({ label, value, color }) => (
                            <div key={label} className="rounded-xl border p-4 text-center"
                              style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}>
                              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: theme.text.muted }}>{label}</p>
                              <p className="text-xl font-bold" style={{ color }}>{fmtCurrency(value)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        {isAdmin && (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 md:mt-5">
                            <button onClick={() => setVendorPayOpen(true)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
                              style={{ backgroundColor: theme.accents.primary }}>Make Payment</button>
                            <button onClick={() => setVendorAllocOpen(true)}
                              disabled={summary.prepaidBalance <= 0}
                              className="px-4 py-2 rounded-lg text-sm font-semibold border disabled:opacity-40"
                              style={{ color: theme.accents.primary, borderColor: theme.accents.primary }}>Allocate Inventory</button>
                            <button onClick={() => setVendorReturnOpen(true)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm bg-red-600 hover:bg-red-700">
                              Return Defective Inventory</button>
                          </div>
                        )}
                      </div>

                      {/* Ledger */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Transaction History</h3>
                        {ledger.length === 0 ? (
                          <div className="rounded-xl border p-10 text-center text-sm"
                            style={{ borderColor: theme.borders.light, color: theme.text.muted }}>
                            No transactions yet. Record a payment to get started.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {[...ledger].reverse().map((entry: any) => (
                              <div key={entry.id} className="rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: theme.borders.light }}>
                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-2" style={{ backgroundColor: theme.backgrounds.secondary }}>
                                   <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                                      backgroundColor: entry.kind === 'PAYMENT' ? '#dcfce7' : entry.kind === 'DEFECTIVE_RETURN' ? '#fef2f2' : '#dbeafe',
                                      color: entry.kind === 'PAYMENT' ? '#166534' : entry.kind === 'DEFECTIVE_RETURN' ? '#991b1b' : '#1e40af',
                                    }}>
                                      {entry.kind === 'PAYMENT' ? 'PAYMENT' : entry.kind === 'DEFECTIVE_RETURN' ? 'DEFECTIVE RETURN' : 'ALLOCATION'}
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{fmtDate(entry.date)}</span>
                                    {entry.notes && <span className="text-xs" style={{ color: theme.text.muted }}>{entry.notes}</span>}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold" style={{ color: entry.kind === 'ALLOCATION' ? '#dc2626' : '#059669' }}>
                                      {entry.kind === 'ALLOCATION' ? '−' : '+'}{fmtCurrency(entry.kind === 'PAYMENT' ? entry.amount : entry.totalAmount)}
                                    </span>
                                    <span className="text-xs" style={{ color: theme.text.muted }}>
                                      Balance: <span className="font-semibold" style={{ color: theme.text.primary }}>{fmtCurrency(entry.balance)}</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="px-4 py-3 text-xs space-y-1" style={{ color: theme.text.secondary }}>
                                  {entry.kind === 'PAYMENT' ? (
                                    <p>Paid from <span className="font-medium" style={{ color: theme.text.primary }}>{entry.fromAccount?.code} — {entry.fromAccount?.name}</span>
                                      {entry.recordedBy && <> · by {entry.recordedBy.fullName}</>}</p>
                                  ) : (
                                    <>
                                      {entry.bikes?.length > 0 && (
                                        <p><span className="font-medium" style={{ color: theme.text.primary }}>Bikes: </span>
                                          {entry.bikes.map((b: any) => `${b.model?.brand} ${b.model?.modelName} (${b.chassisNumber}) — ${fmtCurrency(b.purchaseCost ?? b.unitCost ?? 0)}`).join(', ')}</p>
                                      )}
                                      {entry.partLines?.length > 0 && (
                                        <p><span className="font-medium" style={{ color: theme.text.primary }}>Parts: </span>
                                          {entry.partLines.map((pl: any) => `${pl.quantity}× ${pl.part?.name} @ ${fmtCurrency(pl.unitCost)} (${pl.branch?.name})`).join(', ')}</p>
                                      )}
                                      {entry.recordedBy && <p>Recorded by {entry.recordedBy.fullName}</p>}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ── Create Vendor Modal ── */}
            {showCreateVendor && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" style={{ border: `1px solid ${theme.borders.light}` }}>
                  <h2 className="text-xl font-bold mb-5" style={{ color: theme.text.primary }}>Add Vendor</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Name *', key: 'name', placeholder: 'e.g. Evee Pakistan' },
                      { label: 'Contact Person', key: 'contactPerson', placeholder: 'e.g. Bilal Ahmed' },
                      { label: 'Phone', key: 'phoneNumber', placeholder: '+92300...' },
                      { label: 'Email', key: 'email', placeholder: 'info@vendor.com' },
                      { label: 'Address', key: 'address', placeholder: 'Street, City' },
                      { label: 'Commission Rate (%)', key: 'commissionRate', placeholder: 'e.g. 5' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>{label}</label>
                        <input type={key === "commissionRate" ? "number" : "text"} className="w-full px-3 py-2 rounded-md text-sm border outline-none"
                          style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                          placeholder={placeholder}
                          value={(vendorForm as any)[key] ?? ""}
                          onChange={(e) => setVendorForm(f => ({ ...f, [key]: key === "commissionRate" ? Number(e.target.value) : e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: theme.borders.light }}>
                    <button onClick={() => { setShowCreateVendor(false); setVendorForm({ name: '', contactPerson: '', phoneNumber: '', email: '', address: '', commissionRate: 0 }); }}
                      className="px-4 py-2 border rounded-md text-sm font-medium"
                      style={{ color: theme.text.primary, borderColor: theme.borders.medium }}>Cancel</button>
                    <AsyncButton loading={vendorSaving} onClick={handleCreateVendor}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-md"
                      style={{ backgroundColor: theme.accents.primary }}>Create Vendor</AsyncButton>
                  </div>
                </div>
              </div>
            )}

            {/* ── Deactivate Confirm Modal ── */}
            {vendorDeleteTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" style={{ border: `1px solid ${theme.borders.light}` }}>
                  <h2 className="text-lg font-bold mb-3" style={{ color: theme.text.primary }}>Deactivate Vendor</h2>
                  {vendorDeleteTarget.prepaidBalance > 0 ? (
                    <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-800">Outstanding balance of {fmtCurrency(vendorDeleteTarget.prepaidBalance)}.</p>
                      <p className="text-sm mt-1 text-amber-700">Allocate or adjust this balance before deactivating.</p>
                    </div>
                  ) : (
                    <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                      Deactivate <strong>{vendorDeleteTarget.name}</strong>? Historical data will be preserved.
                    </p>
                  )}
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setVendorDeleteTarget(null)}
                      className="px-4 py-2 border rounded-md text-sm font-medium"
                      style={{ color: theme.text.primary, borderColor: theme.borders.medium }}>Cancel</button>
                    <AsyncButton loading={vendorDeleting} disabled={vendorDeleteTarget.prepaidBalance > 0} onClick={handleDeleteVendor}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-40">
                      Deactivate</AsyncButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={fetchExpenses}
        defaultBranchId={isBranchScoped ? user?.branchId : null}
      />

      {selectedVendorId && vendorDetail && (
        <>
          <VendorPaymentModal
            isOpen={vendorPayOpen}
            onClose={() => setVendorPayOpen(false)}
            onSuccess={() => fetchVendorDetail(selectedVendorId)}
            vendorId={selectedVendorId}
            vendorName={vendorDetail.vendor?.name ?? ''}
            currentBalance={vendorDetail.summary?.prepaidBalance ?? 0}
          />
          <AllocateInventoryModal
            isOpen={vendorAllocOpen}
            onClose={() => setVendorAllocOpen(false)}
            onSuccess={() => { fetchVendorDetail(selectedVendorId); fetchVendors(); }}
            vendorId={selectedVendorId}
            vendorName={vendorDetail.vendor?.name ?? ''}
            currentBalance={vendorDetail.summary?.prepaidBalance ?? 0}
            vendorCommissionRate={Number(vendorDetail.vendor?.commissionRate ?? 0)}
          />
          <ReturnDefectiveInventoryModal
            isOpen={vendorReturnOpen}
            onClose={() => setVendorReturnOpen(false)}
            onSuccess={() => { fetchVendorDetail(selectedVendorId); fetchVendors(); }}
            vendorId={selectedVendorId}
            vendorName={vendorDetail.vendor?.name ?? ''}
          />
        </>
      )}

      <PayeeLedgerModal
        isOpen={payeeLedgerModalData.isOpen}
        onClose={() => setPayeeLedgerModalData({ ...payeeLedgerModalData, isOpen: false })}
        onSuccess={async () => { await fetchExpenses(); await fetchData(); }}
        payeeAccountId={payeeLedgerModalData.payeeAccountId}
        payeeName={payeeLedgerModalData.payeeName}
      />

      <PayPayableModal
        isOpen={payPayableModalData.isOpen}
        onClose={() => setPayPayableModalData({ ...payPayableModalData, isOpen: false })}
        onSuccess={async () => { await fetchExpenses(); await fetchData(); }}
        payee={payPayableModalData.payee}
      />

      <CreateJournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        onSuccess={async () => { await fetchData(); fetchJournals(); }}
        accounts={accounts}
      />

      <AccountLedgerModal
        isOpen={ledgerModalData.isOpen}
        onClose={() => setLedgerModalData({ ...ledgerModalData, isOpen: false })}
        accountId={ledgerModalData.accountId}
        accountCode={ledgerModalData.code}
        accountName={ledgerModalData.name}
      />

      <CapitalContributionModal
        isOpen={isCapitalContributionOpen}
        onClose={() => setIsCapitalContributionOpen(false)}
        onSuccess={async () => { await fetchData(); fetchJournals(); setActiveTab('JOURNALS'); }}
      />

      <OwnerWithdrawalModal
        isOpen={isOwnerWithdrawalOpen}
        onClose={() => setIsOwnerWithdrawalOpen(false)}
        onSuccess={async () => { await fetchData(); fetchJournals(); setActiveTab('JOURNALS'); }}
      />

      <InternalTransferModal
        isOpen={isInternalTransferOpen}
        onClose={() => setIsInternalTransferOpen(false)}
        onSuccess={async () => { await fetchData(); fetchJournals(); setActiveTab('JOURNALS'); }}
      />

      <AddReceivableModal
        isOpen={isAddReceivableOpen}
        onClose={() => setIsAddReceivableOpen(false)}
        onSuccess={fetchData}
      />

      <CollectReceivableModal
        isOpen={collectModalData.isOpen}
        onClose={() => setCollectModalData({ ...collectModalData, isOpen: false })}
        onSuccess={fetchData}
        party={collectModalData.party}
      />

      <PartyLedgerModal
        isOpen={ledgerModalReceivable.isOpen}
        onClose={() => setLedgerModalReceivable({ ...ledgerModalReceivable, isOpen: false })}
        partyId={ledgerModalReceivable.partyId}
        partyName={ledgerModalReceivable.partyName}
        partyType={ledgerModalReceivable.partyType}
        onSuccess={async () => {
          const updatedReceivables = await getReceivables();
          setReceivables(updatedReceivables);
          await fetchData();
        }}
      />

       {deleteConfirmData.isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setDeleteConfirmData({ ...deleteConfirmData, isOpen: false });
          }}
        >
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.light}`,
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Deactivate Account
            </h3>

            {deleteConfirmData.accountBalance > 0 ? (
              <>
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                  <p className="text-sm font-semibold" style={{ color: '#92400E' }}>
                    This account has a balance of {formatCurrency(deleteConfirmData.accountBalance)}.
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#92400E' }}>
                    You must transfer this amount to another account before deactivating.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
                    Transfer balance to *
                  </label>
                  <select
                    value={deleteConfirmData.transferAccountId}
                    onChange={(e) => setDeleteConfirmData({ ...deleteConfirmData, transferAccountId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    style={{ borderColor: theme.borders.light, color: theme.text.primary, backgroundColor: theme.backgrounds.primary }}
                  >
                    <option value="">Select destination account</option>
                    {accounts
                      .filter((a: any) =>
                        a.id !== deleteConfirmData.accountId &&
                        a.isActive !== false &&
                        ['CASH', 'BANK', 'EWALLET'].includes(a.subtype)
                      )
                      .map((a: any) => (
                        <option key={a.id} value={a.id}>
                          {a.code} — {a.name} ({formatCurrency(a.balance || 0)})
                        </option>
                      ))}
                  </select>
                </div>
              </>
            ) : (
              <p className="mb-6" style={{ color: theme.text.secondary }}>
                Are you sure you want to deactivate <strong>"{deleteConfirmData.accountName}"</strong>?
                This will prevent future transactions but historical data will be preserved.
              </p>
            )}

             <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmData({ isOpen: false, accountId: '', accountName: '', accountBalance: 0, accountSubtype: '', transferAccountId: '' })}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <AsyncButton
                onClick={handleDeleteAccount}
                disabled={deleteConfirmData.accountBalance > 0 && !deleteConfirmData.transferAccountId}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40"
              >
                Deactivate
              </AsyncButton>
            </div>
          </div>
        </div>
      )}

      {/* Undo Confirmation Modal */}
      <UndoConfirmationModal
        isOpen={undoModal.isOpen}
        onClose={() => setUndoModal({ ...undoModal, isOpen: false })}
        onConfirm={undoModal.onConfirm}
        title={undoModal.title}
        description={undoModal.description}
        details={undoModal.details}
      />
    </div>
  );
}
