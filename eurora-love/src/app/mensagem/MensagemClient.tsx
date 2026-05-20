"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/effects/FloatingHearts";

const CHANNELS = [
  { id: "email", label: "E-mail", emoji: "✉️", popular: true },
  { id: "wpp", label: "WhatsApp", emoji: "💬", note: "Link pré-formatado" },
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
    emoji: "✈️",
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

export default function MensagemClient() {
  const [step, setStep] = useState(1);
  const [channel, setChannel] = useState("email");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("2026-06-12");
  const [time, setTime] = useState("06:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.id === templateId);

  const handleSelectTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) {
      setTemplateId(id);
      setMessage(t.preview);
      setStep(2);
    }
  };

  const handleSchedule = async () => {
    if (!recipient || !message) return;
    setLoading(true);
    setError(null);

    try {
      const send_at = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch("/api/mensagem/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, recipient, message, send_at }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao agendar.");
      setScheduledId(data.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink =
    recipient && channel === "wpp"
      ? `https://wa.me/${recipient.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
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
            Programe agora pra disparar automaticamente no Dia dos Namorados —
            via{" "}
            <span className="text-white font-medium">e-mail ou WhatsApp</span>.
          </p>
        </div>
      </section>

      <section className="relative px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s
                      ? "bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-[0_0_20px_rgba(255,45,106,0.4)]"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {step > s ? "✓" : s}
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
            {step === 1 && (
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
                    onClick={() => setStep(2)}
                    className="btn-ghost-glow inline-flex items-center gap-2"
                  >
                    ✍️ Quero escrever do zero
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Compose */}
            {step === 2 && (
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
                  <button onClick={() => setStep(1)} className="btn-ghost-glow">
                    ← Trocar template
                  </button>
                  <button
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
            {step === 3 && !scheduledId && (
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
                  {/* Channel */}
                  <div>
                    <label className="block text-white/70 text-xs uppercase tracking-wider mb-3">
                      Por onde enviar
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHANNELS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setChannel(c.id)}
                          className={`relative px-4 py-3 rounded-2xl border text-sm transition-all ${
                            channel === c.id
                              ? "border-rose-400/60 bg-rose-500/10 text-white shadow-[0_0_20px_rgba(255,45,106,0.2)]"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                          }`}
                        >
                          <span className="text-xl mr-2">{c.emoji}</span>
                          {c.label}
                          {c.popular && (
                            <span className="absolute -top-2 -right-2 text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                              RECOMENDADO
                            </span>
                          )}
                          {c.note && (
                            <span className="block text-[10px] text-white/40 mt-1">
                              {c.note}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div>
                    <label className="block text-white/70 text-xs uppercase tracking-wider mb-2">
                      {channel === "email" ? "E-mail dela" : "WhatsApp (com DDD)"}
                    </label>
                    <input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={
                        channel === "email"
                          ? "ela@email.com"
                          : "+55 11 99999-9999"
                      }
                      type={channel === "email" ? "email" : "tel"}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/40"
                    />
                    {channel === "wpp" && (
                      <p className="text-white/40 text-xs mt-2">
                        Você receberá um link wa.me pré-formatado para enviar no horário escolhido.
                      </p>
                    )}
                  </div>

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
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-rose-400/40 [color-scheme:dark]"
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
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-rose-400/40 [color-scheme:dark]"
                      />
                    </div>
                  </div>

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
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center mt-4">
                    {error}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                  <button onClick={() => setStep(2)} className="btn-ghost-glow">
                    ← Voltar
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!recipient || loading}
                    className="btn-premium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Agendando…" : "Agendar mensagem →"}
                  </button>
                </div>
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
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-5xl mb-8 shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                >
                  ✓
                </motion.div>
                <h2 className="font-heading text-4xl sm:text-5xl text-white mb-4 tracking-tight">
                  Mensagem{" "}
                  <span className="text-gradient-ember">agendada!</span>
                </h2>
                <p className="text-white/65 mb-8 leading-relaxed">
                  No dia <strong className="text-white">{date}</strong> às{" "}
                  <strong className="text-white">{time}</strong>
                  {channel === "email" ? (
                    <>
                      {" "}
                      enviamos um e-mail para{" "}
                      <strong className="text-rose-300">{recipient}</strong>.
                    </>
                  ) : (
                    <> você recebe um lembrete com o link do WhatsApp.</>
                  )}
                </p>

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium inline-flex items-center gap-2 mb-8"
                  >
                    💬 Enviar agora pelo WhatsApp
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
                  onClick={() => {
                    setScheduledId(null);
                    setStep(1);
                    setTemplateId(null);
                    setMessage("");
                    setRecipient("");
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
