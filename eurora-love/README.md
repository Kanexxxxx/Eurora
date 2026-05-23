# EURORA LOVE

Plataforma romantica para criar paginas personalizadas de casal com fotos, musica, mensagem, QR code, presentes e ferramentas de IA.

**Stack:** Next.js 16, PostgreSQL local, Prisma, Asaas, Resend, Framer Motion, Tailwind CSS v4 e TypeScript.

## Desenvolvimento local

1. Instale as dependencias:

```bash
npm install
```

2. Configure o `.env`:

```bash
cp .env.example .env
```

3. Rode o projeto:

```bash
npm run dev
```

## Credenciais necessarias

| Variavel | Onde pegar |
|---|---|
| `DATABASE_URL` | PostgreSQL local da VPS, ex: `postgresql://eurora:SENHA@127.0.0.1:5432/eurora_love` |
| `DIRECT_URL` | Mesma conexao local usada pelo Prisma |
| `UPLOAD_DIR` | Pasta local para fotos/QR codes, ex: `/var/www/eurora/uploads` |
| `UPLOAD_PUBLIC_URL` | URL publica dos uploads, ex: `https://eurora.site/uploads` |
| `ASAAS_API_KEY` | Asaas > Integracoes > Chaves de API |
| `ASAAS_WEBHOOK_TOKEN` | Asaas > Integracoes > Webhooks > Token de autenticacao |
| `NEXT_PUBLIC_APP_URL` | Dominio final, ex: `https://eurora.site` |
| `CRON_SECRET` | Gere com `openssl rand -hex 32` |
| `RESEND_API_KEY` | Resend > API Keys |
| `RESEND_FROM_EMAIL` | Resend > Domains, email remetente verificado |
| `ANTHROPIC_API_KEY` | Anthropic Console > API Keys, opcional |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero publico de suporte com DDI e DDD |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Email publico de suporte |

## Estrutura

```text
src/app
  Rotas, paginas e API routes do Next.js.

src/app/api
  Backend HTTP:
  - asaas/pagamento/criar
  - asaas/pagamento/status
  - asaas/webhook
  - paginas
  - presentes
  - mensagem
  - cron

src/server
  Codigo backend compartilhado:
  - db/prisma.ts
  - payments/asaas.ts
  - payments/activateCouple.ts
  - storage/local.ts
  - env.ts

src/lib
  Tipos, validacoes e utilitarios puros compartilhados.

src/components
  Componentes visuais reutilizaveis.

src/data
  Dados editoriais/listas do produto.
```

## Deploy

Use `DEPLOY_VPS.md` para VPS. Fluxo minimo:

```bash
npm ci
npx prisma db push
npm run build
npm run start:prod
```

Webhook Asaas:

```text
https://eurora.site/api/asaas/webhook
```

Eventos:

```text
PAYMENT_CONFIRMED
PAYMENT_RECEIVED
```
