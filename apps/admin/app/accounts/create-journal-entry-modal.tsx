import { useState, useMemo } from "react";
import { theme } from "@/lib/colors";
import { createJournalEntry } from "@/lib/api/accounting";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { numberToWords } from "@/lib/number-to-words";

export function CreateJournalEntryModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  accounts
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  accounts: any[];
}) {
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([{ accountId: "", debit: "", credit: "" }, { accountId: "", debit: "", credit: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalDebit = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0), [lines]);
  const totalCredit = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0), [lines]);

  const isValid = totalDebit === totalCredit && totalDebit > 0 && description.trim() !== "" && lines.every(l => l.accountId !== "");

  if (!isOpen) return null;

  const handleLineChange = (index: number, field: string, value: string) => {
    const newLines = [...lines];
    if (field === "debit" || field === "credit") {
      const val = value.replace(/\D/g, "");
      // Auto-zero the opposite column if a user types in one
      if (field === "debit" && val !== "") {
        newLines[index] = { ...newLines[index], debit: val, credit: "" };
      } else if (field === "credit" && val !== "") {
        newLines[index] = { ...newLines[index], credit: val, debit: "" };
      } else {
        newLines[index] = { ...newLines[index], [field]: val };
      }
    } else {
      newLines[index] = { ...newLines[index], [field]: value };
    }
    setLines(newLines);
  };

  const handleAddLine = () => {
    setLines([...lines, { accountId: "", debit: "", credit: "" }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return toast.error("A journal entry must have at least 2 lines");
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isValid) return toast.error("Please fill all required fields and ensure debits equal credits.");

    setIsSubmitting(true);
    try {
      const formattedLines = lines.map(l => ({
        accountId: l.accountId,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0
      })).filter(l => l.debit > 0 || l.credit > 0); // Must have value

      await createJournalEntry({ description, lines: formattedLines });
      toast.success("Journal entry recorded successfully!");
      
      setDescription("");
      setLines([{ accountId: "", debit: "", credit: "" }, { accountId: "", debit: "", credit: "" }]);
      
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.text.primary }}>Create Manual Journal Entry</h2>
        
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>Description / Memo</label>
            <input
              type="text"
              placeholder="e.g. Owner Capital Injection"
              className="w-full border rounded-md p-2 outline-none bg-transparent"
              style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium" style={{ color: theme.text.secondary }}>Journal Lines</label>
              <button 
                onClick={handleAddLine}
                className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                + Add Line
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 px-2">
                <div className="col-span-5 text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>Account</div>
                <div className="col-span-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary }}>Debit (Rs.)</div>
                <div className="col-span-3 text-xs font-medium uppercase tracking-wider text-right" style={{ color: theme.text.secondary }}>Credit (Rs.)</div>
                <div className="col-span-1"></div>
              </div>

              {lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded-md border border-gray-100">
                  <div className="col-span-5">
                    <select
                      className="w-full border rounded-md p-2 text-sm outline-none bg-white"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={line.accountId}
                      onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                    >
                      <option value="">Select Account...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm outline-none bg-white text-right"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={line.debit ? Number(line.debit).toLocaleString() : ""}
                      onChange={(e) => handleLineChange(idx, 'debit', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm outline-none bg-white text-right"
                      style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#e5e7eb' }}
                      value={line.credit ? Number(line.credit).toLocaleString() : ""}
                      onChange={(e) => handleLineChange(idx, 'credit', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={() => handleRemoveLine(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove Line"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t grid grid-cols-12 gap-3 px-2" style={{ borderColor: theme.borders?.light || '#e5e7eb' }}>
              <div className="col-span-5 text-right font-bold text-sm" style={{ color: theme.text.primary }}>Totals:</div>
              <div className="col-span-3 text-right font-bold text-sm" style={{ color: totalDebit === totalCredit ? 'inherit' : '#ef4444' }}>
                Rs. {totalDebit.toLocaleString()}
              </div>
              <div className="col-span-3 text-right font-bold text-sm" style={{ color: totalDebit === totalCredit ? 'inherit' : '#ef4444' }}>
                Rs. {totalCredit.toLocaleString()}
              </div>
              <div className="col-span-1"></div>
            </div>

            {totalDebit > 0 && totalDebit === totalCredit && (
               <p className="text-center text-xs mt-3 font-medium text-emerald-600">
                 Amount in words: {numberToWords(totalDebit)}
               </p>
            )}

            {totalDebit !== totalCredit && (
              <p className="text-center text-xs mt-3 font-medium text-red-500">
                Debits and Credits must balance. Difference: Rs. {Math.abs(totalDebit - totalCredit).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t" style={{ borderColor: theme.borders?.light || '#e5e7eb' }}>
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded-md font-medium text-sm transition-colors"
            style={{ color: theme.text.primary, borderColor: theme.borders?.medium || '#d1d5db' }}
          >
            Cancel
          </button>
          <AsyncButton 
            loading={isSubmitting} 
            disabled={!isValid}
            onClick={handleSubmit} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Post Journal Entry
          </AsyncButton>
        </div>
      </div>
    </div>
  );
}
