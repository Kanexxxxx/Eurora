"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";

type ToolId = "carta" | "poema" | "musica" | "presente" | "bio" | "convite";

const TOOLS: {
  id: ToolId;
  title: string;
  emoji: string;
  desc: string;
  badge: string;
  fields: { name: string; label: string; placeholder: string; type?: "text" | "textarea" }[];
}[] = [
  {
    id: "carta",
    title: "Carta Romântica",
    emoji: "💌",
    desc: "Aquela carta que faz chorar — gerada em segundos com IA.",
    badge: "Mais usado",
    fields: [
      { name: "para", label: "Pra quem é a carta", placeholder: "Maria, minha namorada" },
      { name: "lembranca", label: "Uma lembrança especial de vocês", placeholder: "Aquele dia que choveu na praia…", type: "textarea" },
      { name: "tom", label: "Tom da carta", placeholder: "Profundo e emocionante" },
    ],
  },
  {
    id: "poema",
    title: "Poema Personalizado",
    emoji: "🌹",
    desc: "Verso livre ou rimado. Você escolhe o estilo.",
    badge: "Viral",
    fields: [
      { name: "nome", label: "Nome dele/dela", placeholder: "Pedro" },
      { name: "sentimento", label: "O que você sente", placeholder: "Paz, calor de lar, vontade de eternidade", type: "textarea" },
    ],
  },
  {
    id: "musica",
    title: "Letra de Música",
    emoji: "🎵",
    desc: "Uma música autoral pra dedicar — pop, samba, sertanejo, MPB.",
    badge: "Spotify-ready",
    fields: [
      { name: "estilo", label: "Estilo musical", placeholder: "Sertanejo romântico" },
      { name: "historia", label: "História de vocês em 2 frases", placeholder: "Nos conhecemos em uma festa…", type: "textarea" },
    ],
  },
  {
    id: "presente",
    title: "Texto pra Presente",
    emoji: "🎁",
    desc: "Aquele cartãozinho que vai junto com o presente — sem clichê.",
    badge: "Pronto pra cartão",
    fields: [
      { name: "presente", label: "O presente", placeholder: "Uma pulseira gravada" },
      { name: "momento", label: "Pra qual momento", placeholder: "Dia dos Namorados" },
    ],
  },
  {
    id: "bio",
    title: "Bio de Casal",
    emoji: "💕",
    desc: "Pra colocar no Instagram do casal — direta, divertida, fofa.",
    badge: "Compartilhável",
    fields: [
      { name: "data", label: "Desde quando", placeholder: "12/06/2022" },
      { name: "vibe", label: "Vibe do casal", placeholder: "Engraçado e viajante" },
    ],
  },
  {
    id: "convite",
    title: "Convite Romântico",
    emoji: "💎",
    desc: "Convite pra jantar, pedido, encontro surpresa. Elegante e marcante.",
    badge: "Premium",
    fields: [
      { name: "ocasiao", label: "Tipo de convite", placeholder: "Jantar surpresa em casa" },
      { name: "local", label: "Onde", placeholder: "Nosso apê, hoje 20h" },
    ],
  },
];

