"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardCard } from "@/components/dashboard-card";
import { getDashboardStats } from "@/lib/api/dashboard";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import type { DashboardStats } from "@/lib/types";
import { UserRole } from "@/lib/types";

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

        <DashboardCards role={user.role} stats={loading ? null : stats} />
      </div>
    </div>
  );
}

function DashboardCards({
  role,
  stats,
}: {
  role: UserRole;
  stats: DashboardStats | null;
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
    return <MetricGrid cards={operationalCards} stats={stats} columns={3} />;
  }

  const summaryCards: MetricCard[] = [
    {
      label: role === UserRole.ADMIN ? "Total Revenue" : "Scope Revenue",
      field: "totalRevenue",
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

  return (
    <>
      <MetricGrid cards={summaryCards} stats={stats} columns={4} />
      <MetricGrid cards={operationalCards.slice(1, 6)} stats={stats} columns={4} />
    </>
  );
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
}: {
  cards: MetricCard[];
  stats: DashboardStats | null;
  columns: 2 | 3 | 4;
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
