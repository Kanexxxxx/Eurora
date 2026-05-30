import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";
import { scrapeProductImageAndPrice } from "@/server/scrapeProduct";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { forceAll?: boolean };
  const forceAll = body.forceAll === true;

  const links = await prisma.presenteLink.findMany({
    where: forceAll ? {} : { image_url: null },
    select: { id: true, url: true },
  });

  if (links.length === 0) {
    return NextResponse.json({ ok: true, processados: 0, comImagem: 0 });
  }

  let comImagem = 0;

  // Processar em paralelo com limite de 3 simultâneos
  const BATCH = 3;
  for (let i = 0; i < links.length; i += BATCH) {
    const batch = links.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (link) => {
        const { image, price } = await scrapeProductImageAndPrice(link.url);
        if (image || price) {
          comImagem++;
          await prisma.presenteLink.update({
            where: { id: link.id },
            data: {
              ...(image ? { image_url: image } : {}),
              ...(price ? { preco: price } : {}),
            },
          }).catch(() => {});
        }
      })
    );
  }

  return NextResponse.json({ ok: true, processados: links.length, comImagem });
}
