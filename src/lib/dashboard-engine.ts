export interface DailyStats {
  date: string;
  wordsLearned: number;
  verbsLearned: number;
  timeSpentMins: number;
}

export interface ProgressSummary {
  totalWords: number;
  wordsLearned: number;
  totalVerbs: number;
  verbsLearned: number;
  chaptersCompleted: number;
  totalChapters: number;
  streak: number;
}

export function calculateStreak(logs: DailyStats[]): number {
  if (logs.length === 0) return 0;

  const sorted = [...logs]
    .filter((l) => l.wordsLearned > 0 || l.verbsLearned > 0 || l.timeSpentMins > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateOverallProgress(summary: ProgressSummary): number {
  const wordProgress = summary.totalWords > 0
    ? (summary.wordsLearned / summary.totalWords) * 40
    : 0;
  const verbProgress = summary.totalVerbs > 0
    ? (summary.verbsLearned / summary.totalVerbs) * 30
    : 0;
  const chapterProgress = summary.totalChapters > 0
    ? (summary.chaptersCompleted / summary.totalChapters) * 30
    : 0;
  return Math.round(wordProgress + verbProgress + chapterProgress);
}

export function getWeeklyAverage(logs: DailyStats[]): { words: number; verbs: number; mins: number } {
  if (logs.length === 0) return { words: 0, verbs: 0, mins: 0 };
  const last7 = logs.slice(-7);
  const count = last7.length;
  return {
    words: Math.round(last7.reduce((s, l) => s + l.wordsLearned, 0) / count),
    verbs: Math.round(last7.reduce((s, l) => s + l.verbsLearned, 0) / count),
    mins: Math.round(last7.reduce((s, l) => s + l.timeSpentMins, 0) / count),
  };
}

export function getReadinessLevel(overallPercent: number, daysLeft: number): string {
  if (overallPercent >= 80 && daysLeft > 5) return "ready";
  if (overallPercent >= 60) return "on-track";
  if (overallPercent >= 30) return "behind";
  return "at-risk";
}

export function getReadinessLabel(level: string, lang: "en" | "de"): string {
  const labels: Record<string, { en: string; de: string }> = {
    ready: { en: "Exam Ready!", de: "Prüfungsbereit!" },
    "on-track": { en: "On Track", de: "Auf Kurs" },
    behind: { en: "Behind Schedule", de: "Im Rückstand" },
    "at-risk": { en: "At Risk", de: "Gefährdet" },
  };
  return labels[level]?.[lang] ?? level;
}
