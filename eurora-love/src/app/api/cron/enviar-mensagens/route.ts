import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import nodemailer from "nodemailer";
import { optionalEnv, requiredEnv } from "@/server/env";

const GMAIL_USER = optionalEnv("GMAIL_USER", "eurora.com.br@gmail.com");
const FROM = `EURORA LOVE <${GMAIL_USER}>`;
const APP_URL = optionalEnv("NEXT_PUBLIC_APP_URL", "https://eurora.site");
const ADMIN_EMAIL = "eurora.com.br@gmail.com";

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: requiredEnv("GMAIL_APP_PASSWORD") },
  });
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nl2br(s: string) {
  return esc(s).replace(/\n/g, "<br>");
}

function baseHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#07050a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#07050a">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="padding-bottom:20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background-color:#e11d48;border-radius:8px;padding:5px 18px;">
            <span style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">EURORA LOVE</span>
          </td>
        </tr></table>
      </td></tr>
      ${body}
      <tr><td align="center" style="padding-top:28px;border-top:1px solid rgba(255,255,255,0.07);">
        <p style="margin:0;color:rgba(255,245,240,0.28);font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;">
          <a href="${APP_URL}" style="color:#fb7185;text-decoration:none;">eurora.site</a>
          &nbsp;&mdash;&nbsp;
          Enviado com amor &#x2665;
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function messageCardRows(msg: string) {
  return `
<tr><td align="center" style="padding:16px 0 8px;font-size:52px;line-height:1;">&#x1F48C;</td></tr>
<tr><td align="center" style="padding-bottom:28px;">
  <h1 style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.55;">
    Uma mensagem especial<br><em style="color:#fb7185;">chegou pra voc&#234;</em>
  </h1>
</td></tr>
<tr><td style="height:3px;background-color:#e11d48;border-radius:3px 3px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:0 0 28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#110d16;border:1px solid rgba(225,29,72,0.15);border-top:0;border-radius:0 0 16px 16px;">
    <tr><td style="padding:32px 28px;">
      <p style="margin:0;color:#fff0f5;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.9;font-style:italic;">${nl2br(msg)}</p>
    </td></tr>
  </table>
</td></tr>`;
}

function ctaButtonRow(href: string, label: string, bgColor: string) {
  return `
<tr><td align="center" style="padding-bottom:20px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="background-color:${bgColor};border-radius:12px;padding:14px 32px;">
      <a href="${href}" style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;display:block;white-space:nowrap;">${label}</a>
    </td>
  </tr></table>
</td></tr>`;
}

function messagePreviewRow(msg: string, labelText: string) {
  return `
<tr><td style="padding:0 0 24px;">
  <p style="margin:0 0 8px;color:rgba(255,245,240,0.45);font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;">${labelText}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#110d16;border:1px solid rgba(225,29,72,0.15);border-radius:12px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0;color:#fff0f5;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.85;font-style:italic;">${nl2br(msg)}</p>
    </td></tr>
  </table>
</td></tr>`;
}

function infoRow(html: string) {
  return `
<tr><td style="padding:0 0 20px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
    <tr><td style="padding:18px 22px;">
      <p style="margin:0;color:rgba(255,245,240,0.7);font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;">${html}</p>
    </td></tr>
  </table>
</td></tr>`;
}

function buildDirectEmail(message: string): string {
  return baseHtml("Mensagem especial", messageCardRows(message));
}

