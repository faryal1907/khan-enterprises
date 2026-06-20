import { theme } from "@/lib/colors";
import { OrderStatus } from "@/lib/types";

export function getOrderStatusColor(status: string) {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return "#f59e0b";
    case OrderStatus.PAID:
      return "#3b82f6";
    case OrderStatus.CONFIRMED:
      return "#6366f1";
    case OrderStatus.READY_FOR_DELIVERY:
      return "#a855f7";
    case OrderStatus.DELIVERED:
      return "#22c55e";
    case OrderStatus.CANCELLED:
      return "#ef4444";
    default:
      return theme.text.secondary;
  }
}

export function OrderStatusBadge({ status }: { status: string }) {
  const color = getOrderStatusColor(status);

  return (
    <span
      className="inline-block px-2 py-1 text-xs font-medium rounded uppercase"
      style={{
        backgroundColor: `${color}20`,
        color,
        border: `1px solid ${color}`,
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
