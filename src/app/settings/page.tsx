"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { calculateDaysLeft, calculatePace } from "@/lib/pace";
import { isNotificationSupported, getNotificationPermission, requestNotificationPermission, scheduleReminder } from "@/lib/notifications";

interface DailyTarget {
  wordsPerDay: number;
  grammarPerDay: number;
  reminderTime: string;
}

function useDailyTarget() {
  const [target, setTarget] = useState<DailyTarget>({ wordsPerDay: 15, grammarPerDay: 1, reminderTime: "09:00" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dailyTarget");
      if (saved) setTarget({ wordsPerDay: 15, grammarPerDay: 1, reminderTime: "09:00", ...JSON.parse(saved) });
    } catch {}
  }, []);

  const update = (patch: Partial<DailyTarget>) => {
    const next = { ...target, ...patch };
    setTarget(next);
    localStorage.setItem("dailyTarget", JSON.stringify(next));
  };

  return { target, update };
}

export default function SettingsPage() {
  const { theme, language, examDate, setTheme, setLanguage, setExamDate } = useSettings();
  const { target, update: updateTarget } = useDailyTarget();
  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>("default");

  useEffect(() => {
    setNotifSupported(isNotificationSupported());
    setNotifPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (notifPermission === "granted" && target.reminderTime) {
      scheduleReminder(target.reminderTime);
    }
  }, [notifPermission, target.reminderTime]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? "granted" : "denied");
    if (granted) scheduleReminder(target.reminderTime);
  };

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

      <section className="settings-section">
        <h2 className="settings-section-title">
          {language === "de" ? "Tagesziel" : "Daily Target"}
        </h2>
        <label className="settings-label">
          {language === "de" ? "Wörter pro Tag" : "Words per day"}
          <div className="settings-stepper">
            <button
              className="stepper-btn"
              onClick={() => updateTarget({ wordsPerDay: Math.max(5, target.wordsPerDay - 5) })}
            >
              −
            </button>
            <span className="stepper-value">{target.wordsPerDay}</span>
            <button
              className="stepper-btn"
              onClick={() => updateTarget({ wordsPerDay: Math.min(50, target.wordsPerDay + 5) })}
            >
              +
            </button>
          </div>
        </label>
        <label className="settings-label">
          {language === "de" ? "Grammatikregeln pro Tag" : "Grammar rules per day"}
          <div className="settings-stepper">
            <button
              className="stepper-btn"
              onClick={() => updateTarget({ grammarPerDay: Math.max(1, target.grammarPerDay - 1) })}
            >
              −
            </button>
            <span className="stepper-value">{target.grammarPerDay}</span>
            <button
              className="stepper-btn"
              onClick={() => updateTarget({ grammarPerDay: Math.min(10, target.grammarPerDay + 1) })}
            >
              +
            </button>
          </div>
        </label>
        <label className="settings-label">
          {language === "de" ? "Erinnerungszeit" : "Reminder time"}
          <input
            type="time"
            className="settings-input"
            value={target.reminderTime}
            onChange={(e) => updateTarget({ reminderTime: e.target.value })}
          />
        </label>
      </section>

      {notifSupported && (
        <section className="settings-section">
          <h2 className="settings-section-title">
            {language === "de" ? "Benachrichtigungen" : "Notifications"}
          </h2>
          {notifPermission === "granted" ? (
            <div className="settings-notif-status settings-notif-status--on">
              <span className="streak-flame__icon">🔔</span>
              <span>{language === "de" ? "Erinnerungen aktiviert" : "Reminders enabled"}</span>
            </div>
          ) : notifPermission === "denied" ? (
            <div className="settings-notif-status settings-notif-status--off">
              <span>🔕</span>
              <span>{language === "de" ? "Benachrichtigungen blockiert. Bitte in den Geräteeinstellungen aktivieren." : "Notifications blocked. Please enable in device settings."}</span>
            </div>
          ) : (
            <button className="btn btn--primary" onClick={handleEnableNotifications} style={{ width: "100%" }}>
              {language === "de" ? "Erinnerungen aktivieren" : "Enable Reminders"}
            </button>
          )}
        </section>
      )}
    </main>
  );
}
