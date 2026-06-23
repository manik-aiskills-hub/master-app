import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");

  const where = chapterId ? { chapterId: parseInt(chapterId) } : {};
  const exercises = await prisma.listeningExercise.findMany({ where });

  return NextResponse.json(
    exercises.map((e) => ({
      id: e.id,
      titleDe: e.titleDe,
      titleEn: e.titleEn,
      youtubeUrl: e.youtubeUrl,
      questions: e.questions,
      chapterId: e.chapterId,
    }))
  );
}
