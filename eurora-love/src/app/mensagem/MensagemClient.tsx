"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/effects/FloatingHearts";

const CHANNELS = [
  { id: "email", label: "E-mail", emoji: "✉️", popular: true, desc: "Entregue na caixa de entrada", free: true },
  { id: "wpp", label: "WhatsApp", emoji: "💬", desc: "Lembrete com link pronto", free: true },
  { id: "telegram", label: "Telegram", emoji: "✈️", desc: "Aviso com texto formatado", free: true },
  { id: "correios", label: "Correios", emoji: "📬", desc: "Carta física em casa · R$ 14", free: false },
];

const TEMPLATES = [
  {
    id: "namoro",
    title: "Pedido de namoro",
    emoji: "💍",
    desc: "Romântico, direto e inesquecível",
    preview:
      "Hoje, faltando 12 horas pra você acordar e ler isso, eu já decidi: quero acordar do seu lado todos os dias. Aceita namorar comigo, oficialmente, pra sempre?",
    tag: "Top viral",
  },
  {
    id: "desculpa",
    title: "Pedido de desculpas",
    emoji: "🥹",
    desc: "Sincero, profundo, sem desculpa esfarrapada",
    preview:
      "Eu errei. E não vou ficar listando explicações — só quero que você saiba que aprendi. E que ninguém vai amar você do jeito que eu te amo. Me dá uma chance?",
    tag: "Reconciliação",
  },
  {
    id: "distancia",
    title: "Relacionamento à distância",
    emoji: "🌍",
    desc: "Pra encurtar quilômetros com palavras",
    preview:
      "Existem 2.418 km entre a gente, e mesmo assim você é o lugar mais perto que eu tenho de casa. Hoje, no Dia dos Namorados, eu queria que isso virasse zero metros.",
    tag: "Sentimental",
  },
  {
    id: "engracada",
    title: "Engraçada",
    emoji: "😂",
    desc: "Pra quem o relacionamento é puro deboche",
    preview:
      "Te amo mais do que o WiFi quando volta depois de cair. Mais do que cobertor em dia frio. Mais do que pizza às 23h. E olha que isso é MUITO.",
    tag: "Compartilhável",
  },
  {
    id: "emocionante",
    title: "Emocionante (faz chorar)",
    emoji: "😭",
    desc: "A bomba emocional de impacto garantido",
    preview:
      "Existem amores que ensinam, existem amores que curam. E aí tem o seu, que faz as duas coisas em silêncio, todo dia, sem você nem perceber. Obrigado por existir.",
    tag: "Faz chorar",
  },
  {
    id: "ex",
    title: "Mensagem pra ex",
    emoji: "💔",
    desc: "Quando faz sentido tentar uma última vez",
    preview:
      "Talvez seja tarde. Talvez não seja o momento. Mas se em algum lugar dentro de você ainda existe um 'e se?', responde essa mensagem. Eu te espero.",
    tag: "Use com cuidado",
  },
];

function recipientLabel(ch: string) {
  if (ch === "email") return "E-mail dela";
  if (ch === "wpp") return "Número do WhatsApp (com DDD)";
  if (ch === "telegram") return "@ do Telegram";
  return "Endereço completo para entrega";
}

