"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { deleteBranch, getBranches } from "@/lib/api/branches";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { UserRole } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phoneNumber: string | null;
  createdAt: string;
  manager: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  } | null;
  _count: {
    users: number;
    bikeInventory: number;
    partInventory: number;
  };
};

export default function BranchesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;

  useEffect(() => {
    if (user && user.role === UserRole.SALES_STAFF) {
      router.replace("/");
    }
  }, [router, user]);

  const fetchBranches = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const response = await getBranches();
      setBranches(response.branches || []);
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load branches");
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role === UserRole.SALES_STAFF) return;
    fetchBranches();
  }, [fetchBranches, user]);

  const visibleBranches = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return branches;

    return branches.filter((branch) => (
      branch.name.toLowerCase().includes(query) ||
      branch.city.toLowerCase().includes(query) ||
      branch.address.toLowerCase().includes(query) ||
      branch.manager?.fullName.toLowerCase().includes(query)
    ));
  }, [branches, debouncedSearch]);

  const confirmDelete = async () => {
    if (!branchToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBranch(branchToDelete.id);
      toast.success("Branch deleted");
      setBranchToDelete(null);
      await fetchBranches();
    } catch (deleteError: any) {
      toast.error(deleteError.response?.data?.message || "Failed to delete branch");
    } finally {
      setIsDeleting(false);
    }
  };

  if (user && user.role === UserRole.SALES_STAFF) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              {isAdmin ? "Branch Management" : "My Branch"}
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              {isAdmin ? "Manage branch locations and performance." : "View branch details and performance."}
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/branches/new"
              className="px-4 py-2 text-sm font-medium rounded text-center"
              style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
            >
              Add Branch
            </Link>
          )}
        </div>

        <div
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
            Search Branches
          </label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full px-3 py-2 rounded text-sm"
            style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }}
            placeholder="Name, city, address, manager"
          />
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          {loading ? (
            <div className="p-8 text-center" style={{ color: theme.text.secondary }}>
              Loading branches...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="mb-4" style={{ color: theme.accents.secondary }}>{error}</p>
              <AsyncButton onClick={fetchBranches}>Retry</AsyncButton>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                  {["Name", "Location", "Manager", "Staff", "Inventory", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.text.secondary }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleBranches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                      No branches found
                    </td>
                  </tr>
                ) : (
                  visibleBranches.map((branch) => (
                    <tr key={branch.id} className="border-b" style={{ borderColor: theme.borders.light }}>
                      <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-xs" style={{ color: theme.text.secondary }}>{branch.phoneNumber || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                        <div>{branch.city}</div>
                        <div className="text-xs" style={{ color: theme.text.secondary }}>{branch.address}</div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                        {branch.manager ? branch.manager.fullName : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>{branch._count.users}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                        {branch._count.bikeInventory} bikes, {branch._count.partInventory} parts
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <Link href={`/branches/${branch.id}`} className="font-medium hover:opacity-70" style={{ color: theme.accents.primary }}>
                            View
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => setBranchToDelete(branch)}
                              className="font-medium hover:opacity-70"
                              style={{ color: theme.accents.secondary }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {branchToDelete && (
        <ActionModal
          title="Confirm Deletion"
          onClose={() => {
            if (!isDeleting) setBranchToDelete(null);
          }}
        >
          <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
            Delete {branchToDelete.name}? Branches with staff, inventory, or orders cannot be deleted.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBranchToDelete(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Cancel
            </button>
            <AsyncButton
              onClick={confirmDelete}
              loading={isDeleting}
              loadingLabel="Deleting..."
              style={{ backgroundColor: theme.accents.secondary }}
            >
              Delete Branch
            </AsyncButton>
          </div>
        </ActionModal>
      )}
    </div>
  );
}
