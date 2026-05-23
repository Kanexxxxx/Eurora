import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import LovePage from "./LovePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export interface MusicMeta {
  title: string;
  albumArt: string;
  provider?: string;
}

async function getMusicMeta(url: string | null): Promise<MusicMeta | null> {
  if (!url) return null;
  try {
    let endpoint: string | null = null;
    if (url.includes("spotify.com")) {
      endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    }
    if (!endpoint) return null;
    const res = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json() as { title?: string; thumbnail_url?: string; provider_name?: string };
    return {
      title: data.title ?? "Nossa MÃºsica",
      albumArt: data.thumbnail_url ?? "",
      provider: data.provider_name,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const couple = await prisma.couple.findFirst({
    where: { slug, paid: true },
    select: { person1: true, person2: true, message: true },
  });

  if (!couple) return { title: "PÃ¡gina nÃ£o encontrada | EURORA LOVE" };

  const title = `${couple.person1} & ${couple.person2} | EURORA LOVE`;
  const description = couple.message.slice(0, 160);

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const couple = await prisma.couple.findFirst({
    where: { slug, paid: true },
  });

  if (!couple) notFound();

  const musicMeta = await getMusicMeta(couple.music_url);

  return (
    <LovePage
      couple={{
        id: couple.id,
        slug: couple.slug,
        person1: couple.person1,
        person2: couple.person2,
        message: couple.message,
        music_url: couple.music_url,
        relationship_date: couple.relationship_date,
        theme: couple.theme.replace("_", "-") as import("@/lib/types").Theme,
        plan: couple.plan as import("@/lib/types").Plan,
        paid: couple.paid,
        payment_id: couple.payment_id,
        photo_urls: couple.photo_urls,
        qr_code_url: couple.qr_code_url,
        created_at: couple.created_at.toISOString(),
        updated_at: couple.updated_at.toISOString(),
      }}
      musicMeta={musicMeta}
    />
  );
}

