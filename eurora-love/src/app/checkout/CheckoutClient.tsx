"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

type Method = "pix" | "credit_card";

type PayerData = {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
};

type CardData = {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  postalCode: string;
  addressNumber: string;
};

type PaymentResponse = {
  error?: string;
  method?: Method;
  payment_id?: string;
  page_id?: string;
  paid?: boolean;
  slug?: string;
  status?: string;
  pix_qr_code?: string;
  pix_copia_cola?: string;
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors";

const initialPayer: PayerData = {
  name: "",
  email: "",
  cpfCnpj: "",
  phone: "",
};

const initialCard: CardData = {
  holderName: "",
  number: "",
  expiryMonth: "",
  expiryYear: "",
  ccv: "",
  postalCode: "",
  addressNumber: "",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page_id = searchParams.get("page_id") || "";
  const plan = searchParams.get("plan") || "premium";
  const price = plan === "premium" ? "R$ 39" : "R$ 19";

  const [method, setMethod] = useState<Method>("pix");
  const [payer, setPayer] = useState<PayerData>(initialPayer);
  const [card, setCard] = useState<CardData>(initialCard);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(
    page_id ? "" : "ID da pagina nao encontrado."
  );
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(
    (id: string) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        const res = await fetch(`/api/asaas/pagamento/status?page_id=${id}`);
        const data = await res.json();
        if (data.paid) {
          clearInterval(pollingRef.current!);
          router.push(`/sucesso?slug=${data.slug}`);
        }
      }, 3000);
    },
    [router]
  );

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const updatePayer = (key: keyof PayerData, value: string) => {
    setPayer((prev) => ({ ...prev, [key]: value }));
  };

  const updateCard = (key: keyof CardData, value: string) => {
    setCard((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!page_id) return "ID da pagina nao encontrado.";
    if (payer.name.trim().length < 2) return "Informe seu nome.";
    if (!payer.email.includes("@")) return "Informe um e-mail valido.";
    if (onlyDigits(payer.cpfCnpj).length < 11) return "Informe seu CPF.";
    if (onlyDigits(payer.phone).length < 10) return "Informe seu WhatsApp.";

    if (method === "credit_card") {
      if (card.holderName.trim().length < 2) return "Informe o nome no cartao.";
      if (onlyDigits(card.number).length < 13) return "Informe o numero do cartao.";
      if (!card.expiryMonth || !card.expiryYear) return "Informe a validade.";
      if (onlyDigits(card.ccv).length < 3) return "Informe o CVV.";
      if (onlyDigits(card.postalCode).length !== 8) return "Informe o CEP.";
      if (!card.addressNumber.trim()) return "Informe o numero do endereco.";
    }

    return "";
  };

  const submitPayment = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setPayment(null);

    try {
      const res = await fetch("/api/asaas/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          method,
          payer,
          card: method === "credit_card" ? card : undefined,
        }),
      });
      const data = (await res.json()) as PaymentResponse;

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao processar pagamento.");
      }

      if (data.paid && data.slug) {
        router.push(`/sucesso?slug=${data.slug}`);
        return;
      }

      setPayment(data);
      startPolling(page_id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!payment?.pix_copia_cola) return;
    navigator.clipboard.writeText(payment.pix_copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        className="glass rounded-3xl p-5 sm:p-8 max-w-5xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <section>
            <div className="mb-7">
              <p className="text-xs uppercase tracking-widest text-rose-400 mb-2">
                Pagamento seguro
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
                Finalize sem sair do Eurora
              </h1>
              <p className="text-gray-400 text-sm">
                Escolha Pix ou cartao. A pagina sera liberada assim que o
                pagamento for confirmado.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMethod("pix");
                  setPayment(null);
                  setError("");
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  method === "pix"
                    ? "border-rose-500 bg-rose-950/25"
                    : "border-white/10 bg-white/3"
                }`}
              >
                <p className="text-white font-semibold">Pix</p>
                <p className="text-gray-400 text-xs mt-1">
                  QR code e copia e cola na hora
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("credit_card");
                  setPayment(null);
                  setError("");
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  method === "credit_card"
                    ? "border-rose-500 bg-rose-950/25"
                    : "border-white/10 bg-white/3"
                }`}
              >
                <p className="text-white font-semibold">Cartao de credito</p>
                <p className="text-gray-400 text-xs mt-1">
                  Pagamento aprovado direto na tela
                </p>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-white font-semibold mb-3">
                  Dados para pagamento
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={payer.name}
                    onChange={(e) => updatePayer("name", e.target.value)}
                    placeholder="Nome completo"
                    className={inputClass}
                    autoComplete="name"
                  />
                  <input
                    value={payer.email}
                    onChange={(e) => updatePayer("email", e.target.value)}
                    placeholder="E-mail"
                    className={inputClass}
                    inputMode="email"
                    autoComplete="email"
                  />
                  <input
                    value={payer.cpfCnpj}
                    onChange={(e) => updatePayer("cpfCnpj", e.target.value)}
                    placeholder="CPF"
                    className={inputClass}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <input
                    value={payer.phone}
                    onChange={(e) => updatePayer("phone", e.target.value)}
                    placeholder="WhatsApp"
                    className={inputClass}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {method === "credit_card" && (
                <div>
                  <p className="text-white font-semibold mb-3">
                    Dados do cartao
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={card.holderName}
                      onChange={(e) => updateCard("holderName", e.target.value)}
                      placeholder="Nome impresso no cartao"
                      className={`${inputClass} sm:col-span-2`}
                      autoComplete="cc-name"
                    />
                    <input
                      value={card.number}
                      onChange={(e) => updateCard("number", e.target.value)}
                      placeholder="Numero do cartao"
                      className={`${inputClass} sm:col-span-2`}
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                    <input
                      value={card.expiryMonth}
                      onChange={(e) => updateCard("expiryMonth", e.target.value)}
                      placeholder="Mes"
                      className={inputClass}
                      inputMode="numeric"
                      autoComplete="cc-exp-month"
                    />
                    <input
                      value={card.expiryYear}
                      onChange={(e) => updateCard("expiryYear", e.target.value)}
                      placeholder="Ano"
                      className={inputClass}
                      inputMode="numeric"
                      autoComplete="cc-exp-year"
                    />
                    <input
                      value={card.ccv}
                      onChange={(e) => updateCard("ccv", e.target.value)}
                      placeholder="CVV"
                      className={inputClass}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                    />
                    <input
                      value={card.postalCode}
                      onChange={(e) => updateCard("postalCode", e.target.value)}
                      placeholder="CEP"
                      className={inputClass}
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                    <input
                      value={card.addressNumber}
                      onChange={(e) => updateCard("addressNumber", e.target.value)}
                      placeholder="Numero do endereco"
                      className={inputClass}
                      autoComplete="address-line2"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/25 bg-red-950/20 p-4 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={submitPayment}
                disabled={loading}
                className="w-full sm:w-auto btn-premium inline-flex items-center justify-center disabled:opacity-60"
              >
                {loading
                  ? "Processando..."
                  : method === "pix"
                    ? `Gerar Pix de ${price}`
                    : `Pagar ${price} no cartao`}
              </button>
            </div>
          </section>

          <aside className="glass-dark rounded-3xl p-5 sm:p-6 h-fit">
            <p className="text-xs uppercase tracking-widest text-rose-400 mb-2">
              Resumo
            </p>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  {plan === "premium" ? "Premium" : "Basic"}
                </h2>
                <p className="text-gray-400 text-sm">Pagamento unico</p>
              </div>
              <p className="text-white text-2xl font-bold">{price}</p>
            </div>

            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Pagina liberada apos confirmacao</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Checkout protegido pelo Asaas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Sem redirecionamento estranho</span>
              </div>
            </div>

            {payment?.pix_qr_code && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-white font-semibold mb-4 text-center">
                  Escaneie o Pix
                </p>
                <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${payment.pix_qr_code}`}
                    alt="QR Code Pix"
                    className="w-48 h-48"
                  />
                </div>
                <div className="space-y-3">
                  <input
                    readOnly
                    value={payment.pix_copia_cola || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-400 text-xs"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    {copied ? "Copiado!" : "Copiar codigo Pix"}
                  </button>
                </div>
                <div className="mt-5 flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <p className="text-gray-300 text-sm">
                    Aguardando confirmacao do pagamento...
                  </p>
                </div>
              </div>
            )}

            {payment?.method === "credit_card" && !payment.paid && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-amber-200 text-sm">
                  Pagamento enviado. Se a analise do cartao demorar alguns
                  segundos, esta tela atualiza automaticamente.
                </p>
              </div>
            )}
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
