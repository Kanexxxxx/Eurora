"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Couple, Theme } from "@/lib/types";
import { getRelationshipStats } from "@/lib/utils/countdown";

const THEME_STYLES: Record<Theme, { bg: string; accent: string; text: string; glow: string }> = {
  "black-luxury": { bg: "bg-black", accent: "text-rose-400", text: "text-white", glow: "glow-rose" },
  "neon-romance": { bg: "bg-[#0a001a]", accent: "text-fuchsia-400", text: "text-white", glow: "shadow-fuchsia-500/20" },
  "minimal-love": { bg: "bg-[#0d0d0b]", accent: "text-amber-400", text: "text-white", glow: "shadow-amber-500/20" },
  "velvet-dark": { bg: "bg-[#0d0005]", accent: "text-rose-300", text: "text-white", glow: "glow-rose-sm" },
};

interface Props { couple: Couple }

export default function LovePage({ couple }: Props) {
  const styles = THEME_STYLES[couple.theme];
  const stats = getRelationshipStats(couple.relationship_date);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (couple.photo_urls.length <= 1) return;
    const t = setInterval(() => setCurrentPhoto((p) => (p + 1) % couple.photo_urls.length), 5000);
    return () => clearInterval(t);
  }, [couple.photo_urls.length]);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text}`}>
      {/* Intro animation */}
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <motion.p
          className="font-heading text-3xl sm:text-4xl font-bold text-white text-gradient-rose text-center px-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {couple.person1} & {couple.person2}
        </motion.p>
      </motion.div>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative max-w-xl mx-auto px-4 py-14 sm:py-16">
        {/* Names header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <p className={`text-xs uppercase tracking-[0.3em] ${styles.accent} mb-4`}>EURORA LOVE</p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            {couple.person1}
            <span className={` ${styles.accent}`}> & </span>
            {couple.person2}
          </h1>
        </motion.div>

        {/* Photo Gallery */}
        {couple.photo_urls.length > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              {couple.photo_urls.map((url, i) => (
                <motion.img
                  key={url}
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ opacity: i === currentPhoto ? 1 : 0 }}
                  transition={{ duration: 1 }}
                />
              ))}
              {couple.photo_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {couple.photo_urls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === currentPhoto ? "bg-white w-6" : "bg-white/40 w-2"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Relationship Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          {[
            { value: stats.years, label: stats.years === 1 ? "ano" : "anos" },
            { value: stats.months, label: stats.months === 1 ? "mês" : "meses" },
            { value: stats.days, label: stats.days === 1 ? "dia" : "dias" },
          ].map(({ value, label }) => (
            <div key={label} className="glass rounded-2xl p-3 sm:p-4 text-center">
              <p className={`font-heading text-2xl sm:text-3xl font-bold ${styles.accent}`}>{value}</p>
              <p className="text-gray-400 text-xs mt-1">{label} juntos</p>
            </div>
          ))}
        </motion.div>

        {/* Message */}
        <motion.div
          className="glass rounded-3xl p-6 sm:p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
        >
          <p className={`text-xs uppercase tracking-widest ${styles.accent} mb-4`}>Mensagem</p>
          <p className="text-gray-200 leading-relaxed font-heading text-base sm:text-lg italic">
            &ldquo;{couple.message}&rdquo;
          </p>
        </motion.div>

        {/* Music */}
        {couple.music_url && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
          >
            <p className={`text-xs uppercase tracking-widest ${styles.accent} mb-4`}>Nossa Música</p>
            {couple.music_url.includes("spotify.com") ? (
              <iframe
                title="Nossa música"
                src={couple.music_url.replace("open.spotify.com/track/", "open.spotify.com/embed/track/").split("?")[0]}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-2xl"
              />
            ) : (
              <a
                href={couple.music_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 glass rounded-2xl p-4 hover:border-white/20 active:bg-white/5 transition-all"
              >
                <span className="text-2xl">🎵</span>
                <span className="text-gray-300 text-sm">Ouvir nossa música</span>
              </a>
            )}
          </motion.div>
        )}

        {/* QR Code */}
        {couple.qr_code_url && (
          <motion.div
            className="glass rounded-3xl p-6 sm:p-8 mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            <p className={`text-xs uppercase tracking-widest ${styles.accent} mb-4`}>QR Code</p>
            <div className="bg-white rounded-2xl p-4 inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={couple.qr_code_url} alt="QR Code" className="w-32 h-32 sm:w-36 sm:h-36" />
            </div>
            <p className="text-gray-500 text-xs">Escaneie para acessar esta página</p>
          </motion.div>
        )}

        {/* Share */}
        <motion.div
          className="glass rounded-3xl p-5 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <p className={`text-xs uppercase tracking-widest ${styles.accent} mb-4 text-center`}>Compartilhar</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={copy}
              className="px-5 py-2.5 glass rounded-xl text-white text-sm font-medium hover:border-white/20 active:bg-white/10 transition-all"
            >
              {copied ? "✓ Copiado!" : "Copiar Link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Olha o que criei para você 💌 " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-500 active:bg-green-700 rounded-xl text-white text-sm font-medium transition-all"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>

        <p className="text-center text-gray-700 text-xs mt-10">
          Criado com{" "}
          <Link href="/" className={`${styles.accent} hover:underline`}>EURORA LOVE</Link>
        </p>
      </main>
    </div>
  );
}
