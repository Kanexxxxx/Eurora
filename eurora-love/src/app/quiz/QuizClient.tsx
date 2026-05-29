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
function CreatorView() { return null; }

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
