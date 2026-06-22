export interface VerbItem {
  id: number;
  infinitive: string;
  english: string;
  auxiliary: string;
  partizipII: string;
  praeteritum: string | null;
  ichPraesens: string;
  duPraesens: string;
  erPraesens: string;
  wirPraesens: string;
  ihrPraesens: string;
  siePraesens: string;
  isIrregular: boolean;
}

export type Pronoun = "ich" | "du" | "er/sie/es" | "wir" | "ihr" | "sie/Sie";

export const PRONOUNS: Pronoun[] = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

export function getConjugation(verb: VerbItem, pronoun: Pronoun): string {
  switch (pronoun) {
    case "ich": return verb.ichPraesens;
    case "du": return verb.duPraesens;
    case "er/sie/es": return verb.erPraesens;
    case "wir": return verb.wirPraesens;
    case "ihr": return verb.ihrPraesens;
    case "sie/Sie": return verb.siePraesens;
  }
}

export function checkConjugation(answer: string, correct: string): boolean {
  return answer.trim().toLowerCase() === correct.trim().toLowerCase();
}

export function getPerfekt(verb: VerbItem): string {
  return `${verb.auxiliary} + ${verb.partizipII}`;
}

export function generateDrill(verb: VerbItem): { pronoun: Pronoun; correct: string } {
  const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
  return { pronoun, correct: getConjugation(verb, pronoun) };
}

export function verbAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function isVerbWeak(correct: number, total: number): boolean {
  if (total < 3) return false;
  return correct / total < 0.6;
}
