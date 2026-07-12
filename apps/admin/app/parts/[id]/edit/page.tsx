"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/colors";
import { toast } from "sonner";
import { getPartById, updatePart, deletePart, updatePartInventoryReorderLevel } from "@/lib/api/inventory";
import { returnDefectiveInventory, getVendors } from "@/lib/api/vendors";
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

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnNotes, setReturnNotes] = useState("");
  const [returning, setReturning] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [returnQuantity, setReturnQuantity] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");

  // Cost change warning modal state
  const [showCostChangeModal, setShowCostChangeModal] = useState(false);
  const [pendingCostChange, setPendingCostChange] = useState<{ oldCost: number; newCost: number } | null>(null);

  useEffect(() => {
    if (user && !canManage) router.replace("/parts");
  }, [canManage, router, user]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    sellingPrice: "",
    purchaseCost: "",
  });

  // Reference data
  const [vendors, setVendors] = useState<any[]>([]);

  // Fetch part data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [part, vendorsRes] = await Promise.all([
          getPartById(partId),
          getVendors(),
        ]);

        setFormData({
          name: part.name,
          sku: part.sku,
          category: part.category,
          description: part.description || "",
          sellingPrice: part.sellingPrice ? String(part.sellingPrice) : "",
          purchaseCost: part.purchaseCost ? String(part.purchaseCost) : "",
        });
        setInventories(part.inventories || []);
        setVendors(vendorsRes.vendors || []);
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
    
    // Check if purchase cost changed
    const oldCost = Number(formData.purchaseCost);
    const currentCost = Number(formData.purchaseCost);
    // We need to fetch the current part to compare
    const part = await getPartById(partId);
    const originalCost = Number(part.purchaseCost || 0);
    
    if (formData.purchaseCost && currentCost !== originalCost) {
      setPendingCostChange({ oldCost: originalCost, newCost: currentCost });
      setShowCostChangeModal(true);
      return;
    }
    
    await performUpdate();
  };

  const performUpdate = async () => {
    setSubmitting(true);

    try {
      await updatePart(partId, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData.description,
        sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : undefined,
        purchaseCost: formData.purchaseCost ? Number(formData.purchaseCost) : undefined,
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
    setShowReturnModal(true);
  };

  const handleReturnPart = async () => {
    if (!selectedInventoryId || !returnQuantity || !selectedVendorId) {
      toast.error("Please select an inventory, quantity, and vendor to return");
      return;
    }

    const selectedInventory = inventories.find(inv => inv.id === selectedInventoryId);
    if (!selectedInventory) {
      toast.error("Invalid inventory selected");
      return;
    }

    const qty = parseInt(returnQuantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Invalid quantity");
      return;
    }

    if (qty > selectedInventory.quantity) {
      toast.error("Cannot return more than available quantity");
      return;
    }

    setReturning(true);
    try {
      await returnDefectiveInventory(selectedVendorId, {
        bikeIds: [],
        partReturns: [{ partInventoryId: selectedInventoryId, quantity: qty }],
        date: returnDate,
        notes: returnNotes.trim() || undefined,
      });
      toast.success("Part returned to vendor successfully");
      setShowReturnModal(false);
      setSelectedInventoryId("");
      setReturnQuantity("");
      setSelectedVendorId("");
      setReturnNotes("");
      setReturnDate(new Date().toISOString().split("T")[0]);
      // Refresh the page data
      const part = await getPartById(partId);
      setInventories(part.inventories || []);
    } catch (error: any) {
      console.error("Failed to return part:", error);
      toast.error(error.response?.data?.message || "Failed to return part");
    } finally {
      setReturning(false);
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

            {/* Pricing */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Selling Price (Rs) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter selling price"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    Purchase Cost (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter purchase cost"
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
                onClick={confirmDelete}
                className="px-4 md:px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                }}
              >
                Return Part
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

      {/* Return Part Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-4 md:p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              Return Part to Vendor
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Inventory Location *
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                  style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                  value={selectedInventoryId}
                  onChange={(e) => setSelectedInventoryId(e.target.value)}
                >
                  <option value="">Select inventory</option>
                  {inventories.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.branch.name} (Qty: {inv.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Return Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                  style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                  placeholder="Quantity to return"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Vendor *
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                  style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Return Date *
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                  style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Notes (optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                  style={{ borderColor: theme.borders.medium, color: theme.text.primary }}
                  placeholder="e.g. Reason for return"
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                />
              </div>
              <div
                className="p-3 rounded text-xs"
                style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d" }}
              >
                <p className="font-semibold text-amber-800 mb-1">After confirmation:</p>
                <ul className="space-y-1 text-amber-700 list-disc list-inside">
                  <li>Part stock quantity will be reduced</li>
                  <li>Vendor's prepaid balance will increase accordingly</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedInventoryId("");
                  setReturnQuantity("");
                  setSelectedVendorId("");
                  setReturnNotes("");
                  setReturnDate(new Date().toISOString().split("T")[0]);
                }}
                disabled={returning}
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
                onClick={handleReturnPart}
                disabled={returning}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "white",
                }}
              >
                {returning ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cost Change Warning Modal */}
      {showCostChangeModal && pendingCostChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-4 md:p-6 max-w-sm sm:max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              Confirm Cost Change
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: theme.text.secondary }}
            >
              You are changing the purchase cost from <strong>Rs {pendingCostChange.oldCost}</strong> to <strong>Rs {pendingCostChange.newCost}</strong>. This will create a journal entry to adjust the inventory value and vendor prepaid balance accordingly.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowCostChangeModal(false);
                  setPendingCostChange(null);
                }}
                disabled={submitting}
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
                onClick={() => {
                  setShowCostChangeModal(false);
                  setPendingCostChange(null);
                  performUpdate();
                }}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {submitting ? "Updating..." : "Confirm Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
