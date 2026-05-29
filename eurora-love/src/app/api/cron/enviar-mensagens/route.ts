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

// ─── Design System (matches eurora.site) ────────────────────────────────────
// bg: #07050a  card: #0c0810  rose-gold: #ff2d6a  gold: #f6c986  text: #fff5f0

// Gmail Android ignora bgcolor escuro — usamos rosa claro que combina com a marca
// e que nenhum cliente de email vai "corrigir"
const BG_OUTER  = "#fdf0f4";  // fundo externo rosa muito claro
const BG_CARD   = "#ffffff";  // card branco
const BG_ACCENT = "#fff0f5";  // seções de destaque rose tint
const C_ROSE    = "#d6195a";  // rosa principal
const C_ROSE2   = "#ff2d6a";  // rosa vibrante
const C_TEXT    = "#1a0a10";  // texto escuro quase preto rose-tinted
const C_MUTED   = "#6b3047";  // texto secundário rose escuro

const CSS = `
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{color:${C_ROSE};}
  body{background-color:${BG_OUTER};}

  @media only screen and (max-width:620px){
    .ew{padding:24px 12px !important;}
    .ec{width:100% !important;}
    .et{font-size:22px !important;line-height:1.4 !important;}
    .em{font-size:16px !important;padding:24px 18px !important;}
    .ep{font-size:14px !important;padding:16px 18px !important;}
    .eb{padding:14px 26px !important;font-size:14px !important;}
    .efeat{display:none !important;}
    .efeat-sm{display:table !important;}
  }
`;

function baseHtml(title: string, preheader: string, body: string, showFeatures = false) {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style type="text/css">${CSS}</style>
</head>
<body style="margin:0;padding:0;background-color:${BG_OUTER};word-break:break-word;" bgcolor="${BG_OUTER}">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preheader)}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG_OUTER}" style="background-color:${BG_OUTER};">
<tr><td align="center" style="padding:24px 16px 40px;">

  <table role="presentation" class="ec" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

    <!-- HERO: gradiente rose-gold -->
    <tr><td style="border-radius:18px 18px 0 0;overflow:hidden;background:linear-gradient(135deg,${C_ROSE} 0%,${C_ROSE2} 50%,#f6a623 100%);padding:28px 32px 32px;" align="center">
      <!-- Logo -->
      <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.32em;text-transform:uppercase;color:rgba(255,255,255,0.85);">&#x2665;&nbsp; EURORA LOVE &nbsp;&#x2665;</p>
      <p style="margin:0;font-size:44px;line-height:1;">&#x1F48C;</p>
      <h1 class="et" style="margin:14px 0 6px;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;line-height:1.4;text-align:center;">
        Uma mensagem especial
      </h1>
      <p style="margin:0;color:rgba(255,255,255,0.85);font-family:Georgia,serif;font-size:18px;font-style:italic;text-align:center;">chegou pra voc&#234; &#x2665;</p>
    </td></tr>

    <!-- CARD PRINCIPAL -->
    <tr><td bgcolor="${BG_CARD}" style="background-color:${BG_CARD};border-left:1px solid #f3d0da;border-right:1px solid #f3d0da;padding:32px 32px 0;" class="ew">

      ${body}

    </td></tr>

    ${showFeatures ? `
    <!-- FEATURES -->
    <tr><td bgcolor="${BG_ACCENT}" style="background-color:${BG_ACCENT};border:1px solid #f3d0da;border-top:0;padding:24px 32px;" class="ew">
      ${featureSection()}
    </td></tr>
    ` : ""}

    <!-- FOOTER -->
    <tr><td bgcolor="${BG_OUTER}" style="background-color:${BG_OUTER};border:1px solid #f3d0da;border-top:0;border-radius:0 0 18px 18px;padding:20px 24px;" align="center">
      <p style="margin:0 0 6px;color:${C_MUTED};font-family:Arial,sans-serif;font-size:12px;line-height:1.7;text-align:center;">
        Enviado via <a href="${APP_URL}" style="color:${C_ROSE};text-decoration:none;font-weight:700;">eurora.site</a>
        &nbsp;&#x2665;&nbsp; Feito com amor
      </p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;text-align:center;">
        <a href="${APP_URL}/cancelar" style="color:#b06080;text-decoration:underline;">Cancelar</a>
        &nbsp;&bull;&nbsp;
        <a href="${APP_URL}/privacidade" style="color:#b06080;text-decoration:underline;">Privacidade</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

