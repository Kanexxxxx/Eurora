import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  const page_id = req.nextUrl.searchParams.get("page_id");

  if (!page_id) {
    return NextResponse.json({ error: "ID nao informado" }, { status: 400 });
  }

  const couple = await prisma.couple.findUnique({
    where: { id: page_id },
    select: { paid: true, slug: true },
  });

  if (!couple) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 });
  }

  return NextResponse.json({ paid: couple.paid, slug: couple.slug });
}

