import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, { url: string | null; ts: number }>();
const TTL = 24 * 60 * 60 * 1000; // 24h in-memory cache

export async function GET(req: NextRequest) {
  const asin = req.nextUrl.searchParams.get("asin");

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return NextResponse.json({ error: "ASIN inválido" }, { status: 400 });
  }

  const cached = cache.get(asin);
  if (cached && Date.now() - cached.ts < TTL) {
    if (cached.url) return NextResponse.json({ url: cached.url });
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
  }

  try {
    const res = await fetch(`https://www.amazon.com.br/dp/${asin}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      cache.set(asin, { url: null, ts: Date.now() });
      return NextResponse.json({ error: "Amazon bloqueou" }, { status: 404 });
    }

    const html = await res.text();

    // Try data-a-dynamic-image attribute (most reliable — it's in the static HTML)
    const dynMatch = html.match(/data-a-dynamic-image="([^"]+)"/);
    if (dynMatch) {
      const decoded = dynMatch[1].replace(/&quot;/g, '"');
      const urlMatch = decoded.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)/);
      if (urlMatch) {
        const url = urlMatch[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
        cache.set(asin, { url, ts: Date.now() });
        return NextResponse.json({ url });
      }
    }

    // Fallback: search for any m.media-amazon product image in the HTML
    const fallback = html.match(
      /(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%+_-]+\._[A-Z0-9,_]+_\.(?:jpg|jpeg|png|webp))/
    );
    if (fallback) {
      const url = fallback[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
      cache.set(asin, { url, ts: Date.now() });
      return NextResponse.json({ url });
    }

    cache.set(asin, { url: null, ts: Date.now() });
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: 500 });
  }
}
