import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asaasRequest, onlyDigits, todayIsoDate } from "@/server/payments/asaas";
import { checkRateLimit } from "@/server/rateLimit";
import { prisma } from "@/server/db/prisma";
import { sendPixEmail } from "@/server/presenteEmail";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  cpf: z.string().transform(onlyDigits).pipe(z.string().min(11).max(11)),
});

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, { key: "gift-payment", limit: 3, windowMs: 60_000 }))
    return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });

  const { name, email, cpf } = parsed.data;

  try {
    const customer = await asaasRequest<{ id: string }>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name, cpfCnpj: cpf, email,
        externalReference: `presentes:${email}`,
        notificationDisabled: true,
      }),
    });

    const payment = await asaasRequest<{ id: string; status?: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id, billingType: "PIX", value: 8,
        dueDate: todayIsoDate(),
        description: "EURORA LOVE - Curadoria de Presentes",
        externalReference: `presentes:${Date.now()}`,
      }),
    });

    const pix = await asaasRequest<{ encodedImage: string; payload: string }>(
      `/payments/${payment.id}/pixQrCode`
    );

    // Salva para rastrear confirmação de email
    await prisma.presentePayment.create({
      data: { payment_id: payment.id, email, name, pix_copia_cola: pix.payload },
    });

    // Envia email com QR code (sem bloquear a resposta)
    sendPixEmail(email, name, pix.payload, pix.encodedImage).catch(() => {});

    return NextResponse.json({
      payment_id: payment.id,
      pix_qr_code: pix.encodedImage,
      pix_copia_cola: pix.payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar PIX.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
