export type TestType = "mini" | "full";

export interface MockTestSection {
  name: string;
  questionCount: number;
  timeLimitSeconds: number;
}

export interface MockTestData {
  id: number;
  dayNumber: number;
  type: TestType;
  sections: MockTestSection[];
  score: number | null;
  maxScore: number | null;
  completedAt: string | null;
}

export function parseSections(json: string): MockTestSection[] {
  try {
    return JSON.parse(json) as MockTestSection[];
  } catch {
    return [];
  }
}

export function getMockTestDays(): number[] {
  return [5, 10, 15, 20, 25, 28, 29, 30];
}

export function getTestType(dayNumber: number): TestType {
  return dayNumber >= 28 ? "full" : "mini";
}

export function getMiniSections(): MockTestSection[] {
  return [
    { name: "Wortschatz", questionCount: 10, timeLimitSeconds: 300 },
    { name: "Grammatik", questionCount: 5, timeLimitSeconds: 180 },
    { name: "Lesen", questionCount: 5, timeLimitSeconds: 300 },
  ];
}

export function getFullSections(): MockTestSection[] {
  return [
    { name: "Lesen", questionCount: 15, timeLimitSeconds: 900 },
    { name: "Hören", questionCount: 10, timeLimitSeconds: 600 },
    { name: "Schreiben", questionCount: 2, timeLimitSeconds: 1200 },
    { name: "Wortschatz & Grammatik", questionCount: 20, timeLimitSeconds: 600 },
  ];
}

export function calculateMockScore(
  correct: number,
  total: number
): { score: number; maxScore: number; percent: number; passed: boolean } {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { score: correct, maxScore: total, percent, passed: percent >= 60 };
}

export function isTestDay(dayNumber: number): boolean {
  return getMockTestDays().includes(dayNumber);
}
