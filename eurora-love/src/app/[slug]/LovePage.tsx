"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Couple, Theme } from "@/lib/types";
import type { MusicMeta } from "./page";

const THEME_STYLES: Record<Theme, { bg: string; accent: string; text: string; accentHex: string; glowRgb: string }> = {
  "black-luxury": { bg: "bg-black",       accent: "text-rose-400",    text: "text-white", accentHex: "#fb7185", glowRgb: "251,113,133" },
  "neon-romance": { bg: "bg-[#0a001a]",   accent: "text-fuchsia-400", text: "text-white", accentHex: "#e879f9", glowRgb: "232,121,249" },
  "minimal-love": { bg: "bg-[#0d0d0b]",   accent: "text-amber-400",   text: "text-white", accentHex: "#fbbf24", glowRgb: "251,191,36"  },
  "velvet-dark":  { bg: "bg-[#0d0005]",   accent: "text-rose-300",    text: "text-white", accentHex: "#fda4af", glowRgb: "253,164,175" },
};

const WAVEFORM = [4, 9, 6, 13, 5, 11, 7, 12, 4, 10];

const DEFAULT_HERO_POEMS = [
  "Tem coisas que a gente não explica, só sente. E quando toca a nossa música, eu volto para aquele instante em que tudo começou a fazer sentido.",
  "Se alguém me perguntasse onde mora a parte mais bonita da minha vida, eu lembraria do seu sorriso antes de conseguir responder.",
  "Você virou meu lugar favorito no mundo: não um endereço, mas uma sensação de paz, cuidado e vontade de ficar.",
];

function buildHeroPoems(message: string) {
  const custom = message.trim();
  return custom ? [custom, ...DEFAULT_HERO_POEMS.slice(0, 2)] : DEFAULT_HERO_POEMS;
}

const SPOTIFY_TYPES = ["track","album","playlist","episode","show"] as const;

function getMusicEmbed(url?: string | null): { src: string; type: "spotify" | "youtube" } | null {
  if (!url) return null;
  try {
    const p = new URL(url);
    if (p.hostname.includes("spotify.com")) {
      const parts = p.pathname.split("/").filter(Boolean);
      // find the first segment that is a known Spotify content type (handles intl-pt/ locale prefixes)
      const typeIdx = parts.findIndex(seg => (SPOTIFY_TYPES as readonly string[]).includes(seg));
      if (typeIdx === -1 || typeIdx + 1 >= parts.length) return null;
      const type = parts[typeIdx] as typeof SPOTIFY_TYPES[number];
      const id = parts[typeIdx + 1].split("?")[0];
      if (!id) return null;
      return { src: `https://open.spotify.com/embed/${type}/${id}?autoplay=1&theme=0`, type: "spotify" };
    }
    if (p.hostname.includes("youtube.com") || p.hostname.includes("youtu.be")) {
      let vid: string | null = null;
      if (p.hostname.includes("youtu.be")) { vid = p.pathname.slice(1).split("?")[0]; }
      else {
        vid = p.searchParams.get("v");
        if (!vid) { const m = p.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/); if (m) vid = m[1]; }
      }
      if (!vid) return null;
      return { src: `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`, type: "youtube" };
    }
    return null;
  } catch { return null; }
}

function getDominantAlbumColor(src: string, fallback: string, onColor: (c: string) => void) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.referrerPolicy = "no-referrer";
  img.src = src;
  img.onload = () => {
    try {
      const size = 28;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return onColor(fallback);
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let best = { score: -1, r: 255, g: 45, b: 106 };
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < 180) continue;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        const sat = max - min, bri = max;
        if (bri < 45 || bri > 245 || sat < 24) continue;
        const score = sat * 1.8 + bri * 0.35;
        if (score > best.score) best = { score, r, g, b };
      }
      onColor(best.score > -1 ? `rgb(${best.r},${best.g},${best.b})` : fallback);
    } catch { onColor(fallback); }
  };
  img.onerror = () => onColor(fallback);
}

function IslandCover({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[7px] bg-white/10 text-[12px]">♪</span>
  );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`Capa de ${title}`}
      className="h-5.5 w-5.5 shrink-0 rounded-[7px] object-cover"
      crossOrigin="anonymous" referrerPolicy="no-referrer"
      onError={() => setFailed(true)} />
  );
}

