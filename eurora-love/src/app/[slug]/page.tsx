import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import type { Couple } from "@/lib/types";
import LovePage from "./LovePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("couples")
    .select("person1, person2, message")
    .eq("slug", slug)
    .eq("paid", true)
    .single();

  if (!data) return { title: "Página não encontrada | EURORA LOVE" };

  const title = `${data.person1} & ${data.person2} | EURORA LOVE`;
  const description = data.message.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: couple } = await supabase
    .from("couples")
    .select("*")
    .eq("slug", slug)
    .eq("paid", true)
    .single();

  if (!couple) notFound();

  return <LovePage couple={couple as Couple} />;
}
