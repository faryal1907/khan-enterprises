"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

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
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Role check and fetch managers
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      router.push("/branches");
      return;
    }

    const fetchManagers = async () => {
      try {
        const res = await api.get("/auth/users");
        const managerUsers = res.data.users.filter((u: any) => u.role === "MANAGER");
        setManagers(managerUsers);
      } catch (err) {
        console.error("Failed to fetch managers", err);
      }
    };

    if (user && user.role === UserRole.ADMIN) {
      fetchManagers();
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const createData: any = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      };
      if (formData.managerId) {
        createData.managerId = formData.managerId;
      }

      await api.post("/branches", createData);
      router.push("/branches");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create branch");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
            Add New Branch
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
            Create a new branch location
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          {error && (
            <div
              className="mb-4 p-3 rounded text-sm"
              style={{
                backgroundColor: theme.accents.secondary + "20",
                color: theme.accents.secondary,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Branch Name *
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
                  City *
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
                  Address *
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
                  Phone Number *
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
                  <option value="">No Manager (Assign Later)</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Leave empty to assign a manager later
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Branch"}
              </button>
              <Link
                href="/branches"
                className="px-4 py-2 text-sm font-medium rounded"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.borders.medium}`,
                }}
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
