import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  page_id: z.string().uuid(),
});

const PRICES = { basic: 19, premium: 39 } as const;

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();
function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = RATE_LIMIT.get(ip);
  if (!e || now - e.ts > 60_000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return true;
  }
  if (e.count >= 3) return false;
  e.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRL(ip))
    return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const { page_id } = parsed.data;

  const couple = await prisma.couple.findUnique({
    where: { id: page_id },
    select: { id: true, paid: true, plan: true },
  });

  if (!couple)
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  if (couple.paid)
    return NextResponse.json({ error: "Já pago" }, { status: 409 });

  const plan = couple.plan as "basic" | "premium";
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
  const notificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pagamento/webhook`;

  const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mpToken}`,
      "X-Idempotency-Key": page_id,
    },
    body: JSON.stringify({
      transaction_amount: PRICES[plan],
      description: `EURORA LOVE — Plano ${plan === "premium" ? "Premium" : "Basic"}`,
      payment_method_id: "pix",
      payer: { email: "cliente@eurora.love.br" },
      notification_url: notificationUrl,
      external_reference: page_id,
    }),
  });

  if (!mpRes.ok) {
    const err = await mpRes.json().catch(() => ({}));
    console.error("MP error", err);
    return NextResponse.json(
      { error: "Erro ao gerar PIX. Tente novamente." },
      { status: 502 }
    );
  }

  const mpData = await mpRes.json();
  const pixInfo = mpData.point_of_interaction?.transaction_data;
  if (!pixInfo)
    return NextResponse.json({ error: "PIX não disponível" }, { status: 502 });

  await prisma.couple.update({
    where: { id: page_id },
    data: { payment_id: String(mpData.id) },
  });

  return NextResponse.json({
    pix_qr_code: pixInfo.qr_code_base64,
    pix_copia_cola: pixInfo.qr_code,
    payment_id: String(mpData.id),
    page_id,
  });
}
