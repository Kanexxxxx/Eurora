"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POOL = [
  { name: "Lucas, SP",    action: "criou uma página do amor agora",          emoji: "💌" },
  { name: "Maria, MG",    action: "desbloqueou os Presentes Secretos",        emoji: "🎁" },
  { name: "João, RJ",     action: "agendou uma mensagem para 12 de junho",    emoji: "⏰" },
  { name: "Beatriz, RS",  action: "fez o Teste do Parceiro: 94% de match",   emoji: "🔮" },
  { name: "Pedro, BA",    action: "gerou um poema com a IA Romântica",        emoji: "✨" },
  { name: "Camila, PR",   action: "comprou o plano Premium",                  emoji: "👑" },
  { name: "Rafael, CE",   action: "colou o QR code numa caixa de bombons",   emoji: "💍" },
  { name: "Ana, DF",      action: "chorou ao escanear o QR code",             emoji: "😭" },
  { name: "Mateus, SC",   action: "virou viral no TikTok com a página",       emoji: "📱" },
  { name: "Larissa, GO",  action: "presenteou o ex com uma carta de IA",     emoji: "🥹" },
  { name: "Felipe, AM",   action: "programou a mensagem do pedido de namoro", emoji: "💎" },
  { name: "Juliana, PE",  action: "criou a bio do casal pro Instagram",       emoji: "💕" },
];

interface Props {
  position?: "bottom-left" | "bottom-right";
  intervalMs?: number;
}

export default function FakeNotifications({
  position = "bottom-left",
  intervalMs = 7500,
}: Props) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setShow(true), 3500);
    const cycle = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % POOL.length);
        setShow(true);
      }, 700);
    }, intervalMs);
    return () => {
      clearTimeout(start);
      clearInterval(cycle);
    };
  }, [intervalMs]);

  const item = POOL[index];
  const positionClass =
    position === "bottom-left"
      ? "bottom-4 left-4 md:bottom-6 md:left-6"
      : "bottom-4 right-4 md:bottom-6 md:right-6";

  return (
    <div className={`fixed ${positionClass} z-40 pointer-events-none safe-bottom`}>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-premium pl-3 pr-5 py-3 rounded-2xl flex items-center gap-3 max-w-[300px] shadow-2xl"
          >
            <div className="relative">
              <span className="text-2xl">{item.emoji}</span>
              <span className="absolute -top-1 -right-1 live-dot" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold leading-tight">
                {item.name}
              </p>
              <p className="text-white/65 text-xs leading-tight mt-0.5">
                {item.action}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
