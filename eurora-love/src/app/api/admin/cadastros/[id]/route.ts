import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";
import { optionalEnv } from "@/server/env";

function uploadRoot() {
  return optionalEnv("UPLOAD_DIR", path.join(process.cwd(), "uploads"));
}

function publicBaseUrl() {
  const appUrl = optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000").replace(/\/$/, "");
  return optionalEnv("UPLOAD_PUBLIC_URL", `${appUrl}/uploads`).replace(/\/$/, "");
}

function urlToFilePath(photoUrl: string): string | null {
  const base = publicBaseUrl();
  if (!photoUrl.startsWith(base)) return null;
  const relative = photoUrl.slice(base.length).replace(/^\//, "");
  const safeRelative = relative.replace(/\.\./g, "");
  return path.join(uploadRoot(), safeRelative);
}

async function tryDeleteFile(filePath: string) {
  try {
    await unlink(filePath);
  } catch {
    // ignore if file doesn't exist
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const couple = await prisma.couple.findUnique({
    where: { id },
  });

  if (!couple) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json(couple);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { person1, person2, message, music_url, relationship_date, paid } = body as Record<string, unknown>;

  if (typeof person1 === "string" && person1.trim().length < 1) {
    return NextResponse.json({ error: "Nome 1 obrigatório" }, { status: 400 });
  }
  if (typeof person2 === "string" && person2.trim().length < 1) {
    return NextResponse.json({ error: "Nome 2 obrigatório" }, { status: 400 });
  }
  if (typeof message === "string" && message.length > 1000) {
    return NextResponse.json({ error: "Mensagem muito longa (máx 1000)" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof person1 === "string") data.person1 = person1.trim();
  if (typeof person2 === "string") data.person2 = person2.trim();
  if (typeof message === "string") data.message = message;
  if (typeof music_url === "string") data.music_url = music_url || null;
  if (typeof relationship_date === "string") data.relationship_date = relationship_date;
  if (typeof paid === "boolean") data.paid = paid;

  try {
    const updated = await prisma.couple.update({
      where: { id },
      data,
      select: { id: true, slug: true, person1: true, person2: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const couple = await prisma.couple.findUnique({
    where: { id },
    select: { photo_urls: true, qr_code_url: true },
  });

  if (!couple) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  // delete photos from disk
  for (const url of couple.photo_urls) {
    const filePath = urlToFilePath(url);
    if (filePath) await tryDeleteFile(filePath);
  }
  if (couple.qr_code_url) {
    const qrPath = urlToFilePath(couple.qr_code_url);
    if (qrPath) await tryDeleteFile(qrPath);
  }

  await prisma.couple.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
