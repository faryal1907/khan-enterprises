"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import axios from "axios";
import { theme } from "@/lib/colors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { initializeAuth, setTokens } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      initializeAuth();

      const { accessToken, refreshToken } = useAuthStore.getState();

      if (!accessToken && refreshToken) {
        setRefreshing(true);
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccess, refreshToken: newRefresh } = response.data;
          if (!cancelled) {
            setTokens(newAccess, newRefresh);
          }
        } catch {
          if (!cancelled) {
            useAuthStore.getState().logout();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } finally {
          if (!cancelled) {
            setRefreshing(false);
            setHydrated(true);
          }
        }
        return;
      }

      if (!cancelled) {
        setHydrated(true);
      }
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, [initializeAuth, setTokens]);

  if (!hydrated || refreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgrounds.primary }}>
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: theme.accents.primary }}
        />
      </div>
    );
  }

  return <>{children}</>;
}