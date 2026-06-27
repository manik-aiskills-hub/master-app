"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { calculateDaysLeft } from "@/lib/pace";
import {
  calculateStreak,
  calculateOverallProgress,
  getWeeklyAverage,
  getReadinessLevel,
  getReadinessLabel,
  type DailyStats,
  type ProgressSummary,
} from "@/lib/dashboard-engine";

interface DashboardData {
  totalWords: number;
  wordsLearned: number;
  totalVerbs: number;
  verbsLearned: number;
  chaptersCompleted: number;
  totalChapters: number;
  dailyLogs: DailyStats[];
}

export default function ProgressPage() {
  const { language, examDate } = useSettings();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <main className="container">
        <h1>{language === "de" ? "Fortschritt" : "Progress"}</h1>
        <p>{language === "de" ? "Laden..." : "Loading..."}</p>
      </main>
    );
  }

  const streak = calculateStreak(data.dailyLogs);
  const summary: ProgressSummary = {
    totalWords: data.totalWords,
    wordsLearned: data.wordsLearned,
    totalVerbs: data.totalVerbs,
    verbsLearned: data.verbsLearned,
    chaptersCompleted: data.chaptersCompleted,
    totalChapters: data.totalChapters,
    streak,
  };
  const overall = calculateOverallProgress(summary);
  const weekly = getWeeklyAverage(data.dailyLogs);
  const daysLeft = examDate ? calculateDaysLeft(new Date(examDate)) : 30;
  const readiness = getReadinessLevel(overall, daysLeft);
  const readinessText = getReadinessLabel(readiness, language);

  return (
    <main className="container">
      <h1>{language === "de" ? "Fortschritt" : "Progress"}</h1>

      <div className="dashboard-readiness">
        <div className={`readiness-badge readiness-badge--${readiness}`}>
          {readinessText}
        </div>
        <div className="dashboard-overall">
          <div className="progress-bar-large">
            <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
          </div>
          <span className="progress-percent">{overall}%</span>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <span className="stat-number">{data.wordsLearned}</span>
          <span className="stat-label">/ {data.totalWords} {language === "de" ? "Wörter" : "Words"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.verbsLearned}</span>
          <span className="stat-label">/ {data.totalVerbs} {language === "de" ? "Verben" : "Verbs"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{data.chaptersCompleted}</span>
          <span className="stat-label">/ {data.totalChapters} {language === "de" ? "Kapitel" : "Chapters"}</span>
        </div>
        <div className="stat-card">
          <div className="streak-flame">
            <span className="streak-flame__icon">🔥</span>
            <span className="stat-number">{streak}</span>
          </div>
          <span className="stat-label">{language === "de" ? "Tage Serie" : "Day Streak"}</span>
        </div>
      </div>

      <h2>{language === "de" ? "Wochendurchschnitt" : "Weekly Average"}</h2>
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <span className="stat-number">{weekly.words}</span>
          <span className="stat-label">{language === "de" ? "Wörter/Tag" : "Words/Day"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{weekly.verbs}</span>
          <span className="stat-label">{language === "de" ? "Verben/Tag" : "Verbs/Day"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{weekly.mins}</span>
          <span className="stat-label">{language === "de" ? "Min/Tag" : "Mins/Day"}</span>
        </div>
      </div>

      {daysLeft > 0 && (
        <p className="dashboard-days-left">
          {daysLeft} {language === "de" ? "Tage bis zur Prüfung" : "days until exam"}
        </p>
      )}

      <a href="/review" className="btn btn--primary" style={{ display: "block", textAlign: "center", marginTop: "1rem" }}>
        🤖 {language === "de" ? "Mit Claude üben" : "Review with Claude"}
      </a>

      <a href="/mock-test" className="btn btn--secondary" style={{ display: "block", textAlign: "center", marginTop: "0.5rem" }}>
        {language === "de" ? "Probetests ansehen" : "View Mock Tests"}
      </a>
    </main>
  );
}
