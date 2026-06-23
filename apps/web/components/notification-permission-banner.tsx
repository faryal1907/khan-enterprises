"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { theme } from "@/lib/colors";

export function NotificationPermissionBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      // Show banner if permission is default (not asked yet)
      if (Notification.permission === "default") {
        setShowBanner(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "default") {
        setShowBanner(false);
      }
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    // Store dismissal in session storage so it doesn't show again this session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("notification-banner-dismissed", "true");
    }
  };

  // Check if banner was dismissed this session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("notification-banner-dismissed");
      if (dismissed === "true") {
        setShowBanner(false);
      }
    }
  }, []);

  if (!showBanner || permission !== "default") {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 rounded-xl p-4 shadow-lg"
      style={{
        backgroundColor: theme.backgrounds.primary,
        border: `1px solid ${theme.borders.light}`,
        borderLeftWidth: "4px",
        borderLeftColor: theme.accents.secondary,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-1" style={{ color: theme.text.primary }}>
            Enable Notifications
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: theme.text.secondary }}>
            Allow notifications to receive updates about your order status, payment verification, and delivery progress.
          </p>
          <button
            onClick={requestPermission}
            className="mt-3 px-4 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: theme.accents.secondary,
              color: theme.text.inverse,
            }}
          >
            Enable Notifications
          </button>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: theme.text.muted }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
