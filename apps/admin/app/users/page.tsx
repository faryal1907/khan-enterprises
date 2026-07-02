"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { UserStatusBadge } from "@/components/user-status-badge";
import { getBranches } from "@/lib/api/inventory";
import { activateUser, deactivateUser, getUsers, type UserFilters } from "@/lib/api/users";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { Branch, UserRole } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type StaffUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  branchId: string | null;
  branch: {
    id: string;
    name: string;
    city: string;
  } | null;
  vendor: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
};

type PendingAction = {
  type: "activate" | "deactivate";
  user: StaffUser;
} | null;

function getBranchLabel(user: StaffUser) {
  return user.branch ? `${user.branch.name} (${user.branch.city})` : "Global";
}

export default function UsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    branchId: "",
    search: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [processingAction, setProcessingAction] = useState<"activate" | "deactivate" | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      router.replace("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    getBranches()
      .then((data) => setBranches(data.branches || []))
      .catch(() => setBranches([]));
  }, []);

  const requestFilters = useMemo<UserFilters>(() => ({
    role: filters.role || undefined,
    status: filters.status || undefined,
    branchId: filters.branchId || undefined,
    search: debouncedSearch || undefined,
  }), [debouncedSearch, filters.branchId, filters.role, filters.status]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUsers(requestFilters);
      setUsers(response.users || []);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [requestFilters]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) return;
    fetchUsers();
  }, [currentUser, fetchUsers]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setProcessingAction(pendingAction.type);
    try {
      if (pendingAction.type === "activate") {
        await activateUser(pendingAction.user.id);
        toast.success("User activated");
      } else {
        await deactivateUser(pendingAction.user.id);
        toast.success("User deactivated");
      }

      setPendingAction(null);
      await fetchUsers();
    } catch (actionError: any) {
      toast.error(actionError.response?.data?.message || `Failed to ${pendingAction.type} user`);
    } finally {
      setProcessingAction(null);
    }
  };

  if (currentUser && currentUser.role !== UserRole.ADMIN) return null;

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
              User Management
            </h1>
            <p className="mt-1 text-sm md:text-base" style={{ color: theme.text.secondary }}>
              Manage staff accounts, roles, branch scope, and access status.
            </p>
          </div>

          <Link
            href="/users/new"
            className="px-4 py-2 text-sm font-medium rounded text-center"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
          >
            Create Staff Account
          </Link>
        </div>

        <div
          className="rounded-lg p-4 md:p-5 mb-4 md:mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Role
              </label>
              <select
                value={filters.role}
                onChange={(event) => handleFilterChange("role", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="SALES_STAFF">Sales Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(event) => handleFilterChange("status", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Branch
              </label>
              <select
                value={filters.branchId}
                onChange={(event) => handleFilterChange("branchId", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Search
              </label>
              <input
                value={filters.search}
                onChange={(event) => handleFilterChange("search", event.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
                placeholder="Name, email, phone"
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-lg overflow-x-auto"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                {["Name", "Email", "Role", "Scope", "Vendor", "Status", "Created", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.text.secondary }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 md:px-6 py-6 md:py-12 text-center text-sm md:text-base" style={{ color: theme.text.secondary }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b" style={{ borderColor: theme.borders.light }}>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs" style={{ color: theme.text.secondary }}>{user.phoneNumber || "-"}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>{user.email}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>{user.role}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>{getBranchLabel(user)}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.primary }}>
                      {user.role === "SALES_STAFF" ? user.vendor?.name || "-" : "-"}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: theme.text.secondary }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <Link href={`/users/${user.id}`} className="font-medium hover:opacity-70" style={{ color: theme.accents.primary }}>
                          View
                        </Link>
                        {user.id === currentUser?.id ? (
                          <span className="text-xs italic" style={{ color: theme.text.muted }}>
                            Current User
                          </span>
                        ) : user.status === "ACTIVE" ? (
                          <button
                            onClick={() => setPendingAction({ type: "deactivate", user })}
                            className="font-medium hover:opacity-70"
                            style={{ color: theme.accents.secondary }}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => setPendingAction({ type: "activate", user })}
                            className="font-medium hover:opacity-70"
                            style={{ color: theme.accents.tertiary }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pendingAction && (
        <ActionModal
          title={pendingAction.type === "activate" ? "Confirm Activation" : "Confirm Deactivation"}
          onClose={() => {
            if (!processingAction) setPendingAction(null);
          }}
        >
          <p className="text-sm mb-4 md:mb-6" style={{ color: theme.text.secondary }}>
            {pendingAction.type === "activate"
              ? `Activate ${pendingAction.user.fullName}? They will regain access based on their role.`
              : `Deactivate ${pendingAction.user.fullName}? They will immediately lose access to the system.`}
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setPendingAction(null)}
              disabled={Boolean(processingAction)}
              className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Cancel
            </button>
            <AsyncButton
              onClick={handleConfirmAction}
              loading={processingAction === pendingAction.type}
              loadingLabel={pendingAction.type === "activate" ? "Activating..." : "Deactivating..."}
              style={{ backgroundColor: pendingAction.type === "activate" ? theme.accents.primary : theme.accents.secondary }}
            >
              {pendingAction.type === "activate" ? "Activate User" : "Deactivate User"}
            </AsyncButton>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
