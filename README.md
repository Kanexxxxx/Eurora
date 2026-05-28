<div align="center">

<img src="eurora-love/src/app/icon.svg" width="80" height="80" alt="EURORA LOVE"/>

# EURORA LOVE

**Plataforma romântica brasileira para o Dia dos Namorados**

[![TypeScript](https://img.shields.io/badge/TypeScript-93%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Status](https://img.shields.io/badge/status-produção-C8917A?style=flat-square)](https://eurora.site)

[**→ eurora.site**](https://eurora.site)

</div>

---

## O que é

EURORA LOVE é uma plataforma SaaS romântica com cinco produtos integrados, voltada para casais brasileiros que querem surpreender de um jeito diferente — bonito, moderno e inesquecível.

## Produtos

| Produto | Descrição | Preço |
|---|---|---|
| 💌 **Página do Amor** | Página cinematográfica com fotos, música do Spotify e mensagem. Gera QR Code único. | Pago |
| 🎁 **Presentes Secretos** | 250+ ideias de presentes curadas do Shopee, Amazon e Mercado Livre | R$ 8 |
| ⏰ **Mensagem Programada** | Escreva agora, envie automaticamente no Dia dos Namorados via WhatsApp, Telegram, e-mail ou Correios | Pago |
| 🔮 **Teste do Parceiro** | Crie um quiz sobre você e descubra o quanto ele(a) te conhece | Grátis |
| ✨ **IA Romântica** | Cartas, poemas, letras de música, bio de casal e convites gerados por IA | Grátis |

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Banco de dados:** PostgreSQL via Prisma ORM
- **Pagamentos:** Asaas (PIX + cartão de crédito)
- **Email:** Nodemailer + Gmail SMTP
- **Deploy:** VPS Ubuntu com PM2 + Nginx
- **CI/CD:** GitHub Actions → SSH deploy automático

## Estrutura

```
eurora-love/
├── src/
│   ├── app/              # Rotas Next.js (App Router)
│   │   ├── [slug]/       # Página do amor pública
│   │   ├── criar/        # Wizard de criação
│   │   ├── checkout/     # Pagamento Asaas
│   │   ├── presentes/    # Catálogo de presentes
│   │   ├── mensagem/     # Agendamento de mensagem
│   │   ├── quiz/         # Teste do parceiro
│   │   ├── ia/           # IA Romântica
│   │   ├── admin/        # Painel administrativo
│   │   └── api/          # API routes
│   ├── components/       # Componentes reutilizáveis
│   ├── server/           # Lógica server-side
│   └── data/             # Catálogo de produtos
├── prisma/               # Schema do banco
└── infra/                # Scripts de deploy
```

## Deploy

O deploy é automático via GitHub Actions a cada push na branch `codex/prepare-prod-asaas`.

Para deploy manual na VPS:

```bash
git pull origin codex/prepare-prod-asaas
npm ci
npx prisma generate
npx prisma db push
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp .env .next/standalone/.env
PORT=4000 pm2 restart eurora-love --update-env
```

Veja [`DEPLOY_VPS.md`](eurora-love/DEPLOY_VPS.md) para o guia completo de configuração.

## Variáveis de ambiente

Copie `eurora-love/.env.example` para `eurora-love/.env` e preencha:

```env
DATABASE_URL=          # PostgreSQL connection string
ASAAS_API_KEY=         # Chave de API do Asaas
ASAAS_WEBHOOK_TOKEN=   # Token do webhook Asaas
CRON_SECRET=           # Token para proteger /api/cron
GMAIL_USER=            # Gmail para envio de emails
GMAIL_APP_PASSWORD=    # App password do Gmail
ADMIN_PASSWORD=        # Senha do painel /admin
```

## Licença

Copyright © 2025 EURORA LOVE. Todos os direitos reservados.

Este software é proprietário e confidencial. Nenhuma parte deste código pode ser copiada, modificada, distribuída ou usada para fins comerciais sem autorização expressa por escrito dos autores.

---

<div align="center">
  <sub>Feito com amor ♥ no Brasil</sub>
</div>
