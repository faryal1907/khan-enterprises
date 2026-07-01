"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { getAccounts, getJournalEntries, getPurchaseOrders, getPayables, payPayable, receivePurchaseOrder, createAccount, updateAccount, deleteAccount, getReceivables } from "@/lib/api/accounting";
import { toast } from "sonner";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/lib/firebase";
import { AsyncButton } from "@/components/async-button";
import { CreatePOModal } from "./create-po-modal";
import { PayPayableModal } from "./pay-payable-modal";
import { CreateJournalEntryModal } from "./create-journal-entry-modal";
import { AccountLedgerModal } from "./account-ledger-modal";
import { CapitalContributionModal } from "./capital-contribution-modal";
import { OwnerWithdrawalModal } from "./owner-withdrawal-modal";
import { InternalTransferModal } from "./internal-transfer-modal";
import { CollectReceivableModal } from "./collect-receivable-modal";
import { CustomerLedgerModal } from "./customer-ledger-modal";

type Tab = 'OVERVIEW' | 'JOURNALS' | 'PURCHASE_ORDERS' | 'PAYABLES' | 'RECEIVABLES' | 'OWNER_EQUITY';

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [receivables, setReceivables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [payModalData, setPayModalData] = useState<{ isOpen: boolean; payableId: string; amount: number }>({
    isOpen: false,
    payableId: "",
    amount: 0
  });
  
  // Account management state
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ code: '', name: '', category: 'ASSET', subtype: 'BANK', accountNumber: '', openingBalance: 0 });
  const [ledgerModalData, setLedgerModalData] = useState<{ isOpen: boolean; accountId: string; code: string; name: string }>({
    isOpen: false,
    accountId: '',
    code: '',
    name: ''
  });
  const [deleteConfirmData, setDeleteConfirmData] = useState<{ isOpen: boolean; accountId: string; accountName: string; accountBalance: number; accountSubtype: string; transferAccountId: string }>({
    isOpen: false,
    accountId: '',
    accountName: '',
    accountBalance: 0,
    accountSubtype: '',
    transferAccountId: '',
  });
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  
  // Owner equity modals
  const [isCapitalContributionOpen, setIsCapitalContributionOpen] = useState(false);
  const [isOwnerWithdrawalOpen, setIsOwnerWithdrawalOpen] = useState(false);
  const [isInternalTransferOpen, setIsInternalTransferOpen] = useState(false);

