"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";
import FakeNotifications from "@/components/conversion/FakeNotifications";
import LiveCounter from "@/components/conversion/LiveCounter";

type ToolId = "carta" | "poema" | "musica" | "presente" | "bio" | "convite";

const TOOLS: {
  id: ToolId;
  title: string;
  emoji: string;
  desc: string;
  prompt: string;
  fields: { name: string; label: string; placeholder: string; type?: "text" | "textarea" }[];
  example: string;
  badge: string;
}[] = [
  {
    id: "carta",
    title: "Carta Romântica",
    emoji: "💌",
    desc: "Aquela carta de papel manuscrito que faz chorar — gerada em segundos.",
    prompt: "Escreva uma carta romântica intensa e sincera",
    badge: "Mais usado",
    fields: [
      { name: "para", label: "Pra quem é a carta", placeholder: "Maria, minha namorada" },
      { name: "lembranca", label: "Uma lembrança especial de vocês", placeholder: "Aquele dia que choveu na praia…", type: "textarea" },
      { name: "tom", label: "Tom da carta", placeholder: "Profundo e emocionante" },
    ],
    example:
      "Maria,\n\nNão dá pra começar essa carta sem te dizer o óbvio que esquecemos de falar todos os dias: você é a coisa mais bonita que já me aconteceu.\n\nLembra daquele dia que choveu na praia e a gente correu rindo até o quiosque? Eu sei que parecia só uma corrida. Pra mim, foi o segundo exato em que entendi que queria isso pra vida toda — você, eu, e a chuva.\n\nObrigado por ser a paz nos meus piores dias e a festa nos melhores.\n\nTeu, pra sempre.",
  },
  {
    id: "poema",
    title: "Poema Personalizado",
    emoji: "🌹",
    desc: "Verso livre ou rimado. Você escolhe o estilo.",
    prompt: "Crie um poema romântico",
    badge: "Viral",
    fields: [
      { name: "nome", label: "Nome dele/dela", placeholder: "Pedro" },
      { name: "sentimento", label: "O que você sente", placeholder: "Paz, calor de lar, vontade de eternidade", type: "textarea" },
    ],
    example:
      "Pedro,\nteu nome cabe na minha boca\ncomo café de manhã —\ndoce, quente, necessário.\n\nNão é amor de fogo\nque queima e acaba.\nÉ brasa: silenciosa,\nsem pressa de virar incêndio,\nporque já entendeu\nque vai durar a vida toda.",
  },
  {
    id: "musica",
    title: "Letra de Música",
    emoji: "🎵",
    desc: "Uma música autoral pra dedicar — pop, samba, sertanejo, MPB.",
    prompt: "Componha uma letra de música romântica",
    badge: "Spotify-ready",
    fields: [
      { name: "estilo", label: "Estilo musical", placeholder: "Sertanejo romântico" },
      { name: "historia", label: "História de vocês em 2 frases", placeholder: "Nos conhecemos em uma festa…", type: "textarea" },
    ],
    example:
      "(Verso 1)\nFoi numa festa qualquer, dia de semana\nVocê chegou de vestido, eu mudei de plano\n\n(Refrão)\nE eu não sabia ainda\nque ali nascia tudo\nque ia mudar minha vida\nem 4 minutos surdos\n\n(Verso 2)\nPedi seu nome, anotei na servieta\nGuardei aquela noite, dobrei na carteira…",
  },
  {
    id: "presente",
    title: "Texto pra Presente",
    emoji: "🎁",
    desc: "Aquele cartãozinho que vai junto com o presente — sem clichê.",
    prompt: "Escreva um texto romântico curto pra acompanhar um presente",
    badge: "Pronto pra cartão",
    fields: [
      { name: "presente", label: "O presente", placeholder: "Uma pulseira gravada" },
      { name: "momento", label: "Pra qual momento", placeholder: "Dia dos Namorados" },
    ],
    example:
      "Uma pulseira pequena\npra um amor enorme.\n\nQue ela te lembre,\ntodos os dias,\nque tem alguém aqui\nque escolhe você\ndo nascer do sol\nao último segundo\nde cada noite.\n\nFeliz Dia dos Namorados.",
  },
  {
    id: "bio",
    title: "Bio de Casal",
    emoji: "💕",
    desc: "Pra colocar no Instagram do casal — direta, divertida, fofa.",
    prompt: "Crie uma bio criativa pra um perfil de casal",
    badge: "Compartilhável",
    fields: [
      { name: "data", label: "Desde quando", placeholder: "12/06/2022" },
      { name: "vibe", label: "Vibe do casal", placeholder: "Engraçado e viajante" },
    ],
    example:
      "📍 Casal desde 12.06.22\n☁️ Brigamos sobre filme. Fazemos as pazes com sorvete.\n✈️ Já fomos pra 7 cidades de mãos dadas.\n💍 Cap. 1 de muitos.\n\n— ele & ela",
  },
  {
    id: "convite",
    title: "Convite Romântico",
    emoji: "💎",
    desc: "Convite pra jantar, pedido, encontro surpresa. Elegante e marcante.",
    prompt: "Crie um convite romântico elegante",
    badge: "Premium",
    fields: [
      { name: "ocasiao", label: "Tipo de convite", placeholder: "Jantar surpresa em casa" },
      { name: "local", label: "Onde", placeholder: "Nosso apê, hoje 20h" },
    ],
    example:
      "Você está oficialmente convidada\npara o jantar de uma vida toda.\n\nLocal: nosso apê.\nHora: 20h.\nDress code: aquele vestido que eu não consigo parar de olhar.\n\nNão preciso que confirme presença.\nSó que apareça.\n\nCom amor,\nEu.",
  },
];

