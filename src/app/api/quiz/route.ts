import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { QuizItem } from "@/lib/quiz-engine";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") ?? "random";
  const chapterId = request.nextUrl.searchParams.get("chapterId");

  const wordWhere = chapterId ? { chapterId: parseInt(chapterId) } : {};

  const words = await prisma.word.findMany({
    where: wordWhere,
    include: { progress: true },
  });

  const verbs = await prisma.verb.findMany({
    where: chapterId ? { chapterId: parseInt(chapterId) } : {},
    include: { progress: true },
  });

  const items: QuizItem[] = [
    ...words.map((w) => ({
      id: w.id,
      type: "word" as const,
      question: `${w.article ? w.article + " " : ""}${w.german}`,
      answer: w.english,
      isWeak: w.progress[0]?.isWeak ?? false,
      lastSeen: w.progress[0]?.lastSeen?.toISOString() ?? null,
      nextReview: w.progress[0]?.nextReview?.toISOString() ?? null,
      seenCount: w.progress[0]?.seenCount ?? 0,
      correctCount: w.progress[0]?.correctCount ?? 0,
    })),
    ...verbs.map((v) => ({
      id: v.id,
      type: "verb" as const,
      question: v.infinitive,
      answer: v.english,
      isWeak: v.progress[0]?.isWeak ?? false,
      lastSeen: v.progress[0]?.lastSeen?.toISOString() ?? null,
      nextReview: v.progress[0]?.nextReview?.toISOString() ?? null,
      seenCount: v.progress[0]?.seenCount ?? 0,
      correctCount: v.progress[0]?.correctCount ?? 0,
    })),
  ];

  let filtered: QuizItem[];
  if (mode === "weak") {
    filtered = items.filter((i) => i.isWeak);
  } else if (mode === "due") {
    const now = new Date();
    filtered = items.filter((i) => !i.nextReview || new Date(i.nextReview) <= now);
  } else {
    filtered = items.filter((i) => i.seenCount > 0);
  }

  return NextResponse.json(filtered);
}