function buildWaReminder(phone: string, message: string): string {
  const waLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const body = `
<tr><td align="center" style="padding:16px 0 8px;font-size:52px;line-height:1;">&#x1F4AC;</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <h1 style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;line-height:1.55;">
    Chegou a hora!<br><em style="color:#25D366;">Envie sua mensagem no WhatsApp</em>
  </h1>
</td></tr>
${infoRow(`Clique no bot&#227;o abaixo para abrir o WhatsApp com a mensagem j&#225; preenchida. Basta pressionar <strong>Enviar</strong>!`)}
${ctaButtonRow(waLink, "&#x1F4AC; Abrir WhatsApp e Enviar", "#25D366")}
${messagePreviewRow(message, "Texto da mensagem")}`;
  return baseHtml("Hora de enviar no WhatsApp!", body);
}

function buildTelegramReminder(tgUser: string, message: string): string {
  const handle = tgUser.replace(/^@/, "");
  const tgLink = `https://t.me/${handle}`;
  const body = `
<tr><td align="center" style="padding:16px 0 8px;font-size:52px;line-height:1;">&#x2708;&#xFE0F;</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <h1 style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;line-height:1.55;">
    Chegou a hora!<br><em style="color:#2AABEE;">Envie sua mensagem no Telegram</em>
  </h1>
</td></tr>
${infoRow(`Abra a conversa com <strong>@${esc(handle)}</strong> e cole a mensagem abaixo. Simples assim!`)}
${ctaButtonRow(tgLink, "&#x2708;&#xFE0F; Abrir Telegram", "#2AABEE")}
${messagePreviewRow(message, "Copie e cole esta mensagem")}`;
  return baseHtml("Hora de enviar no Telegram!", body);
}

function buildCorreiosAdmin(address: string, message: string, clientEmail: string, sendAt: Date): string {
  const dateStr = sendAt.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const body = `
<tr><td align="center" style="padding:16px 0 8px;font-size:52px;line-height:1;">&#x1F4EC;</td></tr>
<tr><td align="center" style="padding-bottom:24px;">
  <h1 style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;line-height:1.55;">
    <span style="color:#fb7185;">Nova carta</span> para enviar pelos Correios
  </h1>
</td></tr>
<tr><td style="padding:0 0 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#110d16;border:1px solid rgba(225,29,72,0.15);border-radius:12px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;color:rgba(255,245,240,0.4);font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Data programada</p>
      <p style="margin:0 0 16px;color:#fff0f5;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">${dateStr}</p>
      <p style="margin:0 0 4px;color:rgba(255,245,240,0.4);font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Endere&#231;o de entrega</p>
      <p style="margin:0 0 16px;color:#fff0f5;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;white-space:pre-line;">${esc(address)}</p>
      <p style="margin:0 0 4px;color:rgba(255,245,240,0.4);font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">E-mail do cliente</p>
      <p style="margin:0;color:#fb7185;font-family:Arial,sans-serif;font-size:14px;">${esc(clientEmail)}</p>
    </td></tr>
  </table>
</td></tr>
${messagePreviewRow(message, "Texto da carta")}`;
  return baseHtml("Carta para enviar pelos Correios", body);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${requiredEnv("CRON_SECRET")}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const pending = await prisma.scheduledMessage.findMany({
    where: { sent: false, paid: true, send_at: { lte: now } },
    take: 50,
  });

  let sent = 0;
  let failed = 0;

  const transporter = createTransporter();

  for (const msg of pending) {
    try {
      const notifyTo = msg.sender_email ?? ADMIN_EMAIL;

      if (msg.channel === "email") {
        await transporter.sendMail({
          from: FROM,
          to: msg.recipient,
          subject: "Uma mensagem especial chegou pra você 💌",
          html: buildDirectEmail(msg.message),
        });
      } else if (msg.channel === "wpp") {
        await transporter.sendMail({
          from: FROM,
          to: notifyTo,
          subject: "Hora de enviar no WhatsApp! 💬",
          html: buildWaReminder(msg.recipient, msg.message),
        });
      } else if (msg.channel === "telegram") {
        await transporter.sendMail({
          from: FROM,
          to: notifyTo,
          subject: "Hora de enviar no Telegram! ✈️",
          html: buildTelegramReminder(msg.recipient, msg.message),
        });
      } else if (msg.channel === "correios") {
        await transporter.sendMail({
          from: FROM,
          to: ADMIN_EMAIL,
          subject: `[Correios] Nova carta — ${new Date(msg.send_at).toLocaleDateString("pt-BR")}`,
          html: buildCorreiosAdmin(msg.recipient, msg.message, notifyTo, msg.send_at),
        });
      }

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
