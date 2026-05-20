"use client";

import { motion } from "framer-motion";

interface Props {
  name1?: string;
  name2?: string;
  date?: string;
}

export default function PreviewMockup({
  name1 = "Júlia",
  name2 = "Pedro",
  date = "12 de junho",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto"
      style={{ perspective: 1400 }}
    >
      <motion.div
        animate={{ rotateX: [0, -2, 0], rotateY: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Phone frame */}
        <div className="relative mx-auto w-[300px] sm:w-[340px] aspect-[9/19] rounded-[42px] bg-gradient-to-b from-zinc-900 to-black p-2 shadow-[0_60px_120px_-30px_rgba(255,45,106,0.55),0_30px_80px_-30px_rgba(0,0,0,0.8)] border border-white/10">
          <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-gradient-to-br from-rose-950/40 via-zinc-900 to-black">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />

            {/* Background blobs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
              <p className="text-rose-300/80 text-[10px] uppercase tracking-[0.32em] mb-3">
                EURORA LOVE
              </p>
              <h3 className="font-heading text-3xl leading-none text-white mb-1">
                {name1}
              </h3>
              <p className="text-rose-400 font-heading italic text-xl mb-1">&</p>
              <h3 className="font-heading text-3xl leading-none text-white mb-5">
                {name2}
              </h3>

              {/* Photo placeholder */}
              <div className="relative w-40 aspect-square rounded-2xl overflow-hidden mb-5 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/40 via-amber-400/30 to-rose-800/40 animate-gradient-shift" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  💑
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 w-full mb-4">
                {[
                  { v: "3", l: "anos" },
                  { v: "7", l: "meses" },
                  { v: "12", l: "dias" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="glass rounded-xl py-2 px-1 text-center"
                  >
                    <p className="text-rose-400 font-heading text-lg leading-none">
                      {s.v}
                    </p>
                    <p className="text-white/50 text-[9px] mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div className="glass rounded-xl px-3 py-2.5 mb-4 w-full">
                <p className="text-white/85 font-heading italic text-[11px] leading-snug">
                  &ldquo;Você é a paz nos meus piores dias e a festa nos
                  melhores. Pra sempre.&rdquo;
                </p>
              </div>

              {/* Music bar */}
              <div className="glass rounded-full px-3 py-2 flex items-center gap-2 w-full">
                <span className="text-green-400 text-xs">▶</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full" />
                </div>
                <span className="text-white/50 text-[9px] tabular-nums">2:14</span>
              </div>

              <p className="mt-3 text-white/40 text-[9px]">
                Surpresa de {date}
              </p>
            </div>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute inset-0 -z-10 bg-rose-600/30 blur-[80px] rounded-full pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
