export interface GrammarRuleItem {
  id: number;
  titleDe: string;
  titleEn: string;
  formula: string;
  explanationDe: string;
  explanationEn: string;
  example1De: string;
  example1En: string;
  example2De: string;
  example2En: string;
}

export interface ExerciseItem {
  id: number;
  type: "fill_in" | "write";
  promptDe: string;
  promptEn: string | null;
  answer: string;
  hint: string | null;
}

export function checkFillIn(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

export function checkSentence(
  userSentence: string,
  correctSentence: string
): { correct: boolean; errors: string[] } {
  const user = userSentence.trim();
  const correct = correctSentence.trim();
  const errors: string[] = [];

  const userNoPunct = user.replace(/[.!?]+$/, "");
  const correctNoPunct = correct.replace(/[.!?]+$/, "");

  if (userNoPunct.toLowerCase() === correctNoPunct.toLowerCase()) {
    if (userNoPunct !== correctNoPunct) {
      errors.push("Check capitalization");
    }
    if (!user.endsWith(".") && !user.endsWith("!") && !user.endsWith("?")) {
      errors.push("Missing punctuation at end");
    }
    return { correct: errors.length === 0, errors };
  }

  const userWords = userNoPunct.toLowerCase().split(/\s+/);
  const correctWords = correctNoPunct.toLowerCase().split(/\s+/);

  if (userWords.length !== correctWords.length) {
    errors.push(`Expected ${correctWords.length} words, got ${userWords.length}`);
  }

  for (let i = 0; i < Math.min(userWords.length, correctWords.length); i++) {
    if (userWords[i] !== correctWords[i]) {
      errors.push(`Word ${i + 1}: "${userWords[i]}" should be "${correctWords[i]}"`);
    }
  }

  if (errors.length === 0) {
    errors.push("Answer does not match expected");
  }

  return { correct: false, errors };
}

export function exerciseProgress(
  totalExercises: number,
  completed: number
): { percent: number; done: boolean } {
  const percent = totalExercises === 0 ? 0 : Math.round((completed / totalExercises) * 100);
  return { percent, done: percent === 100 };
}
