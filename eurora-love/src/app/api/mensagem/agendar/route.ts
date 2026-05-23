import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { z } from "zod";

const schema = z.object({
  channel: z.enum(["email", "wpp"]),
  recipient: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  send_at: z.string().datetime(),
  payment_id: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados invÃ¡lidos." }, { status: 400 });

  const { channel, recipient, message, send_at, payment_id } = parsed.data;

  const scheduled = await prisma.scheduledMessage.create({
    data: {
      channel,
      recipient,
      message,
      send_at: new Date(send_at),
      paid: true,
      payment_id: payment_id || null,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: scheduled.id });
}

