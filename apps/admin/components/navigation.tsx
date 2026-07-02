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
  BookOpen,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
];

const operationLinks = [
  { href: "/bikes", label: "Bikes", icon: Bike },
  { href: "/models", label: "Models", icon: Bike },
  { href: "/parts", label: "Parts", icon: Wrench },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/sales", label: "Sales", icon: DollarSign },
  { href: "/deliveries", label: "Delivery", icon: Truck },
];

const adminLinks = [
  { href: "/transactions", label: "Transactions", icon: CreditCard },
  { href: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { href: "/accounts", label: "Accounts", icon: BookOpen },
  { href: "/users", label: "Users", icon: Users },
  { href: "/branches", label: "Branches", icon: Building2 },
];

export function Navigation({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);

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
  }, );

  if (!user) return <>{children}</>;

  if (!["ADMIN", "MANAGER", "SALES_STAFF"].includes(user.role)) {
    return <>{children}</>;
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isStaff = user.role === UserRole.SALES_STAFF;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" :
    href === "/accounts" ? pathname.startsWith("/accounts") || pathname.startsWith("/vendors") :
    pathname.startsWith(href);

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
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-opacity ${
          sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          backgroundColor: theme.backgrounds.secondary,
          color: theme.text.primary,
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[280px] ${collapsed ? "md:w-[80px]" : "md:w-[260px]"}`}
        style={{
          backgroundColor: theme.backgrounds.secondary,
          borderRight: `1px solid ${theme.borders.light}`,
        }}
      >
        <div className="flex flex-col h-full">

          {/* Brand */}
          <div
            className={`border-b flex items-center justify-between p-4 md:p-6 ${
              collapsed ? "md:flex-col md:justify-center md:gap-2 md:p-3" : "md:justify-between"
            }`}
            style={{ borderColor: theme.borders.light }}
          >
            <Link
              href="/"
              className={`flex items-center min-w-0 ${
                collapsed ? "md:justify-center" : "md:flex-col md:items-start"
              }`}
              aria-label="Ali & Khan's Green Wheels admin home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Ali & Khan's Green Wheels"
                className={`w-auto object-contain ${collapsed ? "md:h-9 h-14" : "md:h-16 h-12"}`}
              />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: theme.backgrounds.primary,
                  color: theme.text.secondary,
                }}
              >
                <X size={18} />
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: theme.backgrounds.primary,
                  color: theme.text.secondary,
                }}
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* Main */}
            <div>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={linkClass(
                    href,
                    collapsed
                      ? "md:justify-center md:px-2 md:py-3 md:space-x-0 space-x-3 px-3 py-3"
                      : "md:space-x-3 md:px-3 md:py-2 space-x-3 px-3 py-3"
                  )}
                  style={linkStyle(href)}
                >
                  <Icon size={18} />
                  <span className={collapsed ? "md:hidden" : ""}>{label}</span>
                </Link>
              ))}
            </div>

            {/* Operations */}
            <div>
              {operationLinks.map(({ href, label, icon: Icon }) => {
                if (href === "/models" && isStaff) return null;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(
                      href,
                      collapsed
                        ? "md:justify-center md:px-2 md:py-3 md:space-x-0 space-x-3 px-3 py-3"
                        : "md:space-x-3 md:px-3 md:py-2 space-x-3 px-3 py-3"
                    )}
                    style={linkStyle(href)}
                  >
                    <Icon size={18} />
                    <span className={`${collapsed ? "md:hidden" : ""} flex-1`}>{label}</span>
                    {href === "/parts" && lowStockCount > 0 && (
                      <span
                        className={`${collapsed ? "md:hidden" : ""} w-5 h-5 rounded-full flex items-center justify-center font-bold`}
                        style={{
                          backgroundColor: theme.accents.secondary,
                          color: theme.text.inverse,
                          fontSize: "10px",
                        }}
                      >
                        {lowStockCount > 9 ? "9+" : lowStockCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Admin only */}
            {isAdmin && (
              <div>
                {adminLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(
                      href,
                      collapsed
                        ? "md:justify-center md:px-2 md:py-3 md:space-x-0 space-x-3 px-3 py-3"
                        : "md:space-x-3 md:px-3 md:py-2 space-x-3 px-3 py-3"
                    )}
                    style={linkStyle(href)}
                  >
                    <Icon size={18} />
                    <span className={collapsed ? "md:hidden" : ""}>{label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Manager only */}
            {isManager && (
              <div>
                <Link
                  href="/branches"
                  className={linkClass(
                    "/branches",
                    collapsed
                      ? "md:justify-center md:px-2 md:py-3 md:space-x-0 space-x-3 px-3 py-3"
                      : "md:space-x-3 md:px-3 md:py-2 space-x-3 px-3 py-3"
                  )}
                  style={linkStyle("/branches")}
                >
                  <Building2 size={18} />
                  <span className={collapsed ? "md:hidden" : ""}>My Branch</span>
                </Link>
              </div>
            )}
          </div>

          {/* User info + logout */}
          <div className="p-4 border-t" style={{ borderColor: theme.borders.light }}>
            <div className={`mb-3 ${collapsed ? "md:hidden" : ""}`}>
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
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className={`w-full rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center space-x-2 px-4 py-3 ${
                collapsed ? "md:px-2 md:py-2" : "md:space-x-2 md:px-4 md:py-2"
              }`}
              style={{
                backgroundColor: theme.accents.secondary,
                color: theme.text.inverse,
              }}
            >
              <LogOut size={16} />
              <span className={collapsed ? "md:hidden" : ""}>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ backgroundColor: theme.backgrounds.primary }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out flex-1 flex flex-col ${
          sidebarOpen ? "ml-[280px]" : "ml-0"
        } ${collapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}
      >
        <div className="md:hidden" style={{ height: "56px" }} /> {/* Spacer for mobile menu button */}
        {children}
      </div>
    </>
  );
}
