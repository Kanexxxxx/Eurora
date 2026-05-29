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

const CSS = `
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{color:#ff2d6a;}
  body{background-color:#07050a !important;}

  @media only screen and (max-width:620px){
    .ew{padding:0 !important;}
    .ec{width:100% !important;}
    .et{font-size:22px !important;line-height:1.4 !important;}
    .em{font-size:16px !important;padding:22px 18px !important;}
    .ep{font-size:14px !important;padding:16px 18px !important;}
    .eb{padding:14px 24px !important;font-size:14px !important;}
    .ei{font-size:13px !important;padding:14px 16px !important;}
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
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${esc(title)}</title>
<style type="text/css">${CSS}</style>
</head>
<body style="margin:0;padding:0;background-color:#07050a;word-break:break-word;" bgcolor="#07050a">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preheader)}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#07050a" style="background-color:#07050a;">
<tr><td align="center" bgcolor="#07050a" style="background-color:#07050a;">

  <!-- Hero gradient bar -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <tr><td style="height:5px;background:linear-gradient(90deg,#d6195a,#ff2d6a,#f6c986,#ff2d6a,#d6195a);font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>

  <!-- Main card -->
  <table role="presentation" class="ec" cellpadding="0" cellspacing="0" border="0" bgcolor="#0c0810" style="max-width:600px;width:100%;background-color:#0c0810;border-left:1px solid rgba(246,201,134,0.08);border-right:1px solid rgba(246,201,134,0.08);">
  <tr><td class="ew" style="padding:36px 32px;">

    <!-- Logo badge -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:linear-gradient(135deg,#ff2d6a,#f6c986);border-radius:10px;padding:8px 24px;">
            <span style="color:#07050a;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;">&#x2665;&nbsp; EURORA LOVE &nbsp;&#x2665;</span>
          </td>
        </tr></table>
      </td></tr>
    </table>

    ${body}

    ${showFeatures ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
      <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(246,201,134,0.15),transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>
    ${featureSection()}
    ` : ""}

    <!-- Footer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid rgba(246,201,134,0.08);">
      <tr><td align="center" style="padding-top:20px;">
        <p style="margin:0 0 6px;color:rgba(255,245,240,0.40);font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;">
          Enviado via <a href="${APP_URL}" style="color:#ff2d6a;text-decoration:none;font-weight:700;">eurora.site</a>
          &nbsp;&#x2665;&nbsp; Feito com amor
        </p>
        <p style="margin:0;color:rgba(255,245,240,0.25);font-family:Arial,Helvetica,sans-serif;font-size:11px;">
          <a href="${APP_URL}/cancelar" style="color:rgba(255,245,240,0.35);text-decoration:underline;">Cancelar recebimento</a>
          &nbsp;&bull;&nbsp;
          <a href="${APP_URL}/privacidade" style="color:rgba(255,245,240,0.35);text-decoration:underline;">Privacidade</a>
        </p>
      </td></tr>
    </table>

  </td></tr>
  </table>

  <!-- Bottom gradient bar -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#d6195a,#ff2d6a,#f6c986);font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>

</td></tr>
</table>
</body>
</html>`;
}

function featureSection() {
  const features = [
    { emoji: "💌", title: "Página do Amor", desc: "Fotos, música e mensagem em uma página cinematográfica.", href: `${APP_URL}/criar` },
    { emoji: "🎁", title: "Presentes Secretos", desc: "250+ ideias de presentes por apenas R$8.", href: `${APP_URL}/presentes` },
    { emoji: "🔮", title: "Teste do Parceiro", desc: "Veja o quanto ele(a) te conhece de verdade. Grátis!", href: `${APP_URL}/quiz` },
  ];

  const cards = features.map(f => `
    <td width="33%" valign="top" style="padding:0 6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#0c0810;border:1px solid rgba(246,201,134,0.10);border-radius:14px;">
        <tr><td align="center" style="padding:20px 14px 8px;font-size:28px;line-height:1;">${f.emoji}</td></tr>
        <tr><td align="center" style="padding:0 14px 6px;">
          <p style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;line-height:1.3;">${f.title}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 12px 16px;">
          <p style="margin:0;color:rgba(255,245,240,0.45);font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.55;">${f.desc}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 14px 18px;">
          <a href="${f.href}" style="color:#ff2d6a;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-decoration:none;letter-spacing:0.05em;">Ver mais &rarr;</a>
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
              <p style="margin:0 0 3px;color:#fff5f0;font-family:Arial,sans-serif;font-size:13px;font-weight:700;">${f.title}</p>
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
  <tr><td align="center" style="padding-bottom:22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${bg};border-radius:9999px;box-shadow:0 10px 40px -10px rgba(255,45,106,0.55);">
        <a href="${href}" class="eb" style="color:#07050a;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;display:block;padding:15px 38px;white-space:nowrap;border-radius:9999px;">${label}</a>
      </td>
    </tr></table>
  </td></tr>`;
}

function infoBox(html: string) {
  return `
  <tr><td style="padding-bottom:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:rgba(246,201,134,0.04);border:1px solid rgba(246,201,134,0.08);border-radius:14px;">
      <tr><td class="ei" style="padding:18px 22px;">
        <p style="margin:0;color:rgba(255,245,240,0.70);font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;">${html}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

