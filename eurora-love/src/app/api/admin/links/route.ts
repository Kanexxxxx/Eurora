import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

function authed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.presenteLink.findMany({
    orderBy: [{ order: "asc" }, { created_at: "desc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, platform, url, categoria, order } = body as {
    name: string;
    platform: string;
    url: string;
    categoria: string;
    order?: number;
  };

  if (!name || !platform || !url || !categoria) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const item = await prisma.presenteLink.create({
    data: { name, platform, url, categoria, order: order ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
