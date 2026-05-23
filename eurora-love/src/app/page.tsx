"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function calcCountdownJun12() {
  const now = new Date();
  const year = now.getMonth() >= 5 && now.getDate() > 12 ? now.getFullYear() + 1 : now.getFullYear();
  const target = new Date(year, 5, 12, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return days;
}
import FloatingHearts from "@/components/effects/FloatingHearts";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import LiveCounter from "@/components/conversion/LiveCounter";
import FakeNotifications from "@/components/conversion/FakeNotifications";
import UrgencyBar from "@/components/conversion/UrgencyBar";
import TrustStrip from "@/components/conversion/TrustStrip";
import PreviewMockup from "@/components/conversion/PreviewMockup";

const FEATURES = [
  {
    emoji: "💌",
    title: "Página do Amor",
    desc: "Fotos, música e mensagem em uma página cinematográfica. Compartilhe via QR Code.",
    href: "/criar",
    color: "from-rose-500/30 to-rose-700/10",
    badge: "Mais popular",
  },
  {
    emoji: "🎁",
    title: "Presentes Secretos",
    desc: "Você não sabe o que dar para seu namorado(a)? 250+ ideias selecionadas de Shopee, Amazon e Mercado Livre. Por apenas R$8.",
    href: "/presentes",
    color: "from-amber-500/30 to-amber-700/10",
    badge: "R$8 🔥",
  },
  {
    emoji: "⏰",
    title: "Mensagem Programada",
    desc: "Escreva agora, envie automaticamente no Dia dos Namorados via WhatsApp ou SMS.",
    href: "/mensagem",
    color: "from-fuchsia-500/30 to-fuchsia-700/10",
    badge: "Viral",
  },
  {
    emoji: "🔮",
    title: "Teste do Amor",
    desc: "Descubra a porcentagem real de combinação entre vocês. Resultado compartilhável.",
    href: "/quiz",
    color: "from-pink-400/30 to-pink-600/10",
    badge: "Grátis",
  },
  {
    emoji: "✨",
    title: "IA Romântica",
    desc: "Cartas, poemas, letras de música, bio de casal e convite romântico — em segundos.",
    href: "/ia",
    color: "from-violet-500/30 to-violet-700/10",
    badge: "Premium",
  },
  {
    emoji: "📱",
    title: "Pronto pra viralizar",
    desc: "Tudo otimizado pra TikTok e Reels. Suas fotos do casal vão dar choque.",
    href: "/criar",
    color: "from-emerald-500/30 to-teal-700/10",
    badge: "TikTok",
  },
];

const TESTIMONIALS = [
  {
    text: "Eu nunca vi minha namorada chorar tanto. Ela mostrou pras 8 amigas no grupo. Virou hit no Insta.",
    name: "Lucas M.",
    city: "São Paulo, SP",
    rating: 5,
    photo: "💑",
  },
  {
    text: "Era pra ser um presente simples e virou uma surpresa que ela não para de mostrar. Vale 10x o que paguei.",
    name: "Amanda S.",
    city: "Belo Horizonte, MG",
    rating: 5,
    photo: "👫",
  },
  {
    text: "Coloquei o QR em uma caixinha de bombons. Ela achou que era só doce. Quase desmaiou quando escaneou.",
    name: "Rafael T.",
    city: "Porto Alegre, RS",
    rating: 5,
    photo: "🥹",
  },
  {
    text: "Voltei com a minha ex usando a mensagem programada + página do amor. Sério, salvou meu relacionamento.",
    name: "Pedro G.",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    photo: "💍",
  },
  {
    text: "O design é absurdo. Parece coisa de Apple. Não acreditei que tinha tanto carinho num site de R$ 19.",
    name: "Camila R.",
    city: "Curitiba, PR",
    rating: 5,
    photo: "💕",
  },
];

