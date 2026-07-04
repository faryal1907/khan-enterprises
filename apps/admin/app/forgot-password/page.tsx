"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api-client";
import { theme } from "@/lib/colors";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/forgot-password";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post("/auth/admin/forgot-password", data);
      setSuccess(response.data.message);
    } catch (err: unknown) {
      const apiMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(apiMessage ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 md:py-8"
      style={{ backgroundColor: theme.backgrounds.secondary }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-md p-5 md:p-8"
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        {/* Brand header */}
        <div className="mb-6 md:mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Ali & Khan's Green Wheels"
            className="mx-auto h-14 md:h-24 w-auto object-contain"
          />
          <p
            className="text-xs sm:text-sm mt-3"
            style={{ color: theme.text.muted }}
          >
            Enter your admin email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
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
              className="w-full px-3 py-2 rounded text-sm focus:outline-none transition-colors"
              style={{
                backgroundColor: theme.backgrounds.tertiary,
                border: `1px solid ${theme.borders.medium}`,
                color: theme.text.primary,
              }}
            />
            {errors.email && (
              <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="text-sm rounded-lg px-4 py-3"
              style={{
                backgroundColor: `${theme.accents.error}18`,
                border: `1px solid ${theme.accents.error}`,
                color: theme.accents.error,
              }}
            >
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div
              className="text-sm rounded-lg px-4 py-3"
              style={{
                backgroundColor: `${theme.accents.secondary}18`,
                border: `1px solid ${theme.accents.secondary}`,
                color: theme.text.primary,
              }}
            >
              {success}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.accents.primary,
              color: theme.text.inverse,
            }}
          >
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm" style={{ color: theme.text.muted }}>
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: theme.accents.primary }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
