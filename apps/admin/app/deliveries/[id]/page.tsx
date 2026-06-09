"use client";
import { theme } from "@/lib/colors";

export default function DeliveryDetailPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Delivery Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View delivery request and manage delivery status
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
                Order Status
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
                Requested Date
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
                Current Status
              </label>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                —
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Delivery Timeline
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
              Approve
            </button>
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Mark in Transit
            </button>
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                color: theme.text.secondary,
                border: `1px solid ${theme.borders.medium}`,
              }}
            >
              Confirm Delivered
            </button>
            <button
              className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
              style={{
                backgroundColor: theme.accents.secondary,
                color: theme.text.inverse,
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/deliveries"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Delivery Queue
          </a>
          <a
            href="/orders/1"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            View Order
          </a>
        </div>
      </div>
    </div>
  );
}
