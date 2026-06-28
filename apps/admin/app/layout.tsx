import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { theme } from "@/lib/colors";
import { Toaster } from "sonner";
import { PushNotificationProvider } from "@/components/push-notification-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khan Admin",
  description: "Ali & Khan's Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: theme.backgrounds.tertiary }}
      >
        <AuthProvider>
          <PushNotificationProvider />
          <Navigation>
            <main className="flex-1">{children}</main>
          </Navigation>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
