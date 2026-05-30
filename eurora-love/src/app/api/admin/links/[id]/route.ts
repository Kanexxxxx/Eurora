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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { name, platform, url, categoria, active, order, image_url } = body;

  if (url !== undefined && (typeof url !== "string" || !isValidUrl(url))) {
    return NextResponse.json({ error: "URL não permitida." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof name === "string" && name.trim()) data.name = name.trim().slice(0, 200);
  if (typeof platform === "string" && platform.trim()) data.platform = platform.trim().slice(0, 100);
  if (typeof url === "string") data.url = url.trim().slice(0, 1000);
  if (typeof categoria === "string" && categoria.trim()) data.categoria = categoria.trim().slice(0, 100);
  if (typeof active === "boolean") data.active = active;
  if (typeof order === "number") data.order = order;
  if (typeof image_url === "string") data.image_url = image_url.startsWith("http") ? image_url.trim() : null;

  const item = await prisma.presenteLink.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  await prisma.presenteLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
