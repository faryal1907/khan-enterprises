import { theme } from "@/lib/colors";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "available" | "reserved" | "sold" | "rejected";
  className?: string;
}

export function Badge({ children, variant = "available", className = "" }: BadgeProps) {
  const variantStyles = {
    available: {
      backgroundColor: `${theme.accents.tertiary}30`,
      color: theme.accents.primary,
    },
    reserved: {
      backgroundColor: `${theme.accents.secondary}30`,
      color: theme.accents.secondary,
    },
    sold: {
      backgroundColor: `${theme.colors.gray300}30`,
      color: theme.colors.gray600,
    },
    rejected: {
      backgroundColor: `${theme.accents.primary}20`,
      color: theme.accents.primary,
    },
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
