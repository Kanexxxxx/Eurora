"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUTOS, CATEGORIAS } from "@/data/presentes";

type LinkItem = {
  id: string;
  name: string;
  platform: string;
  url: string;
  categoria: string;
  image_url?: string | null;
  preco?: string | null;
  active: boolean;
  order: number;
  created_at: string;
};

const PLATAFORMAS = ["Amazon", "Shopee", "ML"];
const EMPTY = { name: "", platform: "Amazon", url: "", categoria: "Presentes em Geral", image_url: "", active: true, order: 0 };
type Tab = "adicionados" | "estaticos";

function PlatBadge({ platform }: { platform: string }) {
  const cls =
    platform === "Amazon" ? "bg-orange-500" :
    platform === "Shopee" ? "bg-[#ee4d2d]" : "bg-yellow-400 text-black";
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${cls}`}>
      {platform === "ML" ? "ML" : platform}
    </span>
  );
}

export default function AdminLinks() {
  const [tab, setTab] = useState<Tab>("adicionados");
  const [items, setItems] = useState<LinkItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busca, setBusca] = useState("");
  const [catFiltro, setCatFiltro] = useState("Todos");

  const load = useCallback(async () => {
    const [linksRes, hiddenRes] = await Promise.all([
      fetch("/api/admin/links").then((r) => r.json()),
      fetch("/api/admin/hidden").then((r) => r.json()),
    ]);
    setItems(linksRes.items ?? []);
    setHiddenIds(Array.isArray(hiddenRes) ? hiddenRes : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/admin/links").then((r) => r.json()),
      fetch("/api/admin/hidden").then((r) => r.json()),
    ])
      .then(([linksRes, hiddenRes]) => {
        if (cancelled) return;
        setItems(linksRes.items ?? []);
        setHiddenIds(Array.isArray(hiddenRes) ? hiddenRes : []);
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
    void load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
    void load();
  }

  async function toggleHidden(produto_id: number) {
    const isHidden = hiddenIds.includes(produto_id);
    await fetch("/api/admin/hidden", {
      method: isHidden ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produto_id }),
    });
    void load();
  }

  async function toggleActive(item: LinkItem) {
    await fetch(`/api/admin/links/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    void load();
  }

  const categorias = Object.keys(CATEGORIAS);

  const produtosEstaticos = PRODUTOS.filter((p) => {
    const matchCat = catFiltro === "Todos" || p.categoria === catFiltro;
    const matchBusca = !busca || p.name.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Produtos do catálogo</h1>
        <button
          onClick={() => setForm({ ...EMPTY })}
          className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Novo produto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/4 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("adicionados")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "adicionados" ? "bg-rose-600 text-white" : "text-white/50 hover:text-white"
          }`}
        >
          Adicionados por você{" "}
          <span className="text-xs opacity-70">({items.length})</span>
        </button>
        <button
          onClick={() => setTab("estaticos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "estaticos" ? "bg-rose-600 text-white" : "text-white/50 hover:text-white"
          }`}
        >
          Produtos do site{" "}
          <span className="text-xs opacity-70">({PRODUTOS.length})</span>
          {hiddenIds.length > 0 && (
            <span className="ml-1 text-xs text-amber-400">({hiddenIds.length} ocultos)</span>
          )}
        </button>
      </div>

      {/* Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-white font-bold text-lg">
              {form.id ? "Editar produto" : "Novo produto"}
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
              <input
                type="url"
                placeholder="URL da imagem (opcional — cola direto da loja)"
                value={form.image_url ?? ""}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
              />
              {form.image_url && form.image_url.startsWith("http") && (
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-white/40 text-xs">Preview da imagem</span>
                </div>
              )}
              <input
                type="number"
                placeholder="Ordem (0 = primeiro)"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
              />
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
      ) : tab === "adicionados" ? (
        items.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <p className="text-4xl mb-3">🎁</p>
            <p>Nenhum produto adicionado ainda.</p>
            <p className="text-sm mt-1">Clique em &quot;Novo produto&quot; para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <PlatBadge platform={item.platform} />
                    <span className="text-white/40 text-xs truncate">{item.categoria}</span>
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
                    onClick={() => setForm({ ...item, image_url: item.image_url ?? "" })}
                    className="text-white/40 hover:text-white px-2 py-1 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400/60 hover:text-red-400 px-2 py-1 transition-colors"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Aba: produtos estáticos */
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="search"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500"
            />
            <select
              value={catFiltro}
              onChange={(e) => setCatFiltro(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
            >
              <option value="Todos" className="bg-[#141414]">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c} value={c} className="bg-[#141414]">{c}</option>
              ))}
            </select>
          </div>

          <p className="text-white/30 text-xs mb-3">
            {produtosEstaticos.length} produto{produtosEstaticos.length !== 1 ? "s" : ""} ·{" "}
            Ocultar remove do catálogo sem excluir permanentemente.
          </p>

          <div className="space-y-2">
            {produtosEstaticos.map((p) => {
              const isHidden = hiddenIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${
                    isHidden
                      ? "bg-white/2 border-white/5 opacity-50"
                      : "bg-white/4 border-white/8"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <PlatBadge platform={p.platform} />
                      <span className="text-white/40 text-xs truncate">{p.categoria}</span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  </div>
                  <button
                    onClick={() => toggleHidden(p.id)}
                    className={`text-xs px-3 py-1 rounded-full shrink-0 transition-colors ${
                      isHidden
                        ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        : "bg-red-500/15 text-red-300 hover:bg-red-500/25"
                    }`}
                  >
                    {isHidden ? "Mostrar" : "Ocultar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
