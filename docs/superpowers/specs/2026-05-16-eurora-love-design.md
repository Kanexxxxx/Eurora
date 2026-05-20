# EURORA LOVE — Product Design Spec

> Approved: 2026-05-16

## Product Overview

Premium romantic digital experience SaaS platform. Users create personalized love pages (photos, music, message, countdown, QR code) and share them as emotional digital gifts. Monetized via one-time PIX payment.

**Domain:** eurora.love.br  
**Language:** PT-BR (i18n-ready architecture for future multi-language)  
**Aesthetic:** Dark luxury — cinematic, premium, emotional. Mix of Apple minimalism + Netflix dark + luxury streetwear.

---

## Pricing

| Plan    | Price  | Features                          | Status       |
|---------|--------|-----------------------------------|--------------|
| Basic   | R$ 19  | Standard themes, 5 photos         | Active       |
| Premium | R$ 39  | All themes, 10 photos, music      | **Highlighted** |
| Ultra   | Hidden | Future: custom domains, analytics | Structure only (v2) |

**Default conversion target: R$ 39 Premium plan.**

---

## Architecture Decision

**Option A — Next.js 15 App Router monolith on Vercel. Approved.**

- Server Components by default (SSR for public love pages, SEO, OG tags)
- Client Components only for interactive sections (wizard, countdown, music player)
- Supabase: Postgres database + RLS + Storage for photos
- Mercado Pago PIX: isolated in server-only API routes
- QR codes: generated server-side, served as PNG
- Deployable to Vercel in one push

---

## Route Architecture

| Route                        | Type   | Description                              |
|------------------------------|--------|------------------------------------------|
| `/`                          | Server | Landing page — marketing, conversion     |
| `/criar`                     | Client | 8-step creation wizard                   |
| `/checkout`                  | Client | PIX checkout + payment polling           |
| `/sucesso`                   | Client | Post-payment success + QR download       |
| `/[slug]`                    | Server | Public love page (SSR + OG meta)         |
| `/api/paginas`               | Server | POST: save draft couple data             |
| `/api/pagamento/criar`       | Server | POST: create Mercado Pago PIX preference |
| `/api/pagamento/webhook`     | Server | POST: MP webhook → activate page         |
| `/api/qrcode/[slug]`         | Server | GET: generate + return QR PNG            |

---

## Database Schema

### Table: `couples`

| Column            | Type        | Notes                                       |
|-------------------|-------------|---------------------------------------------|
| id                | uuid PK     | Default gen_random_uuid()                   |
| slug              | text UNIQUE | Generated from names, URL-safe              |
| person1           | text        | First partner name                          |
| person2           | text        | Second partner name                         |
| message           | text        | Romantic message (max 1000 chars)           |
| music_url         | text NULL   | Spotify embed URL or YouTube URL            |
| relationship_date | date        | Start of relationship                       |
| theme             | text        | 'black-luxury' \| 'neon-romance' \| 'minimal-love' \| 'velvet-dark' |
| plan              | text        | 'basic' \| 'premium'                        |
| paid              | boolean     | Default false; true after webhook confirms  |
| payment_id        | text NULL   | Mercado Pago payment ID (for dedup)         |
| photo_urls        | text[]      | Array of Supabase Storage public URLs       |
| qr_code_url       | text NULL   | Generated after payment                     |
| created_at        | timestamptz | Default now()                               |
| updated_at        | timestamptz | Auto-updated                                |

### Storage: `couple-photos` bucket

- Public read
- Authenticated/service-role write
- Max file size: 5MB per photo
- Accepted: image/jpeg, image/png, image/webp

### RLS Policies

- `couples`: SELECT allowed where `paid = true` (public pages)
- `couples`: INSERT allowed from service role only (via API routes)
- `couples`: UPDATE allowed from service role only (webhook)

---

## Wizard Flow

| Step | Name       | Fields                                     |
|------|------------|--------------------------------------------|
| 1    | Nomes      | person1, person2                           |
| 2    | Fotos      | Upload 1–10 photos (drag & drop)           |
| 3    | Mensagem   | message (textarea, 1000 char limit)        |
| 4    | Música     | music_url (optional Spotify/YouTube embed) |
| 5    | Data       | relationship_date (date picker)            |
| 6    | Tema       | theme (visual card selection)              |
| 7    | Preview    | Full page preview before payment           |
| 8    | Pagamento  | Plan selection + PIX checkout              |

State lives in `useWizard` hook (React state, not persisted until step 8 POST).

---

## Payment Flow

1. User reaches Step 8, selects plan (Basic R$19 or Premium R$39)
2. Client POSTs to `/api/pagamento/criar` → returns `pix_qr_code`, `pix_copia_cola`, `payment_id`, `page_id`
3. (Behind scenes) Draft saved to `couples` table with `paid: false`
4. Checkout page polls every 3s for payment status
5. Mercado Pago fires webhook to `/api/pagamento/webhook`
6. Webhook verifies signature → sets `paid: true` → generates QR code URL
7. Polling detects payment → redirect to `/sucesso?slug=...`

---

## Love Page Features (v1)

- Animated cinematic intro (Framer Motion)
- Photo gallery (swipeable on mobile)
- Music player (iframe embed for Spotify/YouTube)
- Romantic message with premium typography
- Relationship stats: X anos, Y meses, Z dias juntos
- Share buttons (WhatsApp, Instagram, copy link)
- QR code display + download PNG
- Theme-aware styling (4 themes)

---

## Visual Design Language

- **Background:** `#000000` / `#0a0a0a`
- **Primary accent:** Rose-600 (`#e11d48`) — passion
- **Secondary accent:** Amber-400 (`#fbbf24`) — gold/luxury
- **Text primary:** White
- **Text secondary:** `#9ca3af` (gray-400)
- **Fonts:** Playfair Display (headings, emotional) + Inter (body, clean)
- **Animations:** Framer Motion with `ease: [0.16, 1, 0.3, 1]` cubic bezier (premium feel)
- **Border radius:** `rounded-2xl` for cards, `rounded-full` for pills
- **Shadows:** `shadow-rose-500/20` glow effects

---

## Security Strategy

- All Supabase mutations through service role (server-side only)
- Mercado Pago webhook: X-Signature header HMAC-SHA256 verification
- Zod validation on all API route inputs
- Rate limiting: `/api/paginas` max 5/min per IP, `/api/pagamento/criar` max 3/min per IP
- Photo upload: server-side mime-type check, max 5MB, strip EXIF
- Slug sanitization: normalize to lowercase, replace spaces with hyphens, remove special chars
- `NEXT_PUBLIC_*` only for Supabase URL and anon key (safe to expose)
- All other secrets in server-only env vars

---

## SEO + Social

- Dynamic OG image per love page: `/[slug]/opengraph-image.tsx`
- Twitter card: `summary_large_image`
- `generateMetadata` on `[slug]/page.tsx`
- `sitemap.ts`: static routes only (love pages are private/unlisted by design)
- `robots.ts`: disallow `/api/*`, allow rest

---

## Deferred to v2

- Password-protected pages
- Map/location pin
- Timeline feature
- AI love letter generator
- Custom domains
- Advanced analytics dashboard
- Video support
- White-label / multi-tenant
