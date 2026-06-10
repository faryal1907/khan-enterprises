"use client";

import { theme } from "@/lib/colors";

interface TimelineEvent {
  id: string;
  type: "offer" | "counter" | "response" | "status_change" | "expiry";
  title: string;
  description?: string;
  amount?: number;
  timestamp: string;
  actor?: "customer" | "admin" | "system";
}

interface OfferThreadProps {
  offer: {
    id: string;
    offerAmount: number;
    counterAmount?: number | null;
    message?: string | null;
    adminResponse?: string | null;
    status: string;
    createdAt: string;
    expiresAt?: string | null;
  };
  className?: string;
}

export default function OfferThread({ offer, className = "" }: OfferThreadProps) {
  const timelineEvents: TimelineEvent[] = [];

  // Initial offer
  timelineEvents.push({
    id: "initial-offer",
    type: "offer",
    title: "Initial Offer",
    description: offer.message || undefined,
    amount: offer.offerAmount,
    timestamp: offer.createdAt,
    actor: "customer",
  });

  // Counter offer (if exists)
  if (offer.counterAmount && offer.adminResponse) {
    timelineEvents.push({
      id: "counter-offer",
      type: "counter",
      title: "Counter Offer",
      description: offer.adminResponse,
      amount: offer.counterAmount,
      timestamp: offer.createdAt, // In real implementation, this would have its own timestamp
      actor: "admin",
    });
  }

  // Status changes
  if (offer.status === "ACCEPTED") {
    timelineEvents.push({
      id: "accepted",
      type: "status_change",
      title: "Offer Accepted",
      timestamp: offer.createdAt, // In real implementation, this would have its own timestamp
      actor: offer.counterAmount ? "customer" : "admin",
    });
  } else if (offer.status === "REJECTED") {
    timelineEvents.push({
      id: "rejected",
      type: "status_change",
      title: "Offer Rejected",
      description: offer.adminResponse || undefined,
      timestamp: offer.createdAt, // In real implementation, this would have its own timestamp
      actor: "admin",
    });
  } else if (offer.status === "EXPIRED") {
    timelineEvents.push({
      id: "expired",
      type: "expiry",
      title: "Offer Expired",
      timestamp: offer.expiresAt || offer.createdAt,
      actor: "system",
    });
  }

  const getEventStyle = (event: TimelineEvent) => {
    switch (event.type) {
      case "offer":
        return {
          dotColor: theme.accents.primary,
          bgColor: "#E0F2FE",
          borderColor: "#3B82F6",
        };
      case "counter":
        return {
          dotColor: theme.accents.secondary,
          bgColor: "#DBEAFE",
          borderColor: "#6366F1",
        };
      case "status_change":
        return {
          dotColor: event.title === "Offer Accepted" ? "#10B981" : "#EF4444",
          bgColor: event.title === "Offer Accepted" ? "#D1FAE5" : "#FEE2E2",
          borderColor: event.title === "Offer Accepted" ? "#10B981" : "#EF4444",
        };
      case "expiry":
        return {
          dotColor: "#6B7280",
          bgColor: "#F3F4F6",
          borderColor: "#6B7280",
        };
      default:
        return {
          dotColor: theme.accents.primary,
          bgColor: theme.backgrounds.tertiary,
          borderColor: theme.borders.medium,
        };
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: theme.text.primary }}
      >
        Negotiation Timeline
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: theme.borders.light }}
        />

        {/* Timeline events */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const style = getEventStyle(event);
            return (
              <div key={event.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className="absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: style.dotColor,
                    borderColor: style.borderColor,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Event content */}
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: style.bgColor,
                    border: `1px solid ${style.borderColor}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4
                      className="font-semibold text-sm"
                      style={{ color: theme.text.primary }}
                    >
                      {event.title}
                    </h4>
                    {event.actor && (
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.7)",
                          color: theme.text.secondary,
                        }}
                      >
                        {event.actor === "customer"
                          ? "Customer"
                          : event.actor === "admin"
                          ? "Admin"
                          : "System"}
                      </span>
                    )}
                  </div>

                  {event.amount && (
                    <p
                      className="text-lg font-bold mb-2"
                      style={{ color: theme.text.primary }}
                    >
                      {formatAmount(event.amount)}
                    </p>
                  )}

                  {event.description && (
                    <p
                      className="text-sm mb-2"
                      style={{ color: theme.text.secondary }}
                    >
                      {event.description}
                    </p>
                  )}

                  <p
                    className="text-xs"
                    style={{ color: theme.text.muted }}
                  >
                    {formatDateTime(event.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
