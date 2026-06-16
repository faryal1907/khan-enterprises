"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { SummaryCard } from "@/components/summary-card";
import { getBranchById, getBranchMetrics, updateBranch } from "@/lib/api/branches";
import { getUsers } from "@/lib/api/users";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { UserRole } from "@/lib/types";

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  manager: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  } | null;
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
  }>;
  _count: {
    bikeInventory: number;
    partInventory: number;
    orders: number;
  };
};

type Metrics = {
  metrics: {
    inventory: {
      bikes: number;
      parts: number;
    };
    staff: number;
    orders: {
      total: number;
      completed: number;
      pending: number;
      recent: number;
    };
    revenue: {
      total: number;
      averageOrderValue: number;
    };
  };
};

type Manager = {
  id: string;
  fullName: string;
  email: string;
  branchId: string | null;
};

const inputStyle = {
  backgroundColor: theme.backgrounds.tertiary,
  border: `1px solid ${theme.borders.medium}`,
  color: theme.text.primary,
};

export default function BranchDetailPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useParams<{ id: string }>();
  const branchId = params.id;
  const [branch, setBranch] = useState<Branch | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phoneNumber: "",
    managerId: "",
  });

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;

  useEffect(() => {
    if (user && user.role === UserRole.SALES_STAFF) {
      router.replace("/");
    }
  }, [router, user]);

  useEffect(() => {
    if (isManager && user?.branchId && branchId !== user.branchId) {
      router.replace("/branches");
    }
  }, [branchId, isManager, router, user?.branchId]);

  const fillForm = (branchData: Branch) => {
    setFormData({
      name: branchData.name || "",
      city: branchData.city || "",
      address: branchData.address || "",
      phoneNumber: branchData.phoneNumber || "",
      managerId: branchData.manager?.id || "",
    });
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    if (isManager && user.branchId && branchId !== user.branchId) return;

    setLoading(true);
    setError("");

    try {
      const [branchResponse, metricsResponse] = await Promise.all([
        getBranchById(branchId),
        getBranchMetrics(branchId),
      ]);
      setBranch(branchResponse.branch);
      setMetrics(metricsResponse);
      fillForm(branchResponse.branch);

      if (isAdmin) {
        const usersResponse = await getUsers({ role: UserRole.MANAGER, status: "ACTIVE" });
        setManagers(usersResponse.users || []);
      }
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load branch details");
      setBranch(null);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [branchId, isAdmin, isManager, user]);

  useEffect(() => {
    if (!user || user.role === UserRole.SALES_STAFF) return;
    fetchData();
  }, [fetchData, user]);

  const resetForm = () => {
    if (branch) fillForm(branch);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdating(true);

    try {
      await updateBranch(branchId, {
        name: formData.name.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        managerId: formData.managerId || null,
      });
      await fetchData();
      setIsEditing(false);
      toast.success("Branch updated");
    } catch (updateError: any) {
      toast.error(updateError.response?.data?.message || "Failed to update branch");
    } finally {
      setUpdating(false);
    }
  };

  if (user && user.role === UserRole.SALES_STAFF) return null;

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading branch details...</p>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p className="mb-4" style={{ color: error ? theme.accents.secondary : theme.text.secondary }}>
            {error || "Branch not found"}
          </p>
          <div className="flex gap-3">
            <AsyncButton onClick={fetchData}>Retry</AsyncButton>
            <Link
              href="/branches"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Back to Branches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Branch Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              View branch staff, inventory, and performance.
            </p>
          </div>

          <Link
            href="/branches"
            className="px-4 py-2 text-sm font-medium rounded"
            style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
          >
            Back
          </Link>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Branch Information
            </h2>
            {isAdmin && (
              <button
                onClick={() => {
                  if (isEditing) resetForm();
                  setIsEditing(!isEditing);
                }}
                disabled={updating}
                className="text-sm font-medium disabled:opacity-50"
                style={{ color: theme.accents.primary }}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Name *">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                    required
                  />
                </FormField>
                <FormField label="City *">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                    required
                  />
                </FormField>
                <FormField label="Address *">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                    required
                  />
                </FormField>
                <FormField label="Phone Number">
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Manager">
                  <select
                    value={formData.managerId}
                    onChange={(event) => setFormData({ ...formData, managerId: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                  >
                    <option value="">No Manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.fullName} ({manager.email}){manager.branchId ? " - branch scoped" : " - global"}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="mt-4 flex gap-2">
                <AsyncButton type="submit" loading={updating} loadingLabel="Saving...">
                  Save Changes
                </AsyncButton>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsEditing(false);
                  }}
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                  style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Branch ID" value={branch.id} />
              <Info label="Name" value={branch.name} />
              <Info label="City" value={branch.city} />
              <Info label="Address" value={branch.address} />
              <Info label="Phone Number" value={branch.phoneNumber || "-"} />
              <Info label="Manager" value={branch.manager?.fullName || "-"} />
              <Info label="Staff Count" value={branch.users.length.toString()} />
              <Info label="Created At" value={new Date(branch.createdAt).toLocaleString()} />
            </div>
          )}
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Inventory" value={`${metrics.metrics.inventory.bikes} bikes / ${metrics.metrics.inventory.parts} parts`} />
            <SummaryCard label="Staff" value={metrics.metrics.staff} />
            <SummaryCard label="Orders" value={metrics.metrics.orders.total} />
            <SummaryCard label="Revenue" value={`PKR ${metrics.metrics.revenue.total.toLocaleString()}`} />
          </div>
        )}

        <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
            Staff Members
          </h2>

          {branch.users.length === 0 ? (
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              No staff members assigned to this branch.
            </p>
          ) : (
            <div className="space-y-2">
              {branch.users.map((staff) => (
                <div key={staff.id} className="flex justify-between border-b pb-2" style={{ borderColor: theme.borders.light }}>
                  <span style={{ color: theme.text.primary }}>{staff.fullName}</span>
                  <span style={{ color: theme.text.secondary }}>
                    {staff.role} - {staff.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
        {label}
      </p>
      <p className="font-medium break-all" style={{ color: theme.text.primary }}>
        {value}
      </p>
    </div>
  );
}
