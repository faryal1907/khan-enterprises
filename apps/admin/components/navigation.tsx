"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";

export function Navigation() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;

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
            Khan Admin
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
            onClick={logout}
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

              <a
                href="/parts"
                className="text-center p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.backgrounds.tertiary }}
              >
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
                  Parts
                </p>
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
                </>
              )}

              {isAdmin && (
                <>
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
