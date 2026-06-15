import Link from "next/link";
import { theme } from "@/lib/colors";

type DashboardCardProps = {
  label: string;
  value?: number;
  href?: string;
  format?: "number" | "currency";
  emphasis?: "default" | "primary" | "secondary" | "tertiary";
};

const valueColors = {
  default: theme.text.primary,
  primary: theme.accents.primary,
  secondary: theme.accents.secondary,
  tertiary: theme.accents.tertiary,
};

export function DashboardCard({
  label,
  value,
  href,
  format = "number",
  emphasis = "default",
}: DashboardCardProps) {
  const content = (
    <>
      <p className="text-sm" style={{ color: theme.text.secondary }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold mt-2"
        style={{ color: valueColors[emphasis] }}
      >
        {value === undefined
          ? "—"
          : format === "currency"
            ? `Rs ${value.toLocaleString()}`
            : value.toLocaleString()}
      </p>
    </>
  );

  const className =
    "rounded-lg p-4 block transition-opacity hover:opacity-80";
  const style = {
    backgroundColor:
      emphasis === "secondary"
        ? theme.backgrounds.secondary
        : theme.backgrounds.primary,
    border: `1px solid ${
      emphasis === "secondary"
        ? theme.accents.secondary
        : theme.borders.light
    }`,
  };

  return href ? (
    <Link href={href} className={className} style={style}>
      {content}
    </Link>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  );
}
