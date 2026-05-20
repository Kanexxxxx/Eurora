"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page_id = searchParams.get("page_id") || "";
  const plan = searchParams.get("plan") || "premium";

  const [pixData, setPixData] = useState<{ qr_code: string; copia_cola: string } | null>(null);
  const [loading, setLoading] = useState(!!page_id);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(page_id ? "" : "ID da página não encontrado.");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback((id: string) => {
    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/pagamento/status?page_id=${id}`);
      const data = await res.json();
      if (data.paid) {
        clearInterval(pollingRef.current!);
        router.push(`/sucesso?slug=${data.slug}`);
      }
    }, 3000);
  }, [router]);

  useEffect(() => {
    if (!page_id) return;

    fetch("/api/pagamento/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_id, plan }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPixData({ qr_code: data.pix_qr_code, copia_cola: data.pix_copia_cola });
        setLoading(false);
        startPolling(page_id);
      })
      .catch((e: Error) => { setError(e.message); setLoading(false); });

    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [page_id, plan, startPolling]);

  const copyToClipboard = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Gerando seu PIX...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm w-full text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">Erro</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={() => router.push("/criar")} className="px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        className="glass rounded-3xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-rose-400 mb-2">Pagamento</p>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">Pague com PIX</h1>
          <p className="text-gray-400 text-sm">
            {plan === "premium" ? "Premium · R$ 39" : "Basic · R$ 19"} · Pagamento único
          </p>
        </div>

        {pixData && (
          <>
            {/* QR Code */}
            <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`data:image/png;base64,${pixData.qr_code}`} alt="QR Code PIX" className="w-48 h-48" />
            </div>

            {/* Copia e Cola */}
            <div className="mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Ou copie o código PIX:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pixData.copia_cola}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-400 text-xs overflow-hidden"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/3 rounded-2xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <p className="text-gray-300 text-sm">Aguardando confirmação do pagamento...</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
