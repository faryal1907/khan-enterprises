import { useCallback, useEffect, useMemo, useState } from "react";
import { getExpenses } from "@/lib/api/expenses";
import { Expense, UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { SummaryCard } from "@/components/summary-card";
import { AsyncButton } from "@/components/async-button";
import { AddExpenseModal } from "@/components/add-expense-modal";

interface ExpensesTabProps {
  branches: any[];
}

export function ExpensesTab({ branches }: ExpensesTabProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isBranchScoped = (!isAdmin && !isManager) ? true : (isManager && Boolean(user?.branchId));
  
  const canAddExpense = isAdmin || isManager;

  const [filters, setFilters] = useState({
    branch: isBranchScoped ? user?.branchId || "" : "",
    dateFrom: "",
    dateTo: "",
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requestFilters = useMemo(() => ({
    branchId: filters.branch || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  }), [filters]);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const data = await getExpenses(requestFilters);
      setExpenses(data || []);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [requestFilters, user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const summary = useMemo(() => {
    return {
      total: expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0),
      count: expenses.length,
    };
  }, [expenses]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "branch" && isBranchScoped) return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3">
          <SummaryCard label="Total Expenses" value={`PKR ${summary.total.toLocaleString()}`} color="#ef4444" />
          <SummaryCard label="Records" value={summary.count} />
        </div>
        {canAddExpense && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 self-start"
            style={{
              backgroundColor: theme.accents.primary,
              color: "#fff",
            }}
          >
            Add Expense
          </button>
        )}
      </div>

      <div
        className="rounded-lg p-4 mb-6"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              Branch
            </label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              disabled={isBranchScoped}
              className="w-full px-3 py-2 rounded text-sm disabled:opacity-60"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-lg overflow-x-auto"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
              {["Date", "Branch", "Category", "Amount", "Description", "Recorded By"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                  Loading expenses...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                  <div className="flex flex-col items-center gap-3">
                    <span>{error}</span>
                    <AsyncButton onClick={fetchExpenses}>Retry</AsyncButton>
                  </div>
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                  No expenses found
                </td>
              </tr>
            ) : expenses.map((expense) => (
              <tr key={expense.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                  {expense.branch?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: `${theme.accents.primary}20`,
                      color: theme.accents.primary,
                      border: `1px solid ${theme.accents.primary}`,
                    }}
                  >
                    {expense.category.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-red-500">
                  PKR {Number(expense.amount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: theme.text.secondary }}>
                  {expense.description || "-"}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                  {expense.recordedBy?.fullName || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchExpenses}
        defaultBranchId={isBranchScoped ? user?.branchId : null}
      />
    </div>
  );
}
