"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  manager: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
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
  branch: {
    id: string;
    name: string;
  };
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

export default function BranchDetailPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useParams<{ id: string }>();
  const branchId = typeof params?.id === "string" ? params.id : "UNKNOWN";
  const [branch, setBranch] = useState<Branch | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phoneNumber: "",
    managerId: "",
  });

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;

  // Role check: Sales Staff cannot access branch management
  useEffect(() => {
    if (user && user.role === UserRole.SALES_STAFF) {
      router.push("/");
    }
  }, [user, router]);

  // Role check: Manager can only view their own branch
  useEffect(() => {
    if (isManager && user?.branchId && branchId !== user.branchId) {
      router.push("/branches");
    }
  }, [isManager, user?.branchId, branchId, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, metricsRes] = await Promise.all([
          api.get(`/branches/${branchId}`),
          api.get(`/branches/${branchId}/metrics`),
        ]);
        setBranch(branchRes.data.branch);
        setMetrics(metricsRes.data);
        setFormData({
          name: branchRes.data.branch.name,
          city: branchRes.data.branch.city,
          address: branchRes.data.branch.address,
          phoneNumber: branchRes.data.branch.phoneNumber,
          managerId: branchRes.data.branch.manager?.id || "",
        });

        if (isAdmin) {
          const usersRes = await api.get("/auth/users");
          const managerUsers = usersRes.data.users.filter((u: any) => u.role === "MANAGER");
          setManagers(managerUsers);
        }
      } catch (err) {
        setError("Failed to load branch details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branchId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: any = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      };
      if (formData.managerId) {
        updateData.managerId = formData.managerId;
      } else {
        updateData.managerId = null;
      }

      const res = await api.put(`/branches/${branchId}`, updateData);
      setBranch(res.data);
      setIsEditing(false);
      toast.success("Branch updated successfully");
    } catch (err) {
      console.error("Failed to update branch:", err);
      toast.error("Failed to update branch");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>{error || "Branch not found"}</p>
          <Link
            href="/branches"
            className="mt-4 inline-block px-4 py-2 text-sm font-medium rounded"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Branches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              Branch Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              Branch ID: {branchId}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/branches"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Back
            </Link>
          </div>
        </div>

        {/* Info */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Branch Information
            </h2>
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm font-medium"
                style={{ color: theme.accents.primary }}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Manager
                  </label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">No Manager</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Info label="Branch ID" value={branch.id} />
              <Info label="Name" value={branch.name} />
              <Info label="City" value={branch.city} />
              <Info label="Address" value={branch.address} />
              <Info label="Phone Number" value={branch.phoneNumber} />
              <Info label="Manager" value={branch.manager ? branch.manager.fullName : "—"} />
              <Info label="Staff Count" value={branch.users.length.toString()} />
              <Info label="Created At" value={new Date(branch.createdAt).toLocaleString()} />
            </div>
          )}
        </div>

        {/* Metrics */}
        {metrics && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: theme.backgrounds.primary,
              border: `1px solid ${theme.borders.light}`,
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
              Performance Metrics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Inventory
                </p>
                <p className="font-medium" style={{ color: theme.text.primary }}>
                  {metrics.metrics.inventory.bikes} bikes, {metrics.metrics.inventory.parts} parts
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Staff
                </p>
                <p className="font-medium" style={{ color: theme.text.primary }}>
                  {metrics.metrics.staff} members
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Total Orders
                </p>
                <p className="font-medium" style={{ color: theme.text.primary }}>
                  {metrics.metrics.orders.total}
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Total Revenue
                </p>
                <p className="font-medium" style={{ color: theme.text.primary }}>
                  PKR {metrics.metrics.revenue.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Staff */}
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>
            Staff Members
          </h2>

          {branch.users.length === 0 ? (
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              No staff members assigned to this branch.
            </p>
          ) : (
            <div className="space-y-2">
              {branch.users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between border-b pb-2"
                  style={{ borderColor: theme.borders.light }}
                >
                  <span style={{ color: theme.text.primary }}>{user.fullName}</span>
                  <span style={{ color: theme.text.secondary }}>
                    {user.role} - {user.status}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>
        {label}
      </p>
      <p className="font-medium" style={{ color: theme.text.primary }}>
        {value}
      </p>
    </div>
  );
}
