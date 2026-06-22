"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Language } from "./i18n";

export type Theme = "light" | "dark";

export interface Settings {
  theme: Theme;
  language: Language;
  examDate: string | null;
}

interface SettingsContextValue extends Settings {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setExamDate: (date: string | null) => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const DEFAULTS: Settings = { theme: "light", language: "en", examDate: null };

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ theme: data.theme, language: data.language, examDate: data.examDate }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", settings.language);
  }, [settings.language]);

  const persist = useCallback((patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => {});
  }, [settings]);

  const setTheme = useCallback((theme: Theme) => persist({ theme }), [persist]);
  const setLanguage = useCallback((language: Language) => persist({ language }), [persist]);
  const setExamDate = useCallback((examDate: string | null) => persist({ examDate }), [persist]);

  return (
    <SettingsContext.Provider value={{ ...settings, setTheme, setLanguage, setExamDate, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
