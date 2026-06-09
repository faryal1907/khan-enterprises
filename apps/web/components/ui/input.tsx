import { theme } from "@/lib/colors";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.text.secondary }}
        >
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg focus:outline-none ${className}`}
        style={{
          backgroundColor: theme.backgrounds.tertiary,
          border: error
            ? `1px solid ${theme.accents.secondary}`
            : `1px solid ${theme.borders.medium}`,
          color: theme.text.primary,
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: theme.accents.secondary }}>
          {error}
        </p>
      )}
    </div>
  );
}
