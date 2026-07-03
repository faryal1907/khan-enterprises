"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase returns tokens in hash fragment, need to extract from window.location.hash
        const hashFragment = window.location.hash.substring(1); // Remove #
        const params = new URLSearchParams(hashFragment);
        
        const supabaseAccessToken = params.get('access_token');
        const supabaseRefreshToken = params.get('refresh_token');

        if (!supabaseAccessToken || !supabaseRefreshToken) {
          throw new Error("Missing Supabase tokens in callback");
        }

        // Send Supabase tokens to backend to exchange for JWT tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: supabaseAccessToken,
            refreshToken: supabaseRefreshToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || "Failed to exchange tokens");
        }

        const { accessToken, refreshToken, user } = await response.json();
        
        // Set auth in store
        setAuth(user, accessToken, refreshToken);
        
        setStatus("success");
        
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (err: unknown) {
        console.error("Auth callback error:", err);
        const message = (err as { message?: string })?.message ?? "Authentication failed";
        setError(message);
        setStatus("error");
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [router, setAuth]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.backgrounds.primary }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-md p-6 sm:p-8 text-center"
        style={{
          backgroundColor: theme.backgrounds.secondary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        {status === "loading" && (
          <div>
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-spin"
              style={{ 
                border: `3px solid ${theme.borders.medium}`,
                borderTopColor: theme.accents.primary 
              }}
            />
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: theme.text.primary }}>
              Authenticating...
            </h2>
            <p className="text-sm sm:text-base" style={{ color: theme.text.muted }}>
              Please wait while we sign you in
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: `${theme.accents.primary}20` }}
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                style={{ color: theme.accents.primary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: theme.text.primary }}>
              Success!
            </h2>
            <p className="text-sm sm:text-base" style={{ color: theme.text.muted }}>
              Redirecting you to the home page...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              style={{ backgroundColor: `${theme.accents.secondary}20` }}
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                style={{ color: theme.accents.secondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: theme.text.primary }}>
              Authentication Failed
            </h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: theme.text.muted }}>
              {error || "Something went wrong during authentication"}
            </p>
            <p className="text-sm sm:text-base" style={{ color: theme.text.muted }}>
              Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
