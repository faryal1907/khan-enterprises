"use client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isStaff = user.role === UserRole.SALES_STAFF;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: theme.text.primary }}
        >
          {isStaff ? "My Dashboard" : isManager ? "Branch Dashboard" : "Dashboard"}
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

        {/* Sales Staff Dashboard */}
        {isStaff && <SalesStaffDashboard />}

        {/* Branch Manager Dashboard */}
        {isManager && <BranchManagerDashboard />}

        {/* Admin Dashboard */}
        {isAdmin && <AdminDashboard />}
      </div>
    </div>
  );
}

function SalesStaffDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            —
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Sales
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.primary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Alerts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
          </p>
        </div>
      </div>
    </>
  );
}

function BranchManagerDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Branch Revenue
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.primary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Bikes Sold
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
            </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Orders Waiting Payment
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
            </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Issues
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
          </p>
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Orders
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.primary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Total Sales
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            —
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            —
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            —
          </p>
        </div>
      </div>
    </>
  );
}