const FAQS = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Entre 3 a 5 minutos. Você preenche o formulário, paga via PIX, e a página fica online instantaneamente. Você recebe o link, o QR code e a opção de baixar pra imprimir.",
  },
  {
    q: "Posso editar minha página depois?",
    a: "Sim! No plano Premium você pode editar fotos, mensagem e música quantas vezes quiser. No plano Basic, a página é fixada após o pagamento.",
  },
  {
    q: "É realmente seguro pagar via PIX?",
    a: "100%. O pagamento e processado pelo Asaas, plataforma brasileira de pagamentos. Seus dados trafegam em ambiente seguro e a pagina e liberada apos confirmacao.",
  },
  {
    q: "Por quanto tempo a página fica no ar?",
    a: "Para sempre. Pagamento único, sem mensalidade, sem surpresas. Sua página de amor é vitalícia.",
  },
  {
    q: "Posso usar pra pedir em namoro / casamento?",
    a: "Pode (e milhares já usaram). Recomendamos o plano Premium com mensagem programada — assim a surpresa aparece automaticamente na hora exata do pedido.",
  },
  {
    q: "Funciona pra namorado também?",
    a: "Claro. EURORA é pra qualquer casal — hétero, gay, lésbico, namorado(a), noivo(a), casamento, aniversário, reconciliação. O amor é o que importa.",
  },
];

