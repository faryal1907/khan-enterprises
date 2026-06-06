"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import type { LoginResponse } from "@/lib/types";
import { loginSchema, type LoginFormValues } from "@/lib/validation/login";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const response = await api.post<LoginResponse>("/auth/login", data);
      const { accessToken, user } = response.data;
      setAuth(user, accessToken);
      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Invalid email or password.";
      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: theme.backgrounds.primary }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-md p-8"
        style={{
          backgroundColor: theme.backgrounds.secondary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: theme.accents.primary }}
          >
            <span
              className="font-bold text-2xl"
              style={{ color: theme.text.inverse }}
            >
              K
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text.primary }}>
            Khan Enterprises
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.secondary }}
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@khan.com"
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.secondary }}
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.password && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API error banner */}
          {error && (
            <div
              className="text-sm rounded-lg px-4 py-3"
              style={{
                backgroundColor: `${theme.accents.secondary}18`,
                border: `1px solid ${theme.accents.secondary}`,
                color: theme.accents.secondary,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
