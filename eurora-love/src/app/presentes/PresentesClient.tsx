"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/effects/FloatingHearts";
import FakeNotifications from "@/components/conversion/FakeNotifications";
import LiveCounter from "@/components/conversion/LiveCounter";

type Step = "intro" | "quiz" | "loading" | "result";

const QUIZ = [
  {
    id: "persona",
    q: "Como você descreveria a personalidade dela?",
    options: [
      { value: "doce", label: "Doce, fofa, sentimental", emoji: "🥺" },
      { value: "intensa", label: "Intensa, apaixonada, dramática", emoji: "🔥" },
      { value: "divertida", label: "Engraçada, descolada, espontânea", emoji: "😂" },
      { value: "elegante", label: "Elegante, sofisticada, exigente", emoji: "👑" },
    ],
  },
  {
    id: "estilo",
    q: "Qual o estilo dela?",
    options: [
      { value: "minimal", label: "Minimalista, clean", emoji: "🤍" },
      { value: "boho", label: "Boho, despojado", emoji: "🌿" },
      { value: "glam", label: "Glam, brilho, luxo", emoji: "✨" },
      { value: "alt", label: "Alternativo, fashion", emoji: "🖤" },
    ],
  },
  {
    id: "budget",
    q: "Quanto você quer investir?",
    options: [
      { value: "50", label: "Até R$ 50", emoji: "🤍" },
      { value: "100", label: "Até R$ 100", emoji: "💖" },
      { value: "300", label: "Até R$ 300", emoji: "💎" },
      { value: "999", label: "Sem limite — quero impressionar", emoji: "👑" },
    ],
  },
  {
    id: "objetivo",
    q: "Qual a missão desse presente?",
    options: [
      { value: "emocionar", label: "Fazer ela chorar de emoção", emoji: "😭" },
      { value: "surpreender", label: "Surpreender, algo único", emoji: "🎁" },
      { value: "reconciliar", label: "Pedir desculpas / reconciliar", emoji: "🥹" },
      { value: "viralizar", label: "Algo que ela mostre nos stories", emoji: "📱" },
    ],
  },
];

const CATEGORIES = [
  {
    title: "Presentes que fazem mulheres chorarem",
    emoji: "😭",
    desc: "Os campeões absolutos de reações emocionantes.",
    items: 12,
    color: "from-rose-500/30 to-rose-700/10",
  },
  {
    title: "Top que viralizaram no TikTok",
    emoji: "📱",
    desc: "Selecionados de vídeos com +1M de views.",
    items: 18,
    color: "from-fuchsia-500/30 to-purple-700/10",
  },
  {
    title: "Presentes pra salvar relacionamento",
    emoji: "💍",
    desc: "Quando o objetivo é reconciliar de verdade.",
    items: 9,
    color: "from-amber-500/30 to-orange-700/10",
  },
  {
    title: "Combinam com a personalidade dela",
    emoji: "🔮",
    desc: "IA cruzou seu quiz com a base de produtos.",
    items: 24,
    color: "from-pink-400/30 to-rose-600/10",
  },
  {
    title: "Até R$ 50 — pequenos & poderosos",
    emoji: "🤍",
    desc: "Mais barato que jantar fora. Mais impacto.",
    items: 15,
    color: "from-emerald-500/30 to-teal-700/10",
  },
  {
    title: "Premium — até R$ 300",
    emoji: "👑",
    desc: "Pra quando você quer impressionar de verdade.",
    items: 11,
    color: "from-violet-500/30 to-indigo-700/10",
  },
];

