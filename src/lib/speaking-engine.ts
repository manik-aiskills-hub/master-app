export interface SpeakingPromptData {
  id: number;
  type: string;
  promptDe: string;
  promptEn: string;
  keyPhrases: string[];
  modelAnswer: string;
  timeLimitSeconds: number;
  chapterId: number;
}

export function parseKeyPhrases(json: string): string[] {
  try {
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}

export function getSpeakingTypeLabel(type: string, lang: "en" | "de"): string {
  const labels: Record<string, { en: string; de: string }> = {
    monologue: { en: "Monologue", de: "Monolog" },
    dialogue: { en: "Dialogue", de: "Dialog" },
    picture_description: { en: "Picture Description", de: "Bildbeschreibung" },
  };
  return labels[type]?.[lang] ?? type;
}

export function checkKeyPhraseUsage(text: string, keyPhrases: string[]): boolean[] {
  const lower = text.toLowerCase();
  return keyPhrases.map((phrase) => lower.includes(phrase.toLowerCase()));
}

export function calculatePhraseScore(used: boolean[]): { used: number; total: number; percent: number } {
  const total = used.length;
  const usedCount = used.filter(Boolean).length;
  return {
    used: usedCount,
    total,
    percent: total > 0 ? Math.round((usedCount / total) * 100) : 0,
  };
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function isRecordingSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
