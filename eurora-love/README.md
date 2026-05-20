# EURORA LOVE

Premium romantic digital experience — couples create a personalized love page (photos, music, message, countdown, QR code) and share it as a digital gift. Monetized via one-time PIX payment.

**Stack:** Next.js 16 · Supabase · Mercado Pago · Framer Motion · Tailwind CSS v4 · TypeScript

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `MERCADOPAGO_ACCESS_TOKEN` | MP → Developers → Credentials → Access token |
| `MERCADOPAGO_WEBHOOK_SECRET` | MP → Webhooks → your endpoint secret |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally · `https://eurora.love.br` in prod |

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor (Dashboard → SQL Editor → New query)
3. Create the storage bucket:
   - Dashboard → Storage → New bucket
   - Name: `couple-photos` · Public: **yes** · Max size: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

### 4. Run dev server

```bash
npm run dev
```

---

## Project Structure

```
src/app/
  page.tsx              Landing page
  criar/                8-step creation wizard
  checkout/             PIX payment screen
  sucesso/              Post-payment success + QR download
  [slug]/               Public love page (SSR + OG meta)
  api/
    paginas/            POST: save draft + upload photos to Supabase
    pagamento/criar/    POST: create Mercado Pago PIX payment
    pagamento/status/   GET: poll payment status
    pagamento/webhook/  POST: MP webhook → activate page + generate QR
    qrcode/[slug]/      GET: generate QR code PNG
supabase/
  schema.sql            Full DB schema, RLS, indexes, triggers
```

---

## Deployment Checklist

### Supabase
- [ ] Run `supabase/schema.sql` in the SQL editor
- [ ] Create `couple-photos` bucket (public, 5 MB limit, images only)
- [ ] Confirm RLS: SELECT allowed only where `paid = true`

### Mercado Pago
- [ ] Get **production** Access Token from MP dashboard (`APP_USR-…`)
- [ ] Register webhook: `https://eurora.love.br/api/pagamento/webhook`
  - Events: `payment.created` and `payment.updated`
- [ ] Copy webhook secret → set `MERCADOPAGO_WEBHOOK_SECRET`
- [ ] Test end-to-end in sandbox first (`TEST-` token + MP test payer)

### Vercel
- [ ] Import repo in Vercel dashboard (or `vercel --prod`)
- [ ] Add all env vars from `.env.example` under Project → Settings → Environment Variables
- [ ] Set `NEXT_PUBLIC_APP_URL=https://eurora.love.br`
- [ ] Add custom domain `eurora.love.br`
- [ ] Deploy

### Smoke test after deploy
- [ ] `/` loads correctly
- [ ] Complete wizard → checkout → PIX QR appears
- [ ] Approve payment with MP sandbox → redirects to `/sucesso`
- [ ] `/sucesso` shows correct link and QR code
- [ ] `/<slug>` renders the love page
- [ ] Scan QR code → opens correct URL
