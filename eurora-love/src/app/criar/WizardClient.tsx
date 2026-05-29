"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type { WizardData, Theme, Plan } from "@/lib/types";

const THEMES: { id: Theme; name: string; description: string; bg: string; accent: string }[] = [
  { id: "black-luxury", name: "Black Luxury", description: "Sofisticado e elegante", bg: "from-zinc-900 to-black", accent: "border-[#ff2d6a]" },
  { id: "neon-romance", name: "Neon Romance", description: "Intenso e apaixonado", bg: "from-purple-950 to-black", accent: "border-fuchsia-500" },
  { id: "minimal-love", name: "Minimal Love", description: "Limpo e atemporal", bg: "from-stone-900 to-black", accent: "border-amber-400" },
  { id: "velvet-dark", name: "Velvet Dark", description: "Suave e romântico", bg: "from-rose-950 to-black", accent: "border-[#ff2d6a]" },
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
              <div>
                <p className="text-xs uppercase tracking-widest text-[#ffb1c9] mb-2">Passo 4</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">A música de vocês</h2>
                <p className="text-gray-400 text-sm mb-6">
                  {data.plan === "basic" ? "Disponível no plano Premium." : "Cole o link do Spotify ou YouTube (opcional)."}
                </p>
                {data.plan === "premium" ? (
                  <input
                    type="url"
                    inputMode="url"
                    value={data.music_url}
                    onChange={(e) => update("music_url", e.target.value)}
                    placeholder="https://open.spotify.com/track/..."
                    className={inputClass}
                  />
                ) : (
                  <div className="glass rounded-2xl p-6 text-center">
                    <p className="text-amber-400 text-sm font-medium mb-2">🎵 Recurso Premium</p>
                    <p className="text-gray-400 text-sm">Faça upgrade para adicionar música à sua página.</p>
                    <button onClick={() => update("plan", "premium")} className="mt-4 px-6 py-2 bg-[#ff2d6a] hover:bg-[#d6195a] active:bg-[#ad1649] text-white text-sm font-semibold rounded-xl transition-all">
                      Upgrade para Premium (R$ 39)
                    </button>
                  </div>
                )}
              </div>
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
                <p className="text-gray-400 text-sm mb-6">
                  {data.plan === "basic" ? "2 temas disponíveis no Basic." : "Todos os 4 temas Premium."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.filter((_, i) => data.plan === "premium" || i < 2).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => update("theme", theme.id)}
                      className={`relative h-24 sm:h-28 rounded-2xl bg-linear-to-br ${theme.bg} border-2 transition-all active:scale-[0.97] ${
                        data.theme === theme.id ? `${theme.accent} scale-[1.02]` : "border-white/10"
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-start justify-end p-3">
                        <p className="text-white font-semibold text-sm">{theme.name}</p>
                        <p className="text-gray-400 text-xs">{theme.description}</p>
                      </div>
                      {data.theme === theme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#ff2d6a] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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
