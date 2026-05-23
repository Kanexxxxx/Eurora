"use client";

import { useEffect, useState } from "react";

type Pedido = {
  id: string;
  slug: string;
  person1: string;
  person2: string;
  plan: string;
  payment_id: string | null;
  created_at: string;
};

export default function AdminPedidos() {
  const [data, setData] = useState<{ items: Pedido[]; total: number } | null>(null);
  const [page] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/pedidos?page=${page}`)
      .then((r) => r.json())
      .then(setData);
  }, [page]);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-6">
        Pedidos pagos{" "}
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
                <th className="text-left pb-3 font-medium">Plano</th>
                <th className="text-left pb-3 font-medium">ID Pagamento</th>
                <th className="text-left pb-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.items.map((p) => (
                <tr key={p.id} className="text-white/80">
                  <td className="py-3 pr-4 font-medium">
                    {p.person1} & {p.person2}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      className="text-rose-400 hover:text-rose-300"
                    >
                      {p.slug}
                    </a>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.plan === "premium"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-white/10 text-white/60"
                    }`}>
                      {p.plan}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white/40 font-mono text-xs">
                    {p.payment_id ?? "—"}
                  </td>
                  <td className="py-3 text-white/40 text-xs">
                    {new Date(p.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/30">
                    Nenhum pedido pago ainda.
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
