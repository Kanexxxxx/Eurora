import { NextRequest, NextResponse } from "next/server";
import type { Plan, Theme } from "@prisma/client";
import { coupleFieldsSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils/slug";
import { isAdminRequest } from "@/server/auth/admin";
import { prisma } from "@/server/db/prisma";
import { generateAndStoreQR } from "@/server/payments/activateCouple";
import { createUploadKey, extensionFromMime, saveUpload } from "@/server/storage/local";

const THEME_MAP: Record<string, Theme> = {
  "black-luxury": "black_luxury",
  "neon-romance": "neon_romance",
  "minimal-love": "minimal_love",
  "velvet-dark": "velvet_dark",
};

const BASIC_THEMES = new Set(["black-luxury", "neon-romance"]);

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }

  const planRaw = formData.get("plan") === "basic" ? "basic" : "premium";
  const maxPhotos = planRaw === "premium" ? 10 : 5;
  const photos = formData.getAll("photos") as File[];

  if (!photos.length || photos.length > maxPhotos) {
    return NextResponse.json(
      { error: `Envie entre 1 e ${maxPhotos} fotos.` },
      { status: 400 }
    );
  }

  for (const photo of photos) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      return NextResponse.json({ error: "Formato de imagem invalido." }, { status: 400 });
    }
    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Foto muito grande (max 5MB)." }, { status: 400 });
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
      { error: "Dados invalidos.", details: fieldsCheck.error.flatten() },
      { status: 400 }
    );
  }

  const fields = fieldsCheck.data;
  if (fields.plan === "basic" && !BASIC_THEMES.has(fields.theme)) {
    return NextResponse.json(
      { error: "Tema nao disponivel no plano Basic." },
      { status: 400 }
    );
  }

  const photoUrls: string[] = [];
  for (const photo of photos) {
    const ext = extensionFromMime(photo.type);
    if (!ext) {
      return NextResponse.json({ error: "Formato de imagem invalido." }, { status: 400 });
    }

    try {
      const key = createUploadKey("couples", ext);
      const buffer = Buffer.from(await photo.arrayBuffer());
      const publicUrl = await saveUpload(key, buffer);
      photoUrls.push(publicUrl);
    } catch {
      return NextResponse.json(
        { error: "Erro ao fazer upload da foto." },
        { status: 500 }
      );
    }
  }

  const slug = generateSlug(fields.person1, fields.person2);
  const qrCodeUrl = await generateAndStoreQR(slug);

  const couple = await prisma.couple.create({
    data: {
      slug,
      person1: fields.person1,
      person2: fields.person2,
      message: fields.message,
      music_url: fields.plan === "basic" ? null : (fields.music_url || null),
      relationship_date: fields.relationship_date,
      theme: THEME_MAP[fields.theme],
      plan: fields.plan as Plan,
      photo_urls: photoUrls,
      paid: true,
      payment_id: "admin-demo",
      qr_code_url: qrCodeUrl,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  return NextResponse.json({
    page_id: couple.id,
    slug: couple.slug,
    url: `/${couple.slug}`,
  });
}
