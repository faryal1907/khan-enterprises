"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionModal } from "./action-modal";
import { AsyncButton } from "./async-button";
import { theme } from "@/lib/colors";
import { createExpense, getPayeeAccounts, createPayeeAccount, PayeeAccount, PayeeType } from "@/lib/api/expenses";
import { getAccounts } from "@/lib/api/accounting";
import { ExpenseCategory, Branch, UserRole } from "@/lib/types";
import { getBranches } from "@/lib/api/inventory";
import { useAuthStore } from "@/lib/auth-store";

const PAYEE_TYPE_LABELS: Record<PayeeType, string> = {
  VENDOR: 'Vendor',
  EMPLOYEE: 'Employee',
  SUPPLIER: 'Supplier',
  LANDLORD: 'Landlord',
  UTILITY_COMPANY: 'Utility Company',
  CONTRACTOR: 'Contractor',
  OTHER: 'Other',
};

const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
  payeeAccountId: z.string().min(1, "Pay To is required"),
  payNow: z.boolean(),
  paymentAccountId: z.string().optional(),
}).refine(
  (data) => !data.payNow || (data.paymentAccountId && data.paymentAccountId.length > 0),
  { message: "Payment account is required when paying now", path: ["paymentAccountId"] }
);

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultBranchId?: string | null;
}

