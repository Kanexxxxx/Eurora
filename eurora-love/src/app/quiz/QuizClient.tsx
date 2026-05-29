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
    `Tenho um arquétipo secreto aqui. Descobre →\n${origin}/quiz?t=${encoded}`;

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
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Responda perguntas sobre você, gere um link e manda no WhatsApp.
            O resultado revela o <span className="text-[#ffb1c9] font-medium">arquétipo do casal</span>.
          </p>

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
            Ver meu arquétipo →
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
          <p className="text-white/50 text-xs uppercase tracking-wider mb-6">
            Com base em você, {name}...
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 0.15 }}
            className={`relative rounded-[28px] p-8 bg-linear-to-br ${archData.gradient} border border-white/10 mb-8`}
          >
            <p className="text-6xl mb-4">{archData.emoji}</p>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Seu arquétipo</p>
            <h2 className="font-heading text-3xl text-white mb-2 tracking-tight">
              {archData.name}
            </h2>
            <p className="text-white/60 text-sm italic">{archData.tagline}</p>
          </motion.div>

          <p className="text-white/55 mb-8 leading-relaxed">
            Agora vamos ver se <span className="text-[#ffb1c9] font-medium">{nick || "seu parceiro(a)"}</span> te conhece.
          </p>

          <button
            type="button"
            onClick={() => setStep("share")}
            className="btn-premium w-full text-base"
          >
            Gerar link do teste →
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
            conhece o seu arquétipo. 💕
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
function PartnerView({ encoded }: { encoded: string }) { return null; }

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
