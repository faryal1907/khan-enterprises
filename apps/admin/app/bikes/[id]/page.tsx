"use client";
import { useState } from "react";
import { theme } from "@/lib/colors";

export default function BikeDetailPage() {
  const [showStatusModal, setShowStatusModal] = useState(false);
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text.primary }}
          >
            Bike Details
          </h1>
          <p style={{ color: theme.text.secondary }}>
            View bike information and documents
          </p>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: theme.text.muted }}
              >
                Chassis Number
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
                Engine Number
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
                Model
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
                Vendor
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
                Branch
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

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Documents
          </h3>

          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Supplier Invoice
                </p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  —
                </p>
              </div>
              <button
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </button>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Warranty Document
                </p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  —
                </p>
              </div>
              <button
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </button>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded"
              style={{ backgroundColor: theme.backgrounds.tertiary }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Registration Papers
                </p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  —
                </p>
              </div>
              <button
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: theme.accents.primary }}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Status History
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
                    User
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

        <div
          className="rounded-lg p-6 mb-6"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Transfer History
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
                    From Branch
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    To Branch
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    User
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <a
            href="/bikes"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              backgroundColor: theme.backgrounds.primary,
              color: theme.text.secondary,
              border: `1px solid ${theme.borders.medium}`,
            }}
          >
            Back to Bikes
          </a>
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            Change Status
          </button>
          <a
            href="/bikes/1/edit"
            className="px-6 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Edit Bike
          </a>
        </div>

        {/* Change Status Modal */}
        {showStatusModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full mx-4"
              style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.text.primary }}
              >
                Change Status
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.text.secondary }}
                  >
                    New Status
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      border: `1px solid ${theme.borders.medium}`,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="IN_DELIVERY">In Delivery</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
                    style={{
                      backgroundColor: theme.backgrounds.tertiary,
                      color: theme.text.secondary,
                      border: `1px solid ${theme.borders.medium}`,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.accents.primary,
                      color: theme.text.inverse,
                    }}
                  >
                    Change Status
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
