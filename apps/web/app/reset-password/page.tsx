"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { theme } from "@/lib/colors";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validation/reset-password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setSuccess(response.data.message);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiMessage ?? "Something went wrong. Please try again.");
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
        <div className="mb-2 text-center">
          <div className="w-48 h-48 flex items-center justify-center mx-auto mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Ali & Khan's Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
            Set a new password for your account
          </p>
        </div>

        {success ? (
          /* Success state */
          <div className="space-y-5">
            <div
              className="text-sm rounded-lg px-4 py-3"
              style={{
                backgroundColor: `${theme.accents.primary}18`,
                border: `1px solid ${theme.accents.primary}`,
                color: theme.accents.primary,
              }}
            >
              {success}
            </div>
            <p className="text-xs text-center" style={{ color: theme.text.muted }}>
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New password field */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                New Password
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

            {/* Confirm password field */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
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
              {errors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Error banner */}
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
              disabled={isSubmitting || !token}
              className="w-full py-2 px-4 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              {isSubmitting ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {/* Link back to login */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.text.muted }}>
            <a href="/login" className="font-semibold hover:underline" style={{ color: theme.accents.primary }}>
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}