import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.userSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });
  return NextResponse.json({
    theme: settings.theme,
    language: settings.language,
    examDate: settings.examDate?.toISOString().split("T")[0] ?? null,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const settings = await prisma.userSettings.upsert({
    where: { id: 1 },
    update: {
      theme: body.theme,
      language: body.language,
      examDate: body.examDate ? new Date(body.examDate) : null,
    },
    create: {
      theme: body.theme ?? "light",
      language: body.language ?? "en",
      examDate: body.examDate ? new Date(body.examDate) : null,
    },
  });
  return NextResponse.json({
    theme: settings.theme,
    language: settings.language,
    examDate: settings.examDate?.toISOString().split("T")[0] ?? null,
  });
}
