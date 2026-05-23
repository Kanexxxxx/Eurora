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

export default function AdminCadastros() {
  const [data, setData] = useState<{ items: Cadastro[]; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/cadastros").then((r) => r.json()).then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-6">
        Cadastros{" "}
        {data && <span className="text-white/40 text-base font-normal">({data.total})</span>}
      </h1>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.items.map((c) => (
                <tr key={c.id} className="text-white/80">
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
                  <td className="py-3 text-white/40 text-xs">
                    {new Date(c.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/30">
                    Nenhum cadastro ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
