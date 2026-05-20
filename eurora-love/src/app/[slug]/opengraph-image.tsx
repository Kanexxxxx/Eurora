import { ImageResponse } from "next/og";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "EURORA LOVE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data } = await supabase
    .from("couples")
    .select("person1, person2, message")
    .eq("slug", slug)
    .eq("paid", true)
    .single();

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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a000a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ color: "#e11d48", fontSize: 18, letterSpacing: "0.3em", marginBottom: 32 }}>
          EURORA LOVE
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
            color: "#9ca3af",
            fontSize: 28,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          {preview}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            color: "#4b5563",
            fontSize: 18,
          }}
        >
          eurora.love.br
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
