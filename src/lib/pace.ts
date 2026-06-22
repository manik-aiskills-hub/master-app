export type PaceLevel = "relaxed" | "normal" | "intense" | "cramming";

export function calculateDaysLeft(examDate: Date, now: Date = new Date()): number {
  const diff = examDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function calculatePace(daysLeft: number): PaceLevel {
  if (daysLeft > 25) return "relaxed";
  if (daysLeft > 14) return "normal";
  if (daysLeft > 7) return "intense";
  return "cramming";
}

export function getWordsPerDay(daysLeft: number): number {
  if (daysLeft > 20) return 20;
  if (daysLeft > 10) return 15;
  return 10;
}

export function getVerbsPerDay(daysLeft: number): number {
  if (daysLeft > 20) return 10;
  if (daysLeft > 10) return 8;
  return 5;
}
