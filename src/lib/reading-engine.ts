export interface ReadingQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ReadingPassageData {
  id: number;
  titleDe: string;
  titleEn: string;
  contentDe: string;
  questions: ReadingQuestion[];
  timeLimitSeconds: number;
}

export function parseQuestions(json: string): ReadingQuestion[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export function checkReadingAnswer(
  selectedIndex: number,
  correctIndex: number
): boolean {
  return selectedIndex === correctIndex;
}

export function calculateReadingScore(
  answers: (number | null)[],
  questions: ReadingQuestion[]
): { correct: number; total: number; percent: number } {
  let correct = 0;
  const total = questions.length;

  for (let i = 0; i < total; i++) {
    if (answers[i] !== null && answers[i] === questions[i].correctIndex) {
      correct++;
    }
  }

  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function isTimeUp(remaining: number): boolean {
  return remaining <= 0;
}