const STATS = [
  { value: "38.412", label: "Casais felizes" },
  { value: "4.96", label: "Estrelas (12.3k reviews)" },
  { value: "R$19", label: "A partir de" },
  { value: "3min", label: "Pra criar" },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [daysLeft, setDaysLeft] = useState(calcCountdownJun12());

  useEffect(() => {
    const id = setInterval(() => setDaysLeft(calcCountdownJun12()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="relative overflow-hidden">
      <UrgencyBar />
      <NoiseOverlay />
      <FloatingHearts count={16} />
      <FakeNotifications />

      {/* ====================== HERO ====================== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-16 pb-20"
      >
        {/* Cinematic background */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[140px] animate-glow-pulse" />
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[100px]" />
        </motion.div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-rose-400/20"
          >
            <span className="live-dot" />
            <span className="text-xs sm:text-sm text-white/80 font-medium">
              <span className="text-rose-300 font-bold">1.247</span> casais criando agora
              {daysLeft > 0 ? (
                <> · Dia dos Namorados em <span className="text-amber-300 font-bold">{daysLeft} dias</span></>
              ) : (
                <> · <span className="text-amber-300 font-bold">Hoje é Dia dos Namorados! 💕</span></>
              )}
            </span>
          </motion.div>

          <h1 className="font-heading text-[clamp(2.6rem,8vw,6.4rem)] font-bold leading-[0.95] tracking-tight mb-7">
            <span className="block text-white">A página do amor</span>
            <span className="block">
              <span className="text-gradient-rose">
                que ela nunca vai esquecer
              </span>
              <span className="text-rose-400 font-heading italic">.</span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crie uma experiência digital cinematográfica em{" "}
            <span className="text-white font-semibold">3 minutos</span>. Fotos,
            música, mensagem programada e QR code premium —{" "}
            <span className="text-rose-300">tudo pronto pra emocionar</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link href="/criar" className="btn-premium group inline-flex items-center gap-2 text-base">
              <span>Criar minha página do amor</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="#features" className="btn-ghost-glow inline-flex items-center gap-2 text-base">
              <span className="text-rose-300">▶</span> Ver como funciona
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 text-white/55 text-sm">
            <div className="flex -space-x-2">
              {["💖", "💕", "💗", "💓"].map((e, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 flex items-center justify-center text-xs ring-2 ring-background"
                >
                  {e}
                </span>
              ))}
            </div>
            <span>
              <span className="text-white font-semibold">★ 4.96</span> de{" "}
              <span className="text-white font-semibold">38.412</span> casais
            </span>
          </div>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-16 w-full max-w-md"
        >
          <PreviewMockup />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs"
        >
          <span>Role pra ver tudo</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* ====================== LIVE STATS ====================== */}
      <section className="relative px-4 -mt-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass-premium rounded-3xl p-5 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <LiveCounter label="Casais nos últimos 7 dias" base={2847} step={2} intervalMs={5200} />
              <LiveCounter label="Páginas online agora" base={1247} step={2} intervalMs={4800} pulsing />
              <LiveCounter label="Mensagens agendadas" base={9836} step={3} intervalMs={6200} />
              <LiveCounter label="Presentes desbloqueados hoje" base={412} step={1} intervalMs={5800} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FEATURES GRID ====================== */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pill pill-live mb-5"
            >
              <span className="text-rose-300">✦</span> Tudo num só lugar
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 leading-tight tracking-tight"
            >
              Cada ferramenta foi feita pra{" "}
              <span className="text-gradient-fire">emocionar</span>
            </motion.h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Não é mais um site genérico de Dia dos Namorados. É um arsenal
              completo pra você criar a surpresa perfeita.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => {
              const isPresentes = f.title === "Presentes Secretos";
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={isPresentes ? "sm:col-span-2 lg:col-span-1" : ""}
                >
                  <Link href={f.href} className="block group h-full">
                    <div className={`h-full p-7 relative rounded-[28px] border transition-all duration-300 ${
                      isPresentes
                        ? "bg-gradient-to-br from-amber-950/60 via-zinc-900 to-black border-amber-500/40 hover:border-amber-400/60 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]"
                        : "card-premium"
                    }`}>
                      {isPresentes && (
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Mais pedido · só R$8
                        </div>
                      )}
                      <div
                        className={`absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br ${f.color} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 ${
                            isPresentes ? "bg-amber-500/10 border-amber-500/30" : "bg-white/5 border-white/10"
                          }`}>
                            {f.emoji}
                          </div>
                          <span className={`pill text-[10px] ${isPresentes ? "pill-gold" : "pill-gold"}`}>
                            {f.badge}
                          </span>
                        </div>
                        <h3 className="font-heading text-2xl text-white mb-3 leading-tight">
                          {f.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-5">
                          {f.desc}
                        </p>
                        <span className={`inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all ${
                          isPresentes ? "text-amber-300" : "text-rose-300"
                        }`}>
                          {isPresentes ? "Ver presentes →" : "Experimentar agora →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== STATS BANNER ====================== */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0a0710] p-6 md:p-8 text-center"
              >
                <p className="font-heading text-3xl md:text-5xl font-bold text-gradient-fire mb-1">
                  {s.value}
                </p>
                <p className="text-white/55 text-xs uppercase tracking-wider">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== HOW IT WORKS ====================== */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="pill pill-live mb-5 mx-auto">Como funciona</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              <span className="text-gradient-ember">3 passos</span>, 3 minutos,{" "}
              <br className="hidden sm:block" /> 1 momento inesquecível
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-rose-500/40 to-transparent hidden md:block" />

            {[
              {
                n: "01",
                title: "Conte sobre vocês",
                desc: "Suas fotos, sua música, sua história. Tudo num formulário que parece um diário.",
                emoji: "✍️",
              },
              {
                n: "02",
                title: "Escolha seu estilo",
                desc: "4 estéticas premium feitas por designers reais. Black Luxury, Neon Romance e mais.",
                emoji: "🎨",
              },
              {
                n: "03",
                title: "Compartilhe e emocione",
                desc: "Receba link único + QR code premium. Imprima, envie, surpreenda. Pra sempre.",
                emoji: "💌",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`relative mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="md:[direction:ltr]">
                  <p className="font-heading text-7xl font-bold text-gradient-fire opacity-30 leading-none mb-2">
                    {step.n}
                  </p>
                  <h3 className="font-heading text-3xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/65 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="md:[direction:ltr] relative">
                  <div className="card-premium aspect-square max-w-sm mx-auto flex items-center justify-center text-9xl">
                    {step.emoji}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== PRICING ====================== */}
      <section id="precos" className="relative py-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="pill pill-gold mb-5 mx-auto">Preços</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 tracking-tight">
              Mais barato que <span className="text-gradient-fire">um buquê</span>.
              <br className="hidden sm:block" /> Eterno como o que vocês têm.
            </h2>
            <p className="text-white/55">Pagamento único. Sem mensalidade. Sem surpresas ruins.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Basic */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">
                  Basic
                </p>
                <p className="text-white/40 text-xs line-through">R$ 39</p>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <p className="font-heading text-6xl font-bold text-white leading-none">
                  R$ 19
                </p>
                <p className="text-white/40 text-sm mb-2">/ vitalício</p>
              </div>
              <p className="text-rose-300 text-sm mb-7">
                ⚡ Ativação instantânea via PIX
              </p>
              <ul className="space-y-3 text-white/75 text-sm mb-8">
                {[
                  "Página do amor completa",
                  "Até 5 fotos premium",
                  "2 temas exclusivos",
                  "Mensagem personalizada",
                  "QR Code premium impresso",
                  "Link vitalício",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-300 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/criar?plan=basic"
                className="block text-center py-3.5 rounded-full text-white font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                Começar com Basic
              </Link>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-[28px] p-8 bg-gradient-to-br from-rose-950/60 via-zinc-900 to-black border border-rose-500/40 glow-rose-soft"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-amber-400 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Mais escolhido · 87% dos casais
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <p className="text-rose-300 text-xs uppercase tracking-widest font-semibold">
                  Premium
                </p>
                <p className="text-white/40 text-xs line-through">R$ 79</p>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <p className="font-heading text-6xl font-bold text-gradient-fire leading-none">
                  R$ 39
                </p>
                <p className="text-white/40 text-sm mb-2">/ vitalício</p>
              </div>
              <p className="text-rose-300 text-sm mb-7">
                💎 Inclui todos os recursos premium
              </p>
              <ul className="space-y-3 text-white/85 text-sm mb-8">
                {[
                  "Tudo do Basic, e mais:",
                  "Até 10 fotos em alta resolução",
                  "Todos os 4 temas exclusivos",
                  "Música (Spotify, YouTube, Apple)",
                  "Contagem ao vivo do relacionamento",
                  "Mensagem programada (WhatsApp/SMS)",
                  "Cartas, poemas e bios com IA Romântica",
                  "Editar a página sempre que quiser",
                  "Prioridade no suporte",
                ].map((f, idx) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        idx === 0
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {idx === 0 ? "★" : "✓"}
                    </span>
                    <span className={idx === 0 ? "font-semibold" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/criar?plan=premium"
                className="block btn-premium text-center"
              >
                Quero o Premium →
              </Link>
              <p className="text-center mt-3 text-white/50 text-xs">
                7 dias de garantia · Cancelamento fácil
              </p>
            </motion.div>
          </div>

          <div className="mt-8">
            <TrustStrip />
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="pill pill-gold mb-5 mx-auto">★ ★ ★ ★ ★ Depoimentos reais</p>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold text-white mb-5 tracking-tight">
              Histórias que <span className="text-gradient-fire">fazem chorar</span>
            </h2>
            <p className="text-white/60">+ de 12.300 reviews verificadas</p>
          </div>

          <div className="relative">
            <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory mask-fade-x">
              {TESTIMONIALS.concat(TESTIMONIALS).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % TESTIMONIALS.length) * 0.07 }}
                  className="flex-shrink-0 w-[340px] snap-center card-premium p-7"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/30 to-amber-400/30 flex items-center justify-center text-2xl border border-white/10">
                      {t.photo}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {t.name}
                      </p>
                      <p className="text-white/50 text-xs">{t.city}</p>
                    </div>
                  </div>
                  <p className="text-amber-300 mb-3 text-sm">
                    {"★".repeat(t.rating)}
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== EMOTIONAL CTA ====================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-rose-flare opacity-50" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-600/30 rounded-full blur-[100px] animate-glow-pulse" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-rose-300 text-xs uppercase tracking-luxury mb-6 font-semibold">
              Faltam <span className="text-amber-300">poucos dias</span> · É agora
            </p>

            <h2 className="font-heading text-5xl sm:text-7xl font-bold text-white mb-7 tracking-tight leading-[0.95]">
              Não dê <span className="text-white/40">chocolate</span>.
              <br />
              <span className="text-gradient-rose">Dê uma memória</span>.
            </h2>

            <p className="text-white/70 text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
              Em 3 minutos você cria algo que ela vai mostrar pras amigas, pros
              pais e pra netos.{" "}
              <span className="text-white font-semibold">
                Por menos de uma pizza.
              </span>
            </p>

            <Link
              href="/criar"
              className="btn-premium inline-flex items-center gap-3 text-lg group"
            >
              <span>Criar minha página agora</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/50 text-sm">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> PIX aprovado em 30s
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Sem mensalidade
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================== FAQ ====================== */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="pill pill-live mb-5 mx-auto">FAQ</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Você pergunta. <span className="text-gradient-ember">Nós respondemos.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.details
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group card-premium p-0 overflow-hidden"
              >
                <summary className="cursor-pointer flex items-center justify-between p-6 list-none">
                  <p className="text-white font-medium pr-4">{faq.q}</p>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-rose-300 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-white/65 text-sm leading-relaxed -mt-2">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
