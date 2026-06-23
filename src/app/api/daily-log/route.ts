import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { date, wordsLearned, verbsLearned, timeSpentMins } = body;

  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);

  const log = await prisma.dailyLog.upsert({
    where: { date: dateObj },
    update: {
      wordsLearned: { increment: wordsLearned ?? 0 },
      verbsLearned: { increment: verbsLearned ?? 0 },
      timeSpentMins: { increment: timeSpentMins ?? 0 },
    },
    create: {
      date: dateObj,
      wordsLearned: wordsLearned ?? 0,
      verbsLearned: verbsLearned ?? 0,
      timeSpentMins: timeSpentMins ?? 0,
    },
  });

  return NextResponse.json({ success: true, id: log.id });
}
