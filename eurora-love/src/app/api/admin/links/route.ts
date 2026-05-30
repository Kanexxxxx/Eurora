import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";
import { scrapeProductImageAndPrice } from "@/server/scrapeProduct";

function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.presenteLink.findMany({
    orderBy: [{ order: "asc" }, { created_at: "desc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { name, platform, url, categoria, order, image_url } = body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof platform !== "string" || !platform.trim() ||
    typeof url !== "string" || !isValidUrl(url) ||
    typeof categoria !== "string" || !categoria.trim()
  ) {
    return NextResponse.json({ error: "Dados inválidos ou URL não permitida." }, { status: 400 });
  }

  const manualImage = typeof image_url === "string" && image_url.startsWith("http") ? image_url.trim() : null;

  const item = await prisma.presenteLink.create({
    data: {
      name: name.trim().slice(0, 200),
      platform: platform.trim().slice(0, 100),
      url: url.trim().slice(0, 1000),
      categoria: categoria.trim().slice(0, 100),
      order: typeof order === "number" ? order : 0,
      ...(manualImage ? { image_url: manualImage } : {}),
    },
  });

  // Scraping em background se não tiver imagem manual
  if (!manualImage) {
    scrapeProductImageAndPrice(url.trim()).then(({ image, price }) => {
      if (image || price) {
        prisma.presenteLink.update({
          where: { id: item.id },
          data: { ...(image ? { image_url: image } : {}), ...(price ? { preco: price } : {}) },
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  return NextResponse.json(item, { status: 201 });
}