// Receivables modals
   const [collectModalData, setCollectModalData] = useState<{
     isOpen: boolean;
     customer: { customerName: string; customerPhone: string; totalOutstanding: number } | null;
   }>({ isOpen: false, customer: null });
   const [ledgerModalReceivable, setLedgerModalReceivable] = useState<{
     isOpen: boolean;
     customerPhone: string;
     customerName: string;
   }>({ isOpen: false, customerPhone: '', customerName: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accData, journalData, poData, payableData, receivableData] = await Promise.all([
        getAccounts(),
        getJournalEntries(),
        getPurchaseOrders(),
        getPayables(),
        getReceivables()
      ]);
      setAccounts(accData);
      setJournals(journalData);
      setPurchaseOrders(poData);
      setPayables(payableData);
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

  const handleReceivePO = async (id: string) => {
    try {
      await receivePurchaseOrder(id);
      toast.success("PO marked as received! Payable generated.");
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to receive PO");
    }
  };

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
    return <div className="p-8 text-center text-gray-500">Loading accounting data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
          Accounting Hub
        </h1>
        <p className="mt-2 text-sm" style={{ color: theme.text.secondary }}>
          Manage your general ledger, purchase orders, and supplier payables.
        </p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {(['OVERVIEW', 'JOURNALS', 'PURCHASE_ORDERS', 'PAYABLES', 'RECEIVABLES', 'OWNER_EQUITY'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{
              borderColor: activeTab === tab ? theme.accents.primary : 'transparent',
              color: activeTab === tab ? theme.accents.primary : undefined,
            }}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10 rounded-xl">
            <span className="text-sm text-gray-500">Refreshing...</span>
          </div>
        )}
        {activeTab === 'OVERVIEW' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Chart of Accounts</h2>
            </div>

            {isAddingAccount && (
              <div className="mb-4 p-5 rounded-xl border bg-white shadow-sm" style={{ borderColor: theme.borders.light }}>
                <div className="grid grid-cols-4 gap-3 mb-3">
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

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
              <table className="w-full text-left text-sm">
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Journal Entries</h2>
              <button 
                onClick={() => setIsJournalModalOpen(true)}
                className="text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
                style={{ backgroundColor: theme.accents.primary }}
              >
                + Create Journal Entry
              </button>
            </div>
            <div className="space-y-4">
              {journals.length === 0 && (
                <div className="rounded-xl border bg-white p-8 text-center" style={{ borderColor: theme.borders.light, color: theme.text.muted }}>
                  No journal entries yet.
                </div>
              )}
              {journals.map(je => (
                <div key={je.id} className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
                  <div className="p-4" style={{ backgroundColor: theme.backgrounds.secondary }}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: theme.text.primary }}>{je.entryNo}</span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white" style={{ color: theme.text.secondary }}>{new Date(je.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>{je.description}</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left" style={{ borderColor: theme.borders.light }}>
                        <th className="pb-2 pl-4 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Account</th>
                        <th className="pb-2 pr-4 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Debit</th>
                        <th className="pb-2 pr-4 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {je.lines.map((line: any) => (
                        <tr key={line.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                          <td className="py-2 pl-4" style={{ color: theme.text.primary }}>{line.account?.name || line.accountId}</td>
                          <td className="py-2 pr-4 text-right" style={{ color: theme.text.primary }}>{Number(line.debit) > 0 ? formatCurrency(line.debit) : '-'}</td>
                          <td className="py-2 pr-4 text-right" style={{ color: theme.text.primary }}>{Number(line.credit) > 0 ? formatCurrency(line.credit) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PURCHASE_ORDERS' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Purchase Orders</h2>
              <button 
                onClick={() => setIsPOModalOpen(true)}
                className="text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
                style={{ backgroundColor: theme.accents.primary }}
              >
                + Create PO
              </button>
            </div>
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>PO Number</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Vendor</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Cost</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Status</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map(po => (
                    <tr key={po.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                      <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{po.poNumber}</td>
                      <td className="p-3" style={{ color: theme.text.primary }}>{po.vendor?.name}</td>
                      <td className="p-3" style={{ color: theme.text.primary }}>{formatCurrency(po.totalCost)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          po.status === 'RECEIVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {po.status === 'PENDING' && (
                          <AsyncButton 
                            onClick={() => handleReceivePO(po.id)}
                            className="text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
                            style={{ backgroundColor: theme.accents.primary }}
                          >
                            Mark Received
                          </AsyncButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'PAYABLES' && (
          <div>
            <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text.primary }}>Accounts Payable</h2>
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Reference</th>
                    <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Party</th>
                    <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total</th>
                    <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Remaining</th>
                    <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Status</th>
                    <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payables.map(payable => (
                    <tr key={payable.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: theme.borders.light }}>
                      <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{payable.ref}</td>
                      <td className="p-3" style={{ color: theme.text.primary }}>{payable.partyName}</td>
                      <td className="p-3 text-right" style={{ color: theme.text.primary }}>{formatCurrency(payable.total)}</td>
                      <td className="p-3 text-right font-semibold" style={{ color: theme.accents.error }}>
                        {formatCurrency(payable.remaining)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payable.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                          payable.status === 'PARTIAL' ? 'bg-orange-100 text-orange-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payable.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {payable.status !== 'PAID' && (
                          <button 
                            onClick={() => setPayModalData({ isOpen: true, payableId: payable.id, amount: Number(payable.remaining) })}
                            className="text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
                            style={{ backgroundColor: theme.accents.primary }}
                          >
                            Pay
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

        {activeTab === 'RECEIVABLES' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Receivables</h2>
                <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>
                  All payment-verified orders. Outstanding balance updates automatically on every payment.
                </p>
              </div>
              {receivables.length > 0 && (() => {
                const totalOutstanding = receivables.reduce((s: number, r: any) => s + Number(r.totalOutstanding), 0);
                const hasOutstanding = receivables.some((r: any) => Number(r.totalOutstanding) > 0);
                return (
                  <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${hasOutstanding ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {receivables.length} customer{receivables.length !== 1 ? 's' : ''}{hasOutstanding ? ` · Rs. ${totalOutstanding.toLocaleString()} outstanding` : ' · fully settled'}
                  </div>
                );
              })()}
            </div>

            {receivables.length === 0 ? (
              <div
                className="rounded-xl border bg-white p-8 text-center"
                style={{ borderColor: theme.borders.light, color: theme.text.muted }}
              >
                No payment-verified orders yet.
              </div>
            ) : (
              <div className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: theme.borders.light }}>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                      <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Customer</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Invoiced</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Paid</th>
                      <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Outstanding</th>
                      <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Last Payment</th>
                      <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Status</th>
                      <th className="p-3 text-center font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivables.map((r: any) => {
                      const lastPayment = r.lastPaymentDate ? new Date(r.lastPaymentDate) : null;
                      const lastPaymentLabel = lastPayment
                        ? lastPayment.toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })
                        : '-';
                      const outstanding = Number(r.totalOutstanding);
                      return (
                        <tr
                          key={r.customerPhone}
                          className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                          style={{ borderColor: theme.borders.light }}
                        >
                          <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{r.customerName}</td>
                          <td className="p-3 text-right" style={{ color: theme.text.primary }}>
                            {Number(r.totalBilled).toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-emerald-600">
                            {Number(r.totalPaid).toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-semibold" style={{ color: outstanding > 0 ? theme.accents.error : theme.text.secondary }}>
                            {outstanding.toLocaleString()}
                          </td>
                          <td className="p-3 text-center" style={{ color: theme.text.secondary }}>
                            {lastPaymentLabel}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                r.status === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : r.status === 'PARTIAL'
                                  ? 'bg-orange-100 text-orange-800'
                                  : r.status === 'OVERDUE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
<td className="p-3">
                           <div className="flex items-center justify-center gap-2">
                             {outstanding > 0 && (
                             <button
                               onClick={() =>
                                 setCollectModalData({
                                   isOpen: true,
                                   customer: {
                                     customerName: r.customerName,
                                     customerPhone: r.customerPhone,
                                     totalOutstanding: outstanding,
                                   },
                                 })
                               }
                               className="text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
                               style={{ backgroundColor: theme.accents.primary }}
                             >
                               Collect
                             </button>
                             )}
                             <button
                               onClick={() =>
                                 setLedgerModalReceivable({
                                   isOpen: true,
                                   customerPhone: r.customerPhone,
                                   customerName: r.customerName,
                                 })
                               }
                               className="px-3 py-1 rounded-md text-xs font-semibold border shadow-sm"
                               style={{
                                 color: theme.text.primary,
                                 borderColor: theme.borders?.medium || '#d1d5db',
                               }}
                             >
                               Ledger
                             </button>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Owner Equity</h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}>Overview</span>
            </div>

            {(() => {
              const ownerCapital = accounts.find((a) => a.code === '3001')?.balance || 0;
              const ownerDrawings = accounts.find((a) => a.code === '3002')?.balance || 0;
              const totalRevenue = accounts.filter((a) => a.category === 'REVENUE').reduce((s: number, a: any) => s + (a.balance || 0), 0);
              const totalExpenses = accounts.filter((a) => a.category === 'EXPENSE').reduce((s: number, a: any) => s + (a.balance || 0), 0);
              const netProfit = totalRevenue - totalExpenses;
              const netEquity = ownerCapital - ownerDrawings + netProfit;

              return (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
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

            <div className="rounded-xl border bg-white p-5 shadow-sm mb-6" style={{ borderColor: theme.borders.light }}>
              <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: theme.text.secondary }}>Actions</div>
              <div className="flex flex-wrap gap-3">
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

            <div className="rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: theme.borders.light }}>
              {isAddingAccount && (
                <div className="mb-4 p-5 rounded-xl border bg-white shadow-sm" style={{ borderColor: theme.borders.light }}>
                  <div className="grid grid-cols-4 gap-3 mb-3">
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Cash, Bank & E-Wallets</div>
                <button
                  onClick={() => setIsAddingAccount(true)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors text-white"
                  style={{ backgroundColor: theme.accents.primary }}
                >
                  Add Bank/Wallet
                </button>
              </div>
              <table className="w-full text-left text-sm">
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
      </div>

      <CreatePOModal 
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        onSuccess={fetchData}
      />

      <PayPayableModal 
        isOpen={payModalData.isOpen}
        onClose={() => setPayModalData({ ...payModalData, isOpen: false })}
        onSuccess={fetchData}
        payableId={payModalData.payableId}
        remainingAmount={payModalData.amount}
      />

      <CreateJournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        onSuccess={fetchData}
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
        onSuccess={async () => { await fetchData(); setActiveTab('JOURNALS'); }}
      />

      <OwnerWithdrawalModal
        isOpen={isOwnerWithdrawalOpen}
        onClose={() => setIsOwnerWithdrawalOpen(false)}
        onSuccess={async () => { await fetchData(); setActiveTab('JOURNALS'); }}
      />

      <InternalTransferModal
        isOpen={isInternalTransferOpen}
        onClose={() => setIsInternalTransferOpen(false)}
        onSuccess={async () => { await fetchData(); setActiveTab('JOURNALS'); }}
      />

<CollectReceivableModal
        isOpen={collectModalData.isOpen}
        onClose={() => setCollectModalData({ ...collectModalData, isOpen: false })}
        onSuccess={fetchData}
        customer={collectModalData.customer}
      />

      <CustomerLedgerModal
        isOpen={ledgerModalReceivable.isOpen}
        onClose={() => setLedgerModalReceivable({ ...ledgerModalReceivable, isOpen: false })}
        customerPhone={ledgerModalReceivable.customerPhone}
        customerName={ledgerModalReceivable.customerName}
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

            <div className="flex justify-end space-x-3 mt-6">
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
    </div>
  );
}