import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const page_id = req.nextUrl.searchParams.get("page_id");
  if (!page_id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });

  const supabase = createServerClient();
  const { data } = await supabase
    .from("couples")
    .select("paid, slug")
    .eq("id", page_id)
    .single();

  if (!data) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ paid: data.paid, slug: data.slug });
}
