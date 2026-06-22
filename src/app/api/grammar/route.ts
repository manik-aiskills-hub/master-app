import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }

  const rules = await prisma.grammarRule.findMany({
    where: { chapterId: parseInt(chapterId) },
    include: {
      exercises: {
        include: { progress: true },
      },
    },
  });

  return NextResponse.json(
    rules.map((r) => ({
      id: r.id,
      titleDe: r.titleDe,
      titleEn: r.titleEn,
      formula: r.formula,
      explanationDe: r.explanationDe,
      explanationEn: r.explanationEn,
      example1De: r.example1De,
      example1En: r.example1En,
      example2De: r.example2De,
      example2En: r.example2En,
      exercises: r.exercises.map((ex) => ({
        id: ex.id,
        type: ex.type,
        promptDe: ex.promptDe,
        promptEn: ex.promptEn,
        answer: ex.answer,
        hint: ex.hint,
        progress: ex.progress[0] ?? null,
      })),
    }))
  );
}

export async function PUT(request: NextRequest) {
  const { exerciseId, isCorrect } = await request.json();

  const progress = await prisma.sentenceProgress.upsert({
    where: { exerciseId },
    create: {
      exerciseId,
      attempts: 1,
      isCorrect,
      isWeak: !isCorrect,
      lastAttempt: new Date(),
    },
    update: {
      attempts: { increment: 1 },
      isCorrect,
      isWeak: !isCorrect,
      lastAttempt: new Date(),
    },
  });

  return NextResponse.json(progress);
}
