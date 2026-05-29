import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";

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
  const { name, platform, url, categoria, order } = body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof platform !== "string" || !platform.trim() ||
    typeof url !== "string" || !isValidUrl(url) ||
    typeof categoria !== "string" || !categoria.trim()
  ) {
    return NextResponse.json({ error: "Dados inválidos ou URL não permitida." }, { status: 400 });
  }

  const item = await prisma.presenteLink.create({
    data: {
      name: name.trim().slice(0, 200),
      platform: platform.trim().slice(0, 100),
      url: url.trim().slice(0, 1000),
      categoria: categoria.trim().slice(0, 100),
      order: typeof order === "number" ? order : 0,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
