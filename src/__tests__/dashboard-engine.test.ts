import {
  calculateStreak,
  calculateOverallProgress,
  getWeeklyAverage,
  getReadinessLevel,
  getReadinessLabel,
  type DailyStats,
  type ProgressSummary,
} from "@/lib/dashboard-engine";

describe("calculateStreak", () => {
  it("counts consecutive active days", () => {
    const logs: DailyStats[] = [
      { date: "2026-06-20", wordsLearned: 10, verbsLearned: 5, timeSpentMins: 30 },
      { date: "2026-06-21", wordsLearned: 12, verbsLearned: 4, timeSpentMins: 25 },
      { date: "2026-06-22", wordsLearned: 8, verbsLearned: 6, timeSpentMins: 20 },
    ];
    expect(calculateStreak(logs)).toBe(3);
  });

  it("breaks on gaps", () => {
    const logs: DailyStats[] = [
      { date: "2026-06-18", wordsLearned: 10, verbsLearned: 5, timeSpentMins: 30 },
      { date: "2026-06-21", wordsLearned: 12, verbsLearned: 4, timeSpentMins: 25 },
      { date: "2026-06-22", wordsLearned: 8, verbsLearned: 6, timeSpentMins: 20 },
    ];
    expect(calculateStreak(logs)).toBe(2);
  });

  it("returns 0 for empty logs", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("ignores days with zero activity", () => {
    const logs: DailyStats[] = [
      { date: "2026-06-21", wordsLearned: 0, verbsLearned: 0, timeSpentMins: 0 },
      { date: "2026-06-22", wordsLearned: 10, verbsLearned: 5, timeSpentMins: 30 },
    ];
    expect(calculateStreak(logs)).toBe(1);
  });
});

describe("calculateOverallProgress", () => {
  it("calculates weighted progress", () => {
    const summary: ProgressSummary = {
      totalWords: 600, wordsLearned: 300,
      totalVerbs: 110, verbsLearned: 55,
      chaptersCompleted: 15, totalChapters: 30,
      streak: 5,
    };
    // 50%*40 + 50%*30 + 50%*30 = 20+15+15 = 50
    expect(calculateOverallProgress(summary)).toBe(50);
  });

  it("handles zero totals", () => {
    const summary: ProgressSummary = {
      totalWords: 0, wordsLearned: 0,
      totalVerbs: 0, verbsLearned: 0,
      chaptersCompleted: 0, totalChapters: 0,
      streak: 0,
    };
    expect(calculateOverallProgress(summary)).toBe(0);
  });

  it("returns 100 when complete", () => {
    const summary: ProgressSummary = {
      totalWords: 600, wordsLearned: 600,
      totalVerbs: 110, verbsLearned: 110,
      chaptersCompleted: 30, totalChapters: 30,
      streak: 30,
    };
    expect(calculateOverallProgress(summary)).toBe(100);
  });
});

describe("getWeeklyAverage", () => {
  it("averages last 7 days", () => {
    const logs: DailyStats[] = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-06-${16 + i}`,
      wordsLearned: 10,
      verbsLearned: 5,
      timeSpentMins: 30,
    }));
    expect(getWeeklyAverage(logs)).toEqual({ words: 10, verbs: 5, mins: 30 });
  });

  it("handles empty", () => {
    expect(getWeeklyAverage([])).toEqual({ words: 0, verbs: 0, mins: 0 });
  });
});

describe("getReadinessLevel", () => {
  it("returns ready for high progress with time", () => {
    expect(getReadinessLevel(85, 10)).toBe("ready");
  });

  it("returns on-track for decent progress", () => {
    expect(getReadinessLevel(65, 3)).toBe("on-track");
  });

  it("returns behind for moderate progress", () => {
    expect(getReadinessLevel(35, 5)).toBe("behind");
  });

  it("returns at-risk for low progress", () => {
    expect(getReadinessLevel(15, 5)).toBe("at-risk");
  });
});

describe("getReadinessLabel", () => {
  it("returns German labels", () => {
    expect(getReadinessLabel("ready", "de")).toBe("Prüfungsbereit!");
    expect(getReadinessLabel("at-risk", "de")).toBe("Gefährdet");
  });

  it("returns English labels", () => {
    expect(getReadinessLabel("on-track", "en")).toBe("On Track");
  });

  it("falls back for unknown", () => {
    expect(getReadinessLabel("unknown", "en")).toBe("unknown");
  });
});
