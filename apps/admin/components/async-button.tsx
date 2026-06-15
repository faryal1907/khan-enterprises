import type { ButtonHTMLAttributes, ReactNode } from "react";
import { theme } from "@/lib/colors";

type AsyncButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export function AsyncButton({
  loading = false,
  loadingLabel = "Working...",
  children,
  disabled,
  style,
  className = "",
  ...props
}: AsyncButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`px-4 py-2 text-sm font-medium rounded transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: theme.accents.primary,
        color: theme.text.inverse,
        ...style,
      }}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
