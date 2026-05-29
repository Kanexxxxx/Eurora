import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";

function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function optionalUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  return isValidUrl(value) ? value.trim().slice(0, 1000) : null;
}

function optionalText(value: unknown, max = 100) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.presenteLink.findMany({
    orderBy: [{ order: "asc" }, { created_at: "desc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { name, platform, url, categoria, image_url, preco, order } = body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof platform !== "string" || !platform.trim() ||
    typeof url !== "string" || !isValidUrl(url) ||
    typeof categoria !== "string" || !categoria.trim()
  ) {
    return NextResponse.json({ error: "Dados invalidos ou URL nao permitida." }, { status: 400 });
  }

  const item = await prisma.presenteLink.create({
    data: {
      name: name.trim().slice(0, 200),
      platform: platform.trim().slice(0, 100),
      url: url.trim().slice(0, 1000),
      categoria: categoria.trim().slice(0, 100),
      image_url: optionalUrl(image_url),
      preco: optionalText(preco, 40),
      order: typeof order === "number" ? order : 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
