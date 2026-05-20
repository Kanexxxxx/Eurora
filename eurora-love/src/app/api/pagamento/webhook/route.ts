import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifySignature(req: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode — set secret in production

  const xSignature = req.headers.get("x-signature") || "";
  const xRequestId = req.headers.get("x-request-id") || "";
  const dataId = req.nextUrl.searchParams.get("data.id") || "";
  const ts =
    xSignature
      .split(",")
      .find((s) => s.startsWith("ts="))
      ?.split("=")[1] ?? "";
  const v1 =
    xSignature
      .split(",")
      .find((s) => s.startsWith("v1="))
      ?.split("=")[1] ?? "";

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${ts}\n${manifest}`)
    .digest("hex");

  if (expected.length !== v1.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

async function generateAndStoreQR(
  slug: string,
  supabase: ReturnType<typeof createServerClient>
): Promise<string | null> {
  try {
    const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;
    const QRCode = await import("qrcode");
    const qrBuffer = await QRCode.toBuffer(pageUrl, { width: 400, margin: 2 });

    const filename = `qrcodes/${slug}.png`;
    await supabase.storage
      .from("couple-photos")
      .upload(filename, qrBuffer, { contentType: "image/png", upsert: true });

    const { data } = supabase.storage
      .from("couple-photos")
      .getPublicUrl(filename);
    return data.publicUrl;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  if (!verifySignature(req)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  let event: { action: string; data?: { id?: string } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (
    event.action !== "payment.updated" &&
    event.action !== "payment.created"
  ) {
    return NextResponse.json({ received: true });
  }

  const paymentId = event.data?.id;
  if (!paymentId) return NextResponse.json({ received: true });

  const mpRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    { headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` } }
  );
  if (!mpRes.ok) return NextResponse.json({ received: true });

  const payment = await mpRes.json();
  if (payment.status !== "approved") return NextResponse.json({ received: true });

  const page_id = payment.external_reference;
  if (!page_id) return NextResponse.json({ received: true });

  const couple = await prisma.couple.findUnique({
    where: { id: page_id },
    select: { id: true, slug: true, paid: true },
  });

  if (!couple || couple.paid) return NextResponse.json({ received: true });

  const supabase = createServerClient();
  const qrCodeUrl = await generateAndStoreQR(couple.slug, supabase);

  await prisma.couple.update({
    where: { id: page_id },
    data: {
      paid: true,
      payment_id: String(paymentId),
      qr_code_url: qrCodeUrl,
    },
  });

  return NextResponse.json({ received: true });
}
