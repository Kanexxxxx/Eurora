import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { coupleFieldsSchema, coupleSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils/slug";

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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em 1 minuto." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const photos = formData.getAll("photos") as File[];
  if (!photos.length || photos.length > 10) {
    return NextResponse.json({ error: "Envie entre 1 e 10 fotos." }, { status: 400 });
  }

  for (const photo of photos) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      return NextResponse.json({ error: "Formato de imagem inválido." }, { status: 400 });
    }
    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Foto muito grande (máx 5MB)." }, { status: 400 });
    }
  }

  // Validate text fields BEFORE uploading photos to avoid orphaned storage files
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
    return NextResponse.json({ error: "Dados inválidos.", details: fieldsCheck.error.flatten() }, { status: 400 });
  }

  const supabase = createServerClient();
  const photoUrls: string[] = [];

  for (const photo of photos) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${photo.type.split("/")[1]}`;
    const { error: uploadError } = await supabase.storage
      .from("couple-photos")
      .upload(filename, buffer, { contentType: photo.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: "Erro ao fazer upload da foto." }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("couple-photos").getPublicUrl(filename);
    photoUrls.push(urlData.publicUrl);
  }

  const body = {
    person1: formData.get("person1") as string,
    person2: formData.get("person2") as string,
    message: formData.get("message") as string,
    music_url: (formData.get("music_url") as string) || undefined,
    relationship_date: formData.get("relationship_date") as string,
    theme: formData.get("theme") as string,
    plan: formData.get("plan") as string,
    photo_urls: photoUrls,
  };

  const parsed = coupleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const slug = generateSlug(parsed.data.person1, parsed.data.person2);

  const { data: couple, error: dbError } = await supabase
    .from("couples")
    .insert({
      ...parsed.data,
      slug,
      paid: false,
    })
    .select("id")
    .single();

  if (dbError || !couple) {
    return NextResponse.json({ error: "Erro ao salvar dados." }, { status: 500 });
  }

  return NextResponse.json({ page_id: couple.id });
}
