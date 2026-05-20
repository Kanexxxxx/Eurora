import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  // Vercel Cron authenticates with CRON_SECRET header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const pending = await prisma.scheduledMessage.findMany({
    where: {
      sent: false,
      paid: true,
      send_at: { lte: now },
    },
    take: 50,
  });

  let sent = 0;
  let failed = 0;

  for (const msg of pending) {
    try {
      if (msg.channel === "email") {
        await resend.emails.send({
          from: "EURORA LOVE <oi@eurora.love.br>",
          to: msg.recipient,
          subject: "Uma mensagem especial chegou pra você 💌",
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#07050a;color:#fff5f0;padding:40px;border-radius:16px;">
              <p style="color:#ff2d6a;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:24px;">EURORA LOVE</p>
              <div style="background:rgba(255,200,220,0.05);border:1px solid rgba(255,200,220,0.1);border-radius:12px;padding:32px;">
                <p style="font-size:18px;line-height:1.8;white-space:pre-line;">${msg.message}</p>
              </div>
              <p style="color:rgba(255,245,240,0.4);font-size:12px;margin-top:24px;text-align:center;">
                Criado com <a href="https://eurora.love.br" style="color:#ff2d6a;">EURORA LOVE</a>
              </p>
            </div>
          `,
        });
      }
      // WhatsApp: não há API automática sem aprovação do Meta Business.
      // Para WhatsApp, a mensagem é armazenada e o usuário é notificado por email
      // para enviá-la manualmente no momento certo (via link wa.me pré-formatado).

      await prisma.scheduledMessage.update({
        where: { id: msg.id },
        data: { sent: true, sent_at: new Date() },
      });
      sent++;
    } catch (err) {
      console.error(`Falha ao enviar mensagem ${msg.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ processed: pending.length, sent, failed });
}
