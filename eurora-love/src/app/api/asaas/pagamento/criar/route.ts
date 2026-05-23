import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import {
  createAsaasCustomer,
  createAsaasPayment,
  getAsaasPixQrCode,
  isAsaasPaidStatus,
  onlyDigits,
} from "@/server/payments/asaas";
import { activateCouplePage } from "@/server/payments/activateCouple";

const payerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  cpfCnpj: z.string().transform(onlyDigits).pipe(z.string().min(11).max(14)),
  phone: z.string().transform(onlyDigits).pipe(z.string().min(10).max(11)),
});

const cardSchema = z.object({
  holderName: z.string().min(2).max(120),
  number: z.string().transform(onlyDigits).pipe(z.string().min(13).max(19)),
  expiryMonth: z.string().transform(onlyDigits).pipe(z.string().min(1).max(2)),
  expiryYear: z.string().transform(onlyDigits).pipe(z.string().min(2).max(4)),
  ccv: z.string().transform(onlyDigits).pipe(z.string().min(3).max(4)),
  postalCode: z.string().transform(onlyDigits).pipe(z.string().min(8).max(8)),
  addressNumber: z.string().min(1).max(20),
});

const schema = z.object({
  page_id: z.string().uuid(),
  method: z.enum(["pix", "credit_card"]),
  payer: payerSchema,
  card: cardSchema.optional(),
});

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();

function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = RATE_LIMIT.get(ip);
  if (!e || now - e.ts > 60_000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return true;
  }
  if (e.count >= 5) return false;
  e.count++;
  return true;
}

function requestIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(req: NextRequest) {
  const ip = requestIp(req);
  if (!checkRL(ip)) {
    return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados de pagamento invalidos." },
      { status: 400 }
    );
  }

  const { page_id, method, payer, card } = parsed.data;
  if (method === "credit_card" && !card) {
    return NextResponse.json(
      { error: "Dados do cartao nao informados." },
      { status: 400 }
    );
  }

  const couple = await prisma.couple.findUnique({
    where: { id: page_id },
    select: { id: true, paid: true, plan: true },
  });

  if (!couple) {
    return NextResponse.json({ error: "Pagina nao encontrada" }, { status: 404 });
  }
  if (couple.paid) {
    return NextResponse.json({ error: "Ja pago" }, { status: 409 });
  }

  try {
    const customer = await createAsaasCustomer({
      ...payer,
      externalReference: `${page_id}:${payer.cpfCnpj}`,
    });

    const payment = await createAsaasPayment({
      customerId: customer.id,
      pageId: page_id,
      plan: couple.plan as "basic" | "premium",
      method,
      payer,
      card,
      remoteIp: ip,
    });

    await prisma.couple.update({
      where: { id: page_id },
      data: { payment_id: payment.id },
    });

    if (method === "pix") {
      const pix = await getAsaasPixQrCode(payment.id);
      return NextResponse.json({
        method,
        payment_id: payment.id,
        page_id,
        pix_qr_code: pix.encodedImage,
        pix_copia_cola: pix.payload,
        pix_expiration: pix.expirationDate,
      });
    }

    if (isAsaasPaidStatus(payment.status)) {
      const activated = await activateCouplePage(page_id, payment.id);
      return NextResponse.json({
        method,
        payment_id: payment.id,
        page_id,
        paid: true,
        slug: activated?.slug,
      });
    }

    return NextResponse.json({
      method,
      payment_id: payment.id,
      page_id,
      paid: false,
      status: payment.status,
      invoice_url: payment.invoiceUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar pagamento.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

