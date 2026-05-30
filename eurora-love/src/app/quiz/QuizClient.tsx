"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";
import FakeNotifications from "@/components/conversion/FakeNotifications";
import {
  ARCHETYPES,
  QUESTIONS,
  DIM_LABELS,
  calcArchetype,
  calcDimScores,
  getResultText,
  buildQuizDataV2,
  encodeQuiz,
  decodeQuiz,
  isV2,
  type ArchetypeId,
  type QuizData,
  type QuizDataV2,
  type CustomQ,
} from "./quiz.data";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff2d6a]/40 transition-colors";

/* ─── RadarChart ─── */
const RADAR_ANGLES = [-90, -18, 54, 126, 198].map((d) => (d * Math.PI) / 180);
const CX = 100, CY = 100, R = 75;

function radarPoint(angle: number, score: number) {
  const r = R * Math.max(score, 0.05);
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function RadarChart({
  dims,
  size = 200,
  mini = false,
}: {
  dims: [number, number, number, number, number];
  size?: number;
  mini?: boolean;
}) {
  const pts = dims.map((d, i) => radarPoint(RADAR_ANGLES[i], d));
  const filled = pts.map((p) => `${p.x},${p.y}`).join(" ");

  const outerPts = RADAR_ANGLES.map((a) => radarPoint(a, 1.0));
  const outer = outerPts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="overflow-visible"
    >
      <polygon
        points={outer}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <polygon
        points={RADAR_ANGLES.map((a) => {
          const p = radarPoint(a, 0.5);
          return `${p.x},${p.y}`;
        }).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      {outerPts.map((p, i) => (
        <line
          key={i}
          x1={CX} y1={CY}
          x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      <polygon
        points={filled}
        fill="url(#radarGrad)"
        fillOpacity="0.5"
        stroke="url(#radarStroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={mini ? 2.5 : 4}
          fill="#ff2d6a"
          fillOpacity="0.9"
        />
      ))}
      {!mini &&
        outerPts.map((p, i) => {
          const lx = CX + (R + 22) * Math.cos(RADAR_ANGLES[i]);
          const ly = CY + (R + 22) * Math.sin(RADAR_ANGLES[i]);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="8"
            >
              {DIM_LABELS[i].split("\n").map((line, li) => (
                <tspan key={li} x={lx} dy={li === 0 ? 0 : 10}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f6c986" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6a" />
          <stop offset="100%" stopColor="#ffb1c9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ════════════════════════════════
   CREATOR VIEW
════════════════════════════════ */
function CreatorView() {
  type Step = "name" | "quiz" | "custom" | "preview" | "share";
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [customQs, setCustomQs] = useState<CustomQ[]>([]);
  const [editQ, setEditQ] = useState({ q: "", opts: ["", "", "", ""], a: 0 });
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://eurora.site";

  const quizData = buildQuizDataV2(name, nick, answers, customQs);
  const encoded = step === "share" || step === "preview" ? encodeQuiz(quizData) : "";
  const arch = step === "preview" || step === "share" ? calcArchetype(answers) : "ninho" as const;
  const archData = ARCHETYPES[arch];

  const whatsappMsg =
    `Será que você me conhece mesmo? 🤔\n` +
    `Fiz um Teste do Amor sobre mim. Tenta acertar minhas respostas e ver nosso tipo de casal →\n${origin}/quiz?t=${encoded}`;

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
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
    navigator.clipboard.writeText(`${origin}/quiz?t=${encoded}`).then(() => {
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
            <span className="live-dot" /> Teste do Amor
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight leading-[0.95]">
            Ele/ela te<br />
            <span className="text-gradient-rose">conhece bem?</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Responda sobre você, mande o link para quem você ama e veja se a pessoa acerta.
            No final, o teste revela o <span className="text-[#ffb1c9] font-medium">tipo de casal</span> de vocês.
          </p>

          <div className="grid gap-2 mb-6 text-left">
            {[
              "1. Você responde 10 perguntas sobre seu jeito de amar.",
              "2. A outra pessoa tenta adivinhar suas respostas.",
              "3. O resultado mostra a sintonia e o tipo de casal de vocês.",
            ].map((text) => (
              <div key={text} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                {text}
              </div>
            ))}
          </div>

          <div className="card-premium p-6 mb-5 space-y-4">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 text-left">
                Seu nome
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você se chama?"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 text-left">
                Como você chama ele/ela?
              </label>
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Meu amor, Pedro, Lulinha…"
                className={inputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim() && nick.trim()) setStep("quiz");
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("quiz")}
            disabled={!name.trim() || !nick.trim()}
            className="btn-premium w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar meu teste →
          </button>
          <p className="mt-6 text-white/35 text-xs">
            Grátis · Sem cadastro · Link instantâneo
          </p>
        </motion.section>
      )}

      {/* ── STEP: QUIZ (10 perguntas) ── */}
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
              <p className="text-white/60 text-sm">{qIdx + 1} / {QUESTIONS.length}</p>
              <p className="text-[#ffb1c9] text-sm font-semibold">
                {Math.round(((qIdx + 1) / QUESTIONS.length) * 100)}%
              </p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                animate={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className="text-white/45 text-sm mb-2 uppercase tracking-wider">
            Sobre você, {name}
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
                {QUESTIONS[qIdx].q}
              </h2>
              <div className="space-y-3">
                {QUESTIONS[qIdx].opts.map((opt, i) => (
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

          {customQs.length > 0 && (
            <div className="space-y-3 mb-6">
              {customQs.map((cq, i) => (
                <div key={i} className="card-premium p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white/85 text-sm font-medium truncate">{cq.q}</p>
                    <p className="text-white/40 text-xs mt-1">Resposta correta: {cq.opts[cq.a]}</p>
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

          {customQs.length < 2 && (
            <div className="card-premium p-5 mb-5 space-y-3">
              <input
                value={editQ.q}
                onChange={(e) => setEditQ({ ...editQ, q: e.target.value })}
                placeholder="Sua pergunta… ex: Qual é meu prato favorito?"
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
                disabled={!editQ.q.trim() || editQ.opts.filter((o) => o.trim()).length < 2}
                className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                + Adicionar pergunta
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("preview")}
            className="btn-premium w-full text-base"
          >
            Ver meu tipo no Teste do Amor →
          </button>
        </motion.section>
      )}

      {/* ── STEP: PREVIEW (arquétipo do criador) ── */}
      {step === "preview" && (
        <motion.section
          key="preview"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
            Teste do Amor de {name}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
            Seu tipo de casal foi definido.
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Isso não é uma nota. É o perfil emocional que a outra pessoa vai tentar descobrir respondendo o seu teste.
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 0.15 }}
            className={`relative rounded-[28px] p-8 bg-linear-to-br ${archData.gradient} border border-white/10 mb-8`}
          >
            <p className="text-6xl mb-4">{archData.emoji}</p>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Seu tipo no Teste do Amor</p>
            <h2 className="font-heading text-3xl text-white mb-2 tracking-tight">
              {archData.name}
            </h2>
            <p className="text-white/60 text-sm italic">{archData.tagline}</p>
          </motion.div>

          <p className="text-white/55 mb-8 leading-relaxed">
            Agora envie para <span className="text-[#ffb1c9] font-medium">{nick || "seu parceiro(a)"}</span>.
            A pessoa vai tentar acertar suas respostas e revelar a sintonia de vocês.
          </p>

          <button
            type="button"
            onClick={() => setStep("share")}
            className="btn-premium w-full text-base"
          >
            Gerar link para responder →
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
            Manda pro {nick || "seu parceiro(a)"} e descobre se ele/ela<br className="hidden sm:block" />
            acerta seu jeito de amar. 💕
          </p>

          <div className="card-premium p-4 mb-3 flex items-center gap-3">
            <p className="text-white/45 text-xs font-mono flex-1 truncate text-left">
              {origin}/quiz?t={encoded}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-xs transition-all"
            >
              {copied ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>

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
            <p className="text-white/40 text-xs mb-3">Enquanto espera a resposta...</p>
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
  const v2 = data && isV2(data) ? data : null;

  // Monta lista de perguntas (preset v2 + custom de ambas versões)
  const presetQs = v2
    ? QUESTIONS.map((pq, i) => ({ q: pq.q, opts: pq.opts, correct: v2.q[i] ?? 0 }))
    : data
    ? [
        { q: "Qual é a minha cor favorita?", opts: ["Azul 💙","Rosa / Lilás 🌸","Verde 🌿","Preto / Branco 🖤"], correct: data.q[0] ?? 0 },
        { q: "Como prefiro passar meu fim de semana ideal?", opts: ["Em casa relaxando 🛋️","Saindo pra comer e explorar 🍕","Aventura na natureza 🌿","Com muita gente 🎉"], correct: data.q[1] ?? 0 },
        { q: "O que eu não consigo viver sem?", opts: ["Café ou chá ☕","Música 🎵","Celular 📱","Séries ou filmes 🎬"], correct: data.q[2] ?? 0 },
        { q: "Como fico quando estou com raiva?", opts: ["Fico em silêncio 😶","Falo tudo na hora 💬","Choro 😢","Me afasto por um tempo 🚶"], correct: data.q[3] ?? 0 },
        { q: "Minha maior qualidade é...", opts: ["Lealdade e honestidade","Senso de humor 😂","Cuidar dos outros ❤️","Determinação 💪"], correct: data.q[4] ?? 0 },
        { q: "O que me deixa mais feliz?", opts: ["Momentos em casal ❤️","Conquistas e vitórias 🏆","Viajar e explorar 🌍","Comida boa 🍽️"], correct: data.q[5] ?? 0 },
        { q: "Onde sonho em viajar?", opts: ["Europa (Paris, Roma...)","Praia tropical 🏖️","Japão ou Ásia 🗾","EUA (NY, Miami...)"], correct: data.q[6] ?? 0 },
        { q: "Meu gênero favorito de série ou filme?", opts: ["Romance / Drama 💕","Comédia 😂","Terror / Suspense 👻","Ação / Aventura 💥"], correct: data.q[7] ?? 0 },
      ]
    : [];

  const customQs = data
    ? data.c.map((cq) => ({ q: cq.q, opts: cq.opts, correct: cq.a }))
    : [];

  const allQuestions = [...presetQs, ...customQs];

  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white/60 mb-6">Link inválido ou corrompido.</p>
        <Link href="/quiz" className="btn-premium">Criar novo teste</Link>
      </div>
    );
  }

  const score = answers.filter((a, i) => a === allQuestions[i]?.correct).length;
  const total = allQuestions.length;

  const dimScores = v2
    ? calcDimScores(answers, v2.q)
    : ([0.5, 0.5, 0.5, 0.5, 0.5] as [number, number, number, number, number]);

  const arch: ArchetypeId = v2?.arch ?? "ninho";
  const archData = ARCHETYPES[arch];
  const partnerName = data.n;
  const nick = v2?.nick ?? "você";

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (qIdx < allQuestions.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setStep("result");
    }
  }

  // Mini-radar parcial durante o quiz (só v2)
  const partialDims = v2
    ? calcDimScores(
        [...answers, ...Array(Math.max(0, QUESTIONS.length - answers.length)).fill(-1)],
        v2.q
      )
    : ([0, 0, 0, 0, 0] as [number, number, number, number, number]);

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
            <span className="text-gradient-rose">{partnerName}</span> criou<br />
            um teste pra você!
          </h1>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Responda como você acha que {partnerName} responderia.
            No final, o teste mostra quantas você acertou e qual é o tipo de casal de vocês.
          </p>

          {/* Tipo de casal desfocado (só v2) */}
          {v2 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative mb-8"
            >
              <div
                className={`rounded-[28px] p-8 bg-linear-to-br ${archData.gradient} border border-white/10 blur-md grayscale`}
              >
                <p className="text-6xl mb-3">{archData.emoji}</p>
                <p className="font-heading text-2xl text-white">{archData.name}</p>
                <p className="text-white/60 text-sm mt-1">{archData.tagline}</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl">🔒</p>
                <p className="text-white/70 text-sm mt-2 font-medium">Responda para revelar o tipo de casal</p>
              </div>
            </motion.div>
          )}

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
              <p className="text-white/70 text-xs">Resultado divertido</p>
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
          {/* Progress + mini-radar */}
          <div className="mb-10 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/60 text-sm">{qIdx + 1} / {allQuestions.length}</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                  animate={{ width: `${((qIdx + 1) / allQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            {/* Mini-radar (só v2) */}
            {v2 && (
              <div className="shrink-0 -mt-1">
                <RadarChart dims={partialDims} size={52} mini />
              </div>
            )}
          </div>

          <p className="text-white/40 text-sm mb-2 uppercase tracking-wider">
            Sobre {partnerName}
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
          {v2 ? (
            /* ─── RESULTADO V2 (novo) ─── */
            <>
              <div className="text-center mb-6">
                <p className="pill pill-live mx-auto mb-4">
                  <span className="live-dot" /> Resultado do Teste do Amor
                </p>
                <h1 className="font-heading text-3xl sm:text-5xl text-white font-bold tracking-tight mb-3">
                  Ele/ela acertou {score} de {total}
                </h1>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  O teste compara as respostas de vocês e transforma o resultado em um tipo de casal.
                  É um jeito divertido de ver onde existe sintonia e onde ainda tem coisa para descobrir.
                </p>
              </div>

              {/* Card do Arquétipo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[36px] overflow-hidden p-px mb-6"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986] opacity-80" />
                <div className="relative rounded-[35px] bg-[#0a0710]/90 backdrop-blur-md p-8 sm:p-12 text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-4">
                    Tipo de casal de vocês
                  </p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    {archData.emoji}
                  </motion.p>
                  <h3 className="font-heading text-3xl sm:text-4xl text-white mb-2 tracking-tight">
                    {archData.name}
                  </h3>
                  <p className="text-[#ffb1c9] text-sm italic mb-3">{archData.tagline}</p>
                  <p className="text-white/45 text-xs leading-relaxed max-w-sm mx-auto mb-6">
                    Esse nome resume o clima do relacionamento de vocês com base nas respostas do Teste do Amor.
                  </p>
                  <p className="text-white/70 leading-relaxed max-w-md mx-auto text-sm sm:text-base">
                    {getResultText(arch, score, total, partnerName, nick)}
                  </p>
                </div>
              </motion.div>

              {/* Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-premium p-6 mb-6 flex flex-col items-center"
              >
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">
                  Mapa do que foi descoberto
                </p>
                <RadarChart dims={dimScores} size={220} />
                <p className="text-white/60 text-sm mt-4 font-semibold">
                  {score} de {total} respostas certas
                </p>
                <p className="text-white/35 text-xs mt-2 text-center max-w-sm">
                  Cada ponta mostra uma área do relacionamento: linguagem do amor, reação, mundo pessoal, energia e cuidado.
                </p>
              </motion.div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href={`/presentes?tipo=${archData.presentes}`}
                  className="btn-premium w-full text-base flex items-center justify-center gap-2"
                >
                  🎁 Ver presentes para {archData.name} →
                </a>
                <Link
                  href="/criar"
                  className="block text-center py-3.5 rounded-full text-white font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  💌 Criar a página de vocês →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      `Fiz o teste de ${partnerName} e descobrimos que somos "${archData.name}" 💕\n` +
                      `Acertei ${score}/${total} sobre ela/ele — e o resultado me surpreendeu.\n` +
                      `Descubra o arquétipo do seu casal também →\n${window.location.origin}/quiz`;
                    if (navigator.share) {
                      navigator.share({ title: `Somos ${archData.name}!`, text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  className="w-full py-3.5 rounded-full text-white/70 font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  📲 Compartilhar resultado
                </button>
                <Link
                  href="/quiz"
                  className="block text-center py-3 text-white/40 text-sm hover:text-white/60 transition-colors"
                >
                  Criar o teste sobre mim também →
                </Link>
              </div>
            </>
          ) : (
            /* ─── RESULTADO V1 FALLBACK (legado) ─── */
            (() => {
              const pct = total > 0 ? score / total : 0;
              const TIERS_LEGACY = [
                { min: 1.0, emoji: "💎", title: "Você me conhece de cor e salteado!", text: "Acertou tudo! Isso só prova que a gente foi feito um pro outro." },
                { min: 0.75, emoji: "🔥", title: "Você me conhece muito bem!", text: "Quase perfeito! A ligação entre vocês é real e profunda." },
                { min: 0.5, emoji: "❤️", title: "Você me conhece bastante!", text: "Mais da metade certa! Vocês têm uma boa conexão." },
                { min: 0.25, emoji: "🌱", title: "Ainda tem segredos pra descobrir!", text: "Tá chegando lá! O relacionamento de vocês ainda tem muita história pela frente." },
                { min: 0, emoji: "😄", title: "A gente ainda vai se conhecer muito!", text: "Pontuação baixa não quer dizer nada — significa que vocês têm muito pra explorar juntos." },
              ];
              const tier = TIERS_LEGACY.find((t) => pct >= t.min) ?? TIERS_LEGACY[TIERS_LEGACY.length - 1];
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-[36px] overflow-hidden p-px mb-8"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986] opacity-80" />
                  <div className="relative rounded-[35px] bg-[#0a0710]/90 backdrop-blur-md p-8 sm:p-12 text-center">
                    <p className="text-7xl mb-4">{tier.emoji}</p>
                    <p className="font-heading text-7xl sm:text-9xl font-bold animate-shimmer-text leading-none my-6">
                      {score}/{total}
                    </p>
                    <h3 className="font-heading text-2xl sm:text-3xl text-white mb-3">{tier.title}</h3>
                    <p className="text-white/65 leading-relaxed">{tier.text}</p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href="/criar" className="btn-premium inline-flex items-center gap-2">
                        💌 Criar página do amor →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })()
          )}

          {/* Gabarito (ambas versões) */}
          <p className="text-white/40 text-xs uppercase tracking-wider mb-4 text-center mt-8">
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
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      correct ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {correct ? "✓ Acertou" : "✗ Errou"}
                    </span>
                    <span className="text-white/40 text-xs">
                      Resposta de {partnerName}: {q.opts[q.correct]}
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