function messageCard(msg: string) {
  return `
  <tr><td style="padding-bottom:32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-radius:16px;overflow:hidden;">
      <!-- Top accent bar — rose gold to champagne -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#d6195a,#ff2d6a,#f6c986);font-size:0;line-height:0;">&nbsp;</td></tr>
      <!-- Message body -->
      <tr><td class="em" style="background:#0c0810;padding:32px 30px;border:1px solid rgba(246,201,134,0.10);border-top:0;border-radius:0 0 16px 16px;">
        <p style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:2;font-style:italic;">${nl2br(msg)}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

function messagePreviewCard(msg: string, label: string) {
  return `
  <tr><td style="padding-bottom:24px;">
    <p style="margin:0 0 8px;color:rgba(255,245,240,0.35);font-family:Arial,Helvetica,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.16em;">${label}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:#0c0810;border:1px solid rgba(246,201,134,0.10);border-radius:14px;">
      <tr><td class="ep" style="padding:22px 26px;">
        <p style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.9;font-style:italic;">${nl2br(msg)}</p>
      </td></tr>
    </table>
  </td></tr>`;
}

// ─── Email builders ──────────────────────────────────────────────────────────

function buildDirectEmail(message: string, senderName?: string): { html: string; text: string } {
  const body = `
  <!-- Hero title -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr><td align="center">
      <p style="margin:0 0 10px;font-size:40px;line-height:1;">&#x1F48C;</p>
      <h1 class="et" style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;line-height:1.45;">
        Uma mensagem especial<br><em style="color:#ff2d6a;">chegou pra voc&#234;</em>
      </h1>
      <p style="margin:10px 0 0;color:rgba(255,245,240,0.45);font-family:Arial,Helvetica,sans-serif;font-size:13px;">
        Algu&#233;m pensou muito em voc&#234; antes de escrever isso &#x2665;
      </p>
    </td></tr>
  </table>

  <!-- Message card -->
  ${messageCard(message)}

  <!-- Divider -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(246,201,134,0.12),transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>

  <!-- Cross-sell: criar página -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:linear-gradient(135deg,rgba(255,45,106,0.08),rgba(246,201,134,0.05));border:1px solid rgba(255,45,106,0.15);border-radius:16px;margin-bottom:24px;">
    <tr><td style="padding:24px 26px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:16px;">
            <p style="margin:0 0 4px;font-size:22px;line-height:1;">&#x2728;</p>
            <p style="margin:0 0 6px;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:700;">Quer surpreender tamb&#233;m?</p>
            <p style="margin:0;color:rgba(255,245,240,0.50);font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
              Crie uma p&#225;gina do amor com fotos, m&#250;sica e mensagem. Em minutos.
            </p>
          </td>
        </tr>
        <tr><td style="padding-top:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="background:linear-gradient(135deg,#ff2d6a,#f6c986);border-radius:9999px;">
              <a href="${APP_URL}/criar" class="eb" style="color:#07050a;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:800;text-decoration:none;display:block;padding:12px 28px;border-radius:9999px;white-space:nowrap;">
                &#x1F48C; Criar minha p&#225;gina
              </a>
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>

  <!-- 3 features row -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;" class="efeat">
    <tr>
      <td width="33%" valign="top" style="padding:0 5px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#13101a;border:1px solid #2a2035;border-radius:12px;">
          <tr><td align="center" style="padding:16px 12px 8px;font-size:24px;">&#x1F381;</td></tr>
          <tr><td align="center" style="padding:0 10px 6px;"><p style="margin:0;color:#fff5f0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;">Presentes Secretos</p></td></tr>
          <tr><td align="center" style="padding:0 10px 12px;"><p style="margin:0;color:rgba(255,245,240,0.40);font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">250+ ideias por R$8</p></td></tr>
          <tr><td align="center" style="padding:0 10px 14px;"><a href="${APP_URL}/presentes" style="color:#ff2d6a;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-decoration:none;">Ver &rarr;</a></td></tr>
        </table>
      </td>
      <td width="33%" valign="top" style="padding:0 2px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#13101a;border:1px solid #2a2035;border-radius:12px;">
          <tr><td align="center" style="padding:16px 12px 8px;font-size:24px;">&#x1F4AC;</td></tr>
          <tr><td align="center" style="padding:0 10px 6px;"><p style="margin:0;color:#fff5f0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;">Mensagem Futura</p></td></tr>
          <tr><td align="center" style="padding:0 10px 12px;"><p style="margin:0;color:rgba(255,245,240,0.40);font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">Agende para a hora certa</p></td></tr>
          <tr><td align="center" style="padding:0 10px 14px;"><a href="${APP_URL}/mensagem" style="color:#ff2d6a;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-decoration:none;">Ver &rarr;</a></td></tr>
        </table>
      </td>
      <td width="33%" valign="top" style="padding:0 0 0 5px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#13101a;border:1px solid #2a2035;border-radius:12px;">
          <tr><td align="center" style="padding:16px 12px 8px;font-size:24px;">&#x1F9E0;</td></tr>
          <tr><td align="center" style="padding:0 10px 6px;"><p style="margin:0;color:#fff5f0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;">Teste do Casal</p></td></tr>
          <tr><td align="center" style="padding:0 10px 12px;"><p style="margin:0;color:rgba(255,245,240,0.40);font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">Quanto ele te conhece?</p></td></tr>
          <tr><td align="center" style="padding:0 10px 14px;"><a href="${APP_URL}/quiz" style="color:#ff2d6a;font-family:Arial,sans-serif;font-size:10px;font-weight:700;text-decoration:none;">Ver &rarr;</a></td></tr>
        </table>
      </td>
    </tr>
  </table>
  `;

  // Assinatura do remetente
  const signatureBlock = senderName ? `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:-16px;margin-bottom:24px;">
    <tr><td align="right">
      <p style="margin:0;color:rgba(255,245,240,0.55);font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;">
        — ${esc(senderName)} &#x2665;
      </p>
    </td></tr>
  </table>` : "";

  const fullBody = body.replace("  <!-- 3 features row -->", `${signatureBlock}  <!-- 3 features row -->`);

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

  return { html: baseHtml("Uma mensagem especial chegou pra você 💌", "Alguém pensou muito em você antes de escrever isso ♥", fullBody, false), text };
}

function buildWaReminder(phone: string, message: string): { html: string; text: string } {
  const waLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  const body = `
  <tr><td align="center" class="eicon" style="padding:8px 0 16px;font-size:52px;line-height:1;">&#x1F4AC;</td></tr>
  <tr><td align="center" style="padding-bottom:26px;">
    <h1 class="et" style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
      Chegou a hora!<br><em style="color:#25D366;">Envie no WhatsApp agora</em>
    </h1>
  </td></tr>
  ${infoBox("Clique no bot&#227;o abaixo para abrir o WhatsApp com a mensagem j&#225; preenchida. Basta pressionar <strong style=\"color:#fff5f0;\">Enviar</strong>!")}
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
    <h1 class="et" style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
      Chegou a hora!<br><em style="color:#2AABEE;">Envie no Telegram agora</em>
    </h1>
  </td></tr>
  ${infoBox(`Abra a conversa com <strong style="color:#fff5f0;">@${esc(handle)}</strong>, cole a mensagem abaixo e pressione enviar. Simples assim!`)}
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
    <h1 class="et" style="margin:0;color:#fff5f0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.5;">
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
              <p style="margin:0;color:#fff5f0;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">${dateStr}</p>
            </td>
            <td width="50%" valign="top" style="padding-bottom:16px;">
              <p style="margin:0 0 4px;color:rgba(255,245,240,0.38);font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">E-mail do cliente</p>
              <p style="margin:0;color:#ff2d6a;font-family:Arial,sans-serif;font-size:14px;">${esc(clientEmail)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <p style="margin:0 0 4px;color:rgba(255,245,240,0.38);font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Endere&#231;o de entrega</p>
              <p style="margin:0;color:#fff5f0;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;white-space:pre-line;">${esc(address)}</p>
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
