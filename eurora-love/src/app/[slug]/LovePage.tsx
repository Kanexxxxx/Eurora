"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Couple, Theme } from "@/lib/types";
import type { MusicMeta } from "./page";

const THEME_STYLES: Record<Theme, { bg: string; accent: string; text: string; accentHex: string }> = {
  "black-luxury": { bg: "bg-black", accent: "text-rose-400", text: "text-white", accentHex: "#fb7185" },
  "neon-romance": { bg: "bg-[#0a001a]", accent: "text-fuchsia-400", text: "text-white", accentHex: "#e879f9" },
  "minimal-love": { bg: "bg-[#0d0d0b]", accent: "text-amber-400", text: "text-white", accentHex: "#fbbf24" },
  "velvet-dark": { bg: "bg-[#0d0005]", accent: "text-rose-300", text: "text-white", accentHex: "#fda4af" },
};

const WAVEFORM = [6, 10, 8, 14, 5, 12, 7, 13];

function formatSinceDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `DESDE ${month}.${year}`;
}

function calcDaysTogether(dateStr: string): { days: number; months: number; years: number } {
  const start = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return { days, months, years };
}

function calcNextAnniversary(dateStr: string): { days: number; label: string } {
  const start = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  const nextAnn = thisYear <= now ? new Date(now.getFullYear() + 1, start.getMonth(), start.getDate()) : thisYear;
  const diffMs = nextAnn.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const month = nextAnn.toLocaleDateString("pt-BR", { month: "long" });
  return { days, label: `${nextAnn.getDate()} de ${month}` };
}

interface Props {
  couple: Couple;
  musicMeta?: MusicMeta | null;
}

