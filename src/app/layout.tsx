import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "German B1 Planner",
  description: "30-day telc B1 exam preparation",
  manifest: "/manifest.json",
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
        </SettingsProvider>
      </body>
    </html>
  );
}
