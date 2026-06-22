"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

const tabs = [
  { key: "nav.learn" as const, href: "/", icon: "📖" },
  { key: "nav.quiz" as const, href: "/quiz", icon: "❓" },
  { key: "nav.exam" as const, href: "/exam", icon: "📝" },
  { key: "nav.progress" as const, href: "/progress", icon: "📊" },
  { key: "nav.settings" as const, href: "/settings", icon: "⚙️" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useSettings();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`nav-tab${active ? " nav-tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-tab__icon">{tab.icon}</span>
            <span className="nav-tab__label">{t(language, tab.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
