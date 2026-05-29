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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID invalido." }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { name, platform, url, categoria, image_url, preco, active, order } = body;

  if (url !== undefined && (typeof url !== "string" || !isValidUrl(url))) {
    return NextResponse.json({ error: "URL nao permitida." }, { status: 400 });
  }
  if (image_url !== undefined && image_url !== "" && (typeof image_url !== "string" || !isValidUrl(image_url))) {
    return NextResponse.json({ error: "URL da imagem nao permitida." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof name === "string" && name.trim()) data.name = name.trim().slice(0, 200);
  if (typeof platform === "string" && platform.trim()) data.platform = platform.trim().slice(0, 100);
  if (typeof url === "string") data.url = url.trim().slice(0, 1000);
  if (typeof categoria === "string" && categoria.trim()) data.categoria = categoria.trim().slice(0, 100);
  if (typeof image_url === "string") data.image_url = image_url.trim() ? image_url.trim().slice(0, 1000) : null;
  if (typeof preco === "string") data.preco = preco.trim() ? preco.trim().slice(0, 40) : null;
  if (typeof active === "boolean") data.active = active;
  if (typeof order === "number") data.order = order;

  const item = await prisma.presenteLink.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID invalido." }, { status: 400 });
  }

  await prisma.presenteLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
