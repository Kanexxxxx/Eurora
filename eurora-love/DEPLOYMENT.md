# EURORA LOVE - Deployment Guide

## 1. `.env` template

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Asaas
ASAAS_API_KEY=$aact_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ASAAS_API_URL=https://api.asaas.com/v3
ASAAS_WEBHOOK_TOKEN=token-gerado-no-webhook-asaas

# App URL - no trailing slash
NEXT_PUBLIC_APP_URL=https://eurora.site

# Cron
CRON_SECRET=coloque-aqui-um-token-seguro-com-32-chars-ou-mais

# Email
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=no-reply@eurora.site
```

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in SQL Editor.
3. Create the storage bucket:
   - Name: `couple-photos`
   - Public: `ON`
   - File size limit: `5242880`
   - Allowed MIME types: `image/jpeg,image/png,image/webp`
4. Copy credentials from Settings > API.

## 3. Asaas setup

1. Open Asaas > Integracoes > Chaves de API.
2. Generate a production API key and set `ASAAS_API_KEY`.
3. Open Asaas > Integracoes > Webhooks.
4. Add webhook URL: `https://eurora.site/api/asaas/webhook`.
5. Select events:
   - `PAYMENT_CONFIRMED`
   - `PAYMENT_RECEIVED`
6. Copy the webhook token and set `ASAAS_WEBHOOK_TOKEN`.

## 4. VPS deployment

Use `DEPLOY_VPS.md` as the main VPS guide. Minimum deploy flow:

```bash
npm ci
npx prisma migrate deploy
npm run build
npm run start:prod
```

## 5. Smoke test checklist

```text
[ ] https://eurora.site loads
[ ] /criar opens and saves a draft
[ ] /checkout creates PIX QR code
[ ] Credit card payment returns a status
[ ] Asaas webhook activates paid page
[ ] /sucesso shows link and QR code
[ ] /<slug> renders the love page
[ ] /presentes creates an R$ 8 PIX
[ ] /mensagem schedules email message
[ ] /api/cron/enviar-mensagens works with CRON_SECRET
```
