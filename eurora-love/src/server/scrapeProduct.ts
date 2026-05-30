const USER_AGENTS = [
  // Desktop Chrome
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  // Mobile Chrome (Amazon muitas vezes responde melhor)
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  // Googlebot (alguns sites liberam para crawlers)
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  // Safari mobile
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
];

function makeHeaders(ua: string, referer?: string): Record<string, string> {
  return {
    "User-Agent": ua,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
    "Cache-Control": "no-cache",
    ...(referer ? { Referer: referer } : {}),
  };
}

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
  // 1. data-a-dynamic-image (tabela de imagens)
  const dyn = html.match(/data-a-dynamic-image="([^"]+)"/);
  if (dyn) {
    const decoded = dyn[1].replace(/&quot;/g, '"');
    const m = decoded.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)/);
    if (m) return m[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
  }
  // 2. landingImage (imagem principal)
  const landing = html.match(/id=["']landingImage["'][^>]+src=["']([^"']+)["']/i)
    ?? html.match(/data-old-hires=["']([^"']+)["']/i);
  if (landing?.[1]?.startsWith("http")) return landing[1];
  // 3. Padrão geral m.media-amazon
  const fb = html.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%+_-]+\._[A-Z0-9,_]+_\.(?:jpg|jpeg|png|webp))/);
  if (fb) return fb[1].replace(/\._[A-Z0-9,_]+_\./, "._SL400_.");
  // 4. OG image (pode ter na Amazon)
  return extractOgImage(html);
}

function extractPrice(html: string): string | null {
  // JSON-LD offers.price
  const ldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldMatch) {
    for (const block of ldMatch) {
      const inner = block.replace(/<\/?script[^>]*>/gi, "");
      try {
        const data = JSON.parse(inner) as Record<string, unknown>;
        const offers = data?.offers as { price?: unknown; 0?: { price?: unknown } } | undefined;
        const price = offers?.price ?? (Array.isArray(offers) ? (offers as Array<{price?: unknown}>)[0]?.price : undefined);
        if (price && Number(price) > 0) {
          return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
        }
      } catch { /* continua */ }
    }
  }
  // Amazon: priceblock_ourprice / a-offscreen
  const aPrice = html.match(/class="a-offscreen">R\$\s*([\d.,]+)</i)
    ?? html.match(/priceblock[^>]+>R\$\s*([\d.,]+)/i);
  if (aPrice?.[1]) {
    const num = parseFloat(aPrice[1].replace(/\./g, "").replace(",", "."));
    if (num > 0) return `R$ ${num.toFixed(2).replace(".", ",")}`;
  }
  // Shopee: product:price:amount
  const metaPrice = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']product:price:amount["']/i);
  if (metaPrice?.[1] && Number(metaPrice[1]) > 0) {
    return `R$ ${Number(metaPrice[1]).toFixed(2).replace(".", ",")}`;
  }
  return null;
}

async function tryFetch(url: string, ua: string, referer?: string): Promise<{ image: string | null; price: string | null }> {
  try {
    const res = await fetch(url, {
      headers: makeHeaders(ua, referer),
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { image: null, price: null };
    const html = await res.text();
    const isAmazon = res.url.includes("amazon.com") || url.includes("amazon") || url.includes("amzn.to");
    const image = isAmazon ? extractAmazonImage(html) : extractOgImage(html);
    const price = extractPrice(html);
    return { image, price };
  } catch {
    return { image: null, price: null };
  }
}

export async function scrapeProductImageAndPrice(targetUrl: string): Promise<{ image: string | null; price: string | null }> {
  const isAmazon = targetUrl.includes("amazon") || targetUrl.includes("amzn.to");
  const isShopee = targetUrl.includes("shopee");
  const isML = targetUrl.includes("mercadolivre") || targetUrl.includes("mercadolibre");

  const referer = isAmazon ? "https://www.amazon.com.br/"
    : isShopee ? "https://shopee.com.br/"
    : isML ? "https://www.mercadolivre.com.br/"
    : undefined;

  // Tenta com múltiplos User-Agents até ter sucesso
  for (const ua of USER_AGENTS) {
    const result = await tryFetch(targetUrl, ua, referer);
    if (result.image) return result;
  }

  return { image: null, price: null };
}
