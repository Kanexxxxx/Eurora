# EURORA LOVE — Deployment Guide

## 1. `.env.local` template

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-0000000000000000-000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret-from-mp-dashboard

# App URL — no trailing slash
NEXT_PUBLIC_APP_URL=https://eurora.love.br
```

---

## 2. Supabase setup

**a. Create project**
- [supabase.com](https://supabase.com) → New project → choose region closest to Brazil (São Paulo)

**b. Run schema**
- Dashboard → SQL Editor → New query → paste contents of `supabase/schema.sql` → Run

**c. Create storage bucket**
- Dashboard → Storage → New bucket
  - Name: `couple-photos`
  - Public: **ON**
  - File size limit: `5242880` (5 MB)
  - Allowed MIME types: `image/jpeg,image/png,image/webp`

**d. Get credentials**
- Dashboard → Settings → API
  - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

---

## 3. Mercado Pago webhook setup

**a. Create application**
- [mercadopago.com.br/developers/panel](https://www.mercadopago.com.br/developers/panel) → Create app → select "Online payments"

**b. Get Access Token**
- App → Credentials → Production → **Access Token** (`APP_USR-...`) → `MERCADOPAGO_ACCESS_TOKEN`

**c. Register webhook**
- App → Webhooks → Add webhook
  - URL: `https://eurora.love.br/api/pagamento/webhook`
  - Events: check **Payments** (`payment`)
- Save → copy the **signing secret** → `MERCADOPAGO_WEBHOOK_SECRET`

**d. Test first (recommended)**
- Use **test credentials** (`TEST-...` token) and [MP sandbox test users](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-user-accounts) before switching to production tokens

---

## 4. Vercel deployment

```bash
# From eurora-love/ directory
npx vercel --prod
```

Or via dashboard:

1. [vercel.com/new](https://vercel.com/new) → Import Git repository
2. Framework: **Next.js** (auto-detected)
3. Root directory: `eurora-love`
4. **Environment Variables** → add all 6 vars from `.env.local`
5. Deploy

**Add domain:**
- Project → Settings → Domains → Add `eurora.love.br`
- Follow DNS instructions (add `A` record or `CNAME` at your registrar)
- Wait for SSL (usually < 2 min)

---

## 5. Smoke test checklist

Run this in order after deploy:

```
[ ] https://eurora.love.br loads — hero, pricing, FAQ visible
[ ] /criar — wizard opens, progress bar works
[ ] Step 1: enter names, preview "Ana & Lucas" appears
[ ] Step 2: upload 1 photo, thumbnail shows, × removes it
[ ] Step 3: type message, counter increments
[ ] Step 4: paste a Spotify URL (Premium) or skip (Basic)
[ ] Step 5: pick a date
[ ] Step 6: select a theme
[ ] Step 7: preview shows correct summary
[ ] Step 8: click "Pagar com PIX" → redirects to /checkout
[ ] /checkout: PIX QR code appears within ~5s
[ ] Pay with MP sandbox → page polls → redirects to /sucesso
[ ] /sucesso: correct link shown, QR code renders, download works
[ ] Open /<slug> — cinematic intro plays, photos, message, stats visible
[ ] WhatsApp share button opens with correct URL
[ ] Scan QR code → opens /<slug>
[ ] Open /<nonexistent-slug> → 404 page
[ ] Share /<slug> on WhatsApp/iMessage → OG image preview appears
```
