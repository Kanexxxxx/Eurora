import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sanitized = slug.replace(/[^a-z0-9-]/g, "");
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${sanitized}`;

  const buffer = await QRCode.toBuffer(url, { width: 400, margin: 2, color: { dark: "#000000", light: "#ffffff" } });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qrcode-${sanitized}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
