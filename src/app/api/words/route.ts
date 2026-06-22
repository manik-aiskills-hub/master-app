import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }

  const words = await prisma.word.findMany({
    where: { chapterId: parseInt(chapterId) },
    include: { progress: true },
  });

  return NextResponse.json(
    words.map((w) => ({
      id: w.id,
      german: w.german,
      english: w.english,
      article: w.article,
      plural: w.plural,
      exampleDe: w.exampleDe,
      exampleEn: w.exampleEn,
      progress: w.progress[0] ?? null,
    }))
  );
}

export async function PUT(request: NextRequest) {
  const { wordId, correct } = await request.json();

  const existing = await prisma.wordProgress.findUnique({
    where: { wordId },
  });

  const progress = await prisma.wordProgress.upsert({
    where: { wordId },
    create: {
      wordId,
      seenCount: 1,
      correctCount: correct ? 1 : 0,
      wrongCount: correct ? 0 : 1,
      isWeak: false,
      lastSeen: new Date(),
    },
    update: {
      seenCount: (existing?.seenCount ?? 0) + 1,
      correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
      wrongCount: (existing?.wrongCount ?? 0) + (correct ? 0 : 1),
      isWeak:
        ((existing?.correctCount ?? 0) + (correct ? 1 : 0)) /
          ((existing?.seenCount ?? 0) + 1) <
        0.6,
      lastSeen: new Date(),
    },
  });

  return NextResponse.json(progress);
}
