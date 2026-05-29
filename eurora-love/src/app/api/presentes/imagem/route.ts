import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

type CachedProductMedia = {
  url: string | null;
  price: string | null;
  ts: number;
};

const cache = new Map<string, CachedProductMedia>();
const TTL = 24 * 60 * 60 * 1000;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1",
};

const ALLOWED_DOMAINS = [
  "shopee.com.br",
  "s.shopee.com.br",
  "amazon.com.br",
  "amzn.to",
  "magazinevoce.com.br",
  "mercadolivre.com.br",
  "mercadolibre.com",
];

function isAllowedUrl(raw: string) {
  const parsed = new URL(raw);
  return ALLOWED_DOMAINS.some((domain) => {
    return parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`);
  });
}

function absoluteUrl(raw: string, baseUrl: string) {
  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractMetaContent(html: string, key: string) {
  const propertyFirst = new RegExp(
    `<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`,
    "i"
  );
  return html.match(propertyFirst)?.[1] ?? html.match(contentFirst)?.[1] ?? null;
}

function extractNamedMetaContent(html: string, key: string) {
  const nameFirst = new RegExp(
    `<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`,
    "i"
  );
  return html.match(nameFirst)?.[1] ?? html.match(contentFirst)?.[1] ?? null;
}

function extractAmazonImage(html: string) {
  const dyn = html.match(/data-a-dynamic-image="([^"]+)"/);
  if (dyn) {
    const decoded = dyn[1].replace(/&quot;/g, '"');
    const match = decoded.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.(?:jpg|jpeg|png|webp))/i);
    if (match) return match[1].replace(/\._[A-Z0-9,_-]+_\./, "._SL500_.");
  }

  const fallback = html.match(
    /(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%+_.-]+\.(?:jpg|jpeg|png|webp))/i
  );
  return fallback?.[1]?.replace(/\._[A-Z0-9,_-]+_\./, "._SL500_.") ?? null;
}

function extractImage(html: string, baseUrl: string) {
  const metaImage =
    extractMetaContent(html, "og:image") ??
    extractNamedMetaContent(html, "twitter:image") ??
    extractNamedMetaContent(html, "twitter:image:src");

  const jsonImage =
    html.match(/"image"\s*:\s*"([^"]+)"/i)?.[1]?.replace(/\\\//g, "/") ??
    html.match(/"imageUrl"\s*:\s*"([^"]+)"/i)?.[1]?.replace(/\\\//g, "/") ??
    null;

  const imgTag = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
  const image = metaImage ?? jsonImage ?? imgTag;

  if (!image) return null;
  return image.startsWith("http") ? image : absoluteUrl(image, baseUrl);
}

function formatPrice(value: string | number) {
  const parsed = Number(String(value).replace(",", ".").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return `R$ ${parsed.toFixed(2).replace(".", ",")}`;
}

function extractPrice(html: string) {
  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdBlocks) {
    for (const block of jsonLdBlocks) {
      const inner = block.replace(/<\/?script[^>]*>/gi, "").trim();
      try {
        const data = JSON.parse(inner);
        const candidates = Array.isArray(data) ? data : [data];
        for (const candidate of candidates) {
          const offer = Array.isArray(candidate?.offers) ? candidate.offers[0] : candidate?.offers;
          const price = offer?.price ?? candidate?.price;
          const formatted = price ? formatPrice(price) : null;
          if (formatted) return formatted;
        }
      } catch {
        // Some stores ship invalid JSON-LD. Continue with other patterns.
      }
    }
  }

  const metaPrice =
    extractMetaContent(html, "product:price:amount") ??
    extractMetaContent(html, "og:price:amount");
  const formattedMeta = metaPrice ? formatPrice(metaPrice) : null;
  if (formattedMeta) return formattedMeta;

  const visiblePrice = html.match(/R\$\s?\d{1,5}(?:[\.,]\d{2})/i)?.[0];
  return visiblePrice ?? null;
}

async function fetchPageData(targetUrl: string) {
  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { image: null, price: null };

    const html = await res.text();
    const finalUrl = res.url || targetUrl;
    const image =
      finalUrl.includes("amazon") || targetUrl.includes("amazon")
        ? extractAmazonImage(html) ?? extractImage(html, finalUrl)
        : extractImage(html, finalUrl);

    return { image, price: extractPrice(html) };
  } catch {
    return { image: null, price: null };
  }
}

function cachedResponse(product: CachedProductMedia) {
  return product.url
    ? NextResponse.json({
        url: product.url,
        ...(product.price ? { preco: product.price } : {}),
      })
    : NextResponse.json({ error: "Nao encontrada" }, { status: 404 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const asin = searchParams.get("asin");
  const rawUrl = searchParams.get("url");

  if (asin && !rawUrl) {
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json({ error: "ASIN invalido" }, { status: 400 });
    }

    const cacheKey = `asin:${asin}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < TTL) return cachedResponse(cached);

    const { image, price } = await fetchPageData(`https://www.amazon.com.br/dp/${asin}`);
    const product = { url: image, price, ts: Date.now() };
    cache.set(cacheKey, product);
    return cachedResponse(product);
  }

  if (!rawUrl) {
    return NextResponse.json({ error: "asin ou url obrigatorio" }, { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = decodeURIComponent(rawUrl);
    if (!isAllowedUrl(targetUrl)) {
      return NextResponse.json({ error: "Dominio nao permitido" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "URL invalida" }, { status: 400 });
  }

  try {
    const saved = await prisma.presenteLink.findFirst({
      where: { url: targetUrl, image_url: { not: null } },
      select: { image_url: true, preco: true },
    });
    if (saved?.image_url) {
      const product = { url: saved.image_url, price: saved.preco, ts: Date.now() };
      cache.set(`url:${targetUrl}`, product);
      return cachedResponse(product);
    }
  } catch {
    // If database is unavailable, still try external metadata.
  }

  const cacheKey = `url:${targetUrl}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) return cachedResponse(cached);

  const { image, price } = await fetchPageData(targetUrl);
  const product = { url: image, price, ts: Date.now() };
  cache.set(cacheKey, product);

  if (image || price) {
    void prisma.presenteLink.updateMany({
      where: { url: targetUrl },
      data: {
        ...(image ? { image_url: image } : {}),
        ...(price ? { preco: price } : {}),
      },
    }).catch(() => {});
  }

  return cachedResponse(product);
}
