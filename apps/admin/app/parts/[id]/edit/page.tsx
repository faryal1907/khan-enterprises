"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getPartById, updatePart, deletePart } from "@/lib/api/inventory";
import { getBranches, getVendors } from "@/lib/api/inventory";
import type { Branch, Vendor } from "@/lib/types";

export default function EditPartPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "Failed to delete part. It may have associated orders.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    setDeleteError("");
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Edit Part
          </h1>
          <p style={{ color: theme.text.secondary }}>
            Update the part information
          </p>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                }}
              >
                Delete Part
              </button>
              <div className="flex space-x-4">
                <a
                  href={`/parts/${partId}`}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.medium}`,
                  }}
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.accents.primary,
                    color: theme.text.inverse,
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
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
            <div className="flex justify-end space-x-4">
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
