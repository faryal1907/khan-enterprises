import { theme } from "@/lib/colors";
import { BikeStatus } from "@/lib/types";

const STATUS_COLORS: Record<BikeStatus, { backgroundColor: string; color: string }> = {
  [BikeStatus.PENDING_SETUP]: {
    backgroundColor: theme.borders.medium,
    color: theme.text.primary,
  },
  [BikeStatus.AVAILABLE]: {
    backgroundColor: theme.accents.tertiary,
    color: theme.text.inverse,
  },
  [BikeStatus.RESERVED]: {
    backgroundColor: theme.accents.secondary,
    color: theme.text.inverse,
  },
  [BikeStatus.SOLD]: {
    backgroundColor: theme.accents.primary,
    color: theme.text.inverse,
  },
  [BikeStatus.IN_DELIVERY]: {
    backgroundColor: theme.backgrounds.secondary,
    color: theme.text.primary,
  },
};

export function BikeStatusBadge({ status }: { status: BikeStatus }) {
  return (
    <span className="px-2 py-1 rounded text-xs font-medium" style={STATUS_COLORS[status]}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
