"use client";
import { theme } from "@/lib/colors";

export default function OrderDetailPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Order Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View order information and manage order status
          </p>
        </div>

        {/* Order Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Order Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Number
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Order Date
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Status
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Name
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Phone
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Email
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Order Items
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
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: theme.text.secondary }}>
                Order Total
              </p>
              <p className="text-2xl font-bold" style={{ color: theme.accents.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Payment Status
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Payment Method
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Gateway Reference
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Delivery Status
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Delivery Address
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Delivery Date
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Order Timeline
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
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${theme.borders.light}` }}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: theme.text.primary }}>
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Documents
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: theme.text.primary }}>
                Invoice
              </span>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: theme.text.primary }}>
                Payment Receipt
              </span>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: theme.text.primary }}>
                Sale Agreement
              </span>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Actions
          </h3>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Confirm Order
            </button>
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.accents.secondary,
                color: theme.text.inverse,
              }}
            >
              Cancel Order
            </button>
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Mark Ready for Delivery
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/orders"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Orders
          </a>
          <a
            href="/deliveries/1"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            View Delivery
          </a>
        </div>
      </div>
    </div>
  );
}
