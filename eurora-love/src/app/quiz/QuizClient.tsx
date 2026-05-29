"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";
import FakeNotifications from "@/components/conversion/FakeNotifications";

/* ─── Types ─── */
type CustomQ = { q: string; opts: string[]; a: number };
type QuizData = { n: string; q: number[]; c: CustomQ[] };

/* ─── Preset questions (about the creator) ─── */
const PRESET = [
  {
    q: "Qual é a minha cor favorita?",
    opts: ["Azul 💙", "Rosa / Lilás 🌸", "Verde 🌿", "Preto / Branco 🖤"],
  },
  {
    q: "Como prefiro passar meu fim de semana ideal?",
    opts: ["Em casa relaxando 🛋️", "Saindo pra comer e explorar 🍕", "Aventura na natureza 🌿", "Com muita gente 🎉"],
  },
  {
    q: "O que eu não consigo viver sem?",
    opts: ["Café ou chá ☕", "Música 🎵", "Celular 📱", "Séries ou filmes 🎬"],
  },
  {
    q: "Como fico quando estou com raiva?",
    opts: ["Fico em silêncio 😶", "Falo tudo na hora 💬", "Choro 😢", "Me afasto por um tempo 🚶"],
  },
  {
    q: "Minha maior qualidade é...",
    opts: ["Lealdade e honestidade", "Senso de humor 😂", "Cuidar dos outros ❤️", "Determinação 💪"],
  },
  {
    q: "O que me deixa mais feliz?",
    opts: ["Momentos em casal ❤️", "Conquistas e vitórias 🏆", "Viajar e explorar 🌍", "Comida boa 🍽️"],
  },
  {
    q: "Onde sonho em viajar?",
    opts: ["Europa (Paris, Roma...)", "Praia tropical 🏖️", "Japão ou Ásia 🗾", "EUA (NY, Miami...)"],
  },
  {
    q: "Meu gênero favorito de série ou filme?",
    opts: ["Romance / Drama 💕", "Comédia 😂", "Terror / Suspense 👻", "Ação / Aventura 💥"],
  },
];

/* ─── Result tiers (partner score) ─── */
const TIERS = [
  {
    min: 1.0,
    emoji: "💎",
    title: "Você me conhece de cor e salteado!",
    text: "Acertou tudo! Isso só prova que a gente foi feito um pro outro. Nada passa por você.",
  },
  {
    min: 0.75,
    emoji: "🔥",
    title: "Você me conhece muito bem!",
    text: "Quase perfeito! A ligação entre vocês é real e profunda. Que casal incrível.",
  },
  {
    min: 0.5,
    emoji: "❤️",
    title: "Você me conhece bastante!",
    text: "Mais da metade certa! Vocês têm uma boa conexão — e ainda tem muito pra descobrir juntos.",
  },
  {
    min: 0.25,
    emoji: "🌱",
    title: "Ainda tem segredos pra descobrir!",
    text: "Tá chegando lá! O relacionamento de vocês ainda tem muita história pela frente.",
  },
  {
    min: 0,
    emoji: "😄",
    title: "A gente ainda vai se conhecer muito!",
    text: "Pontuação baixa não quer dizer nada — significa que vocês têm muito pra explorar juntos ainda.",
  },
];

