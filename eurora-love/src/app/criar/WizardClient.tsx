"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type { WizardData, Theme, Plan } from "@/lib/types";

const THEMES: {
  id: Theme;
  name: string;
  description: string;
  bg: string;
  glow: string;
  accent: string;
  accentColor: string;
  deco: string;
  badge: string;
}[] = [
  {
    id: "black-luxury",
    name: "Black Luxury",
    description: "Sofisticado e elegante",
    bg: "from-zinc-900 via-zinc-950 to-black",
    glow: "rgba(255,45,106,0.20)",
    accent: "border-[#ff2d6a]",
    accentColor: "#ff2d6a",
    deco: "✦ ✦ ✦",
    badge: "Clássico",
  },
  {
    id: "neon-romance",
    name: "Neon Romance",
    description: "Intenso e apaixonado",
    bg: "from-purple-950 via-violet-950 to-black",
    glow: "rgba(168,85,247,0.25)",
    accent: "border-fuchsia-500",
    accentColor: "#d946ef",
    deco: "💜 ✨ 💜",
    badge: "Vibrante",
  },
  {
    id: "minimal-love",
    name: "Minimal Love",
    description: "Limpo e atemporal",
    bg: "from-stone-800 via-stone-900 to-black",
    glow: "rgba(251,191,36,0.18)",
    accent: "border-amber-400",
    accentColor: "#f59e0b",
    deco: "· · ·",
    badge: "Minimalista",
  },
  {
    id: "velvet-dark",
    name: "Velvet Dark",
    description: "Suave e romântico",
    bg: "from-rose-950 via-red-950 to-black",
    glow: "rgba(255,45,106,0.22)",
    accent: "border-rose-400",
    accentColor: "#fb7185",
    deco: "♥ ♥ ♥",
    badge: "Romântico",
  },
];

const TOTAL_STEPS = 8;

const defaultData: WizardData = {
  person1: "",
  person2: "",
  photos: [],
  photoPreviewUrls: [],
  message: "",
  music_url: "",
  relationship_date: "",
  theme: "black-luxury",
  plan: "premium",
};

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d6a] transition-colors";

