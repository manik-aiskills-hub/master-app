export interface ListeningQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ListeningExerciseData {
  id: number;
  titleDe: string;
  titleEn: string;
  youtubeUrl: string;
  questions: ListeningQuestion[];
  chapterId: number;
}

export function parseListeningQuestions(json: string): ListeningQuestion[] {
  try {
    return JSON.parse(json) as ListeningQuestion[];
  } catch {
    return [];
  }
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export function getEmbedUrl(youtubeUrl: string): string | null {
  const id = extractYoutubeId(youtubeUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function checkListeningAnswer(selected: number, correctIndex: number): boolean {
  return selected === correctIndex;
}

export function calculateListeningScore(
  answers: (number | null)[],
  questions: ListeningQuestion[]
): { correct: number; total: number; percent: number } {
  let correct = 0;
  const total = questions.length;
  for (let i = 0; i < total; i++) {
    if (answers[i] !== null && answers[i] === questions[i].correctIndex) {
      correct++;
    }
  }
  return { correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

export function isPassiveMode(mode: string): boolean {
  return mode === "passive";
}
