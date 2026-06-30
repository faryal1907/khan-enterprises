"use client";

import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { getAccounts, getJournalEntries, getPurchaseOrders, getPayables, payPayable, receivePurchaseOrder } from "@/lib/api/accounting";
import { toast } from "sonner";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/lib/firebase";
import { AsyncButton } from "@/components/async-button";
import { CreatePOModal } from "./create-po-modal";
import { PayPayableModal } from "./pay-payable-modal";
import { CreateJournalEntryModal } from "./create-journal-entry-modal";

type Tab = 'OVERVIEW' | 'JOURNALS' | 'PURCHASE_ORDERS' | 'PAYABLES';

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [payModalData, setPayModalData] = useState<{ isOpen: boolean; payableId: string; amount: number }>({
    isOpen: false,
    payableId: "",
    amount: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accData, journalData, poData, payableData] = await Promise.all([
        getAccounts(),
        getJournalEntries(),
        getPurchaseOrders(),
        getPayables()
      ]);
      setAccounts(accData);
      setJournals(journalData);
      setPurchaseOrders(poData);
      setPayables(payableData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load accounting data");
    } finally {
      setLoading(false);
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



  if (loading) {
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
        {(['OVERVIEW', 'JOURNALS', 'PURCHASE_ORDERS', 'PAYABLES'] as Tab[]).map(tab => (
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        {activeTab === 'OVERVIEW' && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }} >Chart of Accounts</h2>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr style={{ backgroundColor: theme.backgrounds?.secondary }}>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Code</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Name</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Category</th>
                  <th className="p-3 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{acc.code}</td>
                    <td className="p-3" style={{ color: theme.text.primary }}>{acc.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {acc.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold" style={{ color: theme.text.primary }}>{formatCurrency(acc.balance || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'JOURNALS' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Journal Entries</h2>
              <button 
                onClick={() => setIsJournalModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
              >
                + Create Journal Entry
              </button>
            </div>
            <div className="space-y-4">
              {journals.map(je => (
                <div key={je.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold" style={{ color: theme.text.primary }}>{je.entryNo}</span>
                    <span className="text-sm" style={{ color: theme.text.secondary }}>{new Date(je.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: theme.text.secondary }}>{je.description}</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-1 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Account</th>
                        <th className="pb-1 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Debit</th>
                        <th className="pb-1 text-right font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {je.lines.map((line: any) => (
                        <tr key={line.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2" style={{ color: theme.text.primary }}>{line.account?.name || line.accountId}</td>
                          <td className="py-2 text-right" style={{ color: theme.text.primary }}>{Number(line.debit) > 0 ? formatCurrency(line.debit) : '-'}</td>
                          <td className="py-2 text-right" style={{ color: theme.text.primary }}>{Number(line.credit) > 0 ? formatCurrency(line.credit) : '-'}</td>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>Purchase Orders</h2>
              <button 
                onClick={() => setIsPOModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
              >
                + Create PO
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr style={{ backgroundColor: theme.backgrounds?.secondary }}>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>PO Number</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Vendor</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Total Cost</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Status</th>
                  <th className="p-3 font-medium uppercase tracking-wider text-xs" style={{ color: theme.text.secondary }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map(po => (
                  <tr key={po.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
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
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
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
        )}

        {activeTab === 'PAYABLES' && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>Accounts Payable</h2>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr style={{ backgroundColor: theme.backgrounds?.secondary }}>
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
                  <tr key={payable.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium" style={{ color: theme.text.primary }}>{payable.ref}</td>
                    <td className="p-3" style={{ color: theme.text.primary }}>{payable.partyName}</td>
                    <td className="p-3 text-right" style={{ color: theme.text.primary }}>{formatCurrency(payable.total)}</td>
                    <td className="p-3 text-right font-semibold text-red-600">
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
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-sm"
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
    </div>
  );
}
