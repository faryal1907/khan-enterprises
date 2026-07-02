"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { theme } from "@/lib/colors";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { getVendors, createVendor, deleteVendor } from "@/lib/api/vendors";
import { AsyncButton } from "@/components/async-button";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);

type Vendor = {
  id: string;
  name: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  prepaidBalance: number;
};

const EMPTY_FORM = {
  name: "",
  contactPerson: "",
  phoneNumber: "",
  email: "",
  address: "",
};

export default function VendorsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.vendors ?? []);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error("Vendor name is required");
    setSaving(true);
    try {
      await createVendor({
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      toast.success("Vendor created");
      setShowCreate(false);
      setForm(EMPTY_FORM);
      await load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create vendor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteVendor(deleteTarget.id);
      toast.success(`${deleteTarget.name} deactivated`);
      setDeleteTarget(null);
      await load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to deactivate vendor");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>
            Vendors
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.text.secondary }}>
            Manage vendor accounts and prepaid balances.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: theme.accents.primary }}
          >
            + Add Vendor
          </button>
        )}
      </div>

      {/* Summary strip */}
      {!loading && vendors.length > 0 && (() => {
        const totalBalance = vendors.reduce((s, v) => s + v.prepaidBalance, 0);
        const withBalance = vendors.filter((v) => v.prepaidBalance > 0).length;
        return (
          <div
            className="rounded-xl border p-4 flex items-center gap-6"
            style={{ borderColor: theme.borders.light, backgroundColor: theme.backgrounds.secondary }}
          >
            <div>
              <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>Total Prepaid Outstanding</p>
              <p className="text-xl font-bold" style={{ color: totalBalance > 0 ? theme.accents.primary : theme.text.secondary }}>
                {fmt(totalBalance)}
              </p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: theme.borders.light }} />
            <div>
              <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>Vendors with balance</p>
              <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{withBalance}</p>
            </div>
          </div>
        );
      })()}

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden shadow-sm"
        style={{ borderColor: theme.borders.light }}
      >
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading vendors...
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: theme.text.muted }}>
            No vendors yet.{isAdmin && " Click \"+ Add Vendor\" to get started."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: theme.backgrounds.secondary }}>
                <th className="p-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: theme.text.secondary }}>Vendor</th>
                <th className="p-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: theme.text.secondary }}>Contact</th>
                <th className="p-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: theme.text.secondary }}>Phone</th>
                <th className="p-3 text-right font-semibold text-xs uppercase tracking-wider" style={{ color: theme.text.secondary }}>Prepaid Balance</th>
                <th className="p-3 text-center font-semibold text-xs uppercase tracking-wider" style={{ color: theme.text.secondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                  style={{ borderColor: theme.borders.light }}
                >
                  <td className="p-3">
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{v.name}</p>
                    {v.email && (
                      <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{v.email}</p>
                    )}
                  </td>
                  <td className="p-3" style={{ color: theme.text.secondary }}>
                    {v.contactPerson || <span style={{ color: theme.text.muted }}>—</span>}
                  </td>
                  <td className="p-3" style={{ color: theme.text.secondary }}>
                    {v.phoneNumber || <span style={{ color: theme.text.muted }}>—</span>}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className="font-bold"
                      style={{ color: v.prepaidBalance > 0 ? "#d97706" : theme.text.secondary }}
                    >
                      {fmt(v.prepaidBalance)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/vendors/${v.id}`}
                        className="px-3 py-1 rounded text-xs font-semibold border"
                        style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
                      >
                        View
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteTarget(v)}
                          className="px-3 py-1 rounded text-xs font-semibold border text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Vendor Modal ──────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
            style={{ border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-xl font-bold mb-5" style={{ color: theme.text.primary }}>
              Add Vendor
            </h2>
            <div className="space-y-4">
              {[
                { label: "Name *", key: "name", placeholder: "e.g. Evee Pakistan" },
                { label: "Contact Person", key: "contactPerson", placeholder: "e.g. Bilal Ahmed" },
                { label: "Phone", key: "phoneNumber", placeholder: "+92300..." },
                { label: "Email", key: "email", placeholder: "info@vendor.com" },
                { label: "Address", key: "address", placeholder: "Street, City" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md text-sm border outline-none"
                    style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: theme.borders.light }}>
              <button
                onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}
                className="px-4 py-2 border rounded-md text-sm font-medium"
                style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
              >
                Cancel
              </button>
              <AsyncButton
                loading={saving}
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-semibold text-white rounded-md"
                style={{ backgroundColor: theme.accents.primary }}
              >
                Create Vendor
              </AsyncButton>
            </div>
          </div>
        </div>
      )}

      {/* ── Deactivate Confirm Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
            style={{ border: `1px solid ${theme.borders.light}` }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: theme.text.primary }}>
              Deactivate Vendor
            </h2>
            {deleteTarget.prepaidBalance > 0 ? (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm font-semibold text-amber-800">
                  This vendor has an outstanding balance of {fmt(deleteTarget.prepaidBalance)}.
                </p>
                <p className="text-sm mt-1 text-amber-700">
                  Allocate or adjust this balance before deactivating.
                </p>
              </div>
            ) : (
              <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                Are you sure you want to deactivate <strong>{deleteTarget.name}</strong>?
                Historical data will be preserved.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded-md text-sm font-medium"
                style={{ color: theme.text.primary, borderColor: theme.borders.medium }}
              >
                Cancel
              </button>
              <AsyncButton
                loading={deleting}
                disabled={deleteTarget.prepaidBalance > 0}
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-40"
              >
                Deactivate
              </AsyncButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
