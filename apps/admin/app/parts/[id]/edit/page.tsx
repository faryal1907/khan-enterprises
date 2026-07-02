"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getPartById, updatePart, deletePart, updatePartInventoryReorderLevel } from "@/lib/api/inventory";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { AsyncButton } from "@/components/async-button";

export default function EditPartPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params.id as string;
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const canManage = isAdmin || user?.role === UserRole.MANAGER;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [inventories, setInventories] = useState<any[]>([]);
  const [reorderLevels, setReorderLevels] = useState<Record<string, string>>({});
  const [savingReorder, setSavingReorder] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user && !canManage) router.replace("/parts");
  }, [canManage, router, user]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
  });

  // Reference data (not needed for this form)
  // const [branches, setBranches] = useState<Branch[]>([]);
  // const [vendors, setVendors] = useState<Vendor[]>([]);

  // Fetch part data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const part = await getPartById(partId);

        setFormData({
          name: part.name,
          sku: part.sku,
          category: part.category,
          description: part.description || "",
        });
        setInventories(part.inventories || []);
        const initialLevels: Record<string, string> = {};
        (part.inventories || []).forEach((inv: any) => {
          initialLevels[inv.id] = String(inv.reorderLevel ?? 0);
        });
        setReorderLevels(initialLevels);
      } catch (error) {
        console.error("Failed to fetch part data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [partId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updatePart(partId, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData.description,
      });

      toast.success("Part updated successfully");
      router.push(`/parts/${partId}`);
    } catch (error) {
      console.error("Failed to update part:", error);
      toast.error("Failed to update part");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePart(partId);
      toast.success("Part deleted successfully");
      router.push("/parts");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete part. It may have associated orders.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleReorderLevelChange = (inventoryId: string, value: string) => {
    setReorderLevels((prev) => ({ ...prev, [inventoryId]: value }));
  };

  const handleSaveReorderLevel = async (inventoryId: string) => {
    const value = parseInt(reorderLevels[inventoryId] || "0", 10);
    if (isNaN(value) || value < 0) {
      toast.error("Reorder level must be a non-negative number");
      return;
    }

    setSavingReorder((prev) => ({ ...prev, [inventoryId]: true }));
    try {
      await updatePartInventoryReorderLevel(inventoryId, value);
      toast.success("Reorder level updated");
    } catch (error) {
      console.error("Failed to update reorder level:", error);
      toast.error("Failed to update reorder level");
    } finally {
      setSavingReorder((prev) => ({ ...prev, [inventoryId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 md:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold mb-1 md:mb-2"
            style={{ color: theme.text.primary }}
          >
            Edit Part
          </h1>
          <p className="text-sm md:text-base" style={{ color: theme.text.secondary }}>
            Update the part information
          </p>
        </div>

        <div
          className="rounded-lg p-4 md:p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Basic Info */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Basic Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Part Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter part name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.text.secondary }}
                    >
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: theme.backgrounds.tertiary,
                        border: `1px solid ${theme.borders.medium}`,
                        color: theme.text.primary,
                      }}
                    >
                      <option value="">Select category</option>
                      <option value="ELECTRICAL">Electrical</option>
                      <option value="MECHANICAL">Mechanical</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {inventories.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: theme.text.primary }}
                >
                  Reorder Levels by Branch
                </h3>
                <div className="space-y-3">
                  {inventories.map((inv: any) => (
                    <div
                      key={inv.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded"
                      style={{ backgroundColor: theme.backgrounds.tertiary }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                          {inv.branch?.name || "Unknown Branch"}
                        </p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>
                          Current quantity: {inv.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={reorderLevels[inv.id] ?? ""}
                          onChange={(e) => handleReorderLevelChange(inv.id, e.target.value)}
                          className="w-24 px-3 py-2 rounded text-sm"
                          style={{
                            backgroundColor: theme.backgrounds.primary,
                            border: `1px solid ${theme.borders.medium}`,
                            color: theme.text.primary,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveReorderLevel(inv.id)}
                          disabled={savingReorder[inv.id]}
                          className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                          style={{
                            backgroundColor: theme.accents.primary,
                            color: theme.text.inverse,
                          }}
                        >
                          {savingReorder[inv.id] ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 sm:gap-3 pt-4 md:pt-6">
              {isAdmin && <button
                type="button"
                onClick={handleDelete}
                className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                }}
              >
                Delete Part
              </button>}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                <a
                  href="/parts"
                  className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </a>
                <AsyncButton
                  type="submit"
                  loading={submitting}
                  loadingLabel="Saving..."
                  className="px-4 md:px-6"
                >
                  Save Changes
                </AsyncButton>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-4 md:p-6 max-w-sm sm:max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              {deleteError ? "Action Required" : "Delete Part"}
            </h3>
            {deleteError ? (
              <div className="mb-6 p-4 rounded bg-red-50 text-red-700 border border-red-200">
                <p className="text-sm font-medium">{deleteError}</p>
              </div>
            ) : (
              <p
                className="text-sm mb-6"
                style={{ color: theme.text.secondary }}
              >
                Are you sure you want to delete this part? This action cannot be undone. All current stock level tracking for this part will also be permanently removed.
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              {deleteError ? (
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                  }}
                >
                  Okay
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70 disabled:opacity-50"
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
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                    }}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete Part"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