function HeroPoemOverlay({ poems }: { poems: string[] }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => setVisible(true), 2200);
    const t2 = window.setInterval(() => setIdx(i => (i + 1) % poems.length), 7600);
    return () => { window.clearTimeout(t1); window.clearInterval(t2); };
  }, [poems.length]);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[43%] z-10 -translate-y-1/2 px-7 text-center">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p key={idx}
            className="mx-auto max-w-75 font-heading text-[15px] font-semibold italic leading-relaxed lyrics-aurora drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          >
            &ldquo;{poems[idx]}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatSince(d: string) {
  const dt = new Date(d + "T12:00:00");
  return `DESDE ${String(dt.getMonth() + 1).padStart(2, "0")}.${dt.getFullYear()}`;
}

function calcTogether(d: string) {
  const start = new Date(d + "T12:00:00");
  const ms = Date.now() - start.getTime();
  const days = Math.floor(ms / 86400000);
  return { days, years: Math.floor(days / 365), months: Math.floor((days % 365) / 30) };
}

function calcNextAnn(d: string) {
  const start = new Date(d + "T12:00:00");
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  const next = thisYear <= now ? new Date(now.getFullYear() + 1, start.getMonth(), start.getDate()) : thisYear;
  return {
    days: Math.ceil((next.getTime() - now.getTime()) / 86400000),
    label: `${next.getDate()} de ${next.toLocaleDateString("pt-BR", { month: "long" })}`,
  };
}

interface Props { couple: Couple; musicMeta?: MusicMeta | null; }

