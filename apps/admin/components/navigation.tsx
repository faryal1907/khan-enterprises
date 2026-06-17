"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";
import { getLowStockItems } from "@/lib/api/inventory";

import Link from "next/link";

import {
  LayoutDashboard,
  Bike,
  Wrench,
  BadgeDollarSign,
  ShoppingCart,
  DollarSign,
  Truck,
  CreditCard,
  ClipboardList,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
];

const operationLinks = [
  { href: "/bikes", label: "Bikes", icon: Bike },
  { href: "/models", label: "Models", icon: Bike },
  { href: "/parts", label: "Parts", icon: Wrench },
  { href: "/offers", label: "Offers", icon: BadgeDollarSign },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/sales", label: "Sales", icon: DollarSign },
  { href: "/deliveries", label: "Delivery", icon: Truck },
];

const adminLinks = [
  { href: "/transactions", label: "Transactions", icon: CreditCard },
  { href: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { href: "/users", label: "Users", icon: Users },
  { href: "/branches", label: "Branches", icon: Building2 },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0); // ← was missing

  useEffect(() => {
    const fetchLowStockCount = async () => {
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

  if (!["ADMIN", "MANAGER", "SALES_STAFF"].includes(user.role)) {
    return null;
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isStaff = user.role === UserRole.SALES_STAFF;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string, extra = "") =>
    `flex items-center rounded-lg text-sm font-medium transition-colors mb-1 ${extra}`;

  const linkStyle = (href: string) => ({
    color: isActive(href) ? theme.accents.primary : theme.text.secondary,
    backgroundColor: isActive(href)
      ? `${theme.accents.tertiary}30`
      : "transparent",
  });

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
        style={{
          backgroundColor: theme.backgrounds.secondary,
          color: theme.text.primary,
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: collapsed ? "80px" : "260px",
          backgroundColor: theme.backgrounds.secondary,
          borderRight: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex flex-col h-full">

          {/* Brand */}
          <div
            className={`border-b flex items-center ${
              collapsed ? "justify-center p-4" : "justify-between p-6"
            }`}
            style={{ borderColor: theme.borders.light }}
          >
            {!collapsed && (
              <div>
                <span
                  className="font-bold text-xl"
                  style={{ color: theme.text.primary }}
                >
                  ALI & KHAN&apos;S
                </span>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                  Admin Portal
                </p>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: theme.backgrounds.primary,
                color: theme.text.secondary,
              }}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* Main */}
            <div>
              {!collapsed && (
                <p
                  className="text-xs font-semibold uppercase mb-3 px-3"
                  style={{ color: theme.text.muted }}
                >
                  Main
                </p>
              )}
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={linkClass(
                    href,
                    collapsed ? "justify-center px-2 py-3" : "space-x-3 px-3 py-2"
                  )}
                  style={linkStyle(href)}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              ))}
            </div>

            {/* Operations */}
            <div>
              {!collapsed && (
                <p
                  className="text-xs font-semibold uppercase mb-3 px-3"
                  style={{ color: theme.text.muted }}
                >
                  Operations
                </p>
              )}
              {operationLinks.map(({ href, label, icon: Icon }) => {
                if (href === "/models" && isStaff) return null;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(
                      href,
                      collapsed
                        ? "justify-center px-2 py-3"
                        : "space-x-3 px-3 py-2"
                    )}
                    style={linkStyle(href)}
                  >
                    <Icon size={18} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{label}</span>
                        {href === "/parts" && lowStockCount > 0 && (
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center font-bold"
                            style={{
                              backgroundColor: theme.accents.secondary,
                              color: theme.text.inverse,
                              fontSize: "10px",
                            }}
                          >
                            {lowStockCount > 9 ? "9+" : lowStockCount}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Admin only */}
            {isAdmin && (
              <div>
                {!collapsed && (
                  <p
                    className="text-xs font-semibold uppercase mb-3 px-3"
                    style={{ color: theme.text.muted }}
                  >
                    Administration
                  </p>
                )}
                {adminLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(
                      href,
                      collapsed
                        ? "justify-center px-2 py-3"
                        : "space-x-3 px-3 py-2"
                    )}
                    style={linkStyle(href)}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                ))}
              </div>
            )}

            {/* Manager only */}
            {isManager && (
              <div>
                {!collapsed && (
                  <p
                    className="text-xs font-semibold uppercase mb-3 px-3"
                    style={{ color: theme.text.muted }}
                  >
                    Management
                  </p>
                )}
                <Link
                  href="/branches"
                  className={linkClass(
                    "/branches",
                    collapsed
                      ? "justify-center px-2 py-3"
                      : "space-x-3 px-3 py-2"
                  )}
                  style={linkStyle("/branches")}
                >
                  <Building2 size={18} />
                  {!collapsed && <span>My Branch</span>}
                </Link>
              </div>
            )}
          </div>

          {/* User info + logout */}
          <div className="p-4 border-t" style={{ borderColor: theme.borders.light }}>
            {!collapsed && (
              <div className="mb-3">
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  Logged in as
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.text.primary }}
                >
                  {user.email}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className={`w-full py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center ${
                collapsed ? "px-2" : "space-x-2 px-4"
              }`}
              style={{
                backgroundColor: theme.accents.secondary,
                color: theme.text.inverse,
              }}
            >
              <LogOut size={16} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}