import nodemailer from "nodemailer";
import { optionalEnv, requiredEnv } from "@/server/env";

const GMAIL_USER = optionalEnv("GMAIL_USER", "eurora.com.br@gmail.com");
const APP_URL = optionalEnv("NEXT_PUBLIC_APP_URL", "https://eurora.site");
const FROM = `EURORA LOVE <${GMAIL_USER}>`;

function transporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: requiredEnv("GMAIL_APP_PASSWORD") },
  });
}

function base(content: string) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#fdf0f4;font-family:Georgia,serif;}
  .wrap{max-width:560px;margin:0 auto;padding:24px 12px;}
  .card{background:#fff;border-radius:16px;padding:32px 28px;box-shadow:0 4px 24px rgba(214,25,90,.08);}
  h1{margin:0 0 8px;font-size:24px;color:#d6195a;letter-spacing:-.5px;}
  p{margin:12px 0;color:#3a1020;line-height:1.6;font-size:15px;}
  .pix{background:#fff5f9;border:2px dashed #d6195a;border-radius:12px;padding:16px 20px;
    word-break:break-all;font-family:monospace;font-size:12px;color:#1a0a10;margin:20px 0;}
  .btn{display:inline-block;background:linear-gradient(135deg,#d6195a,#ff5a8a);color:#fff!important;
    text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:bold;font-size:16px;margin:20px 0;}
  .footer{text-align:center;color:#9b5070;font-size:12px;margin-top:24px;}
</style></head><body>
<div class="wrap"><div class="card">${content}</div>
<div class="footer">♥ EURORA LOVE · eurora.site<br>Dúvidas? ${GMAIL_USER}</div>
</div></body></html>`;
}

export async function sendPixEmail(
  to: string, name: string, pixCopiaECola: string, pixQrBase64: string
) {
  const html = base(`
    <h1>🎁 PIX gerado!</h1>
    <p>Olá, <strong>${name}</strong>!</p>
    <p>Seu PIX para desbloquear a <strong>Curadoria de Presentes EURORA LOVE</strong> foi gerado com sucesso.</p>
    <p><strong>Escaneie o QR code ou copie o código PIX:</strong></p>
    <div style="text-align:center;margin:20px 0;">
      <img src="cid:qrcode@eurora" alt="QR Code PIX" width="200" height="200"
        style="border-radius:12px;border:4px solid #ffd0e0;">
    </div>
    <p style="font-weight:bold;color:#d6195a;margin-bottom:4px;">Código PIX copia e cola:</p>
    <div class="pix">${pixCopiaECola}</div>
    <p style="font-size:13px;color:#6b3047;">⏱ Pague em até 30 minutos. Após o pagamento, os presentes
      aparecem <strong>automaticamente</strong> — sem precisar atualizar a página.</p>
    <p style="font-size:13px;color:#6b3047;">Valor: <strong>R$&nbsp;8,00</strong> · Pagamento único · Acesso para sempre.</p>
  `);

  await transporter().sendMail({
    from: FROM,
    to,
    subject: "🎁 PIX gerado — Curadoria de Presentes EURORA LOVE",
    html,
    attachments: [{
      filename: "qrcode.png",
      content: Buffer.from(pixQrBase64, "base64"),
      cid: "qrcode@eurora",
    }],
  });
}

export async function sendConfirmationEmail(to: string, name: string) {
  const html = base(`
    <h1>✅ Pagamento confirmado!</h1>
    <p>Olá, <strong>${name}</strong>!</p>
    <p>Seu pagamento foi confirmado. <strong>Sua curadoria de presentes está liberada!</strong> 🎉</p>
    <p>Acesse agora e veja mais de <strong>416 ideias de presentes</strong> — roupas, calçados,
      casa, tecnologia, joias e muito mais.</p>
    <div style="text-align:center;">
      <a href="${APP_URL}/presentes" class="btn">Ver meus presentes →</a>
    </div>
    <p style="font-size:13px;color:#6b3047;">O acesso fica salvo no seu navegador. Para acessar em
      outro dispositivo, basta abrir o link acima no mesmo navegador onde pagou.</p>
    <p style="font-size:13px;color:#6b3047;">Obrigado por escolher a EURORA LOVE! ♥</p>
  `);

  await transporter().sendMail({
    from: FROM,
    to,
    subject: "✅ Pagamento confirmado — Seus presentes estão liberados!",
    html,
  });
}