const FAKE_PRODUCTS = [
  {
    name: "Pulseira Personalizada com Coordenadas",
    price: "R$ 47,90",
    source: "Shopee",
    emoji: "💫",
    tag: "TikTok #1",
    img: "linear-gradient(135deg, #f9d6dc 0%, #ff2d6a 100%)",
  },
  {
    name: "Buquê Eterno de Rosas Encantadas",
    price: "R$ 89,90",
    source: "Amazon",
    emoji: "🌹",
    tag: "Faz chorar",
    img: "linear-gradient(135deg, #ffb1c9 0%, #d6195a 100%)",
  },
  {
    name: "Caixa Surpresa com Mensagem Secreta",
    price: "R$ 64,90",
    source: "TikTok Shop",
    emoji: "🎁",
    tag: "Viral",
    img: "linear-gradient(135deg, #f6c986 0%, #ff6a3d 100%)",
  },
  {
    name: "Diário do Casal com Capa Personalizada",
    price: "R$ 119,00",
    source: "Mercado Livre",
    emoji: "📔",
    tag: "Premium",
    img: "linear-gradient(135deg, #d6195a 0%, #2a0f2a 100%)",
  },
  {
    name: "Set Spa Aromaterapia 'Nossa Noite'",
    price: "R$ 154,90",
    source: "Amazon",
    emoji: "🕯️",
    tag: "Romântico",
    img: "linear-gradient(135deg, #f4b8a4 0%, #d49457 100%)",
  },
  {
    name: "Necessaire de Couro Bordado a Mão",
    price: "R$ 89,00",
    source: "Shopee",
    emoji: "💼",
    tag: "Único",
    img: "linear-gradient(135deg, #ff2d6a 0%, #f6c986 100%)",
  },
];

