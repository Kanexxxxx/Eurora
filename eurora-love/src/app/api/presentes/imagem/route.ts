import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { scrapeProductImageAndPrice } from "@/server/scrapeProduct";

const cache = new Map<string, { url: string | null; ts: number }>();
const TTL = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const asin = searchParams.get("asin");
  const rawUrl = searchParams.get("url");

  // ── Amazon via ASIN — bloqueado por VPS, usa fallback visual ─────────────
  if (asin) {
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json({ error: "ASIN inválido" }, { status: 400 });
    }
    cache.set(`asin:${asin}`, { url: null, ts: Date.now() });
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

    // 1. Verificar se já está salvo no banco
    try {
      const saved = await prisma.presenteLink.findFirst({
        where: { url: targetUrl, image_url: { not: null } },
        select: { image_url: true, preco: true },
      });
      if (saved?.image_url) {
        cache.set(`url:${targetUrl}`, { url: saved.image_url, ts: Date.now() });
        return NextResponse.json({ url: saved.image_url, ...(saved.preco ? { preco: saved.preco } : {}) });
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
    const { image: url, price } = await scrapeProductImageAndPrice(targetUrl);
    cache.set(cacheKey, { url, ts: Date.now() });

    // Salvar no banco para nunca mais buscar externamente
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