export function AddExpenseModal({ isOpen, onClose, onSuccess, defaultBranchId }: AddExpenseModalProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [payees, setPayees] = useState<PayeeAccount[]>([]);

  // Payee search
  const [payeeSearch, setPayeeSearch] = useState("");
  const [showPayeeDropdown, setShowPayeeDropdown] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<PayeeAccount | null>(null);
  const payeeInputRef = useRef<HTMLInputElement>(null);

  // Inline payee creation
  const [showCreatePayee, setShowCreatePayee] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState("");
  const [newPayeeType, setNewPayeeType] = useState<PayeeType>("OTHER");
  const [newPayeePhone, setNewPayeePhone] = useState("");
  const [isCreatingPayee, setIsCreatingPayee] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: ExpenseCategory.OTHER,
      description: "",
      branchId: defaultBranchId || "",
      payeeAccountId: "",
      payNow: false,
      paymentAccountId: "",
    },
  });

  const payNow = watch("payNow");

  useEffect(() => {
    if (isOpen) {
      getBranches()
        .then((data) => setBranches(data.branches || []))
        .catch(() => setBranches([]));

      getAccounts()
        .then((data) =>
          setAccounts(
            data.filter(
              (a: any) =>
                a.category === "ASSET" &&
                ["CASH", "BANK", "EWALLET"].includes(a.subtype) &&
                a.isActive
            )
          )
        )
        .catch(() => setAccounts([]));

      getPayeeAccounts()
        .then(setPayees)
        .catch(() => setPayees([]));

      reset({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: ExpenseCategory.OTHER,
        description: "",
        branchId: defaultBranchId || "",
        payeeAccountId: "",
        payNow: false,
        paymentAccountId: "",
      });
      setSelectedPayee(null);
      setPayeeSearch("");
      setShowCreatePayee(false);
    }
  }, [isOpen, reset, defaultBranchId]);

  const filteredPayees = payees.filter((p) =>
    p.name.toLowerCase().includes(payeeSearch.toLowerCase()) ||
    PAYEE_TYPE_LABELS[p.type].toLowerCase().includes(payeeSearch.toLowerCase())
  );

  const handleSelectPayee = (payee: PayeeAccount) => {
    setSelectedPayee(payee);
    setValue("payeeAccountId", payee.id, { shouldValidate: true });
    setPayeeSearch(payee.name);
    setShowPayeeDropdown(false);
  };

  const handleClearPayee = () => {
    setSelectedPayee(null);
    setValue("payeeAccountId", "", { shouldValidate: false });
    setPayeeSearch("");
    setTimeout(() => payeeInputRef.current?.focus(), 50);
  };

  const handleCreatePayee = async () => {
    if (!newPayeeName.trim()) return toast.error("Payee name is required");
    setIsCreatingPayee(true);
    try {
      const payee = await createPayeeAccount({
        name: newPayeeName.trim(),
        type: newPayeeType,
        phone: newPayeePhone.trim() || undefined,
      });
      setPayees((prev) => [...prev, payee].sort((a, b) => a.name.localeCompare(b.name)));
      handleSelectPayee(payee);
      setShowCreatePayee(false);
      setNewPayeeName("");
      setNewPayeeType("OTHER");
      setNewPayeePhone("");
      toast.success(`Payee "${payee.name}" created`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create payee");
    } finally {
      setIsCreatingPayee(false);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await createExpense({
        amount: data.amount,
        date: new Date(data.date).toISOString(),
        category: data.category,
        description: data.description,
        branchId: data.branchId,
        payeeAccountId: data.payeeAccountId,
        payNow: data.payNow,
        paymentAccountId: data.payNow ? data.paymentAccountId : undefined,
      });
      toast.success("Expense added successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  if (!isOpen) return null;

  return (
    <ActionModal onClose={onClose} title="Add Expense" className="flex flex-col max-h-[90vh]">
      <p className="text-sm mb-4 shrink-0" style={{ color: theme.text.secondary }}>
        Record a new business expense with a payee.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto flex-1 pr-1">

        {/* ── Pay To (Payee) ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Pay To <span className="text-red-500">*</span>
          </label>
          {selectedPayee ? (
            <div
              className="flex items-center justify-between px-3 py-2 rounded border"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                borderColor: theme.borders.medium,
              }}
            >
              <div>
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  {selectedPayee.name}
                </span>
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}
                >
                  {PAYEE_TYPE_LABELS[selectedPayee.type]}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearPayee}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                ref={payeeInputRef}
                type="text"
                placeholder="Search by name or type..."
                value={payeeSearch}
                onChange={(e) => {
                  setPayeeSearch(e.target.value);
                  setShowPayeeDropdown(true);
                }}
                onFocus={() => setShowPayeeDropdown(true)}
                onBlur={() => setTimeout(() => setShowPayeeDropdown(false), 150)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${errors.payeeAccountId ? theme.accents.error : theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
              {showPayeeDropdown && (
                <div
                  className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
                  style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light, maxHeight: '200px', overflowY: 'auto' }}
                >
                  {filteredPayees.length === 0 && !payeeSearch && (
                    <div className="px-3 py-2 text-sm" style={{ color: theme.text.muted }}>
                      No payees yet — type to create one
                    </div>
                  )}
                  {filteredPayees.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                      onMouseDown={() => handleSelectPayee(p)}
                    >
                      <span className="text-sm" style={{ color: theme.text.primary }}>{p.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${theme.accents.primary}15`, color: theme.accents.primary }}>
                        {PAYEE_TYPE_LABELS[p.type]}
                      </span>
                    </button>
                  ))}
                  {payeeSearch && filteredPayees.length === 0 && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onMouseDown={() => {
                        setNewPayeeName(payeeSearch);
                        setShowCreatePayee(true);
                        setShowPayeeDropdown(false);
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: theme.accents.primary }}>
                        + Create "{payeeSearch}"
                      </span>
                    </button>
                  )}
                  {payeeSearch === '' && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 border-t"
                      style={{ borderColor: theme.borders.light }}
                      onMouseDown={() => {
                        setShowCreatePayee(true);
                        setShowPayeeDropdown(false);
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: theme.accents.primary }}>
                        + Add New Payee
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Hidden input for form validation */}
          <input type="hidden" {...register("payeeAccountId")} />
          {errors.payeeAccountId && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.payeeAccountId.message}
            </p>
          )}
        </div>

        {/* ── Inline Create Payee ── */}
        {showCreatePayee && (
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
          >
            <div className="text-sm font-semibold" style={{ color: theme.text.primary }}>Create New Payee</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Name *</label>
                <input
                  type="text"
                  value={newPayeeName}
                  onChange={(e) => setNewPayeeName(e.target.value)}
                  placeholder="e.g. Muhammad Ali Khan"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Type</label>
                <select
                  value={newPayeeType}
                  onChange={(e) => setNewPayeeType(e.target.value as PayeeType)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                >
                  {(Object.keys(PAYEE_TYPE_LABELS) as PayeeType[]).map((t) => (
                    <option key={t} value={t}>{PAYEE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: theme.text.secondary }}>Phone (optional)</label>
                <input
                  type="text"
                  value={newPayeePhone}
                  onChange={(e) => setNewPayeePhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <AsyncButton
                type="button"
                loading={isCreatingPayee}
                onClick={handleCreatePayee}
                className="px-4 py-1.5 text-sm font-semibold rounded text-white"
                style={{ backgroundColor: theme.accents.primary }}
              >
                Create & Select
              </AsyncButton>
              <button
                type="button"
                onClick={() => { setShowCreatePayee(false); setNewPayeeName(""); }}
                className="px-3 py-1.5 text-sm rounded border"
                style={{ color: theme.text.secondary, borderColor: theme.borders.medium }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Branch ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Branch
          </label>
          <select
            {...register("branchId")}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.branchId ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
          >
            {isAdmin && <option value="">Select Branch</option>}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.branchId && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>{errors.branchId.message}</p>
          )}
        </div>

        {/* ── Amount ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Amount (PKR)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.amount ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
          />
          {errors.amount && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>{errors.amount.message}</p>
          )}
        </div>

        {/* ── Date ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Date
          </label>
          <input
            type="date"
            {...register("date")}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.date ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
          />
          {errors.date && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>{errors.date.message}</p>
          )}
        </div>

        {/* ── Category ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Category
          </label>
          <select
            {...register("category")}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.category ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
          >
            {Object.values(ExpenseCategory).map((cat) => (
              <option key={cat} value={cat}>{cat.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* ── Description ── */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.description ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
            placeholder="Details about this expense..."
          />
        </div>

        {/* ── Pay now toggle ── */}
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
        >
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("payNow")}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <div>
              <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                Pay now
              </span>
              <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>
                {payNow
                  ? "Payment will be recorded immediately against your selected account."
                  : "Expense will be recorded as unpaid (accounts payable). Pay it later from the Payables tab."}
              </p>
            </div>
          </label>
        </div>

        {/* ── Payment Account — shown only when paying now ── */}
        {payNow && (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Payment Account
            </label>
            <select
              {...register("paymentAccountId")}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${errors.paymentAccountId ? theme.accents.error : theme.borders.medium}`,
                color: theme.text.primary,
              }}
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.code})
                </option>
              ))}
            </select>
            {errors.paymentAccountId && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
                {errors.paymentAccountId.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: "transparent",
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Cancel
          </button>
          <AsyncButton
            type="submit"
            loading={isSubmitting}
            loadingLabel="Adding..."
            style={{ backgroundColor: theme.accents.primary, color: "#fff" }}
          >
            Add Expense
          </AsyncButton>
        </div>
      </form>
    </ActionModal>
  );
}
