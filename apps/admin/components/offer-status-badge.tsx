import { theme } from "@/lib/colors";

export function getOfferStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
        border: "1px solid #F59E0B",
      };
    case "ACCEPTED":
    case "PAID":
      return {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
        border: "1px solid #10B981",
      };
    case "REJECTED":
      return {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
        border: "1px solid #EF4444",
      };
    case "COUNTERED":
      return {
        backgroundColor: "#DBEAFE",
        color: "#1E40AF",
        border: "1px solid #3B82F6",
      };
    case "EXPIRED":
      return {
        backgroundColor: "#F3F4F6",
        color: "#374151",
        border: "1px solid #6B7280",
      };
    default:
      return {
        backgroundColor: theme.backgrounds.tertiary,
        color: theme.text.secondary,
        border: `1px solid ${theme.borders.medium}`,
      };
  }
}

export function OfferStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-medium rounded" style={getOfferStatusColor(status)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
