import type { ReactNode } from "react";
import { theme } from "@/lib/colors";

type ActionModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function ActionModal({ title, children, onClose, className = "" }: ActionModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 ${className}`}
        style={{
          backgroundColor: theme.backgrounds.primary,
          border: `1px solid ${theme.borders.light}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4 shrink-0" style={{ color: theme.text.primary }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
