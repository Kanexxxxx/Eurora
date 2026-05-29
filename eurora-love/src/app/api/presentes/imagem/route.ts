import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

const cache = new Map<string, { url: string | null; ts: number }>();
const TTL = 24 * 60 * 60 * 1000;

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1",
};

function extractOgImage(html: string): string | null {
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (og?.[1]?.startsWith("http")) return og[1];

  const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (tw?.[1]?.startsWith("http")) return tw[1];

  return null;
}

function extractAmazonImage(html: string): string | null {
  const dyn = html.match(/data-a-dynamic-image="([^"]+)"/);
  if (dyn) {
    const decoded = dyn[1].replace(/&quot;/g, '"');
    const m = decoded.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)/);
    if (m) return m[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
  }
  const fb = html.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%+_-]+\._[A-Z0-9,_]+_\.(?:jpg|jpeg|png|webp))/);
  if (fb) return fb[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
  return null;
}

function extractPrice(html: string): string | null {
  // JSON-LD offers.price (padrão Schema.org)
  const ldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldMatch) {
    for (const block of ldMatch) {
      const inner = block.replace(/<\/?script[^>]*>/gi, "");
      try {
        const data = JSON.parse(inner);
        const price = data?.offers?.price ?? data?.offers?.[0]?.price;
        if (price && Number(price) > 0) {
          return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
        }
      } catch { /* continua */ }
    }
  }

  // Shopee: preço em meta product:price:amount
  const metaPrice = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']product:price:amount["']/i);
  if (metaPrice?.[1] && Number(metaPrice[1]) > 0) {
    return `R$ ${Number(metaPrice[1]).toFixed(2).replace(".", ",")}`;
  }

  return null;
}

async function fetchPageData(targetUrl: string): Promise<{ image: string | null; price: string | null }> {
  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { image: null, price: null };
    const html = await res.text();

    let image: string | null = null;
    if (targetUrl.includes("amazon")) {
      image = extractAmazonImage(html);
    }
    if (!image) image = extractOgImage(html);

    const price = extractPrice(html);
    return { image, price };
  } catch {
    return { image: null, price: null };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const asin = searchParams.get("asin");
  const rawUrl = searchParams.get("url");

  // ── Amazon via ASIN ──────────────────────────────────────────────────────
  if (asin) {
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json({ error: "ASIN inválido" }, { status: 400 });
    }
    const cacheKey = `asin:${asin}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TTL) {
      return cached.url
        ? NextResponse.json({ url: cached.url })
        : NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    // Amazon bloqueia scraping de VPS — retorna null para usar fallback visual no cliente
    cache.set(cacheKey, { url: null, ts: Date.now() });
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }

  // ── Qualquer URL (Shopee, ML, etc.) ─────────────────────────────────────
  if (rawUrl) {
    let targetUrl: string;
    try {
      targetUrl = decodeURIComponent(rawUrl);
      const parsed = new URL(targetUrl);
      const allowed = ["shopee.com.br", "s.shopee.com.br", "amazon.com.br", "amzn.to",
                       "magazinevoce.com.br", "mercadolivre.com.br", "mercadolibre.com"];
      if (!allowed.some(d => parsed.hostname === d || parsed.hostname.endsWith("." + d))) {
        return NextResponse.json({ error: "Domínio não permitido" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // 1. Verificar se já está salvo no banco (zero request externo)
    try {
      const saved = await prisma.presenteLink.findFirst({
        where: { url: targetUrl, image_url: { not: null } },
        select: { image_url: true },
      });
      if (saved?.image_url) {
        cache.set(`url:${targetUrl}`, { url: saved.image_url, ts: Date.now() });
        return NextResponse.json({ url: saved.image_url });
      }
    } catch { /* fallback para fetch */ }

    // 2. Cache em memória
    const cacheKey = `url:${targetUrl}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TTL) {
      return cached.url
        ? NextResponse.json({ url: cached.url })
        : NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    // 3. Buscar externamente (só acontece uma vez por produto)
    const { image: url, price } = await fetchPageData(targetUrl);
    cache.set(cacheKey, { url, ts: Date.now() });

    // Salvar imagem e preço no banco para nunca mais buscar externamente
    if (url || price) {
      prisma.presenteLink.updateMany({
        where: { url: targetUrl },
        data: {
          ...(url ? { image_url: url } : {}),
          ...(price ? { preco: price } : {}),
        },
      }).catch(() => {});
    }

    if (url) {
      return NextResponse.json({ url, ...(price ? { preco: price } : {}) });
    }
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ error: "asin ou url obrigatório" }, { status: 400 });
}
