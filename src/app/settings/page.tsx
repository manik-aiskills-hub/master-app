"use client";

import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { calculateDaysLeft, calculatePace } from "@/lib/pace";

export default function SettingsPage() {
  const { theme, language, examDate, setTheme, setLanguage, setExamDate } = useSettings();

  const daysLeft = examDate ? calculateDaysLeft(new Date(examDate)) : null;
  const pace = daysLeft !== null ? calculatePace(daysLeft) : null;

  return (
    <main className="container">
      <h1>{t(language, "settings.title")}</h1>

      <section className="settings-section">
        <label className="settings-label">
          {t(language, "settings.theme")}
          <div className="settings-toggle">
            <button
              className={`toggle-btn${theme === "light" ? " toggle-btn--active" : ""}`}
              onClick={() => setTheme("light")}
            >
              {t(language, "settings.theme.light")}
            </button>
            <button
              className={`toggle-btn${theme === "dark" ? " toggle-btn--active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              {t(language, "settings.theme.dark")}
            </button>
          </div>
        </label>
      </section>

      <section className="settings-section">
        <label className="settings-label">
          {t(language, "settings.language")}
          <div className="settings-toggle">
            <button
              className={`toggle-btn${language === "en" ? " toggle-btn--active" : ""}`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              className={`toggle-btn${language === "de" ? " toggle-btn--active" : ""}`}
              onClick={() => setLanguage("de")}
            >
              DE
            </button>
          </div>
        </label>
      </section>

      <section className="settings-section">
        <label className="settings-label">
          {t(language, "settings.examDate")}
          <input
            type="date"
            className="settings-input"
            value={examDate ?? ""}
            onChange={(e) => setExamDate(e.target.value || null)}
          />
        </label>
        {daysLeft !== null && pace && (
          <div className="pace-indicator">
            <span className={`pace-badge pace-badge--${pace}`}>
              {t(language, `settings.pace.${pace}`)}
            </span>
            <span className="pace-days">
              {daysLeft} {t(language, "settings.daysLeft")}
            </span>
          </div>
        )}
      </section>
    </main>
  );
}
