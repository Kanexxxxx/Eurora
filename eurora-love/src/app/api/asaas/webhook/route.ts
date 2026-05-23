import { NextRequest, NextResponse } from "next/server";
import { optionalEnv } from "@/server/env";
import { activateCouplePage } from "@/server/payments/activateCouple";

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

  await activateCouplePage(pageId, paymentId);

  return NextResponse.json({ received: true });
}

