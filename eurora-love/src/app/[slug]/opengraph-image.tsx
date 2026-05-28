import { ImageResponse } from "next/og";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";
export const alt = "EURORA LOVE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const data = await prisma.couple.findFirst({
    where: { slug, paid: true },
    select: { person1: true, person2: true, message: true },
  });

  const names = data ? `${data.person1} & ${data.person2}` : "EURORA LOVE";
  const preview = data
    ? data.message.slice(0, 100) + (data.message.length > 100 ? "…" : "")
    : "Experiência digital romântica premium";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #07050a 0%, #0c0810 50%, #100810 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ color: "#ff2d6a", fontSize: 18, letterSpacing: "0.3em", marginBottom: 32, fontWeight: 700 }}>
          ♥ EURORA LOVE ♥
        </div>
        <div
          style={{
            color: "white",
            fontSize: 80,
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          {names}
        </div>
        <div
          style={{
            color: "rgba(255,245,240,0.55)",
            fontSize: 28,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {preview}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            color: "#ff2d6a",
            fontSize: 18,
            letterSpacing: "0.1em",
          }}
        >
          eurora.site
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

