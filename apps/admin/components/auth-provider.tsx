"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import type { User } from "@/lib/types";

/**
 * Runs once on mount. If an accessToken cookie exists, calls GET /auth/me
 * to rehydrate the Zustand store with the user. This fixes the "Loading..."
 * problem caused by Zustand resetting to null on every full page reload.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { setAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      setHydrated(true);
      return;
    }

    api
      .get<{ user: User }>("/auth/me")
      .then((res) => {
        setAuth(res.data.user, token);
      })
      .catch(() => {
        // Token is invalid or expired — clear it and let middleware redirect
        logout();
        router.push("/login");
      })
      .finally(() => {
        setHydrated(true);
      });
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
