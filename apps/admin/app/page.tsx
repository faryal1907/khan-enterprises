"use client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.warn("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, [user]);

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
        {isStaff && <SalesStaffDashboard stats={stats} />}

        {/* Branch Manager Dashboard */}
        {isManager && <BranchManagerDashboard stats={stats} />}

        {/* Admin Dashboard */}
        {isAdmin && <AdminDashboard stats={stats} />}
      </div>
    </div>
  );
}

function SalesStaffDashboard({ stats }: { stats: any }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link
          href="/deliveries"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            {stats?.pendingDeliveries ?? "—"}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link
          href="/bikes"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.availableBikes ?? "—"}
          </p>
        </Link>
        <Link
          href="/parts"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.availableParts ?? "—"}
          </p>
        </Link>
        <Link
          href="/offers"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Sales
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.primary }}>
            {stats?.pendingSales ?? "—"}
          </p>
        </Link>
        <Link
          href="/offers"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Offers
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats?.pendingSales ?? "—"}
          </p>
        </Link>
      </div>
    </>
  );
}

function BranchManagerDashboard({ stats }: { stats: any }) {
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
            {stats ? `Rs ${stats.branchRevenue.toLocaleString()}` : "—"}
          </p>
        </div>
        <Link
          href="/sales"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Bikes Sold
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.bikesSold ?? "—"}
          </p>
        </Link>
        <Link
          href="/bikes"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.availableBikes ?? "—"}
            </p>
        </Link>
        <Link
          href="/parts"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.availableParts ?? "—"}
            </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <Link
          href="/orders"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Orders Waiting Payment
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats?.ordersWaitingPayment ?? "—"}
          </p>
        </Link>
        <Link
          href="/deliveries"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats?.pendingDeliveries ?? "—"}
            </p>
        </Link>
        <Link
          href="/orders?status=CANCELLED"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Cancelled Orders
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats?.issues ?? "—"}
          </p>
        </Link>
      </div>
    </>
  );
}

function AdminDashboard({ stats }: { stats: any }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link
          href="/offers"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Orders
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.primary }}>
            {stats?.pendingOrders ?? "—"}
          </p>
        </Link>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Total Sales
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats ? `Rs ${stats.totalSales.toLocaleString()}` : "—"}
          </p>
        </div>
        <Link
          href="/parts"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Parts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.tertiary }}>
            {stats?.availableParts ?? "—"}
          </p>
        </Link>
        <Link
          href="/bikes"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Available Bikes
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            {stats?.availableBikes ?? "—"}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link
          href="/parts"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.secondary, border: `1px solid ${theme.accents.secondary}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.accents.secondary }}>
            {stats?.lowStockAlerts ?? "—"}
          </p>
        </Link>
        <Link
          href="/deliveries"
          className="rounded-lg p-4 block cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
        >
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Pending Deliveries
          </p>
          <p className="text-2xl font-bold mt-2" style={{ color: theme.text.primary }}>
            {stats?.pendingDeliveries ?? "—"}
          </p>
        </Link>
      </div>
    </>
  );
}
