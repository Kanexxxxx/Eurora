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
  embedUrl?: string;
  embedType?: "spotify" | "youtube";
}

async function getMusicMeta(url: string | null): Promise<MusicMeta | null> {
  if (!url) return null;
  try {
    let endpoint: string | null = null;
    let embedType: "spotify" | "youtube" | undefined;
    if (url.includes("spotify.com") || url.includes("spotify.link")) {
      endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
      embedType = "spotify";
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      embedType = "youtube";
    }
    if (!endpoint) return null;

    const res = await fetch(endpoint, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;

    const data = await res.json() as { title?: string; thumbnail_url?: string; provider_name?: string; html?: string };

    // Extract embed src from oEmbed HTML (handles locale prefixes & short links)
    let embedUrl: string | undefined;
    if (data.html) {
      const m = data.html.match(/src="([^"]+)"/);
      if (m?.[1]) {
        const raw = m[1];
        const sep = raw.includes("?") ? "&" : "?";
        if (!raw.includes("autoplay")) {
          if (embedType === "spotify") {
            embedUrl = raw + sep + "autoplay=1&theme=0";
          } else if (embedType === "youtube") {
            embedUrl = raw + sep + "autoplay=1";
          } else {
            embedUrl = raw;
          }
        } else {
          embedUrl = raw;
        }
      }
    }

    return {
      title: data.title ?? "Nossa Música",
      albumArt: data.thumbnail_url ?? "",
      provider: data.provider_name,
      embedUrl,
      embedType,
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

  if (!couple) return { title: "Página não encontrada | EURORA LOVE" };

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

