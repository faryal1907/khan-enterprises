import { theme } from "@/lib/colors";

export function UserStatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className="px-2 py-1 text-xs font-medium rounded"
      style={{
        backgroundColor: isActive ? theme.accents.tertiary + "20" : theme.accents.secondary + "20",
        color: isActive ? theme.accents.tertiary : theme.accents.secondary,
      }}
    >
      {status}
    </span>
  );
}