export default function IAClient() {
  const [activeId, setActiveId] = useState<ToolId>("carta");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [generationsUsed, setGenerationsUsed] = useState(0);

  const active = TOOLS.find((t) => t.id === activeId)!;
  const FREE_GENERATIONS = 1;

  const handleGenerate = () => {
    if (generationsUsed >= FREE_GENERATIONS) {
      setShowPaywall(true);
      return;
    }
    setGenerating(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(active.example);
      setGenerating(false);
      setGenerationsUsed((n) => n + 1);
    }, 2200);
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
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={8} />
      <FakeNotifications />

      <section className="relative px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> 8.412 textos gerados nas últimas 24h
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            A <span className="text-gradient-fire">IA Romântica</span> mais
            poderosa do Brasil
          </h1>
          <p className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto">
            Treinada em poetas, compositores e cartas de amor reais.{" "}
            <span className="text-white font-medium">
              Sem clichê. Só palavras que tocam de verdade.
            </span>
          </p>
        </div>
      </section>

      <section className="relative px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats - mobile: 1 col, sm: 3 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <LiveCounter label="Cartas escritas hoje" base={1284} step={1} intervalMs={5500} />
            <LiveCounter label="Poemas gerados" base={3018} step={2} intervalMs={6200} />
            <LiveCounter label="Casais usando agora" base={412} step={1} intervalMs={4800} />
          </div>

          {/* Mobile: horizontal tool tabs | Desktop: sidebar */}
          <div className="mb-6 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTool(t.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all ${
                    activeId === t.id
                      ? "glass-premium border-rose-400/40 text-white"
                      : "bg-white/[0.03] border border-white/8 text-white/60"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span className="whitespace-nowrap">{t.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Tools sidebar — desktop only */}
            <div className="hidden lg:block space-y-2 lg:sticky lg:top-24 lg:self-start">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3 px-2">
                Geradores
              </p>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTool(t.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all ${
                    activeId === t.id
                      ? "glass-premium border-rose-400/40"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                  }`}
                >
                  <span className={`text-2xl ${activeId === t.id ? "scale-110" : "opacity-70"} transition-transform`}>
                    {t.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block text-white text-sm font-medium leading-tight">{t.title}</span>
                    <span className="block text-white/45 text-[11px] mt-0.5">{t.badge}</span>
                  </span>
                  {activeId === t.id && <span className="text-rose-300 text-xs">▸</span>}
                </button>
              ))}

              <div className="rounded-2xl p-4 bg-amber-500/5 border border-amber-500/20 mt-4">
                <p className="text-amber-200 text-xs font-semibold mb-1">💎 Premium ilimitado</p>
                <p className="text-white/55 text-[11px] leading-relaxed">
                  R$ 19 por todos os geradores, pra sempre.
                </p>
                <Link href="/criar?plan=premium" className="inline-block mt-3 text-rose-300 text-xs font-semibold hover:text-rose-200">
                  Desbloquear premium →
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
                <span className="pill pill-gold text-[10px] flex-shrink-0 ml-3">IA-GEN</span>
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
                        onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm leading-relaxed"
                      />
                    ) : (
                      <input
                        value={inputs[field.name] || ""}
                        onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-premium w-full inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Escrevendo do coração…
                  </>
                ) : (
                  <>✨ Gerar com IA Romântica</>
                )}
              </button>

              {generationsUsed === 0 && (
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
                      <p className="text-white/60 text-xs uppercase tracking-wider">✨ Resultado gerado</p>
                      <button onClick={handleCopy} className="text-rose-300 text-xs hover:text-rose-200 font-medium">
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

          {/* Mobile premium card */}
          <div className="lg:hidden mt-6 rounded-2xl p-4 bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-200 text-sm font-semibold mb-1">💎 Premium ilimitado — R$ 19</p>
            <p className="text-white/55 text-xs leading-relaxed mb-3">Todos os geradores, pra sempre. Inclui templates premium.</p>
            <Link href="/criar?plan=premium" className="btn-premium text-center block text-sm">
              Desbloquear premium →
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
                Você usou sua geração grátis. Pelo preço de uma cerveja,
                desbloqueia <strong>tudo</strong> da IA Romântica — pra sempre.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-white/50 text-xs">Avulso</p>
                  <p className="font-heading text-3xl text-white mt-1">R$ 6</p>
                  <p className="text-white/40 text-[11px] mt-1">5 gerações</p>
                </div>
                <div className="rounded-2xl border border-rose-400/40 bg-gradient-to-br from-rose-500/10 to-amber-400/5 p-4 relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    PREMIUM
                  </span>
                  <p className="text-rose-300 text-xs">Tudo</p>
                  <p className="font-heading text-3xl text-gradient-fire mt-1">R$ 19</p>
                  <p className="text-white/55 text-[11px] mt-1">Ilimitado vitalício</p>
                </div>
              </div>

              <Link href="/criar?plan=premium" className="btn-premium w-full block text-center">
                Desbloquear premium →
              </Link>

              <p className="text-white/40 text-xs mt-3">
                💳 PIX · Garantia 7 dias
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
