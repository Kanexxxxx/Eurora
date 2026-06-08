"use client";

import { useEffect, useState } from "react";

type Msg = {
  id: string;
  channel: string;
  recipient: string;
  sender_name: string | null;
  sender_email: string | null;
  message: string;
  send_at: string;
  sent: boolean;
  sent_at: string | null;
  paid: boolean;
  payment_id: string | null;
  created_at: string;
};

export default function AdminMensagens() {
  const [data, setData] = useState<{ items: Msg[]; total: number } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/mensagens").then((r) => r.json()).then(setData);
  }, []);

  async function cancelMsg(id: string) {
    setCanceling(id);
    try {
      const res = await fetch(`/api/admin/mensagens/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev ? { items: prev.items.filter((m) => m.id !== id), total: prev.total - 1 } : prev);
        setConfirmCancel(null);
        setExpanded(null);
      }
    } finally {
      setCanceling(null);
    }
  }

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-6">
        Mensagens programadas{" "}
        {data && <span className="text-white/40 text-base font-normal">({data.total})</span>}
      </h1>

      {!data ? (
        <p className="text-white/40">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {data.items.length === 0 && (
            <p className="text-white/30 text-center py-8">Nenhuma mensagem agendada.</p>
          )}
          {data.items.map((m) => (
            <div
              key={m.id}
              className="bg-white/4 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors"
            >
              <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.sent
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {m.sent ? "Enviada" : "Pendente"}
                    </span>
                    <span className="text-white/40 text-xs">{m.channel}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.paid ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {m.paid ? "Pago" : "Não pago"}
                    </span>
                  </div>
                  <p className="text-white font-medium text-sm truncate">{m.recipient}</p>
                  {m.sender_name && (
                    <p className="text-white/40 text-xs mt-0.5">
                      De: {m.sender_name}{m.sender_email ? ` (${m.sender_email})` : ""}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    Enviar em: {new Date(m.send_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!m.sent && (
                    confirmCancel === m.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-red-300 text-xs">Cancelar?</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); cancelMsg(m.id); }}
                          disabled={canceling === m.id}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60 transition-colors"
                        >
                          {canceling === m.id ? "..." : "Sim"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setConfirmCancel(null); }}
                          className="px-2.5 py-1 rounded-lg bg-white/8 text-white/60 text-xs hover:bg-white/12 transition-colors"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmCancel(m.id); }}
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors"
                      >
                        Cancelar
                      </button>
                    )
                  )}
                  <span className="text-white/30 text-xs">{expanded === m.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expanded === m.id && (
                <div className="mt-3 pt-3 border-t border-white/8">
                  <p className="text-white/70 text-sm whitespace-pre-wrap">{m.message}</p>
                  {m.sent_at && (
                    <p className="text-white/30 text-xs mt-2">
                      Enviada em: {new Date(m.sent_at).toLocaleString("pt-BR")}
                    </p>
                  )}
                  <p className="text-white/25 text-xs mt-1">
                    Criada em: {new Date(m.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
