"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";
import FakeNotifications from "@/components/conversion/FakeNotifications";

const Q = [
  {
    q: "Quando vocês discutem, geralmente…",
    options: [
      { v: 3, l: "Conversam e resolvem na mesma hora" },
      { v: 2, l: "Ficam um pouco emburrados, mas voltam pro normal" },
      { v: 1, l: "Cada um vai pra um canto até passar" },
      { v: 0, l: "É guerra mundial 🌪️" },
    ],
  },
  {
    q: "Sobre os planos pro futuro…",
    options: [
      { v: 3, l: "Já planejamos tudo — casa, filho, viagem" },
      { v: 2, l: "Conversamos sobre algumas coisas" },
      { v: 1, l: "Vamos vivendo, sem pressa" },
      { v: 0, l: "Cada um tem o seu plano" },
    ],
  },
  {
    q: "Vocês riem juntos?",
    options: [
      { v: 3, l: "Constantemente, somos um show de comédia" },
      { v: 2, l: "Bastante, é uma das nossas linguagens" },
      { v: 1, l: "Às vezes, em ondas" },
      { v: 0, l: "Raramente" },
    ],
  },
  {
    q: "Como vocês demonstram amor no dia a dia?",
    options: [
      { v: 3, l: "Mil formas: toque, palavras, presentes, tempo" },
      { v: 2, l: "Tem nossas linguagens preferidas" },
      { v: 1, l: "Mais sutil, com gestos pequenos" },
      { v: 0, l: "Não somos muito de demonstrar" },
    ],
  },
  {
    q: "Vocês conhecem os medos um do outro?",
    options: [
      { v: 3, l: "Sim, até os mais profundos" },
      { v: 2, l: "Os principais sim" },
      { v: 1, l: "Alguns" },
      { v: 0, l: "Não muito" },
    ],
  },
  {
    q: "Confiança no relacionamento…",
    options: [
      { v: 3, l: "100% — é nossa fundação" },
      { v: 2, l: "Forte, com pequenas inseguranças" },
      { v: 1, l: "Estamos construindo" },
      { v: 0, l: "Tem furos sérios" },
    ],
  },
  {
    q: "Vocês têm rituais de casal?",
    options: [
      { v: 3, l: "Vários — séries, comidinhas, datas, lugares" },
      { v: 2, l: "Alguns que amamos" },
      { v: 1, l: "Estamos criando aos poucos" },
      { v: 0, l: "Cada um na sua" },
    ],
  },
  {
    q: "Você sente que pode ser 100% vulnerável com ele/ela?",
    options: [
      { v: 3, l: "Sim, totalmente" },
      { v: 2, l: "Quase sempre" },
      { v: 1, l: "Em algumas coisas" },
      { v: 0, l: "Não muito" },
    ],
  },
  {
    q: "Sexualmente, vocês estão…",
    options: [
      { v: 3, l: "Em fogo total, conexão absurda" },
      { v: 2, l: "Bem, com altos e baixos" },
      { v: 1, l: "Em fase morna" },
      { v: 0, l: "Distantes" },
    ],
  },
  {
    q: "Imagina os dois daqui 10 anos. Você vê…",
    options: [
      { v: 3, l: "A gente junto, melhor que hoje" },
      { v: 2, l: "Provavelmente juntos" },
      { v: 1, l: "Não sei dizer" },
      { v: 0, l: "Honestamente, não sei" },
    ],
  },
];

const RESULT_TIERS = [
  {
    min: 27,
    title: "Almas gêmeas confirmadas",
    emoji: "💎",
    color: "from-rose-500 via-fuchsia-400 to-amber-300",
    headline: "Um match raro. Daqueles que ninguém quer perder.",
    body:
      "Vocês têm uma sintonia que poucos casais alcançam. A confiança, o riso e os planos compartilhados formam uma base praticamente indestrutível. Cuide disso como cuida-se de um tesouro: pequenos gestos, todos os dias.",
    cta: "Crie a página do amor pra eternizar isso",
  },
  {
    min: 20,
    title: "Casal real, conexão forte",
    emoji: "🔥",
    color: "from-rose-500 via-rose-400 to-amber-400",
    headline: "Vocês têm o que importa. E muito espaço pra ficar ainda melhor.",
    body:
      "Existe afeto, há química e há projeto. Algumas áreas precisam de carinho extra — comunicação ou tempo de qualidade — e isso é absolutamente normal. Investir um pouco agora pode levar vocês ao próximo nível.",
    cta: "Programar uma mensagem mágica pra ele/ela",
  },
  {
    min: 12,
    title: "Em construção",
    emoji: "🌱",
    color: "from-amber-400 via-rose-400 to-fuchsia-400",
    headline: "Está nascendo algo. Precisa de água e luz pra crescer.",
    body:
      "Tem peças se encaixando, mas ainda tem distâncias importantes pra ajustar. Conversas francas, planos compartilhados e demonstrações concretas de afeto vão fazer milagre. Não desista cedo — relacionamentos sólidos quase sempre começam aqui.",
    cta: "Gerar uma carta romântica com a IA",
  },
  {
    min: 0,
    title: "Atenção necessária",
    emoji: "🚧",
    color: "from-rose-700 via-rose-500 to-amber-500",
    headline: "Vocês merecem mais. Bora trabalhar nisso?",
    body:
      "Os sinais mostram que algo importante precisa de atenção: confiança, vulnerabilidade ou projeto. Não é sentença — é diagnóstico. Casais que se importam o suficiente pra fazer um teste como esse já estão na frente. O próximo passo é uma conversa real e gestos concretos.",
    cta: "Salvar o relacionamento com presentes secretos",
  },
];

