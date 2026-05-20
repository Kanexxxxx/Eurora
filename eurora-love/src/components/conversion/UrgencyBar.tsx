"use client";

import { useEffect, useState } from "react";

// Counts down to Valentine's Day in Brazil (June 12, 2026)
const TARGET = new Date("2026-06-12T19:00:00-03:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function UrgencyBar() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium animate-gradient-shift relative overflow-hidden">
      <span className="absolute inset-0 animate-shimmer-bg pointer-events-none" />
      <span className="relative">
        🔥 OFERTA DIA DOS NAMORADOS — termina em{" "}
        <strong className="font-mono-romantic tabular-nums">
          {pad(t.d)}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
        </strong>{" "}
        · Use o cupom <strong className="tracking-wider">AMOR50</strong> ➜ 50% OFF
      </span>
    </div>
  );
}
