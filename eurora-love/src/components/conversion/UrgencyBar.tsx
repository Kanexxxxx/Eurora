"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-12T19:00:00-03:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const BASE_ITEMS = [
  { icon: "🔥", text: "DIA DOS NAMORADOS" },
  { icon: "⏱️", text: "COUNTDOWN" },
  { icon: "💝", text: "Página do Amor com fotos + música + relógio ao vivo" },
  { icon: "🎁", text: "250+ presentes secretos · desbloqueio via PIX" },
  { icon: "⚡", text: "Entrega imediata após o pagamento" },
  { icon: "💌", text: "Mensagem programada para o momento certo" },
  { icon: "✨", text: "IA Romântica · cartas · poemas · letras de música" },
  { icon: "🔒", text: "Pagamento 100% seguro — PIX ou cartão" },
  { icon: "🌹", text: "A página mais bonita que ele(a) já recebeu" },
  { icon: "💘", text: "Mais de 500 casais já criaram sua página do amor" },
];

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

  const countdown = `${pad(t.d)}d ${pad(t.h)}h ${pad(t.m)}m ${pad(t.s)}s`;

  const items = BASE_ITEMS.map((item) =>
    item.icon === "⏱️"
      ? { icon: "⏱️", text: `Faltam ${countdown} para o Dia dos Namorados` }
      : item
  );

  const allItems = [...items, ...items];

  return (
    <div className="urgency-bar-bg w-full overflow-hidden relative py-2.5">
      <div className="urgency-bar-fade-left absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />
      <div className="urgency-bar-fade-right absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" />

      <div className="animate-ticker flex items-center whitespace-nowrap">
        {allItems.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-7">
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-sm">
              {item.text}
            </span>
            <span className="text-white/40 text-lg ml-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
