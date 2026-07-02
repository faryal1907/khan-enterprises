"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AsyncButton } from "@/components/async-button";
import { createBranch } from "@/lib/api/branches";
import { getUsers } from "@/lib/api/users";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import { UserRole } from "@/lib/types";

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

export default function CreateBranchPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phoneNumber: "",
    managerId: "",
  });
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.replace("/branches");
    }
  }, [router, user]);

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) return;

    setLoadingManagers(true);
    getUsers({ role: UserRole.MANAGER, status: "ACTIVE" })
      .then((data) => setManagers(data.users || []))
      .catch(() => setManagers([]))
      .finally(() => setLoadingManagers(false));
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createBranch({
        name: formData.name.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        managerId: formData.managerId || undefined,
      });
      toast.success("Branch created");
      router.push("/branches");
    } catch (createError: any) {
      setError(createError.response?.data?.message || "Failed to create branch");
    } finally {
      setSubmitting(false);
    }
  };

  if (user && user.role !== UserRole.ADMIN) return null;

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text.primary }}>
            Add New Branch
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
            Create a branch location and optionally assign an active manager.
          </p>
        </div>

        <div className="rounded-lg p-4 md:p-6" style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}>
          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: theme.accents.secondary + "20", color: theme.accents.secondary }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField label="Branch Name *">
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
                  disabled={loadingManagers}
                >
                  <option value="">No Manager (Assign Later)</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.fullName} ({manager.email}){manager.branchId ? " - branch scoped" : " - global"}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Only active manager accounts are shown.
                </p>
              </FormField>
            </div>

            <div className="mt-4 md:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <AsyncButton type="submit" loading={submitting} loadingLabel="Creating...">
                Create Branch
              </AsyncButton>
              <Link
                href="/branches"
                className="px-4 py-2 text-sm font-medium rounded text-center"
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
