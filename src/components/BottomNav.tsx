"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";

function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24"><path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11l9-8z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24"><path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V11l9-8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
  );
}

function DumbbellIcon({ active }: { active: boolean }) {
  const style = active ? {} : { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 24 24" {...style}>
      {active ? (
        <path d="M4 7h2v10H4a1 1 0 01-1-1V8a1 1 0 011-1zm3 1h2v8H7V8zm8 0h2v8h-2V8zm3-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2V7zM9 11h6v2H9v-2z"/>
      ) : (
        <>
          <path d="M4 7h2v10H4a1 1 0 01-1-1V8a1 1 0 011-1z"/><path d="M7 8h2v8H7z"/>
          <path d="M15 8h2v8h-2z"/><path d="M18 7h2a1 1 0 011 1v8a1 1 0 01-1 1h-2V7z"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
        </>
      )}
    </svg>
  );
}

function ClipboardIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24"><path d="M9 2h6a1 1 0 011 1v1h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2V3a1 1 0 011-1zm-1 5h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 2h6v3H9z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="13" y2="18"/>
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 01-10 0V4zM5 4H3v3a3 3 0 003 3h1a5 5 0 01-2-6zm14 0h2v3a3 3 0 01-3 3h-1a5 5 0 002-6zM9 15h6v2H9v-2zm-1 3h8v2H8v-2z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M5 4H3v3a3 3 0 003 3"/><path d="M19 4h2v3a3 3 0 01-3 3"/><line x1="9" y1="15" x2="9" y2="14"/><line x1="15" y1="15" x2="15" y2="14"/><rect x="8" y="15" width="8" height="2" rx="1"/><rect x="7" y="19" width="10" height="2" rx="1"/>
    </svg>
  );
}

function GearIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

const iconMap = {
  home: HomeIcon,
  quiz: DumbbellIcon,
  exam: ClipboardIcon,
  progress: TrophyIcon,
  settings: GearIcon,
} as const;

const tabs = [
  { key: "nav.learn" as const, href: "/", icon: "home" as const },
  { key: "nav.quiz" as const, href: "/quiz", icon: "quiz" as const },
  { key: "nav.exam" as const, href: "/exam", icon: "exam" as const },
  { key: "nav.progress" as const, href: "/progress", icon: "progress" as const },
  { key: "nav.settings" as const, href: "/settings", icon: "settings" as const },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useSettings();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = iconMap[tab.icon];
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`nav-tab${active ? " nav-tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-tab__icon">
              <Icon active={active} />
            </span>
            <span className="nav-tab__label">{t(language, tab.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
