import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import BottomNav from "@/components/BottomNav";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "German B1 Planner",
  description: "30-day telc B1 exam preparation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "B1 Planner",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
          <BottomNav />
          <RegisterSW />
        </SettingsProvider>
      </body>
    </html>
  );
}
