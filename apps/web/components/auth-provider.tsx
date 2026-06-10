"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

const WEB_ACCESS_TOKEN_COOKIE = "webAccessToken";

/**
 * Runs once on mount. Restores auth state from cookies to fix the
 * Zustand store resetting to null on every full page reload.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    setHydrated(true);
  }, []);

  // Don't render children until we know auth state — prevents flash of wrong content
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
