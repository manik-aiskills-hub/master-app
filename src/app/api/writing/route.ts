import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");

  const where = chapterId ? { chapterId: parseInt(chapterId) } : {};
  const prompts = await prisma.writingPrompt.findMany({ where });

  return NextResponse.json(
    prompts.map((p) => ({
      id: p.id,
      type: p.type,
      promptDe: p.promptDe,
      promptEn: p.promptEn,
      modelAnswer: p.modelAnswer,
      checklist: p.checklist,
      chapterId: p.chapterId,
    }))
  );
}
