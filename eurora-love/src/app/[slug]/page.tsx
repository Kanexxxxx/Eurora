import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LovePage from "./LovePage";

interface Props {
  params: Promise<{ slug: string }>;
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
    />
  );
}
