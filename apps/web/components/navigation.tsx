"use client";
import { useAuthStore } from "@/lib/auth-store";
import { UserRole } from "@/lib/types";

export function Navigation() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;

  return (
    <nav className="border-b p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <span className="font-bold text-lg">Khan Web</span>
          <div className="flex space-x-4">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <a href="/bikes" className="hover:text-blue-600">
              Bikes
            </a>
            <a href="/parts" className="hover:text-blue-600">
              Parts
            </a>
            {(isAdmin || isManager) && (
              <a href="/orders" className="hover:text-blue-600">
                Orders
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user.email} ({user.role})
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
