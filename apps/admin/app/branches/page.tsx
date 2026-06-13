"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
  manager: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
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
  const [error, setError] = useState<string | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;

  // Role check: Sales Staff cannot access branch management
  useEffect(() => {
    if (user && user.role === UserRole.SALES_STAFF) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get("/branches");
        let allBranches = res.data.branches;

        // If manager, filter to show only their branch
        if (isManager && user?.branchId) {
          allBranches = allBranches.filter((b: Branch) => b.id === user.branchId);
        }

        setBranches(allBranches);
      } catch (err) {
        setError("Failed to load branches");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [isManager, user?.branchId]);

  const confirmDelete = async () => {
    if (!branchToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`/branches/${branchToDelete}`);
      setBranches(branches.filter((b) => b.id !== branchToDelete));
      toast.success("Branch deleted successfully");
    } catch (err) {
      console.error("Failed to delete branch:", err);
      toast.error("Failed to delete branch");
    } finally {
      setIsDeleting(false);
      setBranchToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p style={{ color: theme.text.secondary }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              {isAdmin ? "Branch Management" : "My Branch"}
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              {isAdmin ? "Manage branch locations and performance" : "View your branch details"}
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/branches/new"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Add Branch
            </Link>
          )}
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: theme.text.secondary }}>
                    No branches found
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr
                    key={branch.id}
                    className="border-b"
                    style={{ borderColor: theme.borders.light }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branch.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branch.city}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branch.manager ? branch.manager.fullName : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branch._count.users}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: theme.text.primary }}>
                      {branch._count.bikeInventory} bikes, {branch._count.partInventory} parts
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link href={`/branches/${branch.id}`}>
                          <button
                            className="font-medium hover:opacity-70"
                            style={{ color: theme.accents.primary }}
                          >
                            View
                          </button>
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => setBranchToDelete(branch.id)}
                            className="font-medium hover:opacity-70 ml-4"
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setBranchToDelete(null)}
          ></div>
          <div
            className="relative w-full max-w-md p-6 rounded-lg shadow-xl"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
              Confirm Deletion
            </h3>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Are you sure you want to delete this branch? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: "#fff",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
