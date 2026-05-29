"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUTOS, CATEGORIAS, type Produto } from "@/data/presentes";

type Step = "verificando" | "locked" | "form" | "pix" | "unlocked";

const PLATFORM_STYLE: Record<string, { bg: string; label: string }> = {
  Amazon: { bg: "bg-orange-500", label: "Amazon" },
  Shopee:  { bg: "bg-[#ee4d2d]",  label: "Shopee" },
  ML:      { bg: "bg-yellow-400 text-black", label: "Mercado Livre" },
};

const TOKEN_KEY = "presentes_token";

// Preview cards shown blurred on the paywall (first 9 products)
const PREVIEW = PRODUTOS.slice(0, 9);

function ProdutoCard({ p, index }: { p: Produto; index: number }) {
  const cat = CATEGORIAS[p.categoria];
  const plat = PLATFORM_STYLE[p.platform] ?? { bg: "bg-gray-500", label: p.platform };
  const [imgSrc, setImgSrc] = useState<string | null>(p.image ?? null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(!p.image);
  const [preco, setPreco] = useState<string | undefined>(p.preco);

  useEffect(() => {
    if (imgSrc) return;
    let endpoint: string | null = null;
    if (p.asin) endpoint = `/api/presentes/imagem?asin=${p.asin}`;
    else if (p.url) endpoint = `/api/presentes/imagem?url=${encodeURIComponent(p.url)}`;
    if (!endpoint) { setLoading(false); return; }
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { url?: string; preco?: string } | null) => {
        if (d?.url) setImgSrc(d.url);
        if (d?.preco && !preco) setPreco(d.preco);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [p.asin, p.url, imgSrc, preco]);

  const showImg = imgSrc && !imgError;

  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.4) }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white/3 hover:border-rose-400/30 hover:bg-white/6 transition-all duration-200 active:scale-[0.97]"
    >
      {/* Imagem */}
      <div className={`relative w-full overflow-hidden bg-linear-to-br ${cat?.gradient ?? "from-gray-700 to-gray-900"} flex items-center justify-center ${showImg ? "aspect-square" : "h-28"}`}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
          </div>
        )}
        {showImg && (
          <img
            src={imgSrc}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => { setImgError(true); setImgSrc(null); }}
          />
        )}
        {!loading && !showImg && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {cat?.emoji ?? "🎁"}
            </span>
            <span className="text-white/50 text-[10px] font-medium uppercase tracking-wider px-3 text-center line-clamp-2">
              {p.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0 ${plat.bg}`}>
            {plat.label}
          </span>
          <span className="text-[9px] text-white/40 uppercase tracking-wide truncate">
            {cat?.label ?? p.categoria}
          </span>
        </div>
        <p className="text-white text-[12px] font-medium leading-snug line-clamp-2 flex-1">
          {p.name}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          {preco ? (
            <span className="text-emerald-400 text-[11px] font-bold">{preco}</span>
          ) : (
            <span />
          )}
          <span className="text-[#ffb1c9] text-[11px] font-semibold group-hover:text-rose-300 transition-colors">
            Ver produto →
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function PresentesClient() {
  const [step, setStep] = useState<Step>("verificando");
  const [categoria, setCategoria] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [dbLinks, setDbLinks] = useState<Produto[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [form, setForm] = useState({ name: "", email: "", cpf: "" });
  const [pix, setPix] = useState<{ payment_id: string; qr_code: string; copia_cola: string } | null>(null);
  const [loadingPagar, setLoadingPagar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [erro, setErro] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check stored token on mount
  useEffect(() => {
    let cancelled = false;

    const checkToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (!cancelled) setStep("locked");
        return;
      }

      try {
        const response = await fetch(`/api/presentes/status?token=${encodeURIComponent(token)}`);
        const data = await response.json() as { valid?: boolean };
        if (!cancelled) setStep(data.valid ? "unlocked" : "locked");
      } catch {
        if (!cancelled) setStep("locked");
      }
    };

    void checkToken();

    return () => {
      cancelled = true;
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const startPolling = useCallback((payment_id: string) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/presentes/status?payment_id=${payment_id}`);
        const d = await r.json() as { paid?: boolean; token?: string };
        if (d.paid && d.token) {
          localStorage.setItem(TOKEN_KEY, d.token);
          stopPolling();
          setStep("unlocked");
        }
      } catch { /* ignore */ }
    }, 3000);
  }, [stopPolling]);

  const handlePagar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoadingPagar(true);
    try {
      const r = await fetch("/api/presentes/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json() as { error?: string; payment_id?: string; pix_qr_code?: string; pix_copia_cola?: string };
      if (!r.ok || d.error) throw new Error(d.error ?? "Erro ao gerar PIX");
      setPix({ payment_id: d.payment_id!, qr_code: d.pix_qr_code!, copia_cola: d.pix_copia_cola! });
      setStep("pix");
      startPolling(d.payment_id!);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoadingPagar(false);
    }
  };

  const copiar = () => {
    if (!pix) return;
    navigator.clipboard.writeText(pix.copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Load DB links when unlocked
  useEffect(() => {
    if (step !== "unlocked") return;
    fetch("/api/presentes/links")
      .then((r) => r.json())
      .then((data: { links: { id: string; name: string; platform: string; url: string; categoria: string; image_url?: string | null; preco?: string | null }[]; hiddenIds: number[] }) => {
        setDbLinks(data.links.map((l, i) => ({
          ...l,
          id: 100000 + i,
          platform: l.platform as Produto["platform"],
          image: l.image_url ?? undefined,
          preco: l.preco ?? undefined,
        })));
        setHiddenIds(data.hiddenIds ?? []);
      })
      .catch(() => {});
  }, [step]);

  // Filtered products
  const todosOsProdutos = [...PRODUTOS.filter((p) => !hiddenIds.includes(p.id)), ...dbLinks];
  const produtos = todosOsProdutos.filter((p) => {
    const matchCat = categoria === "Todos" || p.categoria === categoria;
    const matchBusca = !busca || p.name.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const categorias = ["Todos", ...Object.keys(CATEGORIAS)];

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors text-sm";

  if (step === "verificando") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
      </main>
    );
  }

  if (step === "unlocked") {
    return (
      <main className="min-h-screen px-4 pt-10 pb-16 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="pill pill-gold mb-4 mx-auto">✨ Curadoria desbloqueada</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold mb-3">
            {PRODUTOS.length} ideias de presentes
          </h1>
          <p className="text-white/55 text-sm">
            Clique em qualquer produto para abrir direto na loja.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-5 max-w-sm mx-auto">
          <input
            type="search"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 -mx-4 px-4">
          {categorias.map((cat) => {
            const info = CATEGORIAS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  categoria === cat
                    ? "bg-rose-500 text-white"
                    : "bg-white/8 text-gray-400 hover:text-white hover:bg-white/12"
                }`}
              >
                {info ? `${info.emoji} ${info.label}` : "🎁 Todos"}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-gray-600 text-xs mb-5">
          {produtos.length} produto{produtos.length !== 1 ? "s" : ""}
          {categoria !== "Todos" ? ` em ${categoria}` : ""}
          {busca ? ` para "${busca}"` : ""}
        </p>

        {/* Grid */}
        {produtos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {produtos.map((p, i) => (
              <ProdutoCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-20">Nenhum produto encontrado.</p>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pt-10 pb-16">
      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <p className="pill pill-live mb-5 mx-auto">
          <span className="live-dot" /> Acesso único · só R$ 8
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl text-white font-bold mb-4 leading-tight">
          Você não sabe o que dar para{" "}
          <span className="text-gradient-fire">seu namorado(a)?</span>
        </h1>
        <p className="text-white/55 text-lg">
          Presentes reais selecionados — kits, joias, skincare, tech e muito mais.
          Desbloqueie por apenas <span className="text-white font-bold">R$ 8,00</span> e compre direto na loja.
        </p>
      </div>

      {/* Preview blurred + paywall */}
      <AnimatePresence mode="wait">
        {step === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Blurred preview grid */}
              <div className="grid grid-cols-3 gap-3 blur-sm pointer-events-none select-none opacity-60">
                {PREVIEW.map((p) => {
                  const cat = CATEGORIAS[p.categoria];
                  return (
                    <div key={p.id} className="rounded-2xl overflow-hidden border border-white/8">
                      <div className={`h-24 bg-linear-to-br ${cat?.gradient ?? "from-gray-700 to-gray-900"} flex items-center justify-center text-4xl`}>
                        {cat?.emoji ?? "🎁"}
                      </div>
                      <div className="p-3 bg-white/3">
                        <div className="h-2 bg-white/10 rounded mb-2 w-16" />
                        <div className="h-3 bg-white/15 rounded mb-1" />
                        <div className="h-3 bg-white/10 rounded w-3/4" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black via-black/80 to-transparent rounded-2xl">
                <div className="relative rounded-[28px] p-8 sm:p-10 text-center max-w-sm w-full mx-4 bg-gradient-to-br from-amber-950/80 via-zinc-900 to-black border border-amber-500/40 shadow-[0_0_60px_-10px_rgba(245,158,11,0.4)]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {PRODUTOS.length} presentes selecionados
                  </div>
                  <p className="text-5xl mb-4 mt-2">🎁</p>
                  <h2 className="font-heading text-2xl text-white font-bold mb-2">
                    Você não sabe o que dar?
                  </h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Kits, joias, skincare, maquiagem, tech e ideias criativas — separados por categoria. Compre direto na Amazon com um clique.
                  </p>
                  <div className="mb-6">
                    <p className="text-gray-500 text-xs mb-1">Acesso único, para sempre</p>
                    <p className="font-heading text-6xl font-bold text-gradient-fire leading-none">R$ 8</p>
                    <p className="text-gray-600 text-xs mt-1">Pagamento via PIX · aprovado em 30s</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="w-full py-4 rounded-full text-white font-bold text-base bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.8)] hover:shadow-[0_12px_40px_-8px_rgba(245,158,11,1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Quero ver os presentes →
                  </button>
                  <p className="text-gray-600 text-xs mt-3">🔒 Pagamento seguro · Acesso imediato</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-sm mx-auto"
          >
            <div className="glass rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-white font-bold mb-1">
                Seus dados para o PIX
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Usamos estes dados apenas para gerar seu Pix com segurança.
              </p>
              <form onSubmit={handlePagar} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Nome completo</label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">E-mail</label>
                  <input
                    type="email"
                    placeholder="joao@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">CPF (só números)</label>
                  <input
                    type="text"
                    placeholder="00000000000"
                    inputMode="numeric"
                    maxLength={14}
                    value={form.cpf}
                    onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                    className={inputClass}
                    required
                  />
                </div>

                {erro && (
                  <p className="text-red-400 text-sm text-center">{erro}</p>
                )}

                <button
                  type="submit"
                  disabled={loadingPagar}
                  className="btn-premium w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingPagar ? "Gerando PIX..." : "Gerar PIX — R$ 8,00 →"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("locked")}
                  className="w-full text-gray-600 text-xs hover:text-gray-400 transition-colors py-2"
                >
                  ← Voltar
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === "pix" && pix && (
          <motion.div
            key="pix"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-sm mx-auto"
          >
            <div className="glass rounded-3xl p-8 text-center">
              <div className="bg-white rounded-2xl p-4 inline-block mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${pix.qr_code}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
              <h2 className="font-heading text-xl text-white font-bold mb-1">
                Aguardando pagamento
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Escaneie o QR Code ou copie o código PIX abaixo. Os produtos aparecem automaticamente após o pagamento.
              </p>
              <button
                type="button"
                onClick={copiar}
                className="btn-premium w-full mb-3"
              >
                {copied ? "✓ Copiado!" : "Copiar código PIX"}
              </button>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <p className="text-gray-500 text-xs">Verificando pagamento…</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
