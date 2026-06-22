import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }

  const verbs = await prisma.verb.findMany({
    where: { chapterId: parseInt(chapterId) },
    include: { progress: true },
  });

  return NextResponse.json(
    verbs.map((v) => ({
      id: v.id,
      infinitive: v.infinitive,
      english: v.english,
      auxiliary: v.auxiliary,
      partizipII: v.partizipII,
      praeteritum: v.praeteritum,
      ichPraesens: v.ichPraesens,
      duPraesens: v.duPraesens,
      erPraesens: v.erPraesens,
      wirPraesens: v.wirPraesens,
      ihrPraesens: v.ihrPraesens,
      siePraesens: v.siePraesens,
      isIrregular: v.isIrregular,
      progress: v.progress[0] ?? null,
    }))
  );
}

export async function PUT(request: NextRequest) {
  const { verbId, correct } = await request.json();

  const existing = await prisma.verbProgress.findUnique({
    where: { verbId },
  });

  const progress = await prisma.verbProgress.upsert({
    where: { verbId },
    create: {
      verbId,
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