function featureSection() {
  const features = [
    { emoji: "💌", title: "P&#225;gina do Amor", desc: "Fotos, m&#250;sica e mensagem numa p&#225;gina cinem&#225;tica.", href: `${APP_URL}/criar` },
    { emoji: "🎁", title: "Presentes Secretos", desc: "250+ ideias por apenas R$8.", href: `${APP_URL}/presentes` },
    { emoji: "🧠", title: "Teste do Casal", desc: "Quanto ele(a) te conhece? Gr&#225;tis!", href: `${APP_URL}/quiz` },
  ];

  const cards = features.map(f => `
    <td width="33%" valign="top" style="padding:0 5px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#ffffff;border:1px solid #f3d0da;border-radius:12px;">
        <tr><td align="center" style="padding:16px 10px 6px;font-size:24px;line-height:1;">${f.emoji}</td></tr>
        <tr><td align="center" style="padding:0 10px 5px;">
          <p style="margin:0;color:${C_TEXT};font-family:Arial,sans-serif;font-size:11px;font-weight:700;line-height:1.3;">${f.title}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 8px 12px;">
          <p style="margin:0;color:${C_MUTED};font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">${f.desc}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 10px 14px;">
          <a href="${f.href}" style="color:${C_ROSE};font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-decoration:none;">Ver &rarr;</a>
        </td></tr>
      </table>
    </td>`).join("");

  return `
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0 0 14px;color:rgba(255,245,240,0.30);font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;text-align:center;">Conheça o EURORA LOVE</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="efeat">
      <tr>${cards}</tr>
    </table>
    <!-- Mobile fallback: list view -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="efeat-sm" style="display:none;">
      ${features.map(f => `
      <tr><td style="padding-bottom:10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#0c0810;border:1px solid rgba(246,201,134,0.10);border-radius:12px;">
          <tr>
            <td width="44" align="center" style="padding:14px 0 14px 16px;font-size:24px;">${f.emoji}</td>
            <td style="padding:14px 16px 14px 10px;">
              <p style="margin:0 0 3px;color:${C_TEXT};font-family:Arial,sans-serif;font-size:13px;font-weight:700;">${f.title}</p>
              <p style="margin:0;color:rgba(255,245,240,0.45);font-family:Arial,sans-serif;font-size:11px;line-height:1.5;">${f.desc}</p>
            </td>
            <td width="50" align="center" style="padding:14px 14px 14px 0;">
              <a href="${f.href}" style="color:#ff2d6a;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-decoration:none;">Ver &rarr;</a>
            </td>
          </tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>`;
}

function ctaButton(href: string, label: string, bg: string) {
  return `
  <tr><td align="center" style="padding-bottom:24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${bg};border-radius:9999px;">
        <a href="${href}" class="eb" style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;display:block;padding:15px 40px;white-space:nowrap;border-radius:9999px;">${label}</a>
      </td>
    </tr></table>
  </td></tr>`;
}

function infoBox(html: string) {
  return `
  <tr><td style="padding-bottom:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${BG_ACCENT};border:1px solid #f3d0da;border-radius:14px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;color:${C_TEXT};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;">${html}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

function messageCard(msg: string) {
  return `
  <tr><td style="padding-bottom:28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-radius:14px;overflow:hidden;border:1px solid #f3d0da;">
      <tr><td style="height:4px;background:linear-gradient(90deg,${C_ROSE},${C_ROSE2},#f6a623);font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td class="em" style="background-color:${BG_CARD};padding:28px 28px 24px;">
        <p style="margin:0;color:${C_TEXT};font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.95;font-style:italic;">${nl2br(msg)}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

function messagePreviewCard(msg: string, label: string) {
  return `
  <tr><td style="padding-bottom:20px;">
    <p style="margin:0 0 8px;color:${C_MUTED};font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;">${label}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${BG_ACCENT};border:1px solid #f3d0da;border-radius:12px;">
      <tr><td class="ep" style="padding:20px 22px;">
        <p style="margin:0;color:${C_TEXT};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.85;font-style:italic;">${nl2br(msg)}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

// ─── Email builders ──────────────────────────────────────────────────────────

function buildDirectEmail(message: string, senderName?: string): { html: string; text: string } {
  const sig = senderName
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr><td align="right"><p style="margin:0;color:${C_MUTED};font-family:Georgia,serif;font-size:13px;font-style:italic;">— ${esc(senderName)} &#x2665;</p></td></tr></table>`
    : "";

  const body = `
  <!-- Subtítulo centralizado -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
    <tr><td align="center">
      <p style="margin:0;color:${C_MUTED};font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">
        Algu&#233;m pensou muito em voc&#234; antes de escrever isso &#x2665;
      </p>
    </td></tr>
  </table>

  <!-- Divisor rose-gold -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
    <tr><td style="height:2px;background:linear-gradient(90deg,transparent,${C_ROSE},#f6a623,${C_ROSE},transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>

  <!-- Mensagem principal -->
  ${messageCard(message)}

  <!-- Assinatura do remetente (se houver) -->
  ${sig}

  <!-- CTA centralizado -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background-color:${BG_ACCENT};border:1px solid #f3d0da;border-radius:14px;">
    <tr><td align="center" style="padding:22px 24px 20px;">
      <p style="margin:0 0 4px;font-size:22px;line-height:1;">&#x2728;</p>
      <p style="margin:0 0 4px;color:${C_TEXT};font-family:Georgia,serif;font-size:15px;font-weight:700;">Quer surpreender tamb&#233;m?</p>
      <p style="margin:0 0 18px;color:${C_MUTED};font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">
        Crie uma p&#225;gina do amor com fotos, m&#250;sica e mensagem. Em minutos.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:linear-gradient(135deg,${C_ROSE},#f6a623);border-radius:9999px;">
          <a href="${APP_URL}/criar" class="eb" style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;display:block;padding:14px 36px;border-radius:9999px;white-space:nowrap;">
            &#x1F48C; Criar minha p&#225;gina
          </a>
        </td>
      </tr></table>
    </td></tr>
  </table>
  `;

  const text = [
    "EURORA LOVE ♥",
    "",
    "Uma mensagem especial chegou pra você:",
    "",
    message,
    "",
    ...(senderName ? [`— ${senderName} ♥`, ""] : []),
    "──────────────────",
    `Crie sua página do amor: ${APP_URL}/criar`,
    `Presentes secretos: ${APP_URL}/presentes`,
    `eurora.site ♥`,
  ].join("\n");

  return { html: baseHtml("Uma mensagem especial chegou pra você 💌", "Alguém pensou muito em você antes de escrever isso ♥", body, true), text };
}

function buildWaReminder(phone: string, message: string): { html: string; text: string } {
  const waLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  const body = `
  <tr><td align="center" class="eicon" style="padding:8px 0 16px;font-size:52px;line-height:1;">&#x1F4AC;</td></tr>
  <tr><td align="center" style="padding-bottom:26px;">
    <h1 class="et" style="margin:0;color:${C_TEXT};font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
      Chegou a hora!<br><em style="color:#25D366;">Envie no WhatsApp agora</em>
    </h1>
  </td></tr>
  ${infoBox("Clique no bot&#227;o abaixo para abrir o WhatsApp com a mensagem j&#225; preenchida. Basta pressionar <strong style=\"color:${C_TEXT};\">Enviar</strong>!")}
  ${ctaButton(waLink, "&#x1F4AC; Abrir WhatsApp e Enviar", "linear-gradient(135deg,#25D366,#1da851)")}
  ${messagePreviewCard(message, "Texto da mensagem")}
  `;

  const text = [
    "EURORA LOVE ♥ — Hora de enviar!",
    "",
    "Clique no link para abrir o WhatsApp com a mensagem pronta:",
    waLink,
    "",
    "Texto da mensagem:",
    message,
    "",
    `──────────────────────────────`,
    `eurora.site — Feito com amor`,
  ].join("\n");

  return { html: baseHtml("Hora de enviar no WhatsApp! 💬", "A mensagem programada está pronta — só enviar!", body, true), text };
}

function buildTelegramReminder(tgUser: string, message: string): { html: string; text: string } {
  const handle = tgUser.replace(/^@/, "");
  const tgLink = `https://t.me/${handle}`;

  const body = `
  <tr><td align="center" class="eicon" style="padding:8px 0 16px;font-size:52px;line-height:1;">&#x2708;&#xFE0F;</td></tr>
  <tr><td align="center" style="padding-bottom:26px;">
    <h1 class="et" style="margin:0;color:${C_TEXT};font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
      Chegou a hora!<br><em style="color:#2AABEE;">Envie no Telegram agora</em>
    </h1>
  </td></tr>
  ${infoBox(`Abra a conversa com <strong style="color:${C_TEXT};">@${esc(handle)}</strong>, cole a mensagem abaixo e pressione enviar. Simples assim!`)}
  ${ctaButton(tgLink, "&#x2708;&#xFE0F; Abrir Telegram", "linear-gradient(135deg,#2AABEE,#1d8bc4)")}
  ${messagePreviewCard(message, "Copie e cole esta mensagem")}
  `;

  const text = [
    "EURORA LOVE ♥ — Hora de enviar!",
    "",
    `Abra o Telegram com @${handle}:`,
    tgLink,
    "",
    "Texto da mensagem:",
    message,
    "",
    `──────────────────────────────`,
    `eurora.site — Feito com amor`,
  ].join("\n");

  return { html: baseHtml("Hora de enviar no Telegram! ✈️", "A mensagem programada está pronta — só enviar!", body, true), text };
}

function buildCorreiosAdmin(address: string, message: string, clientEmail: string, sendAt: Date): { html: string; text: string } {
  const dateStr = sendAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const body = `
  <tr><td align="center" class="eicon" style="padding:8px 0 16px;font-size:52px;line-height:1;">&#x1F4EC;</td></tr>
  <tr><td align="center" style="padding-bottom:26px;">
    <h1 class="et" style="margin:0;color:${C_TEXT};font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
      <span style="color:#ff2d6a;">Nova carta</span><br>para enviar pelos Correios
    </h1>
  </td></tr>

  <!-- Info card -->
  <tr><td style="padding-bottom:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:#0c0810;border:1px solid rgba(246,201,134,0.10);border-radius:14px;">
      <tr><td style="padding:24px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="50%" valign="top" style="padding-bottom:16px;">
              <p style="margin:0 0 4px;color:rgba(255,245,240,0.38);font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Data programada</p>
              <p style="margin:0;color:${C_TEXT};font-family:Arial,sans-serif;font-size:14px;font-weight:700;">${dateStr}</p>
            </td>
            <td width="50%" valign="top" style="padding-bottom:16px;">
              <p style="margin:0 0 4px;color:rgba(255,245,240,0.38);font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">E-mail do cliente</p>
              <p style="margin:0;color:#ff2d6a;font-family:Arial,sans-serif;font-size:14px;">${esc(clientEmail)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p style="margin:0 0 4px;color:rgba(255,245,240,0.38);font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Endere&#231;o de entrega</p>
              <p style="margin:0;color:${C_TEXT};font-family:Arial,sans-serif;font-size:14px;line-height:1.7;white-space:pre-line;">${esc(address)}</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
  ${messagePreviewCard(message, "Texto da carta")}
  `;

  const text = [
    "EURORA LOVE ♥ — Nova carta pelos Correios",
    "",
    `Data: ${dateStr}`,
    `Endereço: ${address}`,
    `Cliente: ${clientEmail}`,
    "",
    "Mensagem:",
    message,
    "",
    `──────────────────────────────`,
    `eurora.site`,
  ].join("\n");

  return { html: baseHtml(`[Correios] Nova carta — ${dateStr}`, `Nova carta para entregar em ${address.split("\n")[0]}`, body), text };
}

// ─── Cron handler ────────────────────────────────────────────────────────────

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

  // Headers para lembretes (remetente) — canal de notificação transacional
  const reminderHeaders = {
    "List-Unsubscribe": `<mailto:${ADMIN_EMAIL}?subject=Cancelar%20emails>`,
    "X-Mailer": "EURORA LOVE",
  };

  for (const msg of pending) {
    try {
      const notifyTo = msg.sender_email ?? ADMIN_EMAIL;
      let subject: string;
      let html: string;
      let text: string;
      let to: string;
      // email direto (ao destinatário do amor): sem headers bulk — é mensagem pessoal
      let headers: Record<string, string> = {};

      if (msg.channel === "email") {
        ({ html, text } = buildDirectEmail(msg.message, msg.sender_name ?? undefined));
        subject = "Uma mensagem especial chegou pra você 💌";
        to = msg.recipient;
      } else if (msg.channel === "wpp") {
        ({ html, text } = buildWaReminder(msg.recipient, msg.message));
        subject = "Hora de enviar no WhatsApp! 💬";
        to = notifyTo;
        headers = reminderHeaders;
      } else if (msg.channel === "telegram") {
        ({ html, text } = buildTelegramReminder(msg.recipient, msg.message));
        subject = "Hora de enviar no Telegram! ✈️";
        to = notifyTo;
        headers = reminderHeaders;
      } else if (msg.channel === "correios") {
        ({ html, text } = buildCorreiosAdmin(msg.recipient, msg.message, notifyTo, msg.send_at));
        subject = `[Correios] Nova carta — ${new Date(msg.send_at).toLocaleDateString("pt-BR")}`;
        to = ADMIN_EMAIL;
        headers = reminderHeaders;
      } else {
        continue;
      }

      await transporter.sendMail({ from: FROM, to, subject, html, text, headers });

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
