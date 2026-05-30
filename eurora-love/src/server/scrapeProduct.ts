const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
  "Cache-Control": "no-cache",
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
  const ldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldMatch) {
    for (const block of ldMatch) {
      const inner = block.replace(/<\/?script[^>]*>/gi, "");
      try {
        const data = JSON.parse(inner) as { offers?: { price?: number; 0?: { price?: number } } };
        const price = data?.offers?.price ?? (Array.isArray(data?.offers) ? (data.offers as Array<{price?: number}>)[0]?.price : undefined);
        if (price && Number(price) > 0) {
          return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
        }
      } catch { /* continua */ }
    }
  }
  const metaPrice = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']product:price:amount["']/i);
  if (metaPrice?.[1] && Number(metaPrice[1]) > 0) {
    return `R$ ${Number(metaPrice[1]).toFixed(2).replace(".", ",")}`;
  }
  return null;
}

export async function scrapeProductImageAndPrice(targetUrl: string): Promise<{ image: string | null; price: string | null }> {
  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
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
