export interface WrongAnswer {
  wordId: number;
  german: string;
  english: string;
  article: string | null;
  correctAnswer: string;
  userAnswer: string;
  mode: string;
  timestamp: number;
  bookmarked: boolean;
  chapterSlug: string;
}

const STORAGE_KEY = "wrongAnswers";
const BOOKMARK_KEY = "bookmarkedWords";

function getWrongAnswers(): WrongAnswer[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveWrongAnswers(answers: WrongAnswer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function addWrongAnswer(entry: Omit<WrongAnswer, "timestamp" | "bookmarked">) {
  const answers = getWrongAnswers();
  answers.push({ ...entry, timestamp: Date.now(), bookmarked: false });
  if (answers.length > 500) answers.splice(0, answers.length - 500);
  saveWrongAnswers(answers);
}

export function getRecentWrongAnswers(limit = 50): WrongAnswer[] {
  return getWrongAnswers().slice(-limit).reverse();
}

export function getWrongAnswersByChapter(chapterSlug: string): WrongAnswer[] {
  return getWrongAnswers().filter((a) => a.chapterSlug === chapterSlug);
}

export function getWeakWords(): WrongAnswer[] {
  const answers = getWrongAnswers();
  const counts = new Map<number, { wrong: number; latest: WrongAnswer }>();
  for (const a of answers) {
    const existing = counts.get(a.wordId);
    if (!existing || a.timestamp > existing.latest.timestamp) {
      counts.set(a.wordId, { wrong: (existing?.wrong ?? 0) + 1, latest: a });
    }
  }
  return Array.from(counts.values())
    .filter((c) => c.wrong >= 2)
    .sort((a, b) => b.wrong - a.wrong)
    .map((c) => c.latest);
}

function getBookmarks(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function isBookmarked(wordId: number): boolean {
  return getBookmarks().has(wordId);
}

export function toggleBookmark(wordId: number): boolean {
  const bookmarks = getBookmarks();
  if (bookmarks.has(wordId)) {
    bookmarks.delete(wordId);
  } else {
    bookmarks.add(wordId);
  }
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...bookmarks]));
  return bookmarks.has(wordId);
}

export function getBookmarkedWords(): number[] {
  return [...getBookmarks()];
}
