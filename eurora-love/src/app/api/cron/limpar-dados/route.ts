import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requiredEnv } from "@/server/env";

// LGPD — exclui automaticamente dados de cadastros não pagos após 48h
// Conforme Política de Privacidade: dados de não-compradores não são retidos
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${requiredEnv("CRON_SECRET")}`;
  const valid = authHeader.length === expected.length &&
    timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const { count } = await prisma.couple.deleteMany({
    where: { paid: false, created_at: { lt: cutoff } },
  });

  return NextResponse.json({ ok: true, excluidos: count });
}
