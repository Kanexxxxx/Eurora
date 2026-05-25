"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FloatingHearts from "@/components/effects/FloatingHearts";

export default function SucessoClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState(true);
  const [origin] = useState(() => typeof window !== "undefined" ? window.location.origin : "");

  const pageUrl = `${origin}/${slug}`;
  const qrUrl = `/api/qrcode/${slug}`;

  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Criei+algo+especial+pra+você+💌+${encodeURIComponent(pageUrl)}`
    );
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: "Eurora Love — Pra você",
        text: "Criei algo especial pra você 💌",
        url: pageUrl,
      });
    } else {
      copy();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={confetti ? 30 : 10} />

      {/* Cinematic celebration glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8917A]/15 rounded-full blur-[140px]"
        />
      </div>

      <section className="relative px-4 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#C8917A] via-[#DCBA98] to-[#D4AF70] flex items-center justify-center shadow-[0_0_80px_rgba(200,145,122,0.5)]">
              <span className="text-5xl sm:text-6xl">💌</span>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-[#DCBA98]/50"
                animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="pill pill-gold mx-auto mb-5">
              ✨ Pagamento confirmado
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-[0.95]">
              Sua página está{" "}
              <span className="text-gradient-fire">no ar</span>
              <span className="text-[#C8917A]">.</span>
            </h1>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
              Agora é só compartilhar — e esperar a cara de quem você ama
              quando abrir.
            </p>
          </motion.div>

          {/* Link card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card-premium p-5 sm:p-6 mb-4"
          >
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
              Seu link exclusivo
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[#DCBA98] font-medium break-all text-xs sm:text-sm font-mono-romantic">
                {pageUrl}
              </p>
              <button
                onClick={copy}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/75 text-xs font-medium hover:bg-white/10 active:bg-white/15 transition-colors"
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <button
              onClick={shareWhatsApp}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={shareNative}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-[#C8917A] to-[#DCBA98] text-white text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(200,145,122,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              📲 Compartilhar
            </button>
            <Link
              href={`/${slug}`}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-[#C8917A] to-[#A8705C] text-white text-sm font-semibold shadow-[0_8px_30px_-8px_rgba(200,145,122,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-transform text-center"
            >
              💖 Ver página
            </Link>
            <a
              href={qrUrl}
              download={`qrcode-${slug}.png`}
              className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 active:bg-white/15 transition-colors text-center"
            >
              ⬇ Baixar QR
            </a>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="card-premium p-6 sm:p-7 text-center mb-8"
          >
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              QR Code premium da sua página
            </p>
            <p className="text-white/40 text-[11px] mb-5">
              Imprima e cole no seu presente, na caixinha de chocolate, na flor…
            </p>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8917A]/22 to-[#D4AF70]/22 blur-2xl rounded-3xl" />
              <div className="relative bg-white rounded-2xl p-4 inline-block shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code" className="w-40 h-40 sm:w-44 sm:h-44 mx-auto" />
              </div>
            </div>
          </motion.div>

          {/* Upsells */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
          >
            <p className="text-white/50 text-xs uppercase tracking-luxury text-center mb-5">
              Bora pra próxima surpresa?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  href: "/mensagem",
                  emoji: "⏰",
                  title: "Mensagem programada",
                  desc: "Dispara dia 12/06 às 06h",
                  bg: "from-[#C8917A]/15",
                },
                {
                  href: "/presentes",
                  emoji: "🎁",
                  title: "Presentes Secretos",
                  desc: "IA escolhe pra você",
                  bg: "from-amber-500/15",
                },
                {
                  href: "/ia",
                  emoji: "✨",
                  title: "Gerar uma carta",
                  desc: "IA Romântica premium",
                  bg: "from-fuchsia-500/15",
                },
              ].map((u) => (
                <Link
                  key={u.href}
                  href={u.href}
                  className="card-premium p-4 text-left group"
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${u.bg} to-transparent rounded-full blur-2xl`} />
                  <div className="relative">
                    <span className="text-2xl block mb-2">{u.emoji}</span>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      {u.title}
                    </p>
                    <p className="text-white/50 text-xs">{u.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-white/40 text-xs mt-10">
            Precisa de ajuda?{" "}
            <a
              href="mailto:eurora.com.br@gmail.com"
              className="text-[#DCBA98] hover:text-[#E8D5B7]"
            >
              eurora.com.br@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
