import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { optionalEnv } from "@/server/env";
import { activateCouplePage } from "@/server/payments/activateCouple";

async function notifyAdminSale(slug: string) {
  const user = optionalEnv("GMAIL_USER", "eurora.com.br@gmail.com");
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    const appUrl = optionalEnv("NEXT_PUBLIC_APP_URL", "https://eurora.site");
    await transporter.sendMail({
      from: `EURORA LOVE <${user}>`,
      to: user,
      subject: `💰 Nova venda — ${slug}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:24px;border-radius:12px;max-width:480px">
          <h2 style="color:#fb7185;margin:0 0 12px">Nova página vendida!</h2>
          <p style="color:rgba(255,255,255,0.7);margin:0 0 16px">Uma página foi paga e ativada agora.</p>
          <a href="${appUrl}/${slug}" style="display:inline-block;background:#e11d48;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
            Ver página: ${slug}
          </a>
        </div>
      `,
    });
  } catch { /* não bloqueia o webhook por falha de email */ }
}

type AsaasWebhookEvent = {
  event?: string;
  payment?: {
    id?: string;
    status?: string;
    externalReference?: string;
  };
};

const PAID_EVENTS = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);

function verifyWebhookToken(req: NextRequest) {
  const expected = optionalEnv("ASAAS_WEBHOOK_TOKEN");
  return Boolean(expected) && req.headers.get("asaas-access-token") === expected;
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookToken(req)) {
    return NextResponse.json({ error: "Token invalido" }, { status: 401 });
  }

  let event: AsaasWebhookEvent;
  try {
    event = (await req.json()) as AsaasWebhookEvent;
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  if (!event.event || !PAID_EVENTS.has(event.event)) {
    return NextResponse.json({ received: true });
  }

  const pageId = event.payment?.externalReference;
  const paymentId = event.payment?.id;

  if (!pageId || !paymentId) {
    return NextResponse.json({ received: true });
  }

  const activated = await activateCouplePage(pageId, paymentId);
  if (activated?.slug) {
    void notifyAdminSale(activated.slug);
  }

  return NextResponse.json({ received: true });
}

