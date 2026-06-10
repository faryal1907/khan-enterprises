"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { createPartOrder } from "@/lib/api/part-orders";
import { useAuthStore } from "@/lib/auth-store";

export default function PartDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
    paymentMethod: "CASH",
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await api.get(`/catalog/parts/${id}`);
        setPart(response.data);
      } catch (error) {
        console.error("Failed to fetch part:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  useEffect(() => {
    if (user) {
      setOrderForm((prev) => ({
        ...prev,
        customerName: user.fullName || "",
        customerPhone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleOrderClick = (inventory: any) => {
    setSelectedInventory(inventory);
    setShowOrderForm(true);
    setOrderError("");
    setOrderSuccess(false);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory || !part) return;

    try {
      setSubmittingOrder(true);
      setOrderError("");
      
      const response = await createPartOrder({
        partId: part.id,
        partInventoryId: selectedInventory.id,
        customerName: orderForm.customerName,
        customerPhone: orderForm.customerPhone,
        customerAddress: orderForm.customerAddress,
        quantity: orderForm.quantity,
        paymentMethod: orderForm.paymentMethod,
      });

      setCreatedOrder(response.order);
      setOrderSuccess(true);
      setShowOrderForm(false);
      setOrderForm({
        customerName: user?.fullName || "",
        customerPhone: user?.phoneNumber || "",
        customerAddress: "",
        quantity: 1,
        paymentMethod: "CASH",
      });
    } catch (err: any) {
      console.error("Failed to create part order:", err);
      setOrderError(err.response?.data?.message || "Failed to create order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>Part not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/parts" className="text-sm hover:opacity-70" style={{ color: theme.text.secondary }}>
            ← Back to Parts
          </Link>
        </div>

        {/* Order Success Message */}
        {orderSuccess && createdOrder && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" style={{ color: "#065F46" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#065F46" }}>
                  Order Created Successfully!
                </h3>
                <p className="text-sm mb-2" style={{ color: "#065F46" }}>
                  Order Number: {createdOrder.orderNumber}
                </p>
                <p className="text-sm" style={{ color: "#065F46" }}>
                  Status: {createdOrder.status.replace(/_/g, " ")}
                </p>
                {createdOrder.status === "PENDING_PAYMENT" && (
                  <p className="text-sm mt-2" style={{ color: "#065F46" }}>
                    Please visit your nearest branch to complete payment.
                  </p>
                )}
              </div>
              <button
                onClick={() => setOrderSuccess(false)}
                className="text-sm hover:opacity-70"
                style={{ color: "#065F46" }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Part Information */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h1 className="text-4xl font-bold mb-4" style={{ color: theme.text.primary }}>
                {part.name}
              </h1>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>SKU</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{part.sku}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Category</p>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{part.category}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Description</p>
                <p className="leading-relaxed" style={{ color: theme.text.secondary }}>
                  {part.description || "No description available."}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Selling Price</p>
                <p className="text-3xl font-bold" style={{ color: theme.text.primary }}>
                  PKR {part.sellingPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stock Information */}
          <div>
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text.primary }}>
                Stock by Branch
              </h2>

              {part.inventories && part.inventories.length > 0 ? (
                <div className="space-y-4">
                  {part.inventories.map((inventory: any) => {
                    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
                    return (
                      <div
                        key={inventory.id}
                        className="rounded-lg p-4"
                        style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium" style={{ color: theme.text.primary }}>
                            {inventory.branch?.name}
                          </p>
                          <span
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{
                              backgroundColor: availableQuantity > 0
                                ? `${theme.accents.tertiary}30`
                                : `${theme.colors.gray300}30`,
                              color: availableQuantity > 0
                                ? theme.accents.primary
                                : theme.colors.gray600,
                            }}
                          >
                            {availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: theme.text.secondary }}>
                          Available: {availableQuantity}
                        </p>
                        {availableQuantity > 0 && (
                          <button
                            onClick={() => handleOrderClick(inventory)}
                            className="w-full px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: theme.accents.primary,
                              color: theme.text.inverse,
                            }}
                          >
                            Order Now
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm" style={{ color: theme.text.muted }}>
                  No stock information available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && selectedInventory && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div
              className="rounded-xl p-6 max-w-md w-full"
              style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: theme.text.primary }}>
                  Order Part
                </h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-sm hover:opacity-70"
                  style={{ color: theme.text.secondary }}
                >
                  Cancel
                </button>
              </div>

              {orderError && (
                <div
                  className="rounded-lg p-4 mb-4"
                  style={{ backgroundColor: "#FEE2E2", border: "1px solid #EF4444" }}
                >
                  <p className="text-sm" style={{ color: "#991B1B" }}>{orderError}</p>
                </div>
              )}

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                    <span className="font-medium" style={{ color: theme.text.primary }}>Part:</span> {part.name}
                  </p>
                  <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                    <span className="font-medium" style={{ color: theme.text.primary }}>Branch:</span> {selectedInventory.branch?.name}
                  </p>
                  <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                    <span className="font-medium" style={{ color: theme.text.primary }}>Price:</span> PKR {part.sellingPrice?.toLocaleString()} each
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedInventory.quantity - selectedInventory.reservedQuantity}
                    required
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                    Available: {selectedInventory.quantity - selectedInventory.reservedQuantity}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={orderForm.customerAddress}
                    onChange={(e) => setOrderForm({ ...orderForm, customerAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
                    Payment Method *
                  </label>
                  <select
                    required
                    value={orderForm.paymentMethod}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="CASH">Cash (Pay at Branch)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="SAFEPAY">Safepay (Card)</option>
                    <option value="JAZZCASH">JazzCash</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full px-6 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    {submittingOrder ? "Creating Order..." : "Confirm Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
