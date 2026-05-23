import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requiredEnv } from "@/server/env";
import { asaasRequest, isAsaasPaidStatus } from "@/server/payments/asaas";

function secret() {
  return requiredEnv("CRON_SECRET");
}

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
      type?: string;
      exp?: number;
    };
    return data.type === "presentes" && !!data.exp && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Verify existing token (page reload)
  const token = searchParams.get("token");
  if (token) {
    const valid = verifyToken(token);
    return NextResponse.json({ valid });
  }

  // Poll Asaas for payment status
  const payment_id = searchParams.get("payment_id");
  if (!payment_id)
    return NextResponse.json({ error: "payment_id obrigatÃ³rio" }, { status: 400 });

  try {
    const payment = await asaasRequest<{ status?: string }>(
      `/payments/${payment_id}`
    );
    const paid = isAsaasPaidStatus(payment.status);
    return NextResponse.json({
      paid,
      token: paid ? signToken() : null,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 502 });
  }
}

