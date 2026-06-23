export interface ChecklistItem {
  label: string;
  hint: string;
}

export interface WritingPromptData {
  id: number;
  type: string;
  promptDe: string;
  promptEn: string;
  modelAnswer: string;
  checklist: ChecklistItem[];
  chapterId: number;
}

export function parseChecklist(json: string): ChecklistItem[] {
  try {
    return JSON.parse(json) as ChecklistItem[];
  } catch {
    return [];
  }
}

export function getWritingTypeLabel(type: string, lang: "en" | "de"): string {
  const labels: Record<string, { en: string; de: string }> = {
    email: { en: "Email", de: "E-Mail" },
    letter: { en: "Letter", de: "Brief" },
    complaint: { en: "Complaint", de: "Beschwerde" },
    invitation: { en: "Invitation", de: "Einladung" },
    response: { en: "Response", de: "Antwort" },
  };
  return labels[type]?.[lang] ?? type;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

export function hasGreeting(text: string): boolean {
  const greetings = [
    "sehr geehrte", "liebe", "lieber", "hallo", "guten tag",
    "dear", "hello", "hi",
  ];
  const lower = text.toLowerCase();
  return greetings.some((g) => lower.includes(g));
}

export function hasClosing(text: string): boolean {
  const closings = [
    "mit freundlichen grüßen", "viele grüße", "herzliche grüße",
    "liebe grüße", "mfg", "best regards", "sincerely",
  ];
  const lower = text.toLowerCase();
  return closings.some((c) => lower.includes(c));
}

export function evaluateWriting(
  text: string,
  checklist: ChecklistItem[]
): { wordCount: number; hasGreeting: boolean; hasClosing: boolean; checklistResults: boolean[] } {
  return {
    wordCount: countWords(text),
    hasGreeting: hasGreeting(text),
    hasClosing: hasClosing(text),
    checklistResults: checklist.map((item) =>
      text.toLowerCase().includes(item.label.toLowerCase())
    ),
  };
}
