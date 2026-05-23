import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { z } from "zod";

const schema = z.object({
  channel: z.enum(["email", "wpp", "telegram", "correios"]),
  recipient: z.string().min(3).max(500),
  sender_email: z.string().email().optional(),
  message: z.string().min(10).max(2000),
  send_at: z.string().datetime(),
  payment_id: z.string().optional(),
});

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();

function checkRateLimit(ip: string, max = 5, windowMs = 60 * 60 * 1000): boolean {
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Limite de agendamentos atingido. Tente novamente em 1 hora." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { channel, recipient, sender_email, message, send_at, payment_id } = parsed.data;

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
      message,
      send_at: sendDate,
      paid: true,
      payment_id: payment_id || null,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: scheduled.id });
}