/* ─── Encode / decode (UTF-8 safe base64url) ─── */
function encodeQuiz(data: QuizData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decodeQuiz(s: string): QuizData | null {
  try {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as QuizData;
  } catch {
    return null;
  }
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff2d6a]/40 transition-colors";

/* ════════════════════════════════
   CREATOR VIEW
════════════════════════════════ */
function CreatorView() {
  type Step = "name" | "preset" | "custom" | "share";
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [presetIdx, setPresetIdx] = useState(0);
  const [presetAnswers, setPresetAnswers] = useState<number[]>([]);
  const [customQs, setCustomQs] = useState<CustomQ[]>([]);
  const [editQ, setEditQ] = useState({ q: "", opts: ["", "", "", ""], a: 0 });
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://eurora.site";
  const quizData: QuizData = { n: name, q: presetAnswers, c: customQs };
  const encoded = step === "share" ? encodeQuiz(quizData) : "";
  const shareUrl = `${origin}/quiz?t=${encoded}`;
  const whatsappMsg = `${name} criou um teste especial pra você! 💕\nVocê me conhece bem? Prove! 👇\n${shareUrl}`;

  function handlePresetAnswer(idx: number) {
    const next = [...presetAnswers, idx];
    setPresetAnswers(next);
    if (presetIdx < PRESET.length - 1) {
      setPresetIdx((i) => i + 1);
    } else {
      setStep("custom");
    }
  }

  function addCustomQ() {
    const validOpts = editQ.opts.filter((o) => o.trim());
    if (!editQ.q.trim() || validOpts.length < 2) return;
    const finalOpts = editQ.opts.filter((o) => o.trim());
    setCustomQs([...customQs, { q: editQ.q.trim(), opts: finalOpts, a: Math.min(editQ.a, finalOpts.length - 1) }]);
    setEditQ({ q: "", opts: ["", "", "", ""], a: 0 });
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <AnimatePresence mode="wait">
      {/* ── STEP: NAME ── */}
      {step === "name" && (
        <motion.section
          key="name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Novo · Teste do Parceiro
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight leading-[0.95]">
            Ele/ela te<br />
            <span className="text-gradient-rose">conhece bem?</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Responda perguntas sobre você, gere um link e manda no WhatsApp.
            Seu parceiro vai tentar acertar — e você descobre tudo.
          </p>

          <div className="card-premium p-6 mb-5">
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 text-left">
              Seu nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como você se chama?"
              className={inputClass}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("preset")}
            />
          </div>

          <button
            type="button"
            onClick={() => setStep("preset")}
            disabled={!name.trim()}
            className="btn-premium w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar meu teste →
          </button>

          <p className="mt-6 text-white/35 text-xs">
            Grátis · Sem cadastro · Link instantâneo
          </p>
        </motion.section>
      )}

      {/* ── STEP: PRESET QUESTIONS ── */}
      {step === "preset" && (
        <motion.section
          key="preset"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative px-4 pt-12 pb-20 max-w-2xl mx-auto"
        >
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-sm">{presetIdx + 1} / {PRESET.length}</p>
              <p className="text-[#ffb1c9] text-sm font-semibold">
                {Math.round(((presetIdx + 1) / PRESET.length) * 100)}%
              </p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                animate={{ width: `${((presetIdx + 1) / PRESET.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className="text-white/45 text-sm mb-2 uppercase tracking-wider">
            Sobre você, {name}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={presetIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 leading-tight tracking-tight">
                {PRESET[presetIdx].q}
              </h2>
              <div className="space-y-3">
                {PRESET[presetIdx].opts.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handlePresetAnswer(i)}
                    className="card-premium w-full text-left px-6 py-4 text-white/85 font-medium"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}

      {/* ── STEP: CUSTOM QUESTIONS ── */}
      {step === "custom" && (
        <motion.section
          key="custom"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-12 pb-24 max-w-xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">✨</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
              Quer adicionar perguntas suas?
            </h2>
            <p className="text-white/50 text-sm">
              Opcional — até 2 perguntas personalizadas sobre você.
            </p>
          </div>

          {/* Perguntas adicionadas */}
          {customQs.length > 0 && (
            <div className="space-y-3 mb-6">
              {customQs.map((cq, i) => (
                <div key={i} className="card-premium p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white/85 text-sm font-medium truncate">{cq.q}</p>
                    <p className="text-white/40 text-xs mt-1">
                      Resposta correta: {cq.opts[cq.a]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomQs(customQs.filter((_, j) => j !== i))}
                    className="shrink-0 text-white/30 hover:text-white/70 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulário de nova pergunta */}
          {customQs.length < 2 && (
            <div className="card-premium p-5 mb-5 space-y-3">
              <input
                value={editQ.q}
                onChange={(e) => setEditQ({ ...editQ, q: e.target.value })}
                placeholder="Sua pergunta... ex: Qual é meu prato favorito?"
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-2">
                {editQ.opts.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const next = [...editQ.opts];
                      next[i] = e.target.value;
                      setEditQ({ ...editQ, opts: next });
                    }}
                    placeholder={`Opção ${String.fromCharCode(65 + i)}${i < 2 ? " *" : ""}`}
                    className={inputClass + " text-sm"}
                  />
                ))}
              </div>

              {/* Resposta correta */}
              <div>
                <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">
                  Qual é a resposta certa?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {editQ.opts.map((opt, i) =>
                    opt.trim() ? (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setEditQ({ ...editQ, a: i })}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          editQ.a === i
                            ? "bg-[#ff2d6a] text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}: {opt.trim().slice(0, 18)}
                      </button>
                    ) : null
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={addCustomQ}
                disabled={
                  !editQ.q.trim() ||
                  editQ.opts.filter((o) => o.trim()).length < 2
                }
                className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                + Adicionar pergunta
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("share")}
            className="btn-premium w-full text-base"
          >
            {customQs.length === 0 ? "Pular e gerar link →" : "Gerar link do teste →"}
          </button>
        </motion.section>
      )}

      {/* ── STEP: SHARE ── */}
      {step === "share" && (
        <motion.section
          key="share"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-12 pb-24 max-w-xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            className="text-6xl mb-5"
          >
            🎉
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
            Teste criado, {name}!
          </h2>
          <p className="text-white/55 mb-8 leading-relaxed">
            Manda pro seu parceiro(a) e descobre o quanto<br className="hidden sm:block" /> ele/ela te conhece. 💕
          </p>

          {/* Link */}
          <div className="card-premium p-4 mb-3 flex items-center gap-3">
            <p className="text-white/45 text-xs font-mono flex-1 truncate text-left">
              {shareUrl}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-xs transition-all"
            >
              {copied ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium w-full text-base flex items-center justify-center gap-2 mb-4"
          >
            <span>📲</span> Enviar no WhatsApp
          </a>

          <p className="text-white/30 text-xs">
            O link já contém o teste completo — sem cadastro nem conta.
          </p>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-white/40 text-xs mb-3">
              Enquanto espera a resposta...
            </p>
            <Link href="/criar" className="btn-ghost-glow inline-flex items-center gap-2 text-sm">
              💌 Criar página do amor →
            </Link>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════
   PARTNER VIEW
════════════════════════════════ */
function PartnerView({ encoded }: { encoded: string }) {
  const data = decodeQuiz(encoded);

  const allQuestions = data
    ? [
        ...PRESET.map((p, i) => ({
          q: p.q,
          opts: p.opts,
          correct: data.q[i] ?? 0,
        })),
        ...data.c.map((cq) => ({
          q: cq.q,
          opts: cq.opts,
          correct: cq.a,
        })),
      ]
    : [];

  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white/60 mb-6">Link inválido ou corrompido.</p>
        <Link href="/quiz" className="btn-premium">
          Criar novo teste
        </Link>
      </div>
    );
  }

  const score = answers.filter((a, i) => a === allQuestions[i]?.correct).length;
  const total = allQuestions.length;
  const pct = total > 0 ? score / total : 0;
  const tier = TIERS.find((t) => pct >= t.min) ?? TIERS[TIERS.length - 1];

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (qIdx < allQuestions.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setStep("result");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {/* ── INTRO ── */}
      {step === "intro" && (
        <motion.section
          key="intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <span className="text-6xl block mb-6">💌</span>
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Teste especial pra você
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            <span className="text-gradient-rose">{data.n}</span> criou<br />
            um teste pra você!
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            {data.n} respondeu perguntas sobre si mesmo(a).
            Agora é sua vez — você conhece bem essa pessoa?
          </p>

          <div className="card-premium p-5 mb-8 grid grid-cols-3 divide-x divide-white/5">
            <div className="text-center px-2">
              <p className="text-2xl mb-1">🧠</p>
              <p className="text-white/70 text-xs">{allQuestions.length} perguntas</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl mb-1">⏱️</p>
              <p className="text-white/70 text-xs">~2 minutos</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl mb-1">💕</p>
              <p className="text-white/70 text-xs">100% revelador</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("quiz")}
            className="btn-premium w-full text-lg"
          >
            Começar o teste →
          </button>
        </motion.section>
      )}

      {/* ── QUIZ ── */}
      {step === "quiz" && (
        <motion.section
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative px-4 pt-12 pb-20 max-w-2xl mx-auto"
        >
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-sm">{qIdx + 1} / {allQuestions.length}</p>
              <p className="text-[#ffb1c9] text-sm font-semibold">
                {Math.round(((qIdx + 1) / allQuestions.length) * 100)}%
              </p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                animate={{ width: `${((qIdx + 1) / allQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className="text-white/40 text-sm mb-2 uppercase tracking-wider">
            Sobre {data.n}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 leading-tight tracking-tight">
                {allQuestions[qIdx].q}
              </h2>
              <div className="space-y-3">
                {allQuestions[qIdx].opts.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(i)}
                    className="card-premium w-full text-left px-6 py-4 text-white/85 font-medium"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}

      {/* ── RESULT ── */}
      {step === "result" && (
        <motion.section
          key="result"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-12 pb-24 max-w-3xl mx-auto"
        >
          {/* Score card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[36px] overflow-hidden p-px mb-8"
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986] opacity-80" />
            <div className="relative rounded-[35px] bg-[#0a0710]/90 backdrop-blur-md p-8 sm:p-12 text-center">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-6">
                Resultado final
              </p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-7xl mb-4"
              >
                {tier.emoji}
              </motion.div>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="my-6"
              >
                <p className="font-heading text-7xl sm:text-9xl font-bold animate-shimmer-text leading-none">
                  {score}/{total}
                </p>
                <p className="text-white/55 text-sm mt-2 uppercase tracking-wider">
                  acertos sobre {data.n}
                </p>
              </motion.div>

              <h3 className="font-heading text-2xl sm:text-3xl text-white mb-3 tracking-tight">
                {tier.title}
              </h3>
              <p className="text-white/65 leading-relaxed max-w-md mx-auto">
                {tier.text}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/criar" className="btn-premium inline-flex items-center gap-2">
                  💌 Criar página do amor →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Fiz o teste de ${data.n} e acertei ${score}/${total}! 💕\nFaz o seu também → ${window.location.origin}/quiz`;
                    if (navigator.share) {
                      navigator.share({ title: `Acertei ${score}/${total} sobre ${data.n}!`, text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  className="btn-ghost-glow inline-flex items-center gap-2"
                >
                  📲 Compartilhar resultado
                </button>
              </div>
            </div>
          </motion.div>

          {/* Gabarito */}
          <p className="text-white/40 text-xs uppercase tracking-wider mb-4 text-center">
            Gabarito completo
          </p>
          <div className="space-y-3">
            {allQuestions.map((q, i) => {
              const correct = answers[i] === q.correct;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                  className="card-premium p-4"
                >
                  <p className="text-white/75 text-sm font-medium mb-2">{q.q}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        correct
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {correct ? "✓ Acertou" : "✗ Errou"}
                    </span>
                    <span className="text-white/40 text-xs">
                      Resposta de {data.n}: {q.opts[q.correct]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════
   SHELL (detects creator vs partner)
════════════════════════════════ */
function QuizInner() {
  const params = useSearchParams();
  const t = params.get("t");
  return t ? <PartnerView encoded={t} /> : <CreatorView />;
}

export default function QuizClient() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />
      <FakeNotifications />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-white/40">Carregando...</p>
          </div>
        }
      >
        <QuizInner />
      </Suspense>
    </main>
  );
}