export default function IAClient() {
  const [activeId, setActiveId] = useState<ToolId>("carta");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const active = TOOLS.find((t) => t.id === activeId)!;

  const handleGenerate = async () => {
    const hasContent = active.fields.some((f) => inputs[f.name]?.trim());
    if (!hasContent) {
      setError("Preencha pelo menos um campo antes de gerar.");
      return;
    }

    setGenerating(true);
    setOutput(null);
    setError(null);

    try {
      const res = await fetch("/api/ia/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: activeId, campos: inputs }),
      });

      const data = await res.json();

      if (res.status === 403 && data.paywall) {
        setShowPaywall(true);
        return;
      }

      if (!res.ok) throw new Error(data.error || "Erro ao gerar.");

      setOutput(data.texto);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const switchTool = (id: ToolId) => {
    setActiveId(id);
    setOutput(null);
    setInputs({});
    setError(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={8} />

      <section className="relative px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> IA Romântica
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            A <span className="text-gradient-fire">IA Romântica</span> mais
            poderosa do Brasil
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto">
            Inspirada em poetas, compositores e cartas de amor reais.{" "}
            <span className="text-white font-medium">
              Sem clichê. Só palavras que tocam de verdade.
            </span>
          </p>
        </div>
      </section>

      <section className="relative px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Mobile tabs */}
          <div className="mb-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTool(t.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all border ${
                    activeId === t.id
                      ? "glass-premium border-rose-400/40 text-white"
                      : "bg-white/[0.03] border-white/10 text-white/60"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span className="whitespace-nowrap">{t.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <div className="hidden lg:block space-y-2 lg:sticky lg:top-24 lg:self-start">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3 px-2">
                Geradores
              </p>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTool(t.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all border ${
                    activeId === t.id
                      ? "glass-premium border-rose-400/40"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`text-2xl ${activeId === t.id ? "scale-110" : "opacity-70"} transition-transform`}
                  >
                    {t.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block text-white text-sm font-medium leading-tight">
                      {t.title}
                    </span>
                    <span className="block text-white/45 text-[11px] mt-0.5">
                      {t.badge}
                    </span>
                  </span>
                  {activeId === t.id && (
                    <span className="text-rose-300 text-xs">▸</span>
                  )}
                </button>
              ))}

              <div className="rounded-2xl p-4 bg-amber-500/5 border border-amber-500/20 mt-4">
                <p className="text-amber-200 text-xs font-semibold mb-1">
                  💎 Mais gerações
                </p>
                <p className="text-white/55 text-[11px] leading-relaxed">
                  Crie sua página Premium e use os geradores à vontade.
                </p>
                <Link
                  href="/criar?plan=premium"
                  className="inline-block mt-3 text-rose-300 text-xs font-semibold hover:text-rose-200"
                >
                  Criar minha página →
                </Link>
              </div>
            </div>

            {/* Main panel */}
            <div className="card-premium p-5 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    {active.emoji} {active.title}
                  </h2>
                  <p className="text-white/60 text-sm mt-1">{active.desc}</p>
                </div>
                <span className="pill pill-gold text-[10px] flex-shrink-0 ml-3">
                  IA-GEN
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {active.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-white/65 text-xs uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={inputs[field.name] || ""}
                        onChange={(e) =>
                          setInputs({ ...inputs, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm leading-relaxed"
                      />
                    ) : (
                      <input
                        value={inputs[field.name] || ""}
                        onChange={(e) =>
                          setInputs({ ...inputs, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-premium w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Escrevendo do coração…
                  </>
                ) : (
                  <>✨ Gerar com IA Romântica</>
                )}
              </button>

              {!output && (
                <p className="text-white/45 text-xs text-center mt-3">
                  🎁 1 geração grátis · Sem cadastro
                </p>
              )}

              <AnimatePresence>
                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        ✨ Resultado gerado
                      </p>
                      <button
                        onClick={handleCopy}
                        className="text-rose-300 text-xs hover:text-rose-200 font-medium"
                      >
                        {copied ? "✓ Copiado" : "📋 Copiar"}
                      </button>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden p-px">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-amber-400/20 to-rose-500/30 animate-gradient-shift" />
                      <div className="relative rounded-[23px] bg-[#0a0710]/90 backdrop-blur p-5 sm:p-6">
                        <p className="font-heading text-white/90 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                          {output}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={handleGenerate}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-white/75 text-sm transition-colors"
                      >
                        🔄 Gerar outra versão
                      </button>
                      <Link
                        href="/criar"
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-400/20 border border-rose-400/30 hover:from-rose-500/30 hover:to-amber-400/30 text-rose-200 text-sm font-medium ml-auto"
                      >
                        Usar na página do amor →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile premium */}
          <div className="lg:hidden mt-6 rounded-2xl p-4 bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-200 text-sm font-semibold mb-1">
              💎 Mais gerações
            </p>
            <p className="text-white/55 text-xs leading-relaxed mb-3">
              Crie sua página Premium e use os geradores à vontade.
            </p>
            <Link
              href="/criar?plan=premium"
              className="btn-premium text-center block text-sm"
            >
              Criar minha página →
            </Link>
          </div>
        </div>
      </section>

      {/* Paywall modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            onClick={() => setShowPaywall(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass-premium rounded-3xl p-6 sm:p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-sm flex items-center justify-center"
                aria-label="Fechar"
              >
                ×
              </button>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 mx-auto mb-5 flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_40px_rgba(255,45,106,0.5)]">
                ✨
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl text-white mb-2 tracking-tight">
                Continuar gerando?
              </h3>
              <p className="text-white/65 text-sm mb-6 leading-relaxed">
                Você usou sua geração grátis. Crie sua página do amor e continue
                usando os geradores à vontade.
              </p>

              <Link
                href="/criar?plan=premium"
                className="btn-premium w-full block text-center"
              >
                Criar minha página Premium →
              </Link>

              <p className="text-white/40 text-xs mt-3">
                💳 PIX · Suporte por 7 dias
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
