import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { checkRateLimit } from "@/server/rateLimit";
import { z } from "zod";

const schema = z.object({ slug: z.string().min(1).max(100) });

// LGPD Art. 17 — direito à exclusão de dados pessoais
export async function DELETE(req: NextRequest) {
  if (!checkRateLimit(req, { key: "data-delete", limit: 3, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Slug inválido." }, { status: 400 });

  const { slug } = parsed.data;

  const couple = await prisma.couple.findFirst({ where: { slug } });
  if (!couple) return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });

  // Só permite excluir páginas não pagas (pagas têm contrato/recibo ativo)
  if (couple.paid) {
    return NextResponse.json(
      { error: "Páginas com pagamento confirmado só podem ser excluídas via suporte: oi@eurora.site" },
      { status: 403 }
    );
  }

  await prisma.couple.delete({ where: { slug } });

  return NextResponse.json({ ok: true, message: "Dados excluídos conforme LGPD Art. 17." });
}
