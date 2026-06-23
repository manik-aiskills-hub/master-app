import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tests = await prisma.mockTest.findMany({ orderBy: { dayNumber: "asc" } });
  return NextResponse.json(
    tests.map((t) => ({
      id: t.id,
      dayNumber: t.dayNumber,
      type: t.type,
      sections: t.sections,
      score: t.score,
      maxScore: t.maxScore,
      completedAt: t.completedAt?.toISOString() ?? null,
    }))
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, score, maxScore } = body;

  const updated = await prisma.mockTest.update({
    where: { id },
    data: { score, maxScore, completedAt: new Date() },
  });

  return NextResponse.json({ success: true, id: updated.id });
}
