"use client";

import { useCallback, useEffect, useState } from "react";
import { CATEGORIAS } from "@/data/presentes";

type LinkItem = {
  id: string;
  name: string;
  platform: string;
  url: string;
  categoria: string;
  active: boolean;
  order: number;
  created_at: string;
};

const PLATAFORMAS = ["Amazon", "Shopee", "ML"];

const EMPTY = { name: "", platform: "Amazon", url: "", categoria: "Presentes em Geral", active: true, order: 0 };

export default function AdminLinks() {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/links");
    const d = await r.json();
    setItems(d.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/links")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setItems(d.items ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    if (form.id) {
      await fetch(`/api/admin/links/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setForm(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este link?")) return;
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(item: LinkItem) {
    await fetch(`/api/admin/links/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    load();
  }

  const categorias = Object.keys(CATEGORIAS);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">
          Links R$8{" "}
          <span className="text-white/40 text-base font-normal">({items.length})</span>
        </h1>
        <button
          onClick={() => setForm({ ...EMPTY })}
          className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Novo link
        </button>
      </div>

      <p className="text-white/40 text-sm mb-6">
        Links adicionados aqui aparecem automaticamente no catálogo de presentes para os clientes desbloquearem.
      </p>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-white font-bold text-lg">
              {form.id ? "Editar link" : "Novo link"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do produto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
              />
              <input
                type="url"
                placeholder="URL (https://...)"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
              />
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p} className="bg-[#141414]">{p}</option>
                ))}
              </select>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
              >
                {categorias.map((c) => (
                  <option key={c} value={c} className="bg-[#141414]">{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Ordem (0 = primeiro)"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
                />
              </div>
              <label className="flex items-center gap-2 text-white/60 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-rose-500"
                />
                Ativo no catálogo
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.url}
                className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setForm(null)}
                className="flex-1 bg-white/8 hover:bg-white/15 text-white/70 font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white/40">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🔗</p>
          <p>Nenhum link adicionado ainda.</p>
          <p className="text-sm mt-1">Clique em &quot;Novo link&quot; para adicionar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 hover:border-white/15 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold text-white ${
                    item.platform === "Amazon" ? "bg-orange-500" :
                    item.platform === "Shopee" ? "bg-[#ee4d2d]" : "bg-yellow-400 text-black"
                  }`}>
                    {item.platform}
                  </span>
                  <span className="text-white/40 text-xs">{item.categoria}</span>
                </div>
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-white/30 text-xs truncate">{item.url}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    item.active
                      ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : "bg-white/10 text-white/40 hover:bg-white/20"
                  }`}
                >
                  {item.active ? "Ativo" : "Inativo"}
                </button>
                <button
                  onClick={() => setForm({ ...item })}
                  className="text-white/40 hover:text-white text-sm px-2 py-1 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400/60 hover:text-red-400 text-sm px-2 py-1 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