export default function QuizClient() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const total = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers]);
  const max = Q.length * 3;
  const pct = Math.round((total / max) * 100);

  const tier =
    RESULT_TIERS.find((t) => total >= t.min) ?? RESULT_TIERS[RESULT_TIERS.length - 1];

  const handleAnswer = (v: number) => {
    const next = [...answers, v];
    setAnswers(next);
    if (qIndex < Q.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("result");
    }
  };

  const restart = () => {
    setStep("intro");
    setQIndex(0);
    setAnswers([]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />
      <FakeNotifications />

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative px-4 pt-12 pb-20"
          >
            <div className="max-w-3xl mx-auto text-center">
              <p className="pill pill-live mb-6 mx-auto">
                <span className="live-dot" /> +210.000 casais testaram
              </p>

              <h1 className="font-heading text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight leading-[0.95]">
                <span className="text-gradient-rose">Teste do Amor</span>
                <span className="text-rose-400 font-heading italic">.</span>
              </h1>

              <p className="text-white/65 text-lg sm:text-xl mb-8 leading-relaxed">
                10 perguntas. 2 minutos. Um diagnóstico real e brutalmente
                honesto do que vocês têm — com card compartilhável e mapa do
                casal.
              </p>

              <div className="card-premium p-6 mb-8 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                      Você
                    </label>
                    <input
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                      Ele/Ela
                    </label>
                    <input
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      placeholder="Nome de quem você ama"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-center"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("quiz")}
                disabled={!name1.trim() || !name2.trim()}
                className="btn-premium inline-flex items-center gap-2 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Começar agora →
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 text-white/45 text-xs">
                <span>★ ★ ★ ★ ★ 4.94 / 5</span>
                <span>•</span>
                <span>100% anônimo</span>
                <span>•</span>
                <span>Resultado em 2 min</span>
              </div>
            </div>
          </motion.section>
        )}

        {step === "quiz" && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative px-4 pt-12 pb-20"
          >
            <div className="max-w-2xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/60 text-sm">
                    {qIndex + 1} / {Q.length}
                  </p>
                  <p className="text-rose-300 text-sm font-semibold">
                    {Math.round(((qIndex + 1) / Q.length) * 100)}%
                  </p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${((qIndex + 1) / Q.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 tracking-tight leading-tight">
                    {Q[qIndex].q}
                  </h2>

                  <div className="space-y-3">
                    {Q[qIndex].options.map((opt, i) => (
                      <motion.button
                        key={opt.l}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(opt.v)}
                        className="card-premium w-full text-left px-6 py-4 text-white/85 font-medium"
                      >
                        {opt.l}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {step === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative px-4 pt-12 pb-20"
          >
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[36px] overflow-hidden p-px"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-90 animate-gradient-shift`} />
                <div className="relative rounded-[35px] bg-[#0a0710]/85 backdrop-blur-md p-8 sm:p-12 text-center">
                  <p className="text-white/60 text-xs uppercase tracking-luxury mb-6">
                    Resultado oficial
                  </p>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-7xl mb-6"
                  >
                    {tier.emoji}
                  </motion.div>

                  <p className="font-heading text-2xl text-white/90 mb-2">
                    {name1 || "Você"}{" "}
                    <span className="text-rose-300 italic">&</span>{" "}
                    {name2 || "Par"}
                  </p>

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="my-8"
                  >
                    <p className="font-heading text-7xl sm:text-9xl font-bold animate-shimmer-text leading-none">
                      {pct}%
                    </p>
                    <p className="text-white/60 text-sm mt-2 uppercase tracking-wider">
                      de match real
                    </p>
                  </motion.div>

                  <h3 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
                    {tier.title}
                  </h3>
                  <p className="text-rose-200 text-lg mb-6">{tier.headline}</p>
                  <p className="text-white/65 leading-relaxed max-w-xl mx-auto">
                    {tier.body}
                  </p>

                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/criar"
                      className="btn-premium inline-flex items-center gap-2"
                    >
                      {tier.cta} →
                    </Link>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `${name1} & ${name2} — ${pct}% de match`,
                            text: `Acabamos de fazer o Teste do Amor e deu ${pct}% 💕`,
                            url: window.location.href,
                          });
                        }
                      }}
                      className="btn-ghost-glow inline-flex items-center gap-2"
                    >
                      📲 Compartilhar resultado
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Detail breakdown */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Sintonia", value: Math.min(100, pct + 4), emoji: "🎯" },
                  { label: "Vulnerabilidade", value: Math.min(100, pct - 2), emoji: "🫂" },
                  { label: "Projeto de futuro", value: Math.min(100, pct + 1), emoji: "🌅" },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="card-premium p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="font-heading text-2xl text-gradient-fire">
                        {m.value}%
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{m.label}</p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={restart}
                  className="text-white/55 hover:text-white text-sm underline underline-offset-4"
                >
                  Fazer o teste de novo
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
