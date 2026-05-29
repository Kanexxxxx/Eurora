import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hidden = await prisma.hiddenProduto.findMany({ select: { produto_id: true } });
  return NextResponse.json(hidden.map((h) => h.produto_id));
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { produto_id } = await req.json() as { produto_id: number };
  await prisma.hiddenProduto.upsert({
    where: { produto_id },
    create: { produto_id },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { produto_id } = await req.json() as { produto_id: number };
  await prisma.hiddenProduto.delete({ where: { produto_id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
