import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const [links, hidden] = await Promise.all([
      prisma.presenteLink.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { created_at: "desc" }],
        select: { id: true, name: true, platform: true, url: true, categoria: true, image_url: true, preco: true },
      }),
      prisma.hiddenProduto.findMany({ select: { produto_id: true } }),
    ]);
    return NextResponse.json({
      links,
      hiddenIds: hidden.map((h) => h.produto_id),
    });
  } catch {
    return NextResponse.json({ links: [], hiddenIds: [] });
  }
}
