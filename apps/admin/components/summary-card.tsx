import { theme } from "@/lib/colors";

type SummaryCardProps = {
  label: string;
  value: number;
  color?: string;
};

export function SummaryCard({ label, value, color = theme.text.primary }: SummaryCardProps) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: theme.backgrounds.primary,
        border: `1px solid ${theme.borders.light}`,
      }}
    >
      <p className="text-sm" style={{ color: theme.text.secondary }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
