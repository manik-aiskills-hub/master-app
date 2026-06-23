import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [totalWords, learnedWords, totalVerbs, learnedVerbs, chapters, logs] =
    await Promise.all([
      prisma.word.count(),
      prisma.wordProgress.count({ where: { correctCount: { gt: 0 } } }),
      prisma.verb.count(),
      prisma.verbProgress.count({ where: { correctCount: { gt: 0 } } }),
      prisma.chapter.findMany({
        include: {
          _count: { select: { words: true } },
          words: { include: { progress: true } },
        },
        orderBy: { dayNumber: "asc" },
      }),
      prisma.dailyLog.findMany({ orderBy: { date: "asc" } }),
    ]);

  const chaptersCompleted = chapters.filter((ch) => {
    const wordCount = ch._count.words;
    if (wordCount === 0) return false;
    const practiced = ch.words.filter((w) => w.progress.length > 0).length;
    return practiced >= wordCount;
  }).length;

  return NextResponse.json({
    totalWords,
    wordsLearned: learnedWords,
    totalVerbs,
    verbsLearned: learnedVerbs,
    chaptersCompleted,
    totalChapters: chapters.length,
    dailyLogs: logs.map((l) => ({
      date: l.date.toISOString().split("T")[0],
      wordsLearned: l.wordsLearned,
      verbsLearned: l.verbsLearned,
      timeSpentMins: l.timeSpentMins,
    })),
  });
}
