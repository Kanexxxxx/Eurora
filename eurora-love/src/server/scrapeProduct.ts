const USER_AGENTS = [
  // Desktop Chrome
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  // Mobile Chrome
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  // Googlebot
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  // Safari mobile
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  // Facebook crawler — Shopee serve imagens reais para este UA
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
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

// Rejeita imagens genéricas da Shopee (logo do app, ícones de campanha)
function isGenericShopeeImage(url: string): boolean {
  return url.includes("deo.shopeemobile.com") || url.includes("homepagefe/") || url.includes("shopee-mobilemall");
}

function extractOgImage(html: string): string | null {
  // og:image pode estar em tag separada do content — busca o content logo após og:image
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (og?.[1]?.startsWith("http") && !isGenericShopeeImage(og[1])) return og[1];

  const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (tw?.[1]?.startsWith("http") && !isGenericShopeeImage(tw[1])) return tw[1];

  return null;
}

// Para Shopee: busca imagem real do produto no HTML (ignora banners promocionais)
function extractShopeeHtmlImage(html: string): string | null {
  // Pega todas as URLs susercontent no HTML
  const matches = [...html.matchAll(/https:\/\/down-br\.img\.susercontent\.com\/file\/([^"'<\s]+)/g)];
  for (const m of matches) {
    const path = m[1];
    // Ignora banners promocionais (promo-dim, cover, banner)
    if (/promo-dim|cover-|banner/i.test(path)) continue;
    const url = `https://down-br.img.susercontent.com/file/${path.split(".")[0]}`;
    return url;
  }
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
    const isShopee = res.url.includes("shopee") || url.includes("shopee");
    const image = isAmazon
      ? extractAmazonImage(html)
      : isShopee
        ? (extractShopeeHtmlImage(html) ?? extractOgImage(html))
        : extractOgImage(html);
    const price = extractPrice(html);
    return { image, price };
  } catch {
    return { image: null, price: null };
  }
}

// IPs privados e de metadados cloud — nunca devem ser acessados pelo scraper
const BLOCKED_HOSTS = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0|::1|fc00:|fd)/i;

function isSafeUrl(raw: string): boolean {
  try {
    const { hostname, protocol } = new URL(raw);
    if (protocol !== "https:" && protocol !== "http:") return false;
    if (BLOCKED_HOSTS.test(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

// Extrai shopid e itemid de uma URL da Shopee
// Formatos: /product-name-i.SHOPID.ITEMID  ou  /SHOPID/ITEMID
function parseShopeeIds(url: string): { shopId: string; itemId: string } | null {
  try {
    const path = new URL(url).pathname;
    // Formato: -i.SHOPID.ITEMID no final do path
    const m1 = path.match(/-i\.(\d+)\.(\d+)/);
    if (m1) return { shopId: m1[1], itemId: m1[2] };
    // Formato: /SHOPID/ITEMID
    const m2 = path.match(/^\/(\d+)\/(\d+)/);
    if (m2) return { shopId: m2[1], itemId: m2[2] };
  } catch { /* ignore */ }
  return null;
}

// Busca imagem real via API interna da Shopee (retorna foto do produto, não logo)
async function fetchShopeeImage(targetUrl: string): Promise<{ image: string | null; price: string | null }> {
  try {
    // Seguir redirect para obter URL final (para links curtos s.shopee.com.br)
    let finalUrl = targetUrl;
    if (targetUrl.includes("s.shopee.com.br") || !parseShopeeIds(targetUrl)) {
      const res = await fetch(targetUrl, {
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": USER_AGENTS[0] },
      });
      finalUrl = res.url;
    }

    const ids = parseShopeeIds(finalUrl);
    if (!ids) return { image: null, price: null };

    // API interna da Shopee — retorna JSON com imagens reais do produto
    const apiUrl = `https://shopee.com.br/api/v4/item/get?itemid=${ids.itemId}&shopid=${ids.shopId}`;
    const apiRes = await fetch(apiUrl, {
      headers: {
        "User-Agent": USER_AGENTS[1], // Mobile UA funciona melhor
        "Referer": "https://shopee.com.br/",
        "Accept": "application/json",
        "x-api-source": "pc",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!apiRes.ok) return { image: null, price: null };

    const json = await apiRes.json() as {
      data?: {
        images?: string[];
        image?: string;
        price?: number;
        price_min?: number;
      };
    };

    const data = json?.data;
    if (!data) return { image: null, price: null };

    // Primeira imagem do produto (hash → CDN URL)
    const imageHash = data.images?.[0] ?? data.image;
    const image = imageHash
      ? `https://cf.shopee.com.br/file/${imageHash}`
      : null;

    // Preço em centavos dividido por 100000
    const rawPrice = data.price ?? data.price_min;
    const price = rawPrice && rawPrice > 0
      ? `R$ ${(rawPrice / 100000).toFixed(2).replace(".", ",")}`
      : null;

    return { image, price };
  } catch {
    return { image: null, price: null };
  }
}

export async function scrapeProductImageAndPrice(targetUrl: string): Promise<{ image: string | null; price: string | null }> {
  if (!isSafeUrl(targetUrl)) return { image: null, price: null };

  const isAmazon = targetUrl.includes("amazon") || targetUrl.includes("amzn.to");
  const isShopee = targetUrl.includes("shopee");
  const isML = targetUrl.includes("mercadolivre") || targetUrl.includes("mercadolibre");

  // Shopee: API interna primeiro (imagem real do produto)
  if (isShopee) {
    const result = await fetchShopeeImage(targetUrl);
    if (result.image) return result;
  }

  const referer = isAmazon ? "https://www.amazon.com.br/"
    : isShopee ? "https://shopee.com.br/"
    : isML ? "https://www.mercadolivre.com.br/"
    : undefined;

  // Fallback: scraping HTML com múltiplos User-Agents
  for (const ua of USER_AGENTS) {
    const result = await tryFetch(targetUrl, ua, referer);
    if (result.image) return result;
  }

  return { image: null, price: null };
}
