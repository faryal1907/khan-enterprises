"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { theme } from "@/lib/colors";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation/reset-password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
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
      const apiMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(apiMessage ?? "Something went wrong. Please try again.");
    }
  };

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );

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
            Set a new password for your admin account
          </p>
        </div>

        {success ? (
          /* Success state */
          <div className="space-y-4">
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
            <p className="text-xs text-center" style={{ color: theme.text.muted }}>
              Redirecting to login page…
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-5"
          >
            {/* New password */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 rounded text-sm focus:outline-none transition-colors"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-70 transition-opacity"
                  style={{ color: theme.text.secondary }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.secondary }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 rounded text-sm focus:outline-none transition-colors"
                  style={{
                    backgroundColor: theme.backgrounds.tertiary,
                    border: `1px solid ${theme.borders.medium}`,
                    color: theme.text.primary,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 hover:opacity-70 transition-opacity"
                  style={{ color: theme.text.secondary }}
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: theme.accents.error }}>
                  {errors.confirmPassword.message}
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full py-2 px-4 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.accents.primary,
                color: theme.text.inverse,
              }}
            >
              {isSubmitting ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm" style={{ color: theme.text.muted }}>
            <a
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: theme.accents.primary }}
            >
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
