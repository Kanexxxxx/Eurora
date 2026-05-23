import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

function authed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalCouples, paidCouples, totalMessages, pendingMessages, totalLinks] =
    await Promise.all([
      prisma.couple.count(),
      prisma.couple.count({ where: { paid: true } }),
      prisma.scheduledMessage.count(),
      prisma.scheduledMessage.count({ where: { sent: false } }),
      prisma.presenteLink.count({ where: { active: true } }),
    ]);

  return NextResponse.json({
    totalCouples,
    paidCouples,
    totalMessages,
    pendingMessages,
    totalLinks,
  });
}
