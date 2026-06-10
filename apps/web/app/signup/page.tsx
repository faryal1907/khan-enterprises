"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { theme } from "@/lib/colors";
import type { LoginResponse } from "@/lib/types";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/register";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const response = await api.post<LoginResponse>("/auth/register", data);
      const { accessToken, refreshToken, user } = response.data;
      setAuth(user, accessToken, refreshToken);
      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Registration failed. Please try again.";
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
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full name field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.secondary }}
            >
              Full Name
            </label>
            <input
              {...register("fullName")}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                {errors.fullName.message}
              </p>
            )}
          </div>

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
              placeholder="you@example.com"
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

          {/* Phone number field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.secondary }}
            >
              Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              type="tel"
              autoComplete="tel"
              placeholder="03XXXXXXXXX"
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Address field (optional) */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.secondary }}
            >
              Address (Optional)
            </label>
            <input
              {...register("address")}
              type="text"
              autoComplete="street-address"
              placeholder="Your address"
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.address && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                {errors.address.message}
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
              autoComplete="new-password"
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
            {isSubmitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        {/* Link to login */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.text.muted }}>
            Already have an account?{" "}
            <a href="/login" className="font-semibold hover:underline" style={{ color: theme.accents.primary }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
