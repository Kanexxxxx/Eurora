import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asaasRequest, onlyDigits, todayIsoDate } from "@/server/payments/asaas";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  cpf: z.string().transform(onlyDigits).pipe(z.string().length(11)),
});

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();
function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = RATE_LIMIT.get(ip);
  if (!e || now - e.ts > 60_000) { RATE_LIMIT.set(ip, { count: 1, ts: now }); return true; }
  if (e.count >= 3) return false;
  e.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRL(ip)) return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { name, email, cpf } = parsed.data;

  try {
    const customer = await asaasRequest<{ id: string }>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name,
        cpfCnpj: cpf,
        email,
        externalReference: `msg:correios:${cpf}`,
        notificationDisabled: true,
      }),
    });

    const payment = await asaasRequest<{ id: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id,
        billingType: "PIX",
        value: 14,
        dueDate: todayIsoDate(),
        description: "EURORA LOVE - Carta pelos Correios",
        externalReference: `msg:correios:${email}`,
      }),
    });

    const pix = await asaasRequest<{ encodedImage: string; payload: string }>(
      `/payments/${payment.id}/pixQrCode`
    );

    return NextResponse.json({
      payment_id: payment.id,
      pix_qr_code: pix.encodedImage,
      pix_copia_cola: pix.payload,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar pagamento.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