export default function PresentesClient() {
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [, setAnswers] = useState<Record<string, string>>({});
  const [unlocked, setUnlocked] = useState(false);

  const progress = useMemo(
    () => Math.round(((qIndex + 1) / QUIZ.length) * 100),
    [qIndex]
  );

  const handleAnswer = (qid: string, value: string) => {
    setAnswers((a) => ({ ...a, [qid]: value }));
    if (qIndex < QUIZ.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("loading");
      setTimeout(() => setStep("result"), 2800);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />
      <FakeNotifications />

      {/* Hero */}
      <section className="relative px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> 412 desbloqueios hoje
          </p>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            Nossa IA encontra o{" "}
            <span className="text-gradient-fire">presente perfeito</span> pra ela.
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            Selecionado em tempo real do{" "}
            <span className="text-white font-medium">TikTok Shop, Shopee, Amazon e Mercado Livre</span>.
            Sem genérico. Sem mil-folhas. Só o que faz sentido pra ela.
          </p>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative px-4 py-12"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <LiveCounter
                  label="Desbloqueios hoje"
                  base={412}
                  step={1}
                  intervalMs={5800}
                />
                <LiveCounter
                  label="Casais felizes essa semana"
                  base={2418}
                  step={2}
                  intervalMs={6500}
                />
                <LiveCounter
                  label="Match rate da IA"
                  base={94}
                  step={0}
                  intervalMs={9000}
                  suffix="%"
                  pulsing={false}
                />
              </div>

              {/* Categories preview */}
              <h2 className="font-heading text-3xl sm:text-4xl text-white text-center mb-3 tracking-tight">
                <span className="text-gradient-ember">6 categorias secretas</span>
              </h2>
              <p className="text-white/55 text-center mb-10 text-sm">
                Curadoria atualizada todos os dias por uma IA romântica.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {CATEGORIES.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-premium p-6 relative overflow-hidden"
                  >
                    <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${c.color} rounded-full blur-2xl opacity-60`} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-4xl">{c.emoji}</span>
                        <span className="pill pill-gold text-[10px]">
                          🔒 {c.items} itens
                        </span>
                      </div>
                      <h3 className="font-heading text-xl text-white mb-2 leading-tight">
                        {c.title}
                      </h3>
                      <p className="text-white/55 text-sm">{c.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep("quiz")}
                  className="btn-premium inline-flex items-center gap-2 text-lg"
                >
                  Começar curadoria personalizada →
                </button>
                <p className="text-white/45 text-xs mt-3">
                  Leva 30 segundos · Grátis fazer o quiz
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {step === "quiz" && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative px-4 py-16"
          >
            <div className="max-w-2xl mx-auto">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/60 text-sm">
                    Pergunta {qIndex + 1} de {QUIZ.length}
                  </p>
                  <p className="text-rose-300 text-sm font-semibold">
                    {progress}%
                  </p>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 tracking-tight leading-tight">
                    {QUIZ[qIndex].q}
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {QUIZ[qIndex].options.map((opt, i) => (
                      <motion.button
                        key={opt.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(QUIZ[qIndex].id, opt.value)}
                        className="card-premium px-6 py-5 text-left flex items-center gap-4 group"
                      >
                        <span className="text-3xl group-hover:scale-110 transition-transform">
                          {opt.emoji}
                        </span>
                        <span className="text-white font-medium flex-1">
                          {opt.label}
                        </span>
                        <span className="text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {step === "loading" && (
          <motion.section
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-rose-500/20 border-t-rose-500"
              />
              <span className="absolute inset-0 flex items-center justify-center text-3xl animate-heart-beat">
                ♥
              </span>
            </div>

            <div className="mt-8 text-center max-w-sm">
              <h3 className="font-heading text-2xl text-white mb-2">
                Analisando 8.412 produtos…
              </h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/55 text-sm"
              >
                Cruzando o que ela ama com presentes que viralizaram
              </motion.p>
            </div>
          </motion.section>
        )}

        {step === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative px-4 py-12"
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <p className="pill pill-gold mb-5 mx-auto">
                  ✨ Match perfeito encontrado
                </p>
                <h2 className="font-heading text-4xl sm:text-5xl text-white mb-3 tracking-tight">
                  Encontramos{" "}
                  <span className="text-gradient-fire">12 presentes</span>{" "}
                  perfeitos pra ela
                </h2>
                <p className="text-white/65">
                  Cada um selecionado especialmente baseado nas suas respostas.
                </p>
              </div>

              {/* Locked grid */}
              <div className="relative">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {FAKE_PRODUCTS.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="card-premium overflow-hidden relative"
                    >
                      <div
                        className={`aspect-square ${
                          !unlocked ? "blurred-preview" : ""
                        } flex items-center justify-center text-7xl`}
                        style={{ background: p.img }}
                      >
                        {p.emoji}
                      </div>
                      <div className={`p-4 ${!unlocked ? "blurred-preview-sm" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="pill pill-live text-[9px]">
                            {p.tag}
                          </span>
                          <span className="text-white/40 text-[10px] uppercase">
                            {p.source}
                          </span>
                        </div>
                        <p className="text-white text-sm font-medium leading-tight mb-1">
                          {p.name}
                        </p>
                        <p className="text-rose-300 font-bold text-base">
                          {p.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Paywall overlay */}
                {!unlocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="glass-premium rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 mx-auto mb-5 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(255,45,106,0.5)]">
                        🔒
                      </div>
                      <h3 className="font-heading text-3xl text-white mb-2">
                        Desbloqueie os 12 presentes
                      </h3>
                      <p className="text-white/65 text-sm mb-6 leading-relaxed">
                        Acesso vitalício aos presentes personalizados,
                        atualizados toda semana. <br />
                        <span className="text-amber-300">
                          + Bônus: lista &ldquo;TikTok Viral&rdquo; deste mês
                        </span>
                      </p>

                      <div className="flex items-baseline justify-center gap-3 mb-5">
                        <span className="text-white/40 line-through text-lg">
                          R$ 29,90
                        </span>
                        <span className="font-heading text-5xl font-bold text-gradient-fire leading-none">
                          R$ 8
                        </span>
                      </div>

                      <button
                        onClick={() => setUnlocked(true)}
                        className="btn-premium w-full text-lg mb-3"
                      >
                        Desbloquear por R$ 8 →
                      </button>

                      <p className="text-white/45 text-xs">
                        🔥 412 desbloqueios hoje · Garantia de 7 dias
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {unlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-8"
                >
                  <p className="text-emerald-400 text-sm mb-4">
                    ✓ Lista desbloqueada · Salva no seu e-mail
                  </p>
                  <button className="btn-ghost-glow">
                    Compartilhar minha curadoria
                  </button>
                </motion.div>
              )}

              {/* Social proof under products */}
              <div className="mt-12 glass rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["💕", "💖", "💗"].map((e, i) => (
                      <span
                        key={i}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 flex items-center justify-center text-sm ring-2 ring-background"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/65 text-sm">
                    <span className="text-white font-semibold">2.847</span>{" "}
                    casais usaram essa curadoria essa semana
                  </p>
                </div>
                <p className="text-amber-300 text-sm font-medium">
                  ★ ★ ★ ★ ★ 4.92 / 5
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
