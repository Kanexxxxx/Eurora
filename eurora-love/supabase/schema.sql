-- EURORA LOVE — Supabase Schema

-- Enable pgcrypto for uuid
create extension if not exists "pgcrypto";

-- couples table
create table if not exists public.couples (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  person1           text not null check (char_length(person1) between 2 and 50),
  person2           text not null check (char_length(person2) between 2 and 50),
  message           text not null check (char_length(message) between 10 and 1000),
  music_url         text,
  relationship_date date not null,
  theme             text not null check (theme in ('black-luxury','neon-romance','minimal-love','velvet-dark')),
  plan              text not null default 'premium' check (plan in ('basic','premium')),
  paid              boolean not null default false,
  payment_id        text,
  photo_urls        text[] not null default '{}',
  qr_code_url       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Indexes
create index if not exists couples_slug_idx on public.couples (slug);
create index if not exists couples_paid_idx on public.couples (paid);
create index if not exists couples_payment_id_idx on public.couples (payment_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger couples_updated_at
  before update on public.couples
  for each row execute function update_updated_at();

-- RLS
alter table public.couples enable row level security;

-- Public can only read paid pages
create policy "Public read paid pages"
  on public.couples for select
  using (paid = true);

-- Storage bucket (run in dashboard or via CLI)
-- insert into storage.buckets (id, name, public)
-- values ('couple-photos', 'couple-photos', true)
-- on conflict do nothing;
