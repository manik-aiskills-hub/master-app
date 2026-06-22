import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");

  const where = chapterId ? { chapterId: parseInt(chapterId) } : {};
  const passages = await prisma.readingPassage.findMany({ where });

  return NextResponse.json(
    passages.map((p) => ({
      id: p.id,
      titleDe: p.titleDe,
      titleEn: p.titleEn,
      contentDe: p.contentDe,
      questions: p.questions,
      timeLimitSeconds: p.timeLimitSeconds,
      chapterId: p.chapterId,
    }))
  );
}
