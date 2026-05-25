import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { createUploadKey, extensionFromMime, saveUpload } from "@/server/storage/local";
import { coupleFieldsSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils/slug";
import type { Theme, Plan } from "@prisma/client";

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();

function checkRateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

const THEME_MAP: Record<string, Theme> = {
  "black-luxury": "black_luxury",
  "neon-romance": "neon_romance",
  "minimal-love": "minimal_love",
  "velvet-dark": "velvet_dark",
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em 1 minuto." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const photos = formData.getAll("photos") as File[];
  if (!photos.length || photos.length > 10) {
    return NextResponse.json(
      { error: "Envie entre 1 e 10 fotos." },
      { status: 400 }
    );
  }

  for (const photo of photos) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      return NextResponse.json(
        { error: "Formato de imagem inválido." },
        { status: 400 }
      );
    }
    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Foto muito grande (máx 5MB)." },
        { status: 400 }
      );
    }
  }

  const fieldsCheck = coupleFieldsSchema.safeParse({
    person1: formData.get("person1"),
    person2: formData.get("person2"),
    message: formData.get("message"),
    music_url: formData.get("music_url") || undefined,
    relationship_date: formData.get("relationship_date"),
    theme: formData.get("theme"),
    plan: formData.get("plan"),
  });
  if (!fieldsCheck.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: fieldsCheck.error.flatten() },
      { status: 400 }
    );
  }

  // Upload photos to local VPS storage (served by Nginx at /uploads).
  const photoUrls: string[] = [];

  for (const photo of photos) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = extensionFromMime(photo.type);
    if (!ext) {
      return NextResponse.json(
        { error: "Formato de imagem invalido." },
        { status: 400 }
      );
    }

    try {
      const key = createUploadKey("couples", ext);
      const publicUrl = await saveUpload(key, buffer);
      photoUrls.push(publicUrl);
    } catch {
      return NextResponse.json(
        { error: "Erro ao fazer upload da foto." },
        { status: 500 }
      );
    }
  }

  const fields = fieldsCheck.data;
  const slug = generateSlug(fields.person1, fields.person2);
  const theme = THEME_MAP[fields.theme] as Theme;
  const plan = fields.plan as Plan;

  const couple = await prisma.couple.create({
    data: {
      slug,
      person1: fields.person1,
      person2: fields.person2,
      message: fields.message,
      music_url: fields.music_url || null,
      relationship_date: fields.relationship_date,
      theme,
      plan,
      photo_urls: photoUrls,
      paid: false,
    },
    select: { id: true },
  });

  return NextResponse.json({ page_id: couple.id });
}

