"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  label: string;
  base: number;
  /** Min ms between increments */
  intervalMs?: number;
  /** Max +increment per tick */
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  pulsing?: boolean;
}

export default function LiveCounter({
  label,
  base,
  intervalMs = 4200,
  step = 3,
  prefix = "",
  suffix = "",
  className = "",
  pulsing = true,
}: Props) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    const t = setInterval(
      () => setValue((v) => v + Math.max(1, Math.floor(Math.random() * step))),
      intervalMs + Math.random() * 1500
    );
    return () => clearInterval(t);
  }, [intervalMs, step]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {pulsing && <span className="live-dot" aria-hidden />}
      <div>
        <motion.p
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-heading text-2xl md:text-3xl font-bold text-white"
        >
          {prefix}
          {value.toLocaleString("pt-BR")}
          {suffix}
        </motion.p>
        <p className="text-white/50 text-[11px] uppercase tracking-wider mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}
