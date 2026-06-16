"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { getBranches, getVendors } from "@/lib/api/inventory";
import { createUser } from "@/lib/api/users";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { Branch, UserRole, Vendor } from "@/lib/types";

export default function CreateUserPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: UserRole.MANAGER,
    branchId: "",
    vendorId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.replace("/");
    }
  }, [router, user]);

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

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      vendorId: role === UserRole.SALES_STAFF ? prev.vendorId : "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createUser({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: formData.role,
        branchId: formData.branchId || undefined,
        vendorId: formData.role === UserRole.SALES_STAFF ? formData.vendorId || undefined : undefined,
      });
      toast.success("Staff account created");
      router.push("/users");
    } catch (createError: any) {
      setError(createError.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  if (user && user.role !== UserRole.ADMIN) return null;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
            Create Staff Account
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
            Add a staff member and choose whether they are global or branch-scoped.
          </p>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: theme.accents.secondary + "20", color: theme.accents.secondary }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField label="Email *">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="w-full px-3 py-2 text-sm rounded"
                  style={inputStyle}
                  required
                />
              </FormField>

              <FormField label="Password *">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="w-full px-3 py-2 text-sm rounded"
                  style={inputStyle}
                  required
                  minLength={6}
                />
              </FormField>

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
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Leave empty for global access. Assign a branch to scope managers or sales staff to that branch.
                </p>
              </FormField>

              {formData.role === UserRole.SALES_STAFF && (
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
                  <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                    Optional. Branch assignment controls operational scope.
                  </p>
                </FormField>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <AsyncButton type="submit" loading={submitting} loadingLabel="Creating...">
                Create User
              </AsyncButton>
              <Link
                href="/users"
                className="px-4 py-2 text-sm font-medium rounded"
                style={{ backgroundColor: theme.backgrounds.tertiary, color: theme.text.secondary, border: `1px solid ${theme.borders.medium}` }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: theme.backgrounds.tertiary,
  border: `1px solid ${theme.borders.medium}`,
  color: theme.text.primary,
};

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
