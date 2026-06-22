export interface QuizItem {
  id: number;
  type: "word" | "verb";
  question: string;
  answer: string;
  isWeak: boolean;
  lastSeen: string | null;
  nextReview: string | null;
  seenCount: number;
  correctCount: number;
}

export function calculateNextReview(
  correct: boolean,
  currentStreak: number,
  now: Date = new Date()
): Date {
  const intervals = [1, 3, 7, 14, 30];
  const streak = correct ? Math.min(currentStreak, intervals.length - 1) : 0;
  const daysUntilReview = intervals[streak];
  const next = new Date(now);
  next.setDate(next.getDate() + daysUntilReview);
  return next;
}

export function isDueForReview(nextReview: string | null, now: Date = new Date()): boolean {
  if (!nextReview) return true;
  return new Date(nextReview) <= now;
}

export function selectWeakItems(items: QuizItem[]): QuizItem[] {
  return items.filter((item) => item.isWeak);
}

export function selectDueItems(items: QuizItem[], now: Date = new Date()): QuizItem[] {
  return items.filter((item) => isDueForReview(item.nextReview, now));
}

export function generateQuiz(
  items: QuizItem[],
  count: number,
  mode: "weak" | "due" | "random" = "random"
): QuizItem[] {
  let pool: QuizItem[];

  switch (mode) {
    case "weak":
      pool = selectWeakItems(items);
      break;
    case "due":
      pool = selectDueItems(items);
      break;
    case "random":
    default:
      pool = [...items];
      break;
  }

  return pool.sort(() => Math.random() - 0.5).slice(0, count);
}

export function quizScore(correct: number, total: number): {
  percent: number;
  grade: "excellent" | "good" | "fair" | "poor";
} {
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  let grade: "excellent" | "good" | "fair" | "poor";
  if (percent >= 90) grade = "excellent";
  else if (percent >= 70) grade = "good";
  else if (percent >= 50) grade = "fair";
  else grade = "poor";
  return { percent, grade };
}
