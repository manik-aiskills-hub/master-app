import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import BottomNav from "@/components/BottomNav";
import RegisterSW from "@/components/RegisterSW";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "German B1 Planner",
  description: "30-day telc B1 exam preparation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "B1 Planner",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <SettingsProvider>
          {children}
          <BottomNav />
          <RegisterSW />
        </SettingsProvider>
      </body>
    </html>
  );
}
