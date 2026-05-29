import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/admin";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
