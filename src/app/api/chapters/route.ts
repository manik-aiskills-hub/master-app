import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { dayNumber: "asc" },
    include: {
      _count: { select: { words: true } },
    },
  });

  const chaptersWithProgress = await Promise.all(
    chapters.map(async (ch) => {
      const practicedCount = await prisma.wordProgress.count({
        where: {
          word: { chapterId: ch.id },
          seenCount: { gt: 0 },
        },
      });
      return {
        id: ch.id,
        slug: ch.slug,
        titleDe: ch.titleDe,
        titleEn: ch.titleEn,
        dayNumber: ch.dayNumber,
        totalWords: ch._count.words,
        practicedWords: practicedCount,
      };
    })
  );

  return NextResponse.json(chaptersWithProgress);
}
