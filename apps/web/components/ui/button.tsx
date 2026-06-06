import { theme } from "@/lib/colors";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: {
      backgroundColor: theme.accents.primary,
      color: theme.text.inverse,
    },
    secondary: {
      backgroundColor: theme.accents.secondary,
      color: theme.text.inverse,
    },
    tertiary: {
      backgroundColor: theme.backgrounds.tertiary,
      color: theme.text.primary,
      border: `1px solid ${theme.borders.medium}`,
    },
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