function recipientPlaceholder(ch: string) {
  if (ch === "email") return "ela@email.com";
  if (ch === "wpp") return "+55 11 99999-9999";
  if (ch === "telegram") return "@usuario";
  return `Nome Completo\nRua dos Amores, 123 - Apto 45\nBairro - Cidade/SP\nCEP 01001-000`;
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function MensagemClient() {
  const [step, setStep] = useState(1);
  const [channel, setChannel] = useState("email");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [date, setDate] = useState("2026-06-12");
  const [time, setTime] = useState("06:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  // Payment states (Correios)
  const [paymentStep, setPaymentStep] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerCpf, setPayerCpf] = useState("");
  const [paymentPix, setPaymentPix] = useState<{ id: string; qr: string; cola: string } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const paymentPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const template = TEMPLATES.find((t) => t.id === templateId);

  const stopPaymentPolling = () => {
    if (paymentPollingRef.current) {
      clearInterval(paymentPollingRef.current);
      paymentPollingRef.current = null;
    }
  };

  useEffect(() => () => stopPaymentPolling(), []);

  const handleSelectTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) {
      setTemplateId(id);
      setMessage(t.preview);
      setStep(2);
    }
  };

  const scheduleMessage = async (payment_id?: string) => {
    setLoading(true);
    setError(null);
    try {
      const send_at = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch("/api/mensagem/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          recipient,
          message,
          send_at,
          ...(channel !== "email" && senderEmail ? { sender_email: senderEmail } : {}),
          ...(payment_id ? { payment_id } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao agendar.");
      setScheduledId(data.id);
      setPaymentStep(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!recipient || !message) return;
    if (channel !== "email" && !senderEmail.includes("@")) {
      setError("Informe um e-mail válido para receber o lembrete.");
      return;
    }

    if (channel === "correios") {
      // Go to payment step first
      setError(null);
      setPaymentStep(true);
      return;
    }

    await scheduleMessage();
  };

  const handleCreatePayment = async () => {
    if (payerName.trim().length < 2) { setError("Informe seu nome completo."); return; }
    if (onlyDigits(payerCpf).length !== 11) { setError("Informe um CPF válido (11 dígitos)."); return; }
    if (!senderEmail.includes("@")) { setError("Informe um e-mail válido."); return; }

    setPaymentLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mensagem/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payerName, email: senderEmail, cpf: onlyDigits(payerCpf) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX.");
      setPaymentPix({ id: data.payment_id, qr: data.pix_qr_code, cola: data.pix_copia_cola });

      // Start polling
      stopPaymentPolling();
      paymentPollingRef.current = setInterval(async () => {
        try {
          const r = await fetch(`/api/mensagem/pagar-status?payment_id=${data.payment_id}`);
          const d = await r.json();
          if (d.paid) {
            stopPaymentPolling();
            await scheduleMessage(data.payment_id);
          }
        } catch { /* ignore poll errors */ }
      }, 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao gerar pagamento.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyPix = () => {
    if (!paymentPix) return;
    navigator.clipboard.writeText(paymentPix.cola);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const waLink =
    recipient && channel === "wpp"
      ? `https://wa.me/${recipient.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      : null;

  const tgLink =
    recipient && channel === "telegram"
      ? `https://t.me/${recipient.replace(/^@/, "")}`
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={8} />

      <section className="relative px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Mensagem programada
          </p>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            Escreva hoje. Envie no segundo{" "}
            <span className="text-gradient-fire">exato</span> que vai
            emocioná-la.
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            Programe por e-mail, WhatsApp, Telegram ou carta física — entregue
            na hora certa, sem você precisar lembrar.
          </p>
        </div>
      </section>

      <section className="relative px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s || paymentStep || scheduledId
                      ? "bg-linear-to-br from-rose-500 to-amber-400 text-white shadow-[0_0_20px_rgba(255,45,106,0.4)]"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {step > s || paymentStep || scheduledId ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-px ${step > s ? "bg-rose-400" : "bg-white/10"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 — Templates */}
            {step === 1 && !paymentStep && !scheduledId && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="font-heading text-3xl sm:text-4xl text-white text-center mb-3 tracking-tight">
                  Escolha o tom da sua{" "}
                  <span className="text-gradient-ember">mensagem</span>
                </h2>
                <p className="text-white/55 text-center mb-10 text-sm">
                  Você pode editar tudo no próximo passo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEMPLATES.map((t, i) => (
                    <motion.button
                      type="button"
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => handleSelectTemplate(t.id)}
                      className="card-premium text-left p-6 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {t.emoji}
                        </div>
                        <span className="pill pill-gold text-[10px]">
                          {t.tag}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl text-white mb-1">
                        {t.title}
                      </h3>
                      <p className="text-white/55 text-sm mb-4">{t.desc}</p>
                      <p className="text-white/70 text-sm italic leading-relaxed border-l-2 border-rose-400/40 pl-3">
                        &ldquo;{t.preview.slice(0, 110)}…&rdquo;
                      </p>
                      <span className="inline-flex items-center gap-2 text-rose-300 text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                        Usar este template →
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-ghost-glow inline-flex items-center gap-2"
                  >
                    ✍️ Quero escrever do zero
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Compose */}
            {step === 2 && !paymentStep && !scheduledId && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="font-heading text-3xl sm:text-4xl text-white text-center mb-3 tracking-tight">
                  Sua{" "}
                  <span className="text-gradient-ember">
                    {template?.title.toLowerCase() || "mensagem"}
                  </span>
                  , do seu jeito
                </h2>
                <p className="text-white/55 text-center mb-10 text-sm">
                  Edite, personalize, deixe com o seu coração.
                </p>

                <div className="card-premium p-6">
                  <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                    Sua mensagem
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    maxLength={2000}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 focus:ring-2 focus:ring-rose-400/20 text-sm leading-relaxed font-heading"
                    placeholder="Escreva direto do coração…"
                  />
                  <p className="text-white/40 text-xs mt-2 text-right">
                    {message.length}/2000
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost-glow">
                    ← Trocar template
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={message.trim().length < 10}
                    className="btn-premium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Schedule */}
            {step === 3 && !paymentStep && !scheduledId && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="font-heading text-3xl sm:text-4xl text-white text-center mb-3 tracking-tight">
                  Quando ela{" "}
                  <span className="text-gradient-ember">vai receber</span>?
                </h2>
                <p className="text-white/55 text-center mb-10 text-sm">
                  Escolha o canal, o destinatário e o horário exato.
                </p>

                <div className="card-premium p-6 space-y-6">
                  {/* Channel selector */}
                  <div>
                    <label className="block text-white/70 text-xs uppercase tracking-wider mb-3">
                      Por onde enviar
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHANNELS.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            setChannel(c.id);
                            setRecipient("");
                          }}
                          className={`relative px-4 py-3 rounded-2xl border text-sm transition-all text-left ${
                            channel === c.id
                              ? "border-rose-400/60 bg-rose-500/10 text-white shadow-[0_0_20px_rgba(255,45,106,0.2)]"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                          }`}
                        >
                          <span className="text-xl mr-2">{c.emoji}</span>
                          <span className="font-medium">{c.label}</span>
                          {c.popular && (
                            <span className="absolute -top-2 -right-2 text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                              MELHOR
                            </span>
                          )}
                          {!c.free && (
                            <span className="absolute -top-2 -right-2 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                              R$ 14
                            </span>
                          )}
                          <span className="block text-[11px] text-white/40 mt-1 pl-8">
                            {c.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div>
                    <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                      {recipientLabel(channel)}
                    </label>
                    {channel === "correios" ? (
                      <textarea
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        rows={4}
                        placeholder={recipientPlaceholder(channel)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm leading-relaxed"
                      />
                    ) : (
                      <input
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder={recipientPlaceholder(channel)}
                        type={channel === "email" ? "email" : "text"}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                      />
                    )}
                  </div>

                  {/* Sender email */}
                  {channel !== "email" && (
                    <div>
                      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                        Seu e-mail {channel === "correios" ? "(para confirmação do pagamento)" : "(para receber o lembrete)"}
                      </label>
                      <input
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="voce@email.com"
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                      />
                      <p className="text-white/40 text-xs mt-2">
                        {channel === "correios"
                          ? "Você receberá confirmação quando nossa equipe processar o envio."
                          : "No horário agendado você recebe um lembrete com o link pronto para enviar."}
                      </p>
                    </div>
                  )}

                  {/* Date / Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                        Data
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        title="Data de envio"
                        aria-label="Data de envio"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-rose-400/40 scheme-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        title="Horário de envio"
                        aria-label="Horário de envio"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-rose-400/40 scheme-dark"
                      />
                    </div>
                  </div>

                  {/* Correios notice */}
                  {channel === "correios" && (
                    <div className="rounded-2xl bg-amber-500/8 border border-amber-500/25 p-4 flex items-start gap-3">
                      <span className="text-2xl">📬</span>
                      <div>
                        <p className="text-amber-200 text-sm font-semibold mb-1">
                          Carta física pelos Correios — R$ 14,00
                        </p>
                        <p className="text-white/60 text-xs leading-relaxed">
                          Pagamento via PIX no próximo passo. Nossa equipe imprime e envia a carta para o endereço informado.
                        </p>
                      </div>
                    </div>
                  )}

                  {channel !== "correios" && (
                    <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="text-amber-200 text-sm font-semibold mb-1">
                          Timing perfeito
                        </p>
                        <p className="text-white/65 text-xs leading-relaxed">
                          Mensagens às <strong>06h00</strong> do Dia dos
                          Namorados têm 3x mais reações emocionais — ela acorda e
                          você já está lá.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center mt-4">
                    {error}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                  <button type="button" onClick={() => setStep(2)} className="btn-ghost-glow">
                    ← Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleSchedule}
                    disabled={!recipient || loading}
                    className="btn-premium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Agendando…"
                      : channel === "correios"
                      ? "Ir para pagamento →"
                      : "Agendar mensagem →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* PAYMENT STEP — Correios R$14 */}
            {paymentStep && !scheduledId && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-sm mx-auto"
              >
                <div className="text-center mb-8">
                  <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-2">Pagamento seguro</p>
                  <h2 className="font-heading text-3xl text-white font-bold mb-2">
                    Carta pelos Correios
                  </h2>
                  <p className="font-heading text-5xl font-bold text-gradient-fire leading-none mb-1">R$ 14</p>
                  <p className="text-white/50 text-xs">Pagamento único via PIX</p>
                </div>

                <div className="card-premium p-6 space-y-4">
                  {!paymentPix ? (
                    <>
                      <div>
                        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                          Seu nome completo
                        </label>
                        <input
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          placeholder="João Silva"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                          CPF (só números)
                        </label>
                        <input
                          value={payerCpf}
                          onChange={(e) => setPayerCpf(e.target.value)}
                          placeholder="00000000000"
                          inputMode="numeric"
                          maxLength={14}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40 text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                      )}

                      <button
                        type="button"
                        onClick={handleCreatePayment}
                        disabled={paymentLoading}
                        className="btn-premium w-full disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? "Gerando PIX…" : "Gerar PIX — R$ 14,00 →"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl p-4 mx-auto w-fit">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${paymentPix.qr}`}
                          alt="QR Code PIX"
                          className="w-48 h-48"
                        />
                      </div>
                      <h3 className="font-heading text-lg text-white font-bold text-center">
                        Aguardando pagamento
                      </h3>
                      <p className="text-white/50 text-xs text-center">
                        Escaneie o QR Code ou copie o código PIX. A carta será agendada automaticamente após a confirmação.
                      </p>
                      <button
                        type="button"
                        onClick={copyPix}
                        className="btn-premium w-full"
                      >
                        {pixCopied ? "✓ Copiado!" : "Copiar código PIX"}
                      </button>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                        <p className="text-white/50 text-xs">Verificando pagamento…</p>
                      </div>
                    </>
                  )}
                </div>

                {!paymentPix && (
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStep(false);
                      setError(null);
                    }}
                    className="w-full text-white/40 text-xs hover:text-white/60 transition-colors py-3 text-center"
                  >
                    ← Voltar
                  </button>
                )}
              </motion.div>
            )}

            {/* Success */}
            {scheduledId && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-5xl mb-8 shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                >
                  ✓
                </motion.div>
                <h2 className="font-heading text-4xl sm:text-5xl text-white mb-4 tracking-tight">
                  Mensagem{" "}
                  <span className="text-gradient-ember">agendada!</span>
                </h2>

                <p className="text-white/65 mb-8 leading-relaxed">
                  {channel === "email" && (
                    <>
                      No dia <strong className="text-white">{date}</strong> às{" "}
                      <strong className="text-white">{time}</strong> enviamos
                      um e-mail diretamente para{" "}
                      <strong className="text-rose-300">{recipient}</strong>.
                    </>
                  )}
                  {channel === "wpp" && (
                    <>
                      No dia <strong className="text-white">{date}</strong> às{" "}
                      <strong className="text-white">{time}</strong> você
                      recebe um lembrete em{" "}
                      <strong className="text-rose-300">{senderEmail}</strong>{" "}
                      com o link do WhatsApp já preenchido — só apertar enviar!
                    </>
                  )}
                  {channel === "telegram" && (
                    <>
                      No dia <strong className="text-white">{date}</strong> às{" "}
                      <strong className="text-white">{time}</strong> você
                      recebe um aviso em{" "}
                      <strong className="text-rose-300">{senderEmail}</strong>{" "}
                      com a mensagem formatada para enviar no Telegram.
                    </>
                  )}
                  {channel === "correios" && (
                    <>
                      Pagamento confirmado! Nossa equipe vai processar e enviar a
                      carta para o endereço informado. Você recebe confirmação
                      em{" "}
                      <strong className="text-rose-300">{senderEmail}</strong>.
                    </>
                  )}
                </p>

                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium inline-flex items-center gap-2 mb-4"
                  >
                    💬 Enviar agora pelo WhatsApp
                  </a>
                )}
                {tgLink && (
                  <a
                    href={tgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium inline-flex items-center gap-2 mb-4"
                  >
                    ✈️ Abrir Telegram agora
                  </a>
                )}

                <div className="card-premium p-6 text-left mb-8">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
                    Preview da mensagem
                  </p>
                  <p className="text-white/85 font-heading italic leading-relaxed">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScheduledId(null);
                    setStep(1);
                    setTemplateId(null);
                    setMessage("");
                    setRecipient("");
                    setSenderEmail("");
                    setPaymentStep(false);
                    setPaymentPix(null);
                    setPayerName("");
                    setPayerCpf("");
                  }}
                  className="btn-ghost-glow"
                >
                  Agendar mais uma mensagem
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
