"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionModal } from "@/components/action-modal";
import { AsyncButton } from "@/components/async-button";
import { UserStatusBadge } from "@/components/user-status-badge";
import { getBranches, getVendors } from "@/lib/api/inventory";
import { activateUser, deactivateUser, getUserById, updateUser } from "@/lib/api/users";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { Branch, UserRole, Vendor } from "@/lib/types";

type StaffUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  branchId: string | null;
  vendorId: string | null;
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
  updatedAt: string;
};

type PendingAction = "activate" | "deactivate" | null;

const inputStyle = {
  backgroundColor: theme.backgrounds.tertiary,
  border: `1px solid ${theme.borders.medium}`,
  color: theme.text.primary,
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const userId = params.id;
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionLoading, setActionLoading] = useState<PendingAction | "save">(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    role: UserRole.MANAGER,
    branchId: "",
    vendorId: "",
  });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      router.replace("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    Promise.all([getVendors(), getBranches()])
      .then(([vendorData, branchData]) => {
        setVendors(vendorData.vendors || []);
        setBranches(branchData.branches || []);
      })
      .catch(() => {
        setVendors([]);
        setBranches([]);
      });
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getUserById(userId);
      setStaffUser(data);
      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role,
        branchId: data.branchId || "",
        vendorId: data.vendorId || "",
      });
    } catch (fetchError: any) {
      setError(fetchError.response?.data?.message || "Failed to load user details");
      setStaffUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) return;
    fetchUser();
  }, [currentUser, fetchUser]);

  const resetForm = () => {
    if (!staffUser) return;
    setFormData({
      fullName: staffUser.fullName || "",
      phoneNumber: staffUser.phoneNumber || "",
      role: staffUser.role as UserRole,
      branchId: staffUser.branchId || "",
      vendorId: staffUser.vendorId || "",
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      vendorId: role === UserRole.SALES_STAFF ? prev.vendorId : "",
    }));
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setActionLoading("save");

    try {
      const updated = await updateUser(userId, {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: formData.role,
        branchId: formData.branchId || null,
        vendorId: formData.role === UserRole.SALES_STAFF ? formData.vendorId || null : null,
      });
      setStaffUser(updated);
      setIsEditing(false);
      toast.success("User updated");
    } catch (updateError: any) {
      toast.error(updateError.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(pendingAction);
    try {
      if (pendingAction === "activate") {
        await activateUser(userId);
        toast.success("User activated");
      } else {
        await deactivateUser(userId);
        toast.success("User deactivated");
      }
      setPendingAction(null);
      await fetchUser();
    } catch (actionError: any) {
      toast.error(actionError.response?.data?.message || `Failed to ${pendingAction} user`);
    } finally {
      setActionLoading(null);
    }
  };

  if (currentUser && currentUser.role !== UserRole.ADMIN) return null;

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: theme.text.secondary }}>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !staffUser) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p className="mb-4" style={{ color: error ? theme.accents.secondary : theme.text.secondary }}>
            {error || "User not found"}
          </p>
          <div className="flex gap-3">
            <AsyncButton onClick={fetchUser}>Retry</AsyncButton>
            <Link
              href="/users"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentUser = staffUser.id === currentUser?.id;
  const canToggleStatus = !isCurrentUser;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
              User Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
              Review account access, branch scope, and staff status.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/users"
              className="px-4 py-2 text-sm font-medium rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Back
            </Link>

            {canToggleStatus && staffUser.status === "ACTIVE" && (
              <AsyncButton onClick={() => setPendingAction("deactivate")} style={{ backgroundColor: theme.accents.secondary }}>
                Deactivate User
              </AsyncButton>
            )}
            {canToggleStatus && staffUser.status !== "ACTIVE" && (
              <AsyncButton onClick={() => setPendingAction("activate")}>
                Activate User
              </AsyncButton>
            )}
          </div>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              User Information
            </h2>
            <button
              onClick={() => {
                if (isEditing) resetForm();
                setIsEditing(!isEditing);
              }}
              disabled={actionLoading === "save"}
              className="text-sm font-medium disabled:opacity-50"
              style={{ color: theme.accents.primary }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name *">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
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
                <FormField label="Role *">
                  <select
                    value={formData.role}
                    onChange={(event) => handleRoleChange(event.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                    required
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.SALES_STAFF}>Sales Staff</option>
                  </select>
                </FormField>
                <FormField label="Branch Scope">
                  <select
                    value={formData.branchId}
                    onChange={(event) => setFormData({ ...formData, branchId: event.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={inputStyle}
                  >
                    <option value="">Global / Unassigned</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} ({branch.city})
                      </option>
                    ))}
                  </select>
                </FormField>

                {formData.role === UserRole.SALES_STAFF && (
                  <div className="md:col-span-2">
                    <FormField label="Vendor Assignment">
                      <select
                        value={formData.vendorId}
                        onChange={(event) => setFormData({ ...formData, vendorId: event.target.value })}
                        className="w-full px-3 py-2 text-sm rounded"
                        style={inputStyle}
                      >
                        <option value="">No vendor assigned</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <AsyncButton type="submit" loading={actionLoading === "save"} loadingLabel="Saving...">
                  Save Changes
                </AsyncButton>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsEditing(false);
                  }}
                  disabled={actionLoading === "save"}
                  className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                  style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="User ID" value={staffUser.id} />
              <Info label="Email" value={staffUser.email} />
              <Info label="Full Name" value={staffUser.fullName} />
              <Info label="Phone Number" value={staffUser.phoneNumber || "-"} />
              <Info label="Role" value={staffUser.role} />
              <Info label="Branch Scope" value={staffUser.branch ? `${staffUser.branch.name} (${staffUser.branch.city})` : "Global / Unassigned"} />
              {staffUser.role === UserRole.SALES_STAFF && (
                <Info label="Assigned Vendor" value={staffUser.vendor?.name || "Not assigned"} />
              )}
              <div>
                <p className="text-sm mb-1" style={{ color: theme.text.secondary }}>Status</p>
                <UserStatusBadge status={staffUser.status} />
              </div>
              <Info label="Created At" value={new Date(staffUser.createdAt).toLocaleString()} />
            </div>
          )}
        </div>
      </div>

      {pendingAction && (
        <ActionModal
          title={pendingAction === "activate" ? "Confirm Activation" : "Confirm Deactivation"}
          onClose={() => {
            if (!actionLoading) setPendingAction(null);
          }}
        >
          <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
            {pendingAction === "activate"
              ? `Activate ${staffUser.fullName}? They will regain access based on their role.`
              : `Deactivate ${staffUser.fullName}? They will immediately lose access to the system.`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPendingAction(null)}
              disabled={Boolean(actionLoading)}
              className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
              style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
            >
              Cancel
            </button>
            <AsyncButton
              onClick={handleConfirmAction}
              loading={actionLoading === pendingAction}
              loadingLabel={pendingAction === "activate" ? "Activating..." : "Deactivating..."}
              style={{ backgroundColor: pendingAction === "activate" ? theme.accents.primary : theme.accents.secondary }}
            >
              {pendingAction === "activate" ? "Activate User" : "Deactivate User"}
            </AsyncButton>
          </div>
        </ActionModal>
      )}
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
