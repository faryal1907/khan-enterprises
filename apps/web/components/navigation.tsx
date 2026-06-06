"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";
import { theme } from "@/lib/colors";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bikes", label: "Bikes" },
  { href: "/parts", label: "Parts & Accessories" },
];

export function Navigation() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="border-b shadow-sm sticky top-0 z-50"
      style={{
        backgroundColor: theme.backgrounds.secondary,
        borderColor: theme.borders.light,
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">

        {/* Logo / Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.accents.primary }}
            >
              <span className="font-bold text-xl" style={{ color: theme.text.inverse }}>
                K
              </span>
            </div>
            <span className="font-bold text-xl" style={{ color: theme.text.primary }}>
              Khan Enterprises
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map(({ href, label }) => {
              // Only show Orders link to ADMINs and MANAGERs
              if (href === "/orders" && !(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER)) {
                return null;
              }
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: active ? theme.accents.primary : theme.text.secondary,
                    backgroundColor: active
                      ? `${theme.accents.tertiary}30`
                      : "transparent",
                    borderBottom: active
                      ? `2px solid ${theme.accents.primary}`
                      : "2px solid transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            {/* Orders — conditional */}
            {user && (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) && (
              <Link
                href="/orders"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive("/orders") ? theme.accents.primary : theme.text.secondary,
                  backgroundColor: isActive("/orders")
                    ? `${theme.accents.tertiary}30`
                    : "transparent",
                  borderBottom: isActive("/orders")
                    ? `2px solid ${theme.accents.primary}`
                    : "2px solid transparent",
                }}
              >
                Orders
              </Link>
            )}
          </div>
        </div>

        {/* Search + User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bikes, parts…"
              className="w-56 px-4 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70"
              style={{ color: theme.text.muted }}
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* User actions */}
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm hidden lg:block" style={{ color: theme.text.muted }}>
                {user.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                style={{
                  backgroundColor: theme.accents.secondary,
                  color: theme.text.inverse,
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