export default function LovePage({ couple, musicMeta }: Props) {
  const styles = THEME_STYLES[couple.theme];
  const [copied, setCopied] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [clock, setClock] = useState("");
  const [together, setTogether] = useState({ days: 0, years: 0, months: 0 });
  const [nextAnn, setNextAnn] = useState({ days: 0, label: "" });
  const [musicExpanded, setMusicExpanded] = useState(false);
  const [albumColor, setAlbumColor] = useState(styles.accentHex);

  const gallery = couple.photo_urls.length > 1 ? couple.photo_urls.slice(1) : [];

  useEffect(() => {
    if (couple.photo_urls.length <= 1) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % couple.photo_urls.length), 5000);
    return () => clearInterval(t);
  }, [couple.photo_urls.length]);

  useEffect(() => {
    const tick = () => {
      setClock(new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
      setTogether(calcTogether(couple.relationship_date));
      setNextAnn(calcNextAnn(couple.relationship_date));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [couple.relationship_date]);

  useEffect(() => {
    if (!musicMeta?.albumArt) return;
    getDominantAlbumColor(musicMeta.albumArt, styles.accentHex, setAlbumColor);
  }, [musicMeta?.albumArt, styles.accentHex]);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const sinceLabel = formatSince(couple.relationship_date);
  const heroPoems = buildHeroPoems(couple.message);
  const musicEmbed = getMusicEmbed(couple.music_url);
  const hasMeta = !!(musicMeta?.albumArt);

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text} sm:bg-[#04020a] sm:flex sm:items-center sm:justify-center sm:py-10 sm:px-4`}>
      <div
        className={`relative w-full min-h-screen sm:min-h-0 ${styles.bg} sm:max-w-97.5 sm:rounded-[52px] sm:overflow-hidden sm:border sm:border-white/10`}
        style={{ boxShadow: `0 60px 120px rgba(0,0,0,.95), 0 0 90px rgba(${styles.glowRgb},.16)` }}
      >

        {/* ── Intro overlay ── */}
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.p className="text-white/45 text-sm font-light tracking-[0.4em] uppercase"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            Para você,
          </motion.p>
          <motion.p className="font-heading text-3xl font-bold text-gradient-rose text-center px-6"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {couple.person1} & {couple.person2}
          </motion.p>
          <motion.span className="text-3xl animate-heart-beat" style={{ display: "inline-block" }}>❤️</motion.span>
        </motion.div>

        <main className="relative max-w-sm mx-auto sm:max-w-none">

          {/* ── Hero ── */}
          <motion.div className="relative w-full overflow-hidden" style={{ height: "80svh", minHeight: 480 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>

            {couple.photo_urls.length > 0 ? (
              <AnimatePresence initial={false}>
                <motion.img key={heroIdx} src={couple.photo_urls[heroIdx]} alt={`Foto ${heroIdx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }} />
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-gray-800" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent" />

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 px-5 pt-5 flex items-start justify-between z-10">
              <p className="text-[11px] font-bold text-white/80 tabular-nums">{clock}</p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/55 font-medium">EURORA · LOVE</p>
              <div className="w-10" />
            </div>

            {/* Dynamic Island music pill */}
            {hasMeta && (
              <motion.button type="button" onClick={() => setMusicExpanded(v => !v)} aria-expanded={musicExpanded}
                className="absolute top-4 left-1/2 z-20 flex h-8 min-w-33 -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/90 px-2 backdrop-blur-md"
                style={{ boxShadow: `0 10px 26px rgba(0,0,0,.6), 0 0 22px color-mix(in srgb, ${albumColor} 30%, transparent)` }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
                <IslandCover src={musicMeta!.albumArt} title={musicMeta!.title} />
                <span className="max-w-21.5 truncate text-[10px] font-semibold text-white/90">{musicMeta!.title}</span>
                <div className="ml-auto flex h-4 shrink-0 items-end gap-0.5">
                  {WAVEFORM.slice(0, 5).map((h, i) => (
                    <motion.span key={i} className="w-0.5 rounded-full"
                      animate={{ height: [h * 0.4, h * 0.9, h * 0.5] }}
                      transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                      style={{ minHeight: 2, maxHeight: 10, backgroundColor: albumColor }} />
                  ))}
                </div>
              </motion.button>
            )}

            {/* Photo dots */}
            {couple.photo_urls.length > 1 && (
              <div className="absolute bottom-26.25 inset-x-0 flex justify-center gap-1.5">
                {couple.photo_urls.map((_, i) => (
                  <button key={i} type="button" aria-label={`Ir para foto ${i + 1}`} onClick={() => setHeroIdx(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${i === heroIdx ? "w-5 bg-white" : "w-1.5 bg-white/35"}`} />
                ))}
              </div>
            )}

            <HeroPoemOverlay poems={heroPoems} />

            {/* Names — Fraunces italic, gradient */}
            <motion.div className="absolute bottom-0 inset-x-0 px-6 pb-8"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 2 }}>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/50 mb-2 font-medium">{sinceLabel}</p>
              <h1 className="font-heading text-[40px] font-bold italic leading-tight" style={{ textShadow: "0 2px 24px rgba(0,0,0,.9)" }}>
                <span className="text-white">{couple.person1}</span>{" "}
                <span className={`text-2xl font-light not-italic ${styles.accent}`}>&</span>{" "}
                <span className="text-white">{couple.person2}</span>
              </h1>
            </motion.div>
          </motion.div>

          {/* ── Content ── */}
          <div className="relative px-5 pt-8 pb-10 space-y-7">

            {/* Subtle top glow orb */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 rounded-full blur-3xl opacity-15"
              style={{ background: `radial-gradient(ellipse, ${styles.accentHex}, transparent 70%)` }} />

            {/* Dot grid texture */}
            <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-20" />

            {/* ── Stats strip ── */}
            <motion.div className="relative flex items-center justify-center py-2"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
              <div className="flex-1 text-center">
                <p className="font-heading text-[26px] font-bold text-gradient-rose">
                  {together.years > 0 ? `${together.years}a` : `${together.months}m`}
                </p>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-0.5">juntos</p>
              </div>
              <div className="w-px h-10 bg-white/10 shrink-0" />
              <div className="flex-1 text-center">
                <p className="font-heading text-[26px] font-bold text-gradient-rose">
                  {together.days.toLocaleString("pt-BR")}
                </p>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-0.5">dias</p>
              </div>
              <div className="w-px h-10 bg-white/10 shrink-0" />
              <div className="flex-1 text-center">
                <p className="font-heading text-[26px] font-bold text-gradient-rose">{nextAnn.days}d</p>
                <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] mt-0.5">p/ aniv.</p>
              </div>
            </motion.div>

            {/* ── Quote ── */}
            {couple.message && (
              <motion.p
                className="font-heading text-[15px] font-semibold italic leading-relaxed lyrics-aurora text-center px-3"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }}>
                &ldquo;{couple.message}&rdquo;
              </motion.p>
            )}

            {/* ── Gallery ── */}
            {gallery.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gradient-ember mb-3 font-semibold">
                  Melhores Momentos
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar -mx-5 px-5">
                  {gallery.map((url, i) => (
                    <motion.div key={url}
                      className="shrink-0 snap-start relative overflow-hidden rounded-2xl shadow-xl"
                      style={{ width: 170, height: 226, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.45 + i * 0.07 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Momento ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Music ── */}
            {couple.music_url && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
                className="rounded-3xl overflow-hidden">

                {musicEmbed?.type === "spotify" && (
                  <iframe title="Nossa música" src={musicEmbed.src} width="100%" height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="block rounded-3xl" />
                )}
                {musicEmbed?.type === "youtube" && (
                  <div className="aspect-video w-full">
                    <iframe title="Nossa música" src={musicEmbed.src}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen className="w-full h-full block" />
                  </div>
                )}
                {!musicEmbed && (
                  <a href={couple.music_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-5 glass rounded-3xl hover:bg-white/5 transition-all">
                    <span className="text-2xl">🎵</span>
                    <span className="text-gray-300 text-sm font-heading">Ouvir nossa música</span>
                  </a>
                )}
              </motion.div>
            )}

            {/* ── QR Code ── */}
            {couple.qr_code_url && (
              <motion.div className="glass-premium rounded-3xl p-6 text-center"
                style={{ border: `1px solid rgba(${styles.glowRgb}, 0.25)`, boxShadow: `0 0 50px rgba(${styles.glowRgb}, 0.08)` }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>
                <p className="text-[9px] uppercase tracking-[0.4em] text-gradient-rose font-semibold mb-4">
                  Escaneie o amor 💌
                </p>
                <div className="bg-white rounded-2xl p-4 inline-block mb-3 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={couple.qr_code_url} alt="QR Code" className="w-32 h-32" />
                </div>
                <p className="text-white/30 text-xs font-heading italic">Leve essa página para onde você for</p>
              </motion.div>
            )}

            {/* ── CTAs ── */}
            <motion.div className="flex flex-col gap-3 pt-1"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }}>
              <Link href={`/criar?theme=${couple.theme}`}
                className="btn-shimmer btn-premium relative flex min-h-13 w-full items-center justify-center rounded-full px-4 text-center">
                <span className="font-heading text-[14px] font-bold text-white">Crie a sua também ✨</span>
              </Link>
              <Link href="/presentes"
                className="btn-ghost-glow flex min-h-13 w-full items-center justify-center rounded-full px-4 text-center">
                <span className="font-heading text-[14px] font-bold text-white">Ver presentes para casal 🎁</span>
              </Link>
            </motion.div>

            {/* ── Share ── */}
            <motion.div className="text-center pt-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <p className="text-white/20 text-[9px] uppercase tracking-[0.35em] mb-4 font-semibold">Compartilhe esse amor</p>
              <div className="flex gap-8 justify-center">
                <button type="button" onClick={copy} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-xl group-hover:border-white/20 group-active:scale-90 transition-all">
                    {copied ? "✓" : "🔗"}
                  </div>
                  <span className="text-white/30 text-[10px] font-heading">{copied ? "Copiado!" : "Copiar link"}</span>
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent("Olha o que criei para você 💌 " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-green-600/15 border border-green-500/20 flex items-center justify-center text-xl group-hover:bg-green-600/25 group-active:scale-90 transition-all">
                    📱
                  </div>
                  <span className="text-white/30 text-[10px] font-heading">WhatsApp</span>
                </a>
              </div>
            </motion.div>

            <p className="text-center text-white/12 text-[9px] tracking-[0.35em] uppercase pt-2 pb-2 font-heading">
              Criado com amor ·{" "}
              <Link href="/" className="text-gradient-rose opacity-50 hover:opacity-80 transition-opacity">EURORA LOVE</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
