"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardCard } from "@/components/dashboard-card";
import { getDashboardStats } from "@/lib/api/dashboard";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import type { DashboardStats } from "@/lib/types";
import { UserRole } from "@/lib/types";
import { getSettings, updateSetting } from "@/lib/api/settings";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError("");
    try {
      setStats(await getDashboardStats());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // The dashboard request intentionally starts when the authenticated user changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  if (!user) return null;

  const scopeLabel = loading
    ? "Loading..."
    : stats?.scope.branch
      ? `${stats.scope.branch.name}, ${stats.scope.branch.city}`
      : "All branches (Global)";

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: theme.text.primary }}
        >
          {user.role === UserRole.ADMIN
            ? "Dashboard"
            : stats?.scope.type === "GLOBAL"
              ? "Global Dashboard"
              : "Branch Dashboard"}
        </h1>

        <div
          className="rounded-lg p-6 mb-8"
          style={{
            backgroundColor: theme.backgrounds.primary,
            border: `1px solid ${theme.borders.light}`,
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: theme.text.primary }}
          >
            Welcome, {user.email}
          </h2>
          <div className="space-y-2 text-sm">
            <Info label="Role" value={user.role.replace(/_/g, " ")} />
            <Info label="Scope" value={scopeLabel} />
          </div>
        </div>

        {error && (
          <div
            className="rounded-lg p-4 mb-6 flex items-center justify-between gap-4"
            style={{
              backgroundColor: theme.backgrounds.secondary,
              border: `1px solid ${theme.accents.secondary}`,
              color: theme.text.primary,
            }}
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchStats}
              className="px-4 py-2 rounded font-medium"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Retry
            </button>
          </div>
        )}

        <DashboardCards role={user.role} stats={loading ? null : stats}>
          {user.role === UserRole.ADMIN && <GlobalSettings />}
        </DashboardCards>
      </div>
    </div>
  );
}

function DashboardCards({
  role,
  stats,
  children,
}: {
  role: UserRole;
  stats: DashboardStats | null;
  children?: React.ReactNode;
}) {
  const operationalCards: MetricCard[] = [
    {
      label: "Orders Waiting Payment",
      field: "ordersWaitingPayment",
      href: "/orders?status=PENDING_PAYMENT",
      emphasis: "secondary",
    },
    {
      label: "Pending Deliveries",
      field: "pendingDeliveries",
      href: "/deliveries",
    },
    {
      label: "Pending Verifications",
      field: "pendingVerifications",
      href: "/orders?status=PENDING_PAYMENT", // or wherever verification pending orders are listed
      emphasis: "secondary",
    },
    {
      label: "Available Bikes",
      field: "availableBikes",
      href: "/bikes?status=AVAILABLE",
      emphasis: "tertiary",
    },
    {
      label: "Available Parts",
      field: "availableParts",
      href: "/parts",
      emphasis: "tertiary",
    },
    {
      label: "Low Stock Alerts",
      field: "lowStockAlerts",
      href: "/parts?lowStock=true",
      emphasis: "secondary",
    },
  ];

  if (role === UserRole.SALES_STAFF) {
    return <MetricGrid cards={operationalCards} stats={stats} columns={3}>{children}</MetricGrid>;
  }

  const summaryCards: MetricCard[] = [
    {
      label: role === UserRole.ADMIN ? "Total Revenue" : "Scope Revenue",
      field: "totalRevenue",
      format: "currency",
      emphasis: "primary",
    },
    {
      label: role === UserRole.ADMIN ? "Total Expenses" : "Scope Expenses",
      field: "totalExpenses",
      format: "currency",
      emphasis: "secondary",
    },
    {
      label: role === UserRole.ADMIN ? "Total Profit" : "Scope Profit",
      field: "totalProfit",
      format: "currency",
      emphasis: "primary",
    },
    {
      label: "Bikes Sold",
      field: "bikesSold",
      href: "/bikes?status=SOLD",
      emphasis: "tertiary",
    },
    {
      label: "Cancelled Orders",
      field: "cancelledOrders",
      href: "/orders?status=CANCELLED",
      emphasis: "secondary",
    },
    operationalCards[0],
  ];

  const allCards: MetricCard[] = [
    ...summaryCards,
    ...operationalCards.slice(1),
  ];

  return <MetricGrid cards={allCards} stats={stats} columns={4}>{children}</MetricGrid>;
}

type MetricCard = {
  label: string;
  field: keyof DashboardStats;
  href?: string;
  format?: "number" | "currency";
  emphasis?: "default" | "primary" | "secondary" | "tertiary";
};

function MetricGrid({
  cards,
  stats,
  columns,
  children,
}: {
  cards: MetricCard[];
  stats: DashboardStats | null;
  columns: 2 | 3 | 4;
  children?: React.ReactNode;
}) {
  const columnClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns];

  return (
    <div className={`grid grid-cols-1 ${columnClass} gap-4 mb-6`}>
      {cards.map((card) => {
        const value = stats?.[card.field];
        return (
          <DashboardCard
            key={card.field}
            label={card.label}
            value={typeof value === "number" ? value : undefined}
            href={card.href}
            format={card.format}
            emphasis={card.emphasis}
          />
        );
      })}
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ color: theme.text.secondary }}>
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
}

function GlobalSettings() {
  const [bikeDiscount, setBikeDiscount] = useState<string>("0");
  const [partDiscount, setPartDiscount] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editBikeDiscount, setEditBikeDiscount] = useState<string>("0");
  const [editPartDiscount, setEditPartDiscount] = useState<string>("0");

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data["GLOBAL_BIKE_DISCOUNT"]) setBikeDiscount(data["GLOBAL_BIKE_DISCOUNT"]);
        if (data["GLOBAL_PART_DISCOUNT"]) setPartDiscount(data["GLOBAL_PART_DISCOUNT"]);
      })
      .catch((err) => {
        toast.error("Failed to load settings");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenModal = () => {
    setEditBikeDiscount(bikeDiscount);
    setEditPartDiscount(partDiscount);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting("GLOBAL_BIKE_DISCOUNT", editBikeDiscount),
        updateSetting("GLOBAL_PART_DISCOUNT", editPartDiscount)
      ]);
      setBikeDiscount(editBikeDiscount);
      setPartDiscount(editPartDiscount);
      toast.success("Global discounts updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="rounded-lg p-4 cursor-pointer transition-opacity hover:opacity-80"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <p className="text-sm" style={{ color: theme.text.secondary }}>
          Global Discounts
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>Bikes</p>
            <p className="text-xl font-bold" style={{ color: theme.accents.primary }}>
              {bikeDiscount}%
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: theme.text.muted }}>Parts</p>
            <p className="text-xl font-bold" style={{ color: theme.accents.secondary }}>
              {partDiscount}%
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div
            className="rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: theme.backgrounds.primary, border: `1px solid ${theme.borders.light}` }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.text.primary }}
            >
              Edit Global Discounts
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text.secondary }}>
                  Global Bike Discount (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={editBikeDiscount}
                  onChange={(e) => setEditBikeDiscount(e.target.value)}
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
                  Global Part Discount (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={editPartDiscount}
                  onChange={(e) => setEditPartDiscount(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
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
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: theme.accents.primary,
                  color: theme.text.inverse,
                }}
              >
                {saving ? "Saving..." : "Save Discounts"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
