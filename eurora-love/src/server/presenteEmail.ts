import nodemailer from "nodemailer";
import { optionalEnv, requiredEnv } from "@/server/env";

const EMAIL_USER  = optionalEnv("EMAIL_USER", optionalEnv("GMAIL_USER", "eurora@eurora.site"));
const EMAIL_PASS  = optionalEnv("EMAIL_PASS", optionalEnv("GMAIL_APP_PASSWORD", ""));
const EMAIL_HOST  = optionalEnv("EMAIL_HOST", "smtp.hostinger.com");
const EMAIL_PORT  = parseInt(optionalEnv("EMAIL_PORT", "465"), 10);
const APP_URL     = optionalEnv("NEXT_PUBLIC_APP_URL", "https://eurora.site");
const FROM        = `EURORA LOVE <${EMAIL_USER}>`;
const REPLY_TO    = EMAIL_USER;

// Paleta de cores
const C_ROSE = "#d6195a";
const C_BG   = "#fdf0f4";
const C_CARD = "#ffffff";
const C_TEXT = "#3a1020";
const C_MUTE = "#6b3047";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function transporter() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

/** Template base compatível com a maioria dos clientes de email */
function base(preheader: string, content: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style type="text/css">
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  body{margin:0;padding:0;background-color:${C_BG};}
  a{color:${C_ROSE};text-decoration:none;}
  .btn{display:inline-block;background:${C_ROSE};color:#fff!important;text-decoration:none;
    padding:14px 32px;border-radius:50px;font-weight:bold;font-size:15px;}
  .pix-code{background:#fff5f9;border:2px dashed ${C_ROSE};border-radius:8px;
    padding:14px 18px;word-break:break-all;font-family:monospace;font-size:12px;
    color:${C_TEXT};margin:16px 0;}
  @media only screen and (max-width:600px){
    .ec{width:100%!important;}
    .ep{padding:24px 16px!important;}
  }
</style>
</head>
<body bgcolor="${C_BG}" style="background-color:${C_BG};margin:0;padding:0;">

<!-- Preheader oculto (aparece no preview do email, melhora abertura) -->
<div style="display:none;max-height:0;overflow:hidden;color:${C_BG};font-size:1px;">
${esc(preheader)}&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  bgcolor="${C_BG}" style="background-color:${C_BG};">
<tr><td align="center" style="padding:28px 16px 40px;">

  <!-- Header com logo -->
  <table role="presentation" class="ec" cellpadding="0" cellspacing="0" border="0"
    style="max-width:560px;width:100%;margin-bottom:8px;">
  <tr><td align="center" style="padding:0 0 16px;">
    <span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:${C_ROSE};">
      ♥ EURORA LOVE
    </span>
  </td></tr>
  </table>

  <!-- Card principal -->
  <table role="presentation" class="ec" cellpadding="0" cellspacing="0" border="0"
    style="max-width:560px;width:100%;background:${C_CARD};border-radius:16px;
    box-shadow:0 4px 24px rgba(214,25,90,.10);">
  <tr><td class="ep" style="padding:32px 32px 28px;font-family:Georgia,serif;color:${C_TEXT};
    font-size:15px;line-height:1.65;">
    ${content}
  </td></tr>
  </table>

  <!-- Rodapé -->
  <table role="presentation" class="ec" cellpadding="0" cellspacing="0" border="0"
    style="max-width:560px;width:100%;margin-top:20px;">
  <tr><td align="center" style="font-family:Arial,sans-serif;font-size:11px;color:${C_MUTE};
    line-height:1.6;padding:0 16px;">
    Este é um email transacional da EURORA LOVE.<br>
    <a href="${APP_URL}" style="color:${C_MUTE};">eurora.site</a>
    &nbsp;·&nbsp;
    <a href="mailto:${EMAIL_USER}" style="color:${C_MUTE};">Contato</a>
  </td></tr>
  </table>

</td></tr>
</table>
</body>
</html>`;
}

// ── Email 1: PIX gerado ────────────────────────────────────────────────────
export async function sendPixEmail(
  to: string,
  name: string,
  pixCopiaECola: string,
  pixQrBase64: string
) {
  const preheader = `Olá ${name}! Seu código de pagamento está pronto. Copie e cole no seu banco.`;

  const html = base(preheader, `
    <h1 style="margin:0 0 12px;font-size:22px;color:${C_ROSE};">Seu pagamento foi gerado</h1>
    <p>Olá, <strong>${esc(name)}</strong>!</p>
    <p>Recebemos sua solicitação de acesso à
      <strong>Curadoria de Presentes EURORA LOVE</strong>.
      Finalize o pagamento para liberar mais de 416 ideias de presentes.</p>

    <p style="font-weight:bold;margin-bottom:4px;">Escaneie o QR Code:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:8px 0 16px;">
      <img src="cid:qrcode@eurora" alt="QR Code" width="180" height="180"
        style="border-radius:10px;border:3px solid #ffd0e0;display:block;">
    </td></tr>
    </table>

    <p style="font-weight:bold;margin-bottom:6px;color:${C_ROSE};">
      Ou copie o código abaixo:
    </p>
    <div class="pix-code">${esc(pixCopiaECola)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:8px 0;">
      <span style="background:#fff5f9;border-radius:8px;padding:10px 16px;
        font-size:13px;color:${C_MUTE};display:inline-block;">
        Valor: <strong>R$&nbsp;8,00</strong> &nbsp;·&nbsp; Acesso único para sempre
        &nbsp;·&nbsp; Os presentes aparecem automaticamente após o pagamento
      </span>
    </td></tr>
    </table>
  `);

  const text = `Olá ${name}!

Acesso à Curadoria de Presentes EURORA LOVE — R$ 8,00

CÓDIGO PIX COPIA E COLA:
${pixCopiaECola}

Após o pagamento, os presentes aparecem automaticamente na página.

Dúvidas: ${EMAIL_USER}
EURORA LOVE — eurora.site`;

  await transporter().sendMail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Seu código de acesso — EURORA LOVE`,
    html,
    text,
    headers: {
      "X-Mailer": "EURORA LOVE Mailer",
      "List-Unsubscribe": `<mailto:${EMAIL_USER}?subject=Cancelar>`,
      "Precedence": "transactional",
    },
    attachments: [{
      filename: "qrcode.png",
      content: Buffer.from(pixQrBase64, "base64"),
      cid: "qrcode@eurora",
    }],
  });
}

