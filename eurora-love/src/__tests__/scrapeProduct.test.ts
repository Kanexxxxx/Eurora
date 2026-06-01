import { describe, it, expect } from "vitest";
import {
  isSafeUrl,
  isGenericShopeeImage,
  extractOgImage,
  extractPrice,
  parseShopeeIds,
} from "@/server/scrapeProduct";

describe("isSafeUrl", () => {
  it("aceita URLs HTTPS válidas", () => {
    expect(isSafeUrl("https://shopee.com.br/produto-i.123.456")).toBe(true);
    expect(isSafeUrl("https://amazon.com.br/dp/B0ABC")).toBe(true);
    expect(isSafeUrl("https://mercadolivre.com.br/item")).toBe(true);
  });

  it("rejeita localhost e IPs privados", () => {
    expect(isSafeUrl("http://localhost/api")).toBe(false);
    expect(isSafeUrl("http://127.0.0.1/")).toBe(false);
    expect(isSafeUrl("http://192.168.1.1/")).toBe(false);
    expect(isSafeUrl("http://10.0.0.1/")).toBe(false);
    expect(isSafeUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
  });

  it("rejeita URLs malformadas", () => {
    expect(isSafeUrl("not-a-url")).toBe(false);
    expect(isSafeUrl("")).toBe(false);
  });

  it("rejeita protocolo não HTTP(S)", () => {
    expect(isSafeUrl("ftp://shopee.com.br/arquivo")).toBe(false);
    expect(isSafeUrl("file:///etc/passwd")).toBe(false);
  });
});

describe("isGenericShopeeImage", () => {
  it("rejeita imagens genéricas da Shopee", () => {
    expect(isGenericShopeeImage("https://deo.shopeemobile.com/shopee/logo.png")).toBe(true);
    expect(isGenericShopeeImage("https://cf.shopee.com.br/homepagefe/banner.jpg")).toBe(true);
    expect(isGenericShopeeImage("https://cf.shopee.com.br/shopee-mobilemall/icon.png")).toBe(true);
  });

  it("aceita imagens reais de produto", () => {
    expect(isGenericShopeeImage("https://down-br.img.susercontent.com/file/abc123")).toBe(false);
    expect(isGenericShopeeImage("https://cf.shopee.com.br/file/produto123")).toBe(false);
  });
});

describe("extractOgImage", () => {
  it("extrai og:image do HTML", () => {
    const html = `<meta property="og:image" content="https://example.com/img.jpg">`;
    expect(extractOgImage(html)).toBe("https://example.com/img.jpg");
  });

  it("extrai og:image com atributos invertidos", () => {
    const html = `<meta content="https://example.com/img.jpg" property="og:image">`;
    expect(extractOgImage(html)).toBe("https://example.com/img.jpg");
  });

  it("extrai twitter:image como fallback", () => {
    const html = `<meta name="twitter:image" content="https://example.com/tw.jpg">`;
    expect(extractOgImage(html)).toBe("https://example.com/tw.jpg");
  });

  it("retorna null se não encontrar", () => {
    expect(extractOgImage("<html><body>Sem imagem</body></html>")).toBeNull();
  });

  it("ignora imagens genéricas da Shopee", () => {
    const html = `<meta property="og:image" content="https://deo.shopeemobile.com/shopee/logo.png">`;
    expect(extractOgImage(html)).toBeNull();
  });
});

describe("extractPrice", () => {
  it("extrai preço do meta product:price:amount (Shopee)", () => {
    const html = `<meta property="product:price:amount" content="99.90">`;
    expect(extractPrice(html)).toBe("R$ 99,90");
  });

  it("extrai preço do JSON-LD", () => {
    const html = `
      <script type="application/ld+json">
        {"@type":"Product","offers":{"price":149.9}}
      </script>
    `;
    expect(extractPrice(html)).toBe("R$ 149,90");
  });

  it("retorna null se não encontrar preço", () => {
    expect(extractPrice("<html><body>Sem preço</body></html>")).toBeNull();
  });
});

describe("parseShopeeIds", () => {
  it("extrai shopId e itemId do formato -i.SHOPID.ITEMID", () => {
    const result = parseShopeeIds("https://shopee.com.br/produto-i.123456.987654321");
    expect(result).toEqual({ shopId: "123456", itemId: "987654321" });
  });

  it("extrai shopId e itemId do formato /SHOPID/ITEMID", () => {
    const result = parseShopeeIds("https://shopee.com.br/123456/987654321");
    expect(result).toEqual({ shopId: "123456", itemId: "987654321" });
  });

  it("retorna null para URL sem IDs", () => {
    expect(parseShopeeIds("https://shopee.com.br/categoria/")).toBeNull();
  });

  it("retorna null para URL inválida", () => {
    expect(parseShopeeIds("not-a-url")).toBeNull();
  });
});
