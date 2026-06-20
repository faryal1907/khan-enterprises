"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { theme } from "@/lib/colors";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { createCustomerOrder, CreateOrderPayload } from "@/lib/api/create-order";

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", display: "block" }}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", display: "block" }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const bikeId = searchParams.get("bikeId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCNIC, setCustomerCNIC] = useState("");
  const [customerCNICError, setCustomerCNICError] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE_TRANSFER" | "">("");

  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const basePrice = bike ? (bike.price || bike.model?.basePrice) : 0;
  const onlinePrice = basePrice * 0.98;
  const discountAmount = basePrice - onlinePrice;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!bikeId) {
      setError("No bike selected");
      setLoading(false);
      return;
    }
    fetchBike();
  }, [user, bikeId]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName || "");
      if (!customerPhone) setCustomerPhone(user.phoneNumber || "");
      if (!customerEmail) setCustomerEmail(user.email || "");
    }
  }, [user]);

  const fetchBike = async () => {
    try {
      const response = await api.get(`/catalog/bikes/${bikeId}`);
      setBike(response.data);
    } catch (err) {
      setError("Failed to load bike details");
    } finally {
      setLoading(false);
    }
  };

  const validateCNIC = (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 13) {
      setCustomerCNICError("CNIC must be exactly 13 digits");
      return false;
    }
    setCustomerCNICError("");
    return true;
  };

  const handleCNICChange = (value: string) => {
    const formatted = value
      .replace(/[^0-9]/g, "")
      .replace(/(\d{5})(\d{7})(\d)/, "$1-$2-$3")
      .slice(0, 15);
    setCustomerCNIC(formatted);
  };

  const handleCreateOrder = async () => {
    if (!bikeId || !user || !paymentMethod) return;

    if (!customerName || !customerPhone) {
      setError("Please fill in your name and phone number");
      return;
    }

    if (customerCNIC && !validateCNIC(customerCNIC)) {
      setError("Please enter a valid CNIC");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload: CreateOrderPayload = {
        bikeId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        customerCNIC: customerCNIC || undefined,
        customerAddress: customerAddress || undefined,
        paymentMethod,
        // For CASH orders we must not send empty/invalid paymentProofUrl
        paymentProofUrl:
          paymentMethod === "ONLINE_TRANSFER"
            ? paymentProofUrl || undefined
            : undefined,
      };

      const order = await createCustomerOrder(payload);
      setCreatedOrder(order);
    } catch (err: any) {
      const data = err.response?.data;
      setError(data?.message || "Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setPaymentProofPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUploadPaymentProof = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploadingProof(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = uploadResponse.data.fileUrl;
      setPaymentProofUrl(uploadedUrl);
      setProofUploaded(true);
    } catch (err: any) {
      const data = err.response?.data;
      setError(data?.message || "Failed to upload payment proof");
    } finally {
      setUploadingProof(false);
    }
  };

  const handleProceed = () => {
    if (createdOrder) router.push(`/orders/${createdOrder.orderNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.accents.primary }} />
      </div>
    );
  }

  if (!bike && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <p style={{ color: theme.text.secondary }}>Bike not found</p>
          <Link href="/bikes" className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}>
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  if (createdOrder) {
    const isCash = createdOrder.paymentMethod === "CASH";
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
            <div className="text-5xl mb-4">{isCash ? <CheckIcon /> : ""}</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>
              {isCash ? "Order Placed!" : "Order Created!"}
            </h1>
            <p className="mb-2" style={{ color: theme.text.secondary }}>
              Order Number: <span className="font-mono font-bold" style={{ color: theme.accents.primary }}>{createdOrder.orderNumber}</span>
            </p>

            {isCash ? (
              <div className="rounded-xl p-6 text-left mt-6" style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}>
                <p className="font-semibold" style={{ color: "#065F46" }}>Cash on Delivery — Onsite Pickup</p>
                <p className="text-sm mt-2" style={{ color: "#065F46" }}>
                  Your bike has been reserved for <strong>48 hours</strong>. Please visit the store within this time to pick it up.
                </p>
                <p className="text-xs mt-1" style={{ color: "#065F46" }}>
                  If not picked up within 48 hours, your order will be automatically cancelled.
                </p>
                <p className="text-sm mt-2" style={{ color: "#065F46" }}>
                  Total Amount: <strong>PKR {onlinePrice.toLocaleString()}</strong>
                </p>
              </div>
            ) : (
              <div className="rounded-xl p-6 text-left mt-6" style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}>
                <p className="font-semibold" style={{ color: "#065F46" }}>Payment proof submitted!</p>
                <p className="text-sm mt-2" style={{ color: "#065F46" }}>Status: Awaiting admin verification</p>
                <p className="text-sm mt-1" style={{ color: "#065F46" }}>
                  Your order will be confirmed once our team verifies your payment. We'll notify you once verified.
                </p>

                {paymentProofUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border" style={{ borderColor: theme.borders.light }}>
                    <img src={paymentProofUrl} alt="Payment Proof" className="w-full h-32 object-contain" style={{ backgroundColor: theme.backgrounds.primary }} />
                  </div>
                )}

                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: theme.backgrounds.primary }}>
                  <p className="text-sm font-medium mb-3" style={{ color: theme.text.primary }}>Once verified, you may choose between delivery and onsite-pickup!</p>
                  
                </div>
              </div>
            )}

            <button onClick={handleProceed} className="mt-6 w-full px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}>
              View Order Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canPlaceOrder = paymentMethod === "CASH" || (paymentMethod === "ONLINE_TRANSFER" && proofUploaded);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgrounds.primary }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/bikes" className="text-sm hover:opacity-70" style={{ color: theme.text.secondary }}>← Back to Inventory</Link>
        </div>

        <div className="rounded-xl p-8" style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.borders.light}` }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>Complete Your Order</h1>

          {bike && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.backgrounds.tertiary }}>
              <p className="font-semibold" style={{ color: theme.text.primary }}>
                {bike.model?.brand} {bike.model?.modelName} ({bike.model?.year})
              </p>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>{bike.branch?.name}</p>
              <div className="mt-2 pt-2 border-t" style={{ borderColor: theme.borders.light }}>
                <p className="text-sm" style={{ color: theme.text.secondary }}>
                  Store Price: <span className="line-through">PKR {basePrice.toLocaleString()}</span>
                </p>
                <p className="text-lg font-bold" style={{ color: theme.accents.primary }}>
                  Online Price: PKR {onlinePrice.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: theme.text.muted }}>You save PKR {discountAmount.toLocaleString()}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>{error}</div>
          )}

          {/* Customer Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Full Name</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-3 rounded-lg focus:outline-none" style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Phone Number</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-4 py-3 rounded-lg focus:outline-none" style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Email</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg focus:outline-none" style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>CNIC</label>
              <input
                type="text"
                value={customerCNIC}
                onChange={(e) => handleCNICChange(e.target.value)}
                placeholder="12345-1234567-1"
                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: theme.backgrounds.tertiary,
                  border: `1px solid ${customerCNICError ? "#EF4444" : theme.borders.medium}`,
                  color: theme.text.primary,
                }}
              />
              {customerCNICError && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{customerCNICError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Address</label>
              <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-lg focus:outline-none" style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.medium}`, color: theme.text.primary }} />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: theme.text.secondary }}>Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: paymentMethod === "CASH" ? theme.accents.primary : theme.backgrounds.tertiary,
                  color: paymentMethod === "CASH" ? theme.text.inverse : theme.text.primary,
                  border: `2px solid ${paymentMethod === "CASH" ? theme.accents.primary : theme.borders.medium}`,
                }}
              >
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-xs mt-1 opacity-80">Pay at store, pickup in person</p>
                <p className="text-sm font-bold mt-2">PKR {onlinePrice.toLocaleString()}</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE_TRANSFER")}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: paymentMethod === "ONLINE_TRANSFER" ? theme.accents.primary : theme.backgrounds.tertiary,
                  color: paymentMethod === "ONLINE_TRANSFER" ? theme.text.inverse : theme.text.primary,
                  border: `2px solid ${paymentMethod === "ONLINE_TRANSFER" ? theme.accents.primary : theme.borders.medium}`,
                }}
              >
                <p className="font-semibold">Online Transfer</p>
                <p className="text-xs mt-1 opacity-80">Pay via bank transfer or mobile wallet</p>
                <p className="text-sm font-bold mt-2">PKR {onlinePrice.toLocaleString()}</p>
              </button>
            </div>
          </div>

          {/* Payment Proof Upload for ONLINE_TRANSFER */}
          {paymentMethod === "ONLINE_TRANSFER" && (
            <div className="mb-6 p-6 rounded-xl" style={{ backgroundColor: theme.backgrounds.tertiary, border: `1px solid ${theme.borders.light}` }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Upload Payment Proof</h2>
              <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                Transfer PKR {onlinePrice.toLocaleString()} to our bank account and upload the payment screenshot below.
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 p-8 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: isDragging ? theme.accents.primary + "20" : theme.backgrounds.primary,
                  border: `2px dashed ${isDragging ? theme.accents.primary : theme.borders.medium}`,
                }}
              >
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileInput} className="hidden" />
                {paymentProofPreview ? (
                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: theme.borders.light }}>
                    <img src={paymentProofPreview} alt="Payment Proof Preview" className="w-full h-48 object-contain" style={{ backgroundColor: theme.backgrounds.primary }} />
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CameraIcon />
                    <p className="text-sm mt-2" style={{ color: theme.text.secondary }}>Drag & drop your payment screenshot here</p>
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>or click to browse (Images & PDF only)</p>
                  </div>
                )}
              </div>

              {selectedFile && (
                <p className="text-xs mb-4" style={{ color: theme.text.muted }}>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
              )}

              {proofUploaded ? (
                <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Proof Uploaded</p>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadPaymentProof}
                  disabled={!selectedFile || uploadingProof}
                  className="w-full px-6 py-3 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
                >
                  {uploadingProof ? "Uploading..." : "Submit Payment Proof"}
                </button>
              )}
            </div>
          )}

          {paymentMethod === "CASH" && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B" }}>
              <p className="text-sm" style={{ color: "#92400E" }}>
                <strong>Note:</strong> Your bike will be reserved for <strong>48 hours</strong>. Please visit the store to complete your purchase. If not picked up within 48 hours, the reservation will be cancelled.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={!canPlaceOrder || submitting}
            className="w-full px-6 py-4 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: theme.accents.primary, color: theme.text.inverse }}
          >
            {submitting ? "Creating Order..." : `Place Order `}
          </button>
        </div>
      </div>
    </div>
  );
}