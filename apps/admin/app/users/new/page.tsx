"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";

type Vendor = { id: string; name: string };
type Branch = { id: string; name: string; city: string };

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "MANAGER",
    branchId: "",
    vendorId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchRefData = async () => {
      try {
        const [vendorRes, branchRes] = await Promise.all([
          api.get("/vendors"),
          api.get("/branches"),
        ]);
        setVendors(vendorRes.data.vendors);
        setBranches(branchRes.data.branches);
      } catch (err) {
        console.error("Failed to fetch reference data:", err);
      }
    };
    fetchRefData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const createData: any = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };
      if (formData.branchId) {
        createData.branchId = formData.branchId;
      }
      if (formData.role === "SALES_STAFF" && formData.vendorId) {
        createData.vendorId = formData.vendorId;
      }

      await api.post("/auth/users", createData);
      router.push("/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
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
            Create Staff Account
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
            Add a new staff member to the system
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
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, vendorId: "" })}
                  className="w-full px-3 py-2 text-sm rounded"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                  required
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="SALES_STAFF">SALES_STAFF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                  Branch
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                >
                  <option value="">No Branch (Global)</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.city})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                  Leave empty for global users (Admin)
                </p>
              </div>

              {/* Vendor assignment — only for SALES_STAFF */}
              {formData.role === "SALES_STAFF" && (
                <div>
                  <label className="block text-sm mb-1" style={{ color: theme.text.secondary }}>
                    Assigned Vendor *
                  </label>
                  <select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    required
                  >
                    <option value="">Select vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs" style={{ color: theme.text.muted }}>
                    Sales staff can only access bikes and sales from their assigned vendor.
                  </p>
                </div>
              )}
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
                {loading ? "Creating..." : "Create User"}
              </button>
              <Link
                href="/users"
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