export default function LovePage({ couple, musicMeta }: Props) {
  const styles = THEME_STYLES[couple.theme];
  const [copied, setCopied] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [together, setTogether] = useState({ days: 0, months: 0, years: 0 });
  const [nextAnn, setNextAnn] = useState({ days: 0, label: "" });
  const [musicExpanded, setMusicExpanded] = useState(false);

  const galleryPhotos = couple.photo_urls.length > 1 ? couple.photo_urls.slice(1) : [];

  useEffect(() => {
    if (couple.photo_urls.length <= 1) return;
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % couple.photo_urls.length),
      5000
    );
    return () => clearInterval(t);
  }, [couple.photo_urls.length]);

  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date())
      );
      setTogether(calcDaysTogether(couple.relationship_date));
      setNextAnn(calcNextAnniversary(couple.relationship_date));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [couple.relationship_date]);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const sinceLabel = formatSinceDate(couple.relationship_date);

  const spotifyEmbedUrl = couple.music_url?.includes("spotify.com/track/")
    ? couple.music_url.replace("open.spotify.com/track/", "open.spotify.com/embed/track/").split("?")[0]
    : null;

  const hasMusicMeta = musicMeta && musicMeta.albumArt;

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text}`}>
      {/* Intro overlay */}
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <motion.p
          className="font-heading text-3xl sm:text-4xl font-bold text-white text-center px-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {couple.person1} & {couple.person2}
        </motion.p>
      </motion.div>

      <main className="relative max-w-sm mx-auto">

        {/* Hero photo — bigger: 80svh */}
        <motion.div
          className="relative w-full overflow-hidden"
          style={{ height: "80svh", minHeight: 480 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {couple.photo_urls.length > 0 ? (
            <AnimatePresence initial={false}>
              <motion.img
                key={heroIdx}
                src={couple.photo_urls[heroIdx]}
                alt={`Foto ${heroIdx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }}
              />
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />

          {/* Top bar: real clock + EURORA label + music pill */}
          <div className="absolute top-0 left-0 right-0 px-5 pt-5 flex items-start justify-between z-10">
            <p className="text-[11px] font-bold text-white/80 tabular-nums">{currentTime}</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60 font-medium">EURORA · LOVE</p>
            <div className="w-10" />
          </div>

          {/* Music pill — Dynamic Island style */}
          {hasMusicMeta && (
            <motion.button
              type="button"
              onClick={() => setMusicExpanded((v) => !v)}
              aria-expanded={musicExpanded}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/10 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={musicMeta!.albumArt}
                alt="Capa do álbum"
                className="w-5 h-5 rounded-[5px] object-cover"
              />
              <span className="text-white text-[11px] font-medium max-w-[120px] truncate">
                {musicMeta!.title}
              </span>
              <div className="flex items-end gap-[2px]">
                {WAVEFORM.slice(0, 5).map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full bg-[#2f9ee9]"
                    animate={{ height: [h * 0.4, h * 0.85, h * 0.5] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
                    style={{ minHeight: 2, maxHeight: 10 }}
                  />
                ))}
              </div>
            </motion.button>
          )}

          {/* Photo dots */}
          {couple.photo_urls.length > 1 && (
            <div className="absolute bottom-[105px] left-0 right-0 flex justify-center gap-1.5">
              {couple.photo_urls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIdx(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === heroIdx ? "w-5 bg-white" : "w-1.5 bg-white/35"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Names + date */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-6 pb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2 }}
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/55 mb-3 font-medium">
              {sinceLabel}
            </p>
            <h1 className="font-heading text-5xl font-bold leading-[1.05] text-white">
              {couple.person1}
              <br />
              <span className={`text-3xl font-light ${styles.accent}`}>&</span>
              <br />
              {couple.person2}
            </h1>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="px-5 pt-8 pb-10 space-y-6">

          {/* Live stats strip */}
          <motion.div
            className="grid grid-cols-3 gap-2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <div className="rounded-2xl bg-white/5 border border-white/8 px-2 py-3">
              <p className={`font-heading text-xl font-bold ${styles.accent}`}>
                {together.years > 0 ? `${together.years}a` : `${together.months}m`}
              </p>
              <p className="text-white/45 text-[10px] uppercase tracking-wide mt-0.5">juntos</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/8 px-2 py-3">
              <p className={`font-heading text-xl font-bold ${styles.accent}`}>
                {together.days.toLocaleString("pt-BR")}
              </p>
              <p className="text-white/45 text-[10px] uppercase tracking-wide mt-0.5">dias</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/8 px-2 py-3">
              <p className={`font-heading text-xl font-bold ${styles.accent}`}>
                {nextAnn.days}d
              </p>
              <p className="text-white/45 text-[10px] uppercase tracking-wide mt-0.5">p/ aniv.</p>
            </div>
          </motion.div>

          {/* Quote */}
          {couple.message && (
            <motion.p
              className="text-gray-200 text-[15px] leading-relaxed font-heading italic text-center px-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3 }}
            >
              &ldquo;{couple.message}&rdquo;
            </motion.p>
          )}

          {/* Melhores Momentos */}
          {galleryPhotos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 }}
            >
              <p className={`text-[10px] uppercase tracking-[0.3em] ${styles.accent} mb-3 font-medium`}>
                Melhores Momentos
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar -mx-5 px-5">
                {galleryPhotos.map((url, i) => (
                  <motion.div
                    key={url}
                    className="shrink-0 snap-start relative overflow-hidden rounded-2xl"
                    style={{ width: 170, height: 226 }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.45 + i * 0.07 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Momento ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Music player */}
          {couple.music_url && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="rounded-3xl overflow-hidden border border-white/10"
            >
              {hasMusicMeta ? (
                <>
                  {/* Album art header */}
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={musicMeta!.albumArt}
                      alt="Capa do álbum"
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />

                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 flex items-end gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={musicMeta!.albumArt}
                        alt="Capa"
                        className="w-16 h-16 rounded-xl object-cover shadow-2xl ring-1 ring-white/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Nossa Música</p>
                        <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                          {musicMeta!.title}
                        </p>
                        {musicMeta!.provider && (
                          <p className="text-white/40 text-[11px] mt-0.5">{musicMeta!.provider}</p>
                        )}
                      </div>
                      <a
                        href={couple.music_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: styles.accentHex }}
                        aria-label="Ouvir música"
                      >
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Spotify embed if available */}
                  {spotifyEmbedUrl && (
                    <iframe
                      title="Nossa música"
                      src={spotifyEmbedUrl}
                      width="100%"
                      height="80"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="block"
                    />
                  )}
                </>
              ) : spotifyEmbedUrl ? (
                <iframe
                  title="Nossa música"
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-3xl"
                />
              ) : (
                <a
                  href={couple.music_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 glass rounded-3xl p-4 hover:border-white/20 transition-all"
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
              className="glass rounded-3xl p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              <div className="bg-white rounded-2xl p-4 inline-block mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={couple.qr_code_url} alt="QR Code" className="w-32 h-32" />
              </div>
              <p className="text-gray-500 text-xs">Escaneie para acessar esta página</p>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            className="space-y-3 pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
          >
            <Link
              href={`/criar?theme=${couple.theme}`}
              className={`btn-shimmer btn-cta-${couple.theme} relative flex items-center justify-between w-full px-6 py-4 rounded-2xl overflow-hidden transition-all active:scale-[0.98]`}
            >
              <div>
                <p className="text-white font-bold text-[15px] leading-tight">Faça o mesmo ✨</p>
                <p className="text-white/70 text-[11px] mt-0.5">Crie sua página romântica agora</p>
              </div>
              <div className="shrink-0 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center ml-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/presentes"
              className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all active:scale-[0.98]"
            >
              <div>
                <p className="text-white font-semibold text-[15px] leading-tight">Não sabe o que dar? 🎁</p>
                <p className="text-gray-400 text-[11px] mt-0.5">250+ presentes selecionados por R$8</p>
              </div>
              <div className="shrink-0 w-9 h-9 bg-white/8 rounded-xl flex items-center justify-center ml-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          {/* Share */}
          <motion.div
            className="flex gap-3 justify-center pt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <button
              type="button"
              onClick={copy}
              className="px-5 py-2 glass rounded-xl text-white text-xs font-medium hover:border-white/20 transition-all"
            >
              {copied ? "✓ Copiado!" : "Copiar Link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Olha o que criei para você 💌 " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white text-xs font-medium transition-all"
            >
              WhatsApp
            </a>
          </motion.div>

          <p className="text-center text-gray-700 text-xs pt-2">
            Criado com{" "}
            <Link href="/" className={`${styles.accent} hover:underline`}>EURORA LOVE</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