// ── Email 2: Pagamento confirmado ──────────────────────────────────────────
export async function sendConfirmationEmail(to: string, name: string) {
  const preheader = `Acesso liberado! Veja suas 416+ ideias de presentes agora mesmo.`;

  const html = base(preheader, `
    <h1 style="margin:0 0 12px;font-size:22px;color:${C_ROSE};">Acesso liberado com sucesso!</h1>
    <p>Olá, <strong>${esc(name)}</strong>!</p>
    <p>Seu pagamento foi confirmado. Você já tem acesso completo à
      <strong>Curadoria de Presentes EURORA LOVE</strong> com mais de
      <strong>416 ideias</strong> — roupas, calçados, tecnologia, joias, casa e muito mais.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:20px 0;">
      <a href="${APP_URL}/presentes" class="btn"
        style="background:${C_ROSE};color:#fff;text-decoration:none;
        padding:14px 32px;border-radius:50px;font-weight:bold;font-size:15px;
        display:inline-block;">
        Ver meus presentes
      </a>
    </td></tr>
    </table>

    <p style="font-size:13px;color:${C_MUTE};margin-top:8px;">
      O acesso fica salvo no seu navegador. Para acessar em outro dispositivo,
      abra o link acima no mesmo navegador onde realizou o pagamento.
    </p>
    <p style="font-size:13px;color:${C_MUTE};">
      Obrigado por escolher a EURORA LOVE! ♥
    </p>
  `);

  const text = `Olá ${name}!

Seu acesso à Curadoria de Presentes EURORA LOVE está liberado!

Acesse agora: ${APP_URL}/presentes

Você tem acesso a mais de 416 ideias de presentes organizadas por categoria.

O acesso fica salvo no seu navegador.

Obrigado por escolher a EURORA LOVE!
eurora.site`;

  await transporter().sendMail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Acesso liberado — EURORA LOVE`,
    html,
    text,
    headers: {
      "X-Mailer": "EURORA LOVE Mailer",
      "List-Unsubscribe": `<mailto:${EMAIL_USER}?subject=Cancelar>`,
      "Precedence": "transactional",
    },
  });
}
