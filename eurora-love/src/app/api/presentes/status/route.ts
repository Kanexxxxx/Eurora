import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requiredEnv } from "@/server/env";
import { asaasRequest, isAsaasPaidStatus } from "@/server/payments/asaas";
import { prisma } from "@/server/db/prisma";
import { sendConfirmationEmail } from "@/server/presenteEmail";

function secret() { return requiredEnv("CRON_SECRET"); }

function signToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ type: "presentes", exp: Date.now() + 365 * 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (sig !== expected) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      type?: string; exp?: number;
    };
    return data.type === "presentes" && !!data.exp && data.exp > Date.now();
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get("token");
  if (token) return NextResponse.json({ valid: verifyToken(token) });

  const payment_id = searchParams.get("payment_id");
  if (!payment_id)
    return NextResponse.json({ error: "payment_id obrigatorio" }, { status: 400 });

  try {
    const payment = await asaasRequest<{ status?: string }>(`/payments/${payment_id}`);
    const paid = isAsaasPaidStatus(payment.status);

    if (paid) {
      // Envia email de confirmação apenas uma vez
      const record = await prisma.presentePayment.findUnique({ where: { payment_id } }).catch(() => null);
      if (record && !record.email_confirm_sent) {
        await prisma.presentePayment.update({
          where: { payment_id },
          data: { paid: true, email_confirm_sent: true },
        }).catch(() => {});
        sendConfirmationEmail(record.email, record.name).catch(() => {});
      }
    }

    return NextResponse.json({ paid, token: paid ? signToken() : null });
  } catch {
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 502 });
  }
}
