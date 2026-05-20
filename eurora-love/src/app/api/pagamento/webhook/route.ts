import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifySignature(req: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode

  const xSignature = req.headers.get("x-signature") || "";
  const xRequestId = req.headers.get("x-request-id") || "";
  const dataId = req.nextUrl.searchParams.get("data.id") || "";

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(",").find((s) => s.startsWith("ts="))?.split("=")[1] || ""};`;
  const ts = xSignature.split(",").find((s) => s.startsWith("ts="))?.split("=")[1] || "";
  const v1 = xSignature.split(",").find((s) => s.startsWith("v1="))?.split("=")[1] || "";

  const expected = crypto.createHmac("sha256", secret).update(`${ts}\n${manifest}`).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(v1);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

async function generateAndStoreQR(slug: string, supabase: ReturnType<typeof createServerClient>) {
  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;
  const QRCode = await import("qrcode");
  const qrBuffer = await QRCode.toBuffer(pageUrl, { width: 400, margin: 2 });

  const filename = `qrcodes/${slug}.png`;
  await supabase.storage.from("couple-photos").upload(filename, qrBuffer, {
    contentType: "image/png",
    upsert: true,
  });

  const { data } = supabase.storage.from("couple-photos").getPublicUrl(filename);
  return data.publicUrl;
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

  if (event.action !== "payment.updated" && event.action !== "payment.created") {
    return NextResponse.json({ received: true });
  }

  const paymentId = event.data?.id;
  if (!paymentId) return NextResponse.json({ received: true });

  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${mpToken}` },
  });

  if (!mpRes.ok) return NextResponse.json({ received: true });

  const payment = await mpRes.json();
  if (payment.status !== "approved") return NextResponse.json({ received: true });

  const page_id = payment.external_reference;
  if (!page_id) return NextResponse.json({ received: true });

  const supabase = createServerClient();

  const { data: couple } = await supabase
    .from("couples")
    .select("id, slug, paid")
    .eq("id", page_id)
    .single();

  if (!couple || couple.paid) return NextResponse.json({ received: true });

  const qrCodeUrl = await generateAndStoreQR(couple.slug, supabase).catch(() => null);

  await supabase
    .from("couples")
    .update({ paid: true, payment_id: String(paymentId), qr_code_url: qrCodeUrl, updated_at: new Date().toISOString() })
    .eq("id", page_id);

  return NextResponse.json({ received: true });
}
