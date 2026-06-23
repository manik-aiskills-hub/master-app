export interface WordItem {
  id: number;
  german: string;
  english: string;
  article: string | null;
  plural: string | null;
  wordType: string | null;
  exampleDe: string | null;
  exampleEn: string | null;
}

export interface WordProgressData {
  wordId: number;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  isWeak: boolean;
}

export function selectDailyWords(words: WordItem[], count: number): WordItem[] {
  return words.slice(0, count);
}

export function generateMCQOptions(
  correctWord: WordItem,
  allWords: WordItem[],
  count: number = 4
): string[] {
  const others = allWords
    .filter((w) => w.id !== correctWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, count - 1)
    .map((w) => w.english);

  const options = [...others, correctWord.english].sort(() => Math.random() - 0.5);
  return options;
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function isWordWeak(correct: number, total: number): boolean {
  if (total < 2) return false;
  return correct / total < 0.6;
}

export function chapterProgress(
  totalWords: number,
  practicedWords: number
): { percent: number; complete: boolean } {
  const percent = totalWords === 0 ? 0 : Math.round((practicedWords / totalWords) * 100);
  return { percent, complete: percent === 100 };
}
