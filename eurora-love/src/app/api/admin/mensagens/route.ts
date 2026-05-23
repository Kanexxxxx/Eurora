import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

function authed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.scheduledMessage.findMany({
      orderBy: { send_at: "asc" },
      skip,
      take: limit,
    }),
    prisma.scheduledMessage.count(),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}
