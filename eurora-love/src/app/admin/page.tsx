"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalCouples: number;
  paidCouples: number;
  totalMessages: number;
  pendingMessages: number;
  totalLinks: number;
};

const CARDS = [
  { key: "paidCouples",     label: "Pedidos pagos",        icon: "💳", color: "text-emerald-400" },
  { key: "totalCouples",    label: "Cadastros totais",      icon: "👥", color: "text-blue-400"    },
  { key: "totalMessages",   label: "Mensagens agendadas",   icon: "✉️", color: "text-rose-400"    },
  { key: "pendingMessages", label: "Mensagens pendentes",   icon: "⏳", color: "text-amber-400"   },
  { key: "totalLinks",      label: "Produtos no catálogo",  icon: "🎁", color: "text-violet-400"  },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-6">Dashboard</h1>

      {!stats ? (
        <p className="text-white/40">Carregando...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CARDS.map(({ key, label, icon, color }) => (
            <div
              key={key}
              className="bg-white/4 border border-white/8 rounded-2xl p-5"
            >
              <div className={`text-3xl font-bold mb-1 ${color}`}>
                {stats[key as keyof Stats]}
              </div>
              <div className="text-white/50 text-xs flex items-center gap-1.5">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-white/4 border border-white/8 rounded-2xl">
        <h2 className="text-white font-semibold mb-2">Acesso rápido</h2>
        <p className="text-white/40 text-sm">
          Use o menu lateral para ver pedidos, cadastros, mensagens e gerenciar
          links de presentes R$8.
        </p>
        <p className="text-white/30 text-xs mt-3">
          Contato de suporte: eurora.com.br@gmail.com
        </p>
      </div>
    </div>
  );
}
