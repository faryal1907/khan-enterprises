import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionModal } from "./action-modal";
import { AsyncButton } from "./async-button";
import { theme } from "@/lib/colors";
import { createExpense } from "@/lib/api/expenses";
import { getAccounts } from "@/lib/api/accounting";
import { ExpenseCategory, Branch, UserRole } from "@/lib/types";
import { getBranches } from "@/lib/api/inventory";
import { useAuthStore } from "@/lib/auth-store";

const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
  paymentAccountId: z.string().min(1, "Payment Account is required"),
});

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: ExpenseCategory.OTHER,
      description: "",
      branchId: defaultBranchId || "",
      paymentAccountId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      getBranches()
        .then((data) => setBranches(data.branches || []))
        .catch(() => setBranches([]));
      
      getAccounts()
        .then((data) => setAccounts(data.filter((a: any) => a.category === 'ASSET' && ['CASH', 'BANK', 'EWALLET'].includes(a.subtype) && a.isActive)))
        .catch(() => setAccounts([]));
      
      reset({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: ExpenseCategory.OTHER,
        description: "",
        branchId: defaultBranchId || "",
        paymentAccountId: "",
      });
    }
  }, [isOpen, reset, defaultBranchId]);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await createExpense({
        ...data,
        date: new Date(data.date).toISOString(),
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
    <ActionModal
      onClose={onClose}
      title="Add Expense"
    >
      <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
        Record a new business expense.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.branchId && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.branchId.message}
            </p>
          )}
        </div>

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
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.amount.message}
            </p>
          )}
        </div>

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
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.date.message}
            </p>
          )}
        </div>

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
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              border: `1px solid ${errors.description ? theme.accents.error : theme.borders.medium}`,
              color: theme.text.primary,
            }}
            placeholder="Details about this expense..."
          />
          {errors.description && (
            <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
              {errors.description.message}
            </p>
          )}
        </div>

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
            style={{
              backgroundColor: theme.accents.primary,
              color: "#fff",
            }}
          >
            Add Expense
          </AsyncButton>
        </div>
      </form>
    </ActionModal>
  );
}
