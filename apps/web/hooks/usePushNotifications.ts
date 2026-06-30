"use client";

import { useEffect, useState, useRef } from "react";
import { requestForToken, onMessageListener } from "../lib/firebase";
import { toast } from "sonner";
import { api } from "../lib/api-client";

import { useAuthStore } from "../lib/auth-store";

export const usePushNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const isRegistered = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker (config is now embedded in the file)
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully.");
        })
        .catch((err) => {
          console.error("Service Worker registration failed: ", err);
        });
    }
  }, []);

  useEffect(() => {
    if (!user) return; // Wait until the user is authenticated

    const initPushNotifications = async () => {
      try {
        const token = await requestForToken();
        if (token && !isRegistered.current) {
          setFcmToken(token);
          // Send token to backend to save in the database
          await api.post("/firebase/register-token", { token });
          isRegistered.current = true;
          console.log("FCM Token registered with backend.");
        }
      } catch (error) {
        console.error("Failed to initialize push notifications", error);
      }
    };

    initPushNotifications();
  }, [user]);

  useEffect(() => {
    if (!fcmToken) return;

    // Listen for foreground messages
    const listenForMessages = async () => {
      try {
        const payload: any = await onMessageListener();
        if (payload?.notification) {
          toast(payload.notification.title, {
            description: payload.notification.body,
            action: payload.data?.url
              ? {
                  label: "View",
                  onClick: () => {
                    window.location.href = payload.data.url;
                  },
                }
              : undefined,
          });
        }
        // Restart listener to catch the next message
        listenForMessages();
      } catch (err) {
        console.error("Failed to listen for messages", err);
      }
    };

    listenForMessages();
  }, [fcmToken]);

  return { fcmToken };
};
