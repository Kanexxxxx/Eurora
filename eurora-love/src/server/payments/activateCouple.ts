import { optionalEnv } from "@/server/env";
import { prisma } from "@/server/db/prisma";
import { saveUpload } from "@/server/storage/local";

async function generateAndStoreQR(slug: string): Promise<string | null> {
  try {
    const pageUrl = `${optionalEnv("NEXT_PUBLIC_APP_URL", "https://eurora.site")}/${slug}`;
    const QRCode = await import("qrcode");
    const qrBuffer = await QRCode.toBuffer(pageUrl, { width: 400, margin: 2 });

    const filename = `qrcodes/${slug}.png`;
    return saveUpload(filename, qrBuffer);
  } catch {
    return null;
  }
}

export async function activateCouplePage(pageId: string, paymentId: string) {
  const couple = await prisma.couple.findUnique({
    where: { id: pageId },
    select: { id: true, slug: true, paid: true },
  });

  if (!couple) return null;
  if (couple.paid) return couple;

  const qrCodeUrl = await generateAndStoreQR(couple.slug);

  return prisma.couple.update({
    where: { id: pageId },
    data: {
      paid: true,
      payment_id: paymentId,
      qr_code_url: qrCodeUrl,
    },
    select: { id: true, slug: true, paid: true },
  });
}
