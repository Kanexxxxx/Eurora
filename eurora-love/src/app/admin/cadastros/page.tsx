"use client";

import { useEffect, useState } from "react";

type Cadastro = {
  id: string;
  slug: string;
  person1: string;
  person2: string;
  theme: string;
  plan: string;
  paid: boolean;
  created_at: string;
};

type CadastroDetail = Cadastro & {
  message: string;
  music_url: string | null;
  relationship_date: string;
  photo_urls: string[];
  qr_code_url: string | null;
  updated_at: string;
  payer_email: string | null;
  payer_name: string | null;
  payer_phone: string | null;
};

type EditForm = {
  person1: string;
  person2: string;
  message: string;
  music_url: string;
  relationship_date: string;
};

function DetailPanel({
  id,
  onClose,
  onDeleted,
  onSaved,
}: {
  id: string;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onSaved: (id: string, changes: Partial<Cadastro>) => void;
}) {
  const [detail, setDetail] = useState<CadastroDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    person1: "",
    person2: "",
    message: "",
    music_url: "",
    relationship_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/cadastros/${id}`)
      .then((r) => r.json())
      .then((d: CadastroDetail) => {
        setDetail(d);
        setForm({
          person1: d.person1,
          person2: d.person2,
          message: d.message,
          music_url: d.music_url ?? "",
          relationship_date: d.relationship_date,
        });
      });
  }, [id]);

  async function save() {
    if (!detail) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/cadastros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar");
      setDetail((prev) => prev ? { ...prev, ...form } : prev);
      onSaved(id, { person1: form.person1, person2: form.person2 });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  async function activate() {
    if (!detail) return;
    setActivating(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/cadastros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao ativar");
      setDetail((prev) => prev ? { ...prev, paid: true } : prev);
      onSaved(id, { paid: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setActivating(false);
    }
  }

  function copyLink() {
    if (!detail) return;
    const url = `${window.location.origin}/${detail.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function doDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/cadastros/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao excluir");
      }
      onDeleted(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* panel */}
      <div className="relative ml-auto w-full max-w-2xl bg-[#0f0f0f] border-l border-white/10 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/8 sticky top-0 bg-[#0f0f0f] z-10">
          <h2 className="text-white font-semibold">
            {detail ? `${detail.person1} & ${detail.person2}` : "Carregando..."}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {detail && (
              <button
                type="button"
                onClick={copyLink}
                className="px-3 py-1.5 rounded-lg bg-white/8 text-white/60 text-xs hover:bg-white/12 hover:text-white transition-colors"
              >
                {copied ? "✓ Link copiado" : "Copiar link"}
              </button>
            )}
            {detail && !detail.paid && (
              <button
                type="button"
                onClick={activate}
                disabled={activating}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/80 text-white text-xs hover:bg-emerald-600 disabled:opacity-60 transition-colors"
              >
                {activating ? "Ativando..." : "Ativar página"}
              </button>
            )}
            {detail && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-white/8 text-white/70 text-xs hover:bg-white/12 hover:text-white transition-colors"
              >
                Editar
              </button>
            )}
            {!confirmDelete && detail && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors"
              >
                Excluir
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-red-300 text-xs">Confirmar exclusão?</span>
                <button
                  type="button"
                  onClick={doDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60 transition-colors"
                >
                  {deleting ? "Excluindo..." : "Sim, excluir"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/8 text-white/60 text-xs hover:bg-white/12 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-white/40 hover:text-white p-1.5 rounded transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!detail ? (
          <div className="p-5 text-white/40">Carregando...</div>
        ) : (
          <div className="p-5 space-y-6">
            {/* Fotos */}
            {detail.photo_urls.length > 0 && (
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Fotos ({detail.photo_urls.length})
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {detail.photo_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-xl overflow-hidden bg-white/5 block hover:opacity-80 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Info / Edit form */}
            {editing ? (
              <div className="space-y-4">
                <p className="text-white/50 text-xs uppercase tracking-wider">Editar dados</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-person1" className="text-white/50 text-xs mb-1 block">Nome 1</label>
                    <input
                      id="edit-person1"
                      value={form.person1}
                      onChange={(e) => setForm((f) => ({ ...f, person1: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-person2" className="text-white/50 text-xs mb-1 block">Nome 2</label>
                    <input
                      id="edit-person2"
                      value={form.person2}
                      onChange={(e) => setForm((f) => ({ ...f, person2: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-date" className="text-white/50 text-xs mb-1 block">
                    Data do relacionamento
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    value={form.relationship_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, relationship_date: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="edit-music" className="text-white/50 text-xs mb-1 block">
                    Música (URL Spotify/YouTube)
                  </label>
                  <input
                    id="edit-music"
                    value={form.music_url}
                    onChange={(e) => setForm((f) => ({ ...f, music_url: e.target.value }))}
                    placeholder="https://open.spotify.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="edit-message" className="text-white/50 text-xs mb-1 block">
                    Mensagem ({form.message.length}/1000)
                  </label>
                  <textarea
                    id="edit-message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={6}
                    maxLength={1000}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 transition-colors"
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setForm({
                        person1: detail.person1,
                        person2: detail.person2,
                        message: detail.message,
                        music_url: detail.music_url ?? "",
                        relationship_date: detail.relationship_date,
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/8 text-white/60 text-sm hover:bg-white/12 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(detail.payer_name || detail.payer_email || detail.payer_phone) && (
                  <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                    <p className="text-emerald-300/70 text-xs uppercase tracking-wider mb-2">Contato do pagador</p>
                    {detail.payer_name && (
                      <Row label="Nome">{<span className="text-white/80 text-sm">{detail.payer_name}</span>}</Row>
                    )}
                    {detail.payer_email && (
                      <Row label="E-mail">
                        <a href={`mailto:${detail.payer_email}`} className="text-rose-400 hover:text-rose-300 text-sm">
                          {detail.payer_email}
                        </a>
                      </Row>
                    )}
                    {detail.payer_phone && (
                      <Row label="Telefone">
                        <a href={`https://wa.me/55${detail.payer_phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm">
                          {detail.payer_phone}
                        </a>
                      </Row>
                    )}
                  </div>
                )}
                {!detail.payer_name && !detail.payer_email && !detail.payer_phone && !detail.paid && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-amber-300/70 text-xs">Nenhum dado de contato — o pagamento não chegou a ser iniciado.</p>
                  </div>
                )}
                <Row label="Slug">
                  <a
                    href={`/${detail.slug}`}
                    target="_blank"
                    className="text-rose-400 hover:text-rose-300 font-mono text-xs"
                  >
                    /{detail.slug}
                  </a>
                </Row>
                <Row label="Plano">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    detail.plan === "premium"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-white/10 text-white/60"
                  }`}>
                    {detail.plan}
                  </span>
                </Row>
                <Row label="Tema">
                  <span className="text-white/60 text-sm">{detail.theme}</span>
                </Row>
                <Row label="Status">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    detail.paid
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {detail.paid ? "Pago" : "Pendente"}
                  </span>
                </Row>
                <Row label="Relacionamento desde">
                  <span className="text-white/70 text-sm">{detail.relationship_date}</span>
                </Row>
                {detail.music_url && (
                  <Row label="Música">
                    <a
                      href={detail.music_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-300 text-xs truncate max-w-xs"
                    >
                      {detail.music_url}
                    </a>
                  </Row>
                )}
                <Row label="Criado em">
                  <span className="text-white/40 text-xs">
                    {new Date(detail.created_at).toLocaleString("pt-BR")}
                  </span>
                </Row>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                    Mensagem do casal
                  </p>
                  <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                    <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                      {detail.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-white/40 text-xs w-36 shrink-0 pt-0.5">{label}</span>
      <div>{children}</div>
    </div>
  );
}

export default function AdminCadastros() {
  const [data, setData] = useState<{ items: Cadastro[]; total: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/cadastros").then((r) => r.json()).then(setData);
  }, []);

  const filtered = data?.items.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.person1.toLowerCase().includes(q) ||
      c.person2.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  function handleDeleted(id: string) {
    setData((prev) =>
      prev
        ? { items: prev.items.filter((c) => c.id !== id), total: prev.total - 1 }
        : prev,
    );
    setSelected(null);
  }

  function handleSaved(id: string, changes: Partial<Cadastro>) {
    setData((prev) =>
      prev
        ? { ...prev, items: prev.items.map((c) => (c.id === id ? { ...c, ...changes } : c)) }
        : prev,
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-white text-2xl font-bold">
          Cadastros{" "}
          {data && (
            <span className="text-white/40 text-base font-normal">({data.total})</span>
          )}
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar casal ou slug..."
          className="w-56 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      {!data ? (
        <p className="text-white/40">Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs border-b border-white/8">
                <th className="text-left pb-3 font-medium">Casal</th>
                <th className="text-left pb-3 font-medium">Slug</th>
                <th className="text-left pb-3 font-medium">Tema</th>
                <th className="text-left pb-3 font-medium">Plano</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Data</th>
                <th className="text-left pb-3 font-medium" aria-label="Ações" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(filtered ?? []).map((c) => (
                <tr key={c.id} className="text-white/80 hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4 font-medium">
                    {c.person1} & {c.person2}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={`/${c.slug}`}
                      target="_blank"
                      className="text-rose-400 hover:text-rose-300 text-xs font-mono"
                    >
                      {c.slug}
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-white/50 text-xs">{c.theme}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.plan === "premium"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {c.plan}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.paid
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {c.paid ? "Pago" : "Pendente"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white/40 text-xs">
                    {new Date(c.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/6 text-white/60 text-xs hover:bg-white/12 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
              {(filtered ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-white/30">
                    {search ? "Nenhum resultado para a busca." : "Nenhum cadastro ainda."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <DetailPanel
          id={selected}
          onClose={() => setSelected(null)}
          onDeleted={handleDeleted}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
