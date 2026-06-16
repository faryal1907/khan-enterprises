"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";
import { getLowStockItems } from "@/lib/api/inventory";

export function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Fetch low stock count on mount (only for admin roles)
  useEffect(() => {
    const fetchLowStockCount = async () => {
      // Don't fetch if user is not an admin role
      if (!user || !["ADMIN", "MANAGER", "SALES_STAFF"].includes(user.role)) {
        return;
      }
      
      try {
        const response = await getLowStockItems(user?.branchId || undefined);
        setLowStockCount(response.count);
      } catch (error) {
        console.warn("Failed to fetch low stock count:", error);
      }
    };
    fetchLowStockCount();
  }, [user?.branchId, user?.role]);

  if (!user) return null;

  // Block customers from seeing admin navigation
  if (!["ADMIN", "MANAGER", "SALES_STAFF"].includes(user.role)) {
    return null;
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isStaff = user.role === UserRole.SALES_STAFF;

  return (
    <nav
      className="border-b"
      style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-8">
          <span
            className="font-bold text-xl"
            style={{ color: theme.text.primary }}
          >
            ALI & KHAN'S
          </span>
          <div className="flex space-x-6">
            <div className="flex space-x-6 items-center">
          <a
            href="/"
            className="px-3 py-2 text-sm font-medium rounded transition-colors hover:opacity-70"
            style={{
              color: theme.text.secondary,
            }}
          >
            Dashboard
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-2 text-sm font-medium rounded transition-colors hover:opacity-80"
            style={{
              backgroundColor: theme.backgrounds.tertiary,
              color: theme.text.secondary,
            }}
          >
            Operations
          </button>
        </div>
            
          </div>
        </div>
        <div className="flex items-center space-x-4">
          
          <span
            className="text-sm"
            style={{ color: theme.text.muted }}
          >
            {user.email}
          </span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Collapsible Menu */}
      {isMenuOpen && (
        <div
          className="border-t"
          style={{ backgroundColor: theme.backgrounds.primary, borderColor: theme.borders.light }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/bikes"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Bikes
                </p>
              </a>

              {!isStaff && (
                <a
                  href="/models"
                  className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                >
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                    Models
                  </p>
                </a>
              )}

              <a
                href="/parts"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80 relative"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Parts
                </p>
                {lowStockCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: theme.accents.secondary,
                      color: theme.text.inverse,
                      fontSize: "10px",
                    }}
                  >
                    {lowStockCount > 9 ? "9+" : lowStockCount}
                  </span>
                )}
              </a>

              <a
                href="/offers"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Offers
                </p>
              </a>

              <a
                href="/orders"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Orders
                </p>
              </a>

              <a
                href="/sales"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Sales
                </p>
              </a>

              <a
                href="/deliveries"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Delivery
                </p>
              </a>

              {isAdmin && (
                <>
                  <a
                    href="/transactions"
                    className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: theme.backgrounds.tertiary }}
                  >
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      Transactions
                    </p>
                  </a>

                  <a
                    href="/audit-logs"
                    className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: theme.backgrounds.tertiary }}
                  >
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      Audit Logs
                    </p>
                  </a>

                  <a
                    href="/users"
                    className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: theme.backgrounds.tertiary }}
                  >
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      Users
                    </p>
                  </a>

                  <a
                    href="/branches"
                    className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: theme.backgrounds.tertiary }}
                  >
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                      Branches
                    </p>
                  </a>
                </>
              )}

              {isManager && (
                <a
                  href="/branches"
                  className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: theme.backgrounds.tertiary }}
                >
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                    My Branch
                  </p>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
