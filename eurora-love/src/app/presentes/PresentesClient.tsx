"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/effects/FloatingHearts";

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

// Produtos reais com links de afiliados (Shopee, Amazon, Mercado Livre)
const PRODUCTS = [
  {
    name: "Pulseira Personalizada com Coordenadas",
    price: "R$ 47,90",
    source: "Shopee",
    emoji: "💫",
    tag: "TikTok #1",
    color: "from-rose-400 to-rose-600",
    url: "https://shopee.com.br/search?keyword=pulseira+coordenadas+personalizada",
    budget: ["50", "100"],
    objetivo: ["emocionar", "surpreender"],
  },
  {
    name: "Buquê Eterno de Rosas Encantadas",
    price: "R$ 89,90",
    source: "Mercado Livre",
    emoji: "🌹",
    tag: "Faz chorar",
    color: "from-pink-400 to-rose-600",
    url: "https://www.mercadolivre.com.br/busca?q=buque+rosas+eternas+encantadas",
    budget: ["100", "300"],
    objetivo: ["emocionar", "surpreender", "reconciliar"],
  },
  {
    name: "Caixa Surpresa Personalizada com Fotos",
    price: "R$ 64,90",
    source: "Shopee",
    emoji: "🎁",
    tag: "Viral",
    color: "from-amber-400 to-orange-500",
    url: "https://shopee.com.br/search?keyword=caixa+surpresa+fotos+personalizada",
    budget: ["50", "100"],
    objetivo: ["viralizar", "surpreender"],
  },
  {
    name: "Diário do Casal com Capa Personalizada",
    price: "R$ 119,00",
    source: "Shopee",
    emoji: "📔",
    tag: "Sentimental",
    color: "from-violet-500 to-purple-700",
    url: "https://shopee.com.br/search?keyword=diario+casal+personalizado",
    budget: ["100", "300"],
    objetivo: ["emocionar", "surpreender"],
  },
  {
    name: "Kit Spa Aromaterapia Romântico",
    price: "R$ 154,90",
    source: "Amazon",
    emoji: "🕯️",
    tag: "Romântico",
    color: "from-amber-300 to-rose-400",
    url: "https://www.amazon.com.br/s?k=kit+spa+romantico+vela+aromaterapia",
    budget: ["100", "300"],
    objetivo: ["emocionar", "reconciliar"],
  },
  {
    name: "Anel Ajustável Coração de Zircônia",
    price: "R$ 39,90",
    source: "Shopee",
    emoji: "💍",
    tag: "Clássico",
    color: "from-rose-300 to-pink-500",
    url: "https://shopee.com.br/search?keyword=anel+coracao+zirconia+ajustavel",
    budget: ["50", "100"],
    objetivo: ["emocionar", "surpreender"],
  },
  {
    name: "Quadro Personalizado Mapa Estelar",
    price: "R$ 89,00",
    source: "Shopee",
    emoji: "⭐",
    tag: "Único",
    color: "from-indigo-500 to-purple-600",
    url: "https://shopee.com.br/search?keyword=quadro+mapa+estelar+personalizado",
    budget: ["50", "100", "300"],
    objetivo: ["surpreender", "emocionar"],
  },
  {
    name: "Perfume La Vie Est Belle Lancôme",
    price: "R$ 299,00",
    source: "Amazon",
    emoji: "🌸",
    tag: "Premium",
    color: "from-pink-400 to-fuchsia-600",
    url: "https://www.amazon.com.br/s?k=la+vie+est+belle+lancome",
    budget: ["300", "999"],
    objetivo: ["emocionar", "surpreender"],
  },
  {
    name: "Joia de Pele — Colar Personalizado",
    price: "R$ 79,90",
    source: "Shopee",
    emoji: "📿",
    tag: "Tendência",
    color: "from-amber-400 to-yellow-600",
    url: "https://shopee.com.br/search?keyword=colar+personalizado+nome+inicial",
    budget: ["50", "100"],
    objetivo: ["viralizar", "surpreender"],
  },
  {
    name: "Jantar a Dois — Experiência Gastronômica",
    price: "R$ 250,00",
    source: "GetNinjas",
    emoji: "🍷",
    tag: "Experiência",
    color: "from-red-700 to-rose-900",
    url: "https://www.getninjas.com.br/para/jantar-romantico",
    budget: ["300", "999"],
    objetivo: ["emocionar", "reconciliar"],
  },
  {
    name: "Airpods Pro (2ª Geração) Apple",
    price: "R$ 1.599,00",
    source: "Amazon",
    emoji: "🎧",
    tag: "Tech love",
    color: "from-gray-400 to-gray-600",
    url: "https://www.amazon.com.br/s?k=airpods+pro+apple",
    budget: ["999"],
    objetivo: ["surpreender", "viralizar"],
  },
  {
    name: "Vela Perfumada Artesanal 'Nossa Noite'",
    price: "R$ 49,90",
    source: "Shopee",
    emoji: "🕯️",
    tag: "Aconchego",
    color: "from-orange-300 to-amber-500",
    url: "https://shopee.com.br/search?keyword=vela+perfumada+artesanal+romantica",
    budget: ["50", "100"],
    objetivo: ["emocionar", "reconciliar"],
  },
];

