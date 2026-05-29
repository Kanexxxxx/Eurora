import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { asaasRequest } from "@/server/payments/asaas";
import { z } from "zod";
import { checkRateLimit } from "@/server/rateLimit";

const schema = z.object({
  channel: z.enum(["email", "wpp", "telegram", "correios"]),
  recipient: z.string().min(3).max(500),
  sender_email: z.string().email().optional(),
  sender_name: z.string().max(60).optional(),
  message: z.string().min(10).max(2000),
  send_at: z.string().datetime(),
  payment_id: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, { key: "schedule-message", limit: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Limite de agendamentos atingido. Tente novamente em 1 hora." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { channel, recipient, sender_email, sender_name, message, send_at, payment_id } = parsed.data;

  // Correios requires a verified payment of R$14
  if (channel === "correios") {
    if (!payment_id) {
      return NextResponse.json({ error: "Pagamento obrigatório para Correios." }, { status: 402 });
    }
    try {
      const payment = await asaasRequest<{ status: string }>(`/payments/${payment_id}`);
      if (payment.status !== "CONFIRMED" && payment.status !== "RECEIVED") {
        return NextResponse.json({ error: "Pagamento não confirmado." }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: "Não foi possível verificar o pagamento." }, { status: 502 });
    }
  }

  // Reject send_at in the past (with 5-min grace)
  const sendDate = new Date(send_at);
  if (sendDate.getTime() < Date.now() - 5 * 60 * 1000) {
    return NextResponse.json({ error: "Data de envio inválida." }, { status: 400 });
  }

  const scheduled = await prisma.scheduledMessage.create({
    data: {
      channel,
      recipient,
      sender_email: sender_email ?? null,
      sender_name: sender_name ?? null,
      message,
      send_at: sendDate,
      paid: true,
      payment_id: payment_id || null,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: scheduled.id });
}
