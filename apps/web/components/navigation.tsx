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
  { href: "/parts", label: "Parts" },
];

export function Navigation() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-4">

        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          
          <span className="font-bold text-xl hidden sm:block" style={{ color: theme.text.primary }}>
            Ali & Khan's
          </span>
        </Link>

        {/* Navigation Links - Centered */}
        <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
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
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? theme.accents.primary : theme.text.secondary,
                  backgroundColor: active
                    ? `${theme.accents.tertiary}30`
                    : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
          {/* Orders — for all authenticated users */}
          {user && (
            <>
              <Link
                href="/offers"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive("/offers") ? theme.accents.primary : theme.text.secondary,
                  backgroundColor: isActive("/offers")
                    ? `${theme.accents.tertiary}30`
                    : "transparent",
                }}
              >
                Negotiations
              </Link>
              <Link
                href="/orders"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive("/orders") ? theme.accents.primary : theme.text.secondary,
                  backgroundColor: isActive("/orders")
                    ? `${theme.accents.tertiary}30`
                    : "transparent",
                }}
              >
                Orders
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:opacity-70"
          style={{ color: theme.text.primary }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Search + User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bikes, parts…"
              className="w-48 px-4 py-2 rounded-lg text-sm focus:outline-none"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: theme.backgrounds.secondary,
            borderColor: theme.borders.light,
          }}
        >
          <div className="px-4 py-4 space-y-3">
            {/* Navigation Links */}
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: active ? theme.accents.primary : theme.text.secondary,
                    backgroundColor: active
                      ? `${theme.accents.tertiary}30`
                      : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            {/* Authenticated user links */}
            {user && (
              <>
                <Link
                  href="/offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive("/offers") ? theme.accents.primary : theme.text.secondary,
                    backgroundColor: isActive("/offers")
                      ? `${theme.accents.tertiary}30`
                      : "transparent",
                  }}
                >
                  Negotiations
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive("/orders") ? theme.accents.primary : theme.text.secondary,
                    backgroundColor: isActive("/orders")
                      ? `${theme.accents.tertiary}30`
                      : "transparent",
                  }}
                >
                  Orders
                </Link>
              </>
            )}
            {/* Search bar for mobile */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bikes, parts…"
                className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none"
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
            {/* User actions for mobile */}
            {user ? (
              <div className="pt-3 border-t space-y-2" style={{ borderColor: theme.borders.light }}>
                <div className="text-sm px-3" style={{ color: theme.text.muted }}>
                  {user.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 text-left"
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
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 text-center"
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
      )}
    </nav>
  );
}
