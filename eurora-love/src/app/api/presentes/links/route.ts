import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const links = await prisma.presenteLink.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { created_at: "desc" }],
    select: { id: true, name: true, platform: true, url: true, categoria: true },
  });
  return NextResponse.json(links);
}