const MUSIC_EXAMPLES = [
  { url: "https://open.spotify.com/track/1tmD4Xpd1YNSGCG5AYqHDk", title: "Última Saudade", artist: "Sertanejo", thumb: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025856830b78bbf4343b9305", platform: "spotify" },
  { url: "https://open.spotify.com/track/3xgrWGYrqZVL7aAvZTm2MA", title: "Saudade de Quem Eu Sou", artist: "Sertanejo", thumb: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ea8c31c9f8657e8c3812eb", platform: "spotify" },
  { url: "https://open.spotify.com/track/5jP9oqulg2Dz6yLwLYj5KO", title: "Seja Ex", artist: "Sertanejo", thumb: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025856830b78bbf4343b9305", platform: "spotify" },
  { url: "https://youtu.be/rtOvBOTyX00", title: "A Thousand Years", artist: "Christina Perri", thumb: "https://i.ytimg.com/vi/rtOvBOTyX00/hqdefault.jpg", platform: "youtube" },
];

function useMusicPreview(url: string) {
  const [preview, setPreview] = useState<{ title: string; thumb: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPreview(null);
    if (!url || (!url.includes("spotify") && !url.includes("youtube") && !url.includes("youtu.be"))) return;

    timerRef.current = setTimeout(async () => {
      try {
        const endpoint = url.includes("spotify")
          ? `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
          : `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const r = await fetch(endpoint);
        if (!r.ok) return;
        const d = await r.json() as { title?: string; thumbnail_url?: string };
        if (d.title) setPreview({ title: d.title, thumb: d.thumbnail_url ?? "" });
      } catch { /* ignore */ }
    }, 600);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [url]);

  return preview;
}

function MusicStep({ plan, value, onChange, onUpgrade }: {
  plan: string;
  value: string;
  onChange: (v: string) => void;
  onUpgrade: () => void;
}) {
  const preview = useMusicPreview(value);

  if (plan !== "premium") {
    return (
      <div>
        <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 4</p>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">A música de vocês</h2>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-amber-400 text-sm font-medium mb-2">🎵 Recurso Premium</p>
          <p className="text-gray-400 text-sm">Faça upgrade para adicionar música à sua página.</p>
          <button type="button" onClick={onUpgrade} className="mt-4 px-6 py-2 bg-[#ff2d6a] hover:bg-[#d6195a] text-white text-sm font-semibold rounded-xl transition-all">
            Upgrade para Premium (R$ 39)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 4</p>
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">A música de vocês</h2>
      <p className="text-gray-400 text-sm mb-4">Cole o link do Spotify ou YouTube (opcional).</p>

      {/* Input */}
      <input
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://open.spotify.com/track/... ou youtu.be/..."
        className={inputClass}
      />

      {/* Live preview */}
      {preview && (
        <div className="mt-3 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          {preview.thumb && (
            <img src={preview.thumb} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{preview.title}</p>
            <p className="text-white/40 text-xs">
              {value.includes("spotify") ? "🎵 Spotify" : "▶ YouTube"}
            </p>
          </div>
          <button type="button" onClick={() => onChange("")} className="text-white/30 hover:text-white/60 text-lg leading-none">×</button>
        </div>
      )}

      {/* Examples */}
      <p className="text-white/40 text-xs uppercase tracking-wider mt-5 mb-3">Exemplos populares</p>
      <div className="grid grid-cols-2 gap-2">
        {MUSIC_EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex.url}
            onClick={() => onChange(ex.url)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition-all text-left ${
              value === ex.url
                ? "border-[#ff2d6a]/50 bg-[#ff2d6a]/10"
                : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6"
            }`}
          >
            <img
              src={ex.thumb}
              alt=""
              className="w-9 h-9 rounded-lg object-cover shrink-0"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-semibold truncate leading-tight">{ex.title}</p>
              <p className="text-white/40 text-[10px] mt-0.5">
                {ex.platform === "spotify" ? "🎵 Spotify" : "▶ YouTube"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WizardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = (searchParams.get("plan") as Plan) || "premium";
  const initialTheme = (searchParams.get("theme") as Theme) || "black-luxury";

  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({ ...defaultData, plan: initialPlan, theme: initialTheme });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    const maxPhotos = data.plan === "premium" ? 10 : 5;
    const newFiles = Array.from(files).slice(0, maxPhotos - data.photos.length);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newFiles].slice(0, maxPhotos),
      photoPreviewUrls: [...prev.photoPreviewUrls, ...previews].slice(0, maxPhotos),
    }));
  };

  const removePhoto = (i: number) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== i),
      photoPreviewUrls: prev.photoPreviewUrls.filter((_, idx) => idx !== i),
    }));
  };

  const canNext = () => {
    if (step === 1) return data.person1.trim().length >= 2 && data.person2.trim().length >= 2;
    if (step === 2) return data.photos.length >= 1;
    if (step === 3) return data.message.trim().length >= 10;
    if (step === 5) return !!data.relationship_date;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("person1", data.person1);
      formData.append("person2", data.person2);
      formData.append("message", data.message);
      formData.append("music_url", data.music_url);
      formData.append("relationship_date", data.relationship_date);
      formData.append("theme", data.theme);
      formData.append("plan", data.plan);
      data.photos.forEach((photo) => formData.append("photos", photo));

      const res = await fetch("/api/paginas", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Erro ao salvar dados");

      router.push(`/checkout?page_id=${json.page_id}&plan=${data.plan}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setLoading(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#ffb1c9] text-xs font-medium uppercase tracking-widest">EURORA LOVE</span>
          <span className="text-gray-500 text-xs">Passo {step} de {TOTAL_STEPS}</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-[#ff2d6a] to-[#f6c986] rounded-full"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8"
          >
            {/* Step 1: Names */}
            {step === 1 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 1</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Quem são os apaixonados?</h2>
                <p className="text-gray-400 text-sm mb-6">Os nomes que aparecerão na sua página.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Seu nome</label>
                    <input
                      type="text"
                      value={data.person1}
                      onChange={(e) => update("person1", e.target.value)}
                      placeholder="Ex: Ana"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Nome do(a) parceiro(a)</label>
                    <input
                      type="text"
                      value={data.person2}
                      onChange={(e) => update("person2", e.target.value)}
                      placeholder="Ex: Lucas"
                      className={inputClass}
                    />
                  </div>
                  {data.person1 && data.person2 && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-300 font-heading text-lg pt-2"
                    >
                      {data.person1} & {data.person2}
                    </motion.p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {step === 2 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 2</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Suas fotos juntos</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Até {data.plan === "premium" ? 10 : 5} fotos · Toque para selecionar
                </p>
                <label className="block border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-[#ff2d6a]/50 active:border-[#ff2d6a]/70 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                  <p className="text-4xl mb-3">📸</p>
                  <p className="text-gray-400 text-sm">Toque para selecionar fotos</p>
                  <p className="text-gray-600 text-xs mt-1">JPG, PNG ou WebP · máx 5MB cada</p>
                </label>
                {data.photoPreviewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {data.photoPreviewUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {/* Always visible remove button for touch devices */}
                        <button
                          onClick={() => removePhoto(i)}
                          aria-label={`Remover foto ${i + 1}`}
                          className="absolute top-1 right-1 bg-black/70 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/90 active:bg-black transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Message */}
            {step === 3 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 3</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Sua mensagem de amor</h2>
                <p className="text-gray-400 text-sm mb-6">Escreva o que o coração mandar. Mín. 10 caracteres.</p>
                <textarea
                  value={data.message}
                  onChange={(e) => update("message", e.target.value.slice(0, 1000))}
                  placeholder="Desde o dia que te conheci, soube que era você..."
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-gray-600 text-xs text-right mt-1">{data.message.length}/1000</p>
              </div>
            )}

            {/* Step 4: Music */}
            {step === 4 && (
              <MusicStep
                plan={data.plan}
                value={data.music_url}
                onChange={(v) => update("music_url", v)}
                onUpgrade={() => update("plan", "premium")}
              />
            )}

            {/* Step 5: Date */}
            {step === 5 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 5</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Quando começou tudo?</h2>
                <p className="text-gray-400 text-sm mb-6">A data do início do relacionamento de vocês.</p>
                <input
                  type="date"
                  value={data.relationship_date}
                  onChange={(e) => update("relationship_date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`${inputClass} scheme-dark`}
                />
              </div>
            )}

            {/* Step 6: Theme */}
            {step === 6 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 6</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Escolha o tema</h2>
                <p className="text-gray-400 text-sm mb-5">
                  {data.plan === "basic" ? "2 temas disponíveis no Basic." : "Todos os 4 temas Premium."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((theme, i) => {
                    const locked = data.plan === "basic" && i >= 2;
                    const selected = data.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => { if (!locked) update("theme", theme.id); }}
                        disabled={locked}
                        className={`relative h-36 sm:h-44 rounded-2xl bg-linear-to-br ${theme.bg} border-2 transition-all duration-200 text-left overflow-hidden
                          ${selected ? `${theme.accent} shadow-lg` : locked ? "border-white/5 opacity-50" : "border-white/10 hover:border-white/25 active:scale-[0.97]"}
                        `}
                        style={selected ? { boxShadow: `0 0 24px ${theme.glow}` } : undefined}
                      >
                        {/* Decorative glow blob */}
                        <div
                          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40"
                          style={{ background: theme.accentColor }}
                        />

                        {/* Decorative symbols */}
                        <div className="absolute top-3 left-0 right-0 text-center text-base tracking-[0.3em] opacity-30"
                          style={{ color: theme.accentColor }}>
                          {theme.deco}
                        </div>

                        {/* Mini page preview */}
                        <div className="absolute top-9 left-3 right-3 rounded-lg overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.07)`, height: "44px" }}>
                          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${theme.accentColor}, rgba(246,201,134,0.6))` }} />
                          <div className="px-2 pt-1.5 flex gap-1">
                            <div className="h-1.5 rounded-full flex-1 opacity-30" style={{ background: theme.accentColor }} />
                            <div className="h-1.5 rounded-full w-8 opacity-20 bg-white" />
                          </div>
                          <div className="px-2 pt-1 flex gap-1">
                            <div className="h-1 rounded-full w-14 opacity-15 bg-white" />
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-3 right-3">
                          {selected ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{ background: theme.accentColor, color: "#07050a" }}>✓</div>
                          ) : locked ? (
                            <span className="text-xs">🔒</span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: `${theme.accentColor}22`, color: theme.accentColor, border: `1px solid ${theme.accentColor}44` }}>
                              {theme.badge}
                            </span>
                          )}
                        </div>

                        {/* Label */}
                        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                          <p className="text-white font-bold text-sm leading-tight">{theme.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: `${theme.accentColor}cc` }}>{theme.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {data.plan === "basic" && (
                  <p className="text-center text-xs text-white/30 mt-3">
                    🔒 Neon Romance e Velvet Dark disponíveis no <span className="text-amber-400">Premium</span>
                  </p>
                )}
              </div>
            )}

            {/* Step 7: Preview */}
            {step === 7 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 7</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Prévia da sua página</h2>
                <p className="text-gray-400 text-sm mb-5">Confira antes de finalizar.</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Casal", value: `${data.person1} & ${data.person2}` },
                    { label: "Fotos", value: `${data.photos.length} foto(s)` },
                    { label: "Música", value: data.music_url ? "Sim" : "Não" },
                    { label: "Data", value: data.relationship_date || "–" },
                    { label: "Tema", value: THEMES.find((t) => t.id === data.theme)?.name || "–" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Plano</span>
                    <span className="text-[#ffb1c9] font-semibold">{data.plan === "premium" ? "Premium · R$ 39" : "Basic · R$ 19"}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/3 rounded-xl">
                  <p className="text-gray-400 text-xs leading-relaxed italic">&ldquo;{data.message.slice(0, 120)}{data.message.length > 120 ? "..." : ""}&rdquo;</p>
                </div>
              </div>
            )}

            {/* Step 8: Payment selection */}
            {step === 8 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 8</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Tudo pronto!</h2>
                <p className="text-gray-400 text-sm mb-5">Confirme o plano e finalize com Pix ou cartao.</p>
                <div className="space-y-3 mb-5">
                  {[
                    { p: "basic" as Plan, price: "R$ 19", label: "Basic", features: "5 fotos · 2 temas" },
                    { p: "premium" as Plan, price: "R$ 39", label: "Premium", features: "10 fotos · 4 temas · Música" },
                  ].map(({ p, price, label, features }) => (
                    <button
                      key={p}
                      onClick={() => {
                        const premiumOnlyThemes = ["minimal-love", "velvet-dark"];
                        if (p === "basic" && premiumOnlyThemes.includes(data.theme)) {
                          setData((prev) => ({ ...prev, plan: p, theme: "black-luxury" }));
                        } else {
                          update("plan", p);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                        data.plan === p ? "border-[#ff2d6a] bg-[#ff2d6a]/8" : "border-white/10 bg-white/3"
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-white font-semibold">{label}</p>
                        <p className="text-gray-400 text-xs">{features}</p>
                      </div>
                      <p className="text-white font-bold">{price}</p>
                    </button>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[#ff2d6a] hover:bg-[#d6195a] active:bg-[#ad1649] disabled:opacity-50 text-white font-bold rounded-2xl transition-all glow-rose"
                >
                  {loading ? "Processando..." : "Pagar com PIX →"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 glass rounded-xl text-gray-300 hover:text-white active:bg-white/10 transition-all text-sm"
            >
              ← Voltar
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="px-5 py-3 bg-[#ff2d6a] hover:bg-[#d6195a] active:bg-[#ad1649] disabled:opacity-30 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Continuar →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