export default function PresentesClient() {
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = useMemo(
    () => Math.round(((qIndex + 1) / QUIZ.length) * 100),
    [qIndex]
  );

  const filteredProducts = useMemo(() => {
    if (!answers.budget) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.budget.includes(answers.budget) &&
        (!answers.objetivo || p.objetivo.includes(answers.objetivo))
    ).slice(0, 6);
  }, [answers]);

  const handleAnswer = (qid: string, value: string) => {
    const updated = { ...answers, [qid]: value };
    setAnswers(updated);
    if (qIndex < QUIZ.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("loading");
      setTimeout(() => setStep("result"), 2200);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />

      {/* Hero */}
      <section className="relative px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Curadoria personalizada
          </p>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            Nossa IA encontra o{" "}
            <span className="text-gradient-fire">presente perfeito</span> pra
            ela.
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            Curadoria real com links diretos para{" "}
            <span className="text-white font-medium">
              Shopee, Amazon e Mercado Livre
            </span>
            . Sem genérico. Só o que faz sentido pra ela.
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
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
                <span className="text-gradient-ember">
                  Responda 4 perguntas
                </span>
              </h2>
              <p className="text-white/55 mb-10 text-sm">
                Nossa curadoria filtra os melhores produtos com base no perfil
                dela.
              </p>

              <button
                onClick={() => setStep("quiz")}
                className="btn-premium inline-flex items-center gap-2 text-lg"
              >
                Começar curadoria personalizada →
              </button>
              <p className="text-white/45 text-xs mt-3">
                Leva 30 segundos · Totalmente grátis
              </p>
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
                Filtrando presentes…
              </h3>
              <p className="text-white/55 text-sm">
                Cruzando o perfil dela com nossa curadoria
              </p>
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
                  ✨ Curadoria personalizada
                </p>
                <h2 className="font-heading text-4xl sm:text-5xl text-white mb-3 tracking-tight">
                  {filteredProducts.length} presentes perfeitos pra ela
                </h2>
                <p className="text-white/65">
                  Clique em qualquer produto para abrir direto na loja.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {filteredProducts.map((p, i) => (
                  <motion.a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="card-premium overflow-hidden group block"
                  >
                    <div
                      className={`aspect-square bg-gradient-to-br ${p.color} flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500`}
                    >
                      {p.emoji}
                    </div>
                    <div className="p-4">
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
                      <p className="text-white/40 text-xs mt-2 group-hover:text-rose-300 transition-colors">
                        Ver na loja →
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep("intro");
                    setQIndex(0);
                    setAnswers({});
                  }}
                  className="btn-ghost-glow"
                >
                  Refazer o quiz
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
