"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Plan, Theme } from "@/lib/types";

const THEMES: { id: Theme; name: string; plan: "basic" | "premium" }[] = [
  { id: "black-luxury", name: "Black Luxury", plan: "basic" },
  { id: "neon-romance", name: "Neon Romance", plan: "basic" },
  { id: "minimal-love", name: "Minimal Love", plan: "premium" },
  { id: "velvet-dark", name: "Velvet Dark", plan: "premium" },
];

const EMPTY = {
  person1: "",
  person2: "",
  message: "",
  music_url: "",
  relationship_date: "",
  theme: "black-luxury" as Theme,
  plan: "premium" as Plan,
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-rose-500";

type CreatedPage = {
  page_id: string;
  slug: string;
  url: string;
};

export default function AdminCriarPage() {
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedPage | null>(null);
  const previewsRef = useRef<string[]>([]);

  const maxPhotos = form.plan === "premium" ? 10 : 5;
  const publicUrl = useMemo(() => {
    if (!created) return "";
    if (typeof window === "undefined") return created.url;
    return `${window.location.origin}${created.url}`;
  }, [created]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function update<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((prev) => {
      if (key === "plan" && value === "basic") {
        const premiumTheme = prev.theme === "minimal-love" || prev.theme === "velvet-dark";
        return {
          ...prev,
          plan: "basic",
          theme: premiumTheme ? "black-luxury" : prev.theme,
          music_url: "",
        };
      }
      return { ...prev, [key]: value };
    });
  }

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    previews.forEach((url) => URL.revokeObjectURL(url));
    const selected = Array.from(files).slice(0, maxPhotos);
    setPhotos(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    setCreated(null);

    try {
      const data = new FormData();
      data.append("person1", form.person1);
      data.append("person2", form.person2);
      data.append("message", form.message);
      data.append("music_url", form.music_url);
      data.append("relationship_date", form.relationship_date);
      data.append("theme", form.theme);
      data.append("plan", form.plan);
      photos.forEach((photo) => data.append("photos", photo));

      const res = await fetch("/api/admin/paginas", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar pagina.");

      setCreated(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setForm(EMPTY);
    setPhotos([]);
    setPreviews([]);
    setError("");
    setCreated(null);
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-white/40 text-xs uppercase tracking-[0.25em] mb-2">Admin</p>
        <h1 className="text-white text-2xl font-bold">Criar pagina</h1>
        <p className="text-white/45 text-sm mt-2">
          Crie uma pagina igual ao fluxo publico, mas ja marcada como paga para teste e demonstracao.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="bg-white/4 border border-white/8 rounded-2xl p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Nome 1</label>
              <input
                value={form.person1}
                onChange={(e) => update("person1", e.target.value)}
                placeholder="Ex: Ana"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Nome 2</label>
              <input
                value={form.person2}
                onChange={(e) => update("person2", e.target.value)}
                placeholder="Ex: Lucas"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Mensagem</label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value.slice(0, 1000))}
              placeholder="Escreva a mensagem que vai aparecer na pagina..."
              rows={5}
              className={`${inputClass} resize-none`}
            />
            <p className="text-white/25 text-xs text-right mt-1">{form.message.length}/1000</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Data do casal</label>
              <input
                type="date"
                value={form.relationship_date}
                onChange={(e) => update("relationship_date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={`${inputClass} scheme-dark`}
              />
            </div>
            <div>
              <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Plano</label>
              <select
                value={form.plan}
                onChange={(e) => update("plan", e.target.value as Plan)}
                className={inputClass}
              >
                <option value="premium" className="bg-[#111]">Premium - final completo</option>
                <option value="basic" className="bg-[#111]">Basic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Musica</label>
            <input
              value={form.music_url}
              onChange={(e) => update("music_url", e.target.value)}
              disabled={form.plan === "basic"}
              placeholder={form.plan === "basic" ? "Musica fica desativada no Basic" : "Link do Spotify ou YouTube"}
              className={`${inputClass} disabled:opacity-45`}
            />
          </div>

          <div>
            <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">Tema</label>
            <div className="grid sm:grid-cols-4 gap-2">
              {THEMES.map((theme) => {
                const locked = form.plan === "basic" && theme.plan === "premium";
                const active = form.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    disabled={locked}
                    onClick={() => update("theme", theme.id)}
                    className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                      active
                        ? "border-rose-500 bg-rose-500/15 text-white"
                        : locked
                          ? "border-white/5 bg-white/3 text-white/25 cursor-not-allowed"
                          : "border-white/10 bg-white/5 text-white/55 hover:text-white"
                    }`}
                  >
                    <span className="block font-semibold">{theme.name}</span>
                    <span className="text-[11px] opacity-60">{theme.plan === "premium" ? "Premium" : "Basic"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-white/45 text-xs uppercase tracking-wider mb-2 block">
              Fotos ({photos.length}/{maxPhotos})
            </label>
            <label className="block border-2 border-dashed border-white/10 rounded-2xl p-5 text-center cursor-pointer hover:border-rose-500/50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handlePhotos(e.target.files)}
              />
              <span className="text-white/70 text-sm">Selecionar fotos iguais ao fluxo publico</span>
              <span className="block text-white/25 text-xs mt-1">JPG, PNG ou WebP - max 5MB cada</span>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                {previews.map((url, index) => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 text-white text-sm"
                      aria-label={`Remover foto ${index + 1}`}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            {loading ? "Criando..." : "Criar pagina paga"}
          </button>
        </section>

        <aside className="bg-white/4 border border-white/8 rounded-2xl p-5 h-fit">
          <p className="text-white font-semibold mb-3">Resumo</p>
          <div className="space-y-3 text-sm">
            <p className="text-white/55">
              Casal: <span className="text-white">{form.person1 || "-"} & {form.person2 || "-"}</span>
            </p>
            <p className="text-white/55">
              Plano: <span className="text-white capitalize">{form.plan}</span>
            </p>
            <p className="text-white/55">
              Tema: <span className="text-white">{THEMES.find((theme) => theme.id === form.theme)?.name}</span>
            </p>
            <p className="text-white/55">
              Fotos: <span className="text-white">{photos.length}</span>
            </p>
            <p className="text-white/55">
              Musica: <span className="text-white">{form.plan === "premium" && form.music_url ? "Sim" : "Nao"}</span>
            </p>
          </div>

          {created && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-emerald-300 text-sm font-semibold mb-2">Pagina criada e liberada.</p>
              <input readOnly value={publicUrl} className={`${inputClass} mb-3`} />
              <div className="flex gap-2">
                <a
                  href={created.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-white text-black text-sm font-bold px-3 py-2 rounded-lg"
                >
                  Abrir
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-white/8 text-white text-sm font-bold px-3 py-2 rounded-lg hover:bg-white/12"
                >
                  Criar outra
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
