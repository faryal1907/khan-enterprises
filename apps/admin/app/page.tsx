"use client";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: theme.text.primary }}
        >
          Dashboard
        </h1>

        {/* User Info Card */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Welcome, {user.email}
          </h2>
          <div className="space-y-2 text-sm">
            <p style={{ color: theme.text.secondary }}>
              <span className="font-medium">Role:</span> {user.role}
            </p>
            <p style={{ color: theme.text.secondary }}>
              <span className="font-medium">Branch:</span> {user.branchId ?? "All branches (Admin)"}
            </p>
            <p style={{ color: theme.text.secondary }}>
              <span className="font-medium">Status:</span> {user.status}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="font-semibold text-sm mb-2"
              style={{ color: theme.text.secondary }}
            >
              Total Revenue
            </h3>
            <p
              className="text-3xl font-bold"
              style={{ color: theme.accents.primary }}
            >
              —
            </p>
            <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
              This month
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="font-semibold text-sm mb-2"
              style={{ color: theme.text.secondary }}
            >
              Total Sales
            </h3>
            <p
              className="text-3xl font-bold"
              style={{ color: theme.accents.secondary }}
            >
              —
            </p>
            <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
              This month
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="font-semibold text-sm mb-2"
              style={{ color: theme.text.secondary }}
            >
              Total Bikes
            </h3>
            <p
              className="text-3xl font-bold"
              style={{ color: theme.accents.tertiary }}
            >
              —
            </p>
            <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
              All branches
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="font-semibold text-sm mb-2"
              style={{ color: theme.text.secondary }}
            >
              Available Bikes
            </h3>
            <p
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              —
            </p>
            <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
              Ready for sale
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: theme.backgrounds.secondary,
              border: `1px solid ${theme.accents.secondary}`,
            }}
          >
            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: theme.text.primary }}
            >
              Low Stock Alerts
            </h3>
            <p className="text-2xl font-bold" style={{ color: theme.accents.secondary }}>
              —
            </p>
            <p className="text-sm mt-2" style={{ color: theme.text.secondary }}>
              Parts below reorder level
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: theme.text.primary }}
            >
              Pending Items
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: theme.text.secondary }}>
                  Pending Offers
                </span>
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  —
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: theme.text.secondary }}>
                  Pending Orders
                </span>
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  —
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: theme.text.secondary }}>
                  Delivery Requests
                </span>
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  —
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
