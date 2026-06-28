"use client";
import { theme } from "@/lib/colors";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPartById, updatePartInventoryDiscount } from "@/lib/api/inventory";
import { getPartOrders } from "@/lib/api/orders";
import { getSettings } from "@/lib/api/settings";
import Link from "next/link";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params.id as string;
  const [part, setPart] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalPartDiscount, setGlobalPartDiscount] = useState<number>(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [newDiscount, setNewDiscount] = useState("");
  const [newDiscountAmount, setNewDiscountAmount] = useState("");
  const [savingDiscount, setSavingDiscount] = useState(false);

  const [errorModalMsg, setErrorModalMsg] = useState("");

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const [partData, ordersData, settingsData] = await Promise.all([
          getPartById(partId),
          getPartOrders({ partId, limit: 10 }),
          getSettings()
        ]);
        setPart(partData);
        setOrders(ordersData.orders || []);
        if (settingsData["GLOBAL_PART_DISCOUNT"]) {
          setGlobalPartDiscount(parseFloat(settingsData["GLOBAL_PART_DISCOUNT"]));
        }
      } catch (error) {
        console.error("Failed to fetch part:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [partId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.accents.primary }}></div>
        </div>
      </div>
    );
  }

  if (!part) {
    return <div className="p-8">Part not found</div>;
  }

  const handleOpenDiscountModal = (inventory: any) => {
    setSelectedInventory(inventory);
    const currentPercent = inventory.onlineDiscountPercent || 0;
    setNewDiscount(currentPercent.toString());
    if (part && part.sellingPrice) {
      setNewDiscountAmount(((currentPercent / 100) * part.sellingPrice).toString());
    } else {
      setNewDiscountAmount("0");
    }
    setShowDiscountModal(true);
  };

  const handleSaveDiscount = async () => {
    if (!selectedInventory) return;

    const discountVal = parseFloat(newDiscount || "0");
    if (discountVal < 0) {
      setErrorModalMsg("Discount cannot be negative.");
      return;
    }
    if (globalPartDiscount + discountVal > 100) {
      setErrorModalMsg(`Total discount cannot exceed 100%. (Global discount is ${globalPartDiscount}%)`);
      return;
    }

    setSavingDiscount(true);
    try {
      await updatePartInventoryDiscount(selectedInventory.id, discountVal);
      setShowDiscountModal(false);
      // Refresh part
      const partData = await getPartById(partId);
      setPart(partData);
    } catch (error) {
      console.error("Failed to update discount:", error);
      alert("Failed to update discount.");
    } finally {
      setSavingDiscount(false);
    }
  };

  const totalStock = part.inventories?.reduce((acc: number, inv: any) => acc + inv.quantity, 0) || 0;
  const totalReorderLevel = part.inventories?.reduce((acc: number, inv: any) => acc + (inv.reorderLevel || 0), 0) || 0;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              Part Details
            </h1>
            <p style={{ color: theme.text.secondary }}>
              View part information and stock status
            </p>
          </div>
          <Link
            href={`/parts/${partId}/edit`}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Edit Part
          </Link>
        </div>

        {/* Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Part Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.name}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                SKU
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.sku}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Category
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                {part.category}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Price
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                Rs {part.sellingPrice?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Total Stock
              </label>
              <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
                {totalStock}
              </p>
            </div>

          </div>
        </div>

        {/* Stock by Branch */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Stock by Branch
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: theme.backgrounds.tertiary }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}
                >
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Branch
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Reorder Level
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Ind. Discount (%)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {part.inventories?.map((inv: any) => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {inv.branch?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <span className={inv.quantity < (inv.reorderLevel || 0) ? "text-red-500 font-bold" : ""}>
                        {inv.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {inv.reorderLevel}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {inv.onlineDiscountPercent !== undefined && inv.onlineDiscountPercent !== null ? `${inv.onlineDiscountPercent}%` : "0%"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <button
                        onClick={() => handleOpenDiscountModal(inv)}
                        className="text-xs hover:underline"
                        style={{ color: theme.accents.primary }}
                      >
                        Edit Discount
                      </button>
                    </td>
                  </tr>
                ))}
                {(!part.inventories || part.inventories.length === 0) && (
                  <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td colSpan={5} className="px-4 py-3 text-center text-xs" style={{ color: theme.text.secondary }}>
                      No inventory records found for this part across any branches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Recent Activity
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: theme.backgrounds.tertiary }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: theme.backgrounds.primary, borderBottom: `1px solid ${theme.borders.light}` }}
                >
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Order Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <Link href={`/part-orders/${order.id}`} className="hover:underline" style={{ color: theme.accents.primary }}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.backgrounds.secondary, color: theme.text.secondary }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs" style={{ color: theme.text.secondary }}>
                      No recent orders for this part yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/parts"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back
          </a>
        </div>
      </div>

      {/* Custom Discount Modal */}
      {showDiscountModal && selectedInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              Update Discount
            </h3>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                Global Discount Implemented: {globalPartDiscount}%
              </p>
              <p className="text-xs" style={{ color: theme.text.muted }}>
                * Note: The individual discount you apply here will be in addition to the global discount.
              </p>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Discount Amount (Rs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={part.sellingPrice ? (part.sellingPrice * (100 - globalPartDiscount) / 100) : 0}
                  value={newDiscountAmount}
                  onChange={(e) => {
                    setNewDiscountAmount(e.target.value);
                    const amount = parseFloat(e.target.value);
                    if (!isNaN(amount) && part.sellingPrice && part.sellingPrice > 0) {
                      const percent = (amount / part.sellingPrice) * 100;
                      setNewDiscount(percent.toString());
                    } else if (e.target.value === "") {
                      setNewDiscount("0");
                    }
                  }}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={100 - globalPartDiscount}
                  value={newDiscount}
                  onChange={(e) => {
                    setNewDiscount(e.target.value);
                    const percent = parseFloat(e.target.value);
                    if (!isNaN(percent) && part.sellingPrice && part.sellingPrice > 0) {
                      const amount = (percent / 100) * part.sellingPrice;
                      setNewDiscountAmount(amount.toString());
                    } else if (e.target.value === "") {
                      setNewDiscountAmount("0");
                    }
                  }}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>
            </div>
            
            <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
               <p className="text-sm font-medium text-gray-700">Price Breakdown</p>
               <div className="mt-2 space-y-1 text-sm text-gray-600">
                 <div className="flex justify-between">
                   <span>Original Price:</span>
                   <span>Rs {part.sellingPrice?.toLocaleString() || "N/A"}</span>
                 </div>
                 <div className="flex justify-between text-red-600">
                   <span>Global Discount ({globalPartDiscount}%):</span>
                   <span>- Rs {((part.sellingPrice || 0) * (globalPartDiscount / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                 </div>
                 <div className="flex justify-between text-red-600">
                   <span>Individual Discount ({parseFloat(newDiscount || "0")}%):</span>
                   <span>- Rs {((part.sellingPrice || 0) * (parseFloat(newDiscount || "0") / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                 </div>
                 <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-gray-900">
                   <span>Final Price:</span>
                   <span>Rs {((part.sellingPrice || 0) * (1 - (globalPartDiscount + parseFloat(newDiscount || "0")) / 100)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                 </div>
               </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDiscountModal(false)}
                disabled={savingDiscount}
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
                onClick={handleSaveDiscount}
                disabled={savingDiscount}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {savingDiscount ? "Saving..." : "Save Discount"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      {errorModalMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: theme.accents.primary }}
            >
              Validation Error
            </h3>
            <p className="mb-6 text-sm" style={{ color: theme.text.primary }}>
              {errorModalMsg}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModalMsg("")}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
