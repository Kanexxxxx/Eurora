"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Props {
  name1?: string;
  name2?: string;
  date?: string;
  photoUrl?: string;
}

const WAVEFORM = [8, 14, 10, 18, 7, 15, 9, 17, 6, 13, 10, 16];

type SongPreview = {
  id: string;
  type: "track" | "album";
  title: string;
  artist: string;
  cover: string;
  captions: Array<{ at: number; text: string }>;
};

const SONGS = [
  {
    id: "6dOtVTDdiauQNBQEDOtlAB",
    type: "track",
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62",
    captions: [
      { at: 1.8, text: "Eu nao sabia que uma pessoa podia virar casa, ate encontrar voce. Agora ate os dias comuns parecem ter luz acesa esperando a gente voltar." },
      { at: 8.0, text: "Se um dia me perguntarem onde eu fui mais feliz, eu nao vou falar de um lugar. Vou lembrar do seu sorriso chegando perto do meu." },
      { at: 14.2, text: "Tem amores que chegam fazendo barulho. O nosso chegou ficando, cuidando, ensinando que paz tambem pode acelerar o coracao." },
      { at: 20.4, text: "Que sorte a minha: no meio de tanta gente, a vida encontrou um jeito bonito de me entregar justamente voce." },
    ],
  },
  {
    id: "3gPYoFtn70aTgl546XVSET",
    type: "track",
    title: "Chest Pain (I Love)",
    artist: "Malcolm Todd",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c4b4ad9943cf308e464f7a3c",
    captions: [
      { at: 1.8, text: "Voce mora em mim de um jeito silencioso, mas impossivel de ignorar. Esta nos meus planos, nas minhas pausas e em tudo que eu quero proteger." },
      { at: 8.0, text: "Amar voce e descobrir que saudade tambem pode ser bonita, porque ela sempre aponta para o mesmo lugar: o seu abraco." },
      { at: 14.2, text: "Eu gosto de quem eu sou quando estou com voce. Mais leve, mais inteiro, mais perto da versao que eu sempre quis ser." },
      { at: 20.4, text: "Se o mundo pesar, lembra disso: tem alguem aqui que torce por voce ate nos dias em que voce esquece de torcer por si." },
    ],
  },
  {
    id: "587Lf3LyhC8smoFnNIQtn3",
    type: "track",
    title: "Eu Te Seguro",
    artist: "Veigh",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02bfd85a89e28cbbc84b1d1ae3",
    captions: [
      { at: 1.8, text: "Eu te seguro quando o dia esquecer de ser gentil. Seguro seus medos, seus sonhos e tudo que voce ainda nao teve coragem de pedir." },
      { at: 8.0, text: "Nao prometo uma vida sem tempestade. Prometo minha mao na sua, meu peito aberto e a coragem de ficar quando for dificil." },
      { at: 14.2, text: "Nosso amor nao precisa gritar para existir. Ele aparece nos detalhes: no cuidado, na paciencia e na vontade de continuar." },
      { at: 20.4, text: "Voce nao e so parte da minha historia. Voce e aquela parte que eu releio devagar, porque sempre me faz sorrir." },
    ],
  },
  {
    id: "2262bWmqomIaJXwCRHr13j",
    type: "track",
    title: "Sailor Song",
    artist: "Gigi Perez",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e6065f209e0a01986206bd53",
    captions: [
      { at: 1.8, text: "Tem algo em voce que parece destino, mas tambem parece escolha. E eu escolheria tudo outra vez, ate os caminhos que me trouxeram aqui." },
      { at: 8.0, text: "Se a vida fosse mar, eu nao pediria agua calma. Pediria voce comigo, porque ate a onda mais alta fica menor quando somos nos." },
      { at: 14.2, text: "Voce transformou chegada em lar. Antes eu procurava sinais; hoje eu olho pra voce e entendo todos eles." },
      { at: 20.4, text: "Que nosso amor continue assim: leve o bastante para rir, forte o bastante para ficar, bonito o bastante para virar memoria." },
    ],
  },
  {
    id: "2LwsunYgfRoqyIsNtgOCQx",
    type: "track",
    title: "Ma Meilleure Ennemie",
    artist: "Stromae, Pomme",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02952d1767885a9f1ae6dcf0b0",
    captions: [
      { at: 1.8, text: "A gente nao e perfeito, mas talvez seja isso que deixe tudo tao nosso. Entre manias, risadas e caos, eu continuo te escolhendo." },
      { at: 8.0, text: "Voce mexe comigo de um jeito raro: bagunca meus horarios, acalma minhas pressas e me faz querer ficar mais um pouco." },
      { at: 14.2, text: "Nosso amor tem personalidade. Nao cabe em frase pronta, nao parece copia, nao precisa fingir que e facil para ser verdadeiro." },
      { at: 20.4, text: "No fim, e sempre voce. Mesmo quando o dia muda, mesmo quando eu mudo, alguma coisa em mim continua voltando para o seu nome." },
    ],
  },
  {
    id: "4aE8ZrEif8MgWvFNIbz8I6",
    type: "album",
    title: "The Line",
    artist: "Twenty One Pilots",
    cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028a577010b0baa62c836e330b",
    captions: [
      { at: 1.8, text: "Eu queria te dar algo que nao sumisse depois de aberto. Entao deixei aqui um pedaco do que sinto, para voce voltar quando quiser." },
      { at: 8.0, text: "Essa pagina nao guarda so fotos. Guarda o jeito que eu te vejo: com carinho, com orgulho e com essa vontade imensa de cuidar." },
      { at: 14.2, text: "Toda historia bonita merece um lugar para existir fora da memoria. A nossa agora tem musica, tempo, imagem e um pouco do meu coracao." },
      { at: 20.4, text: "Se presente bom e aquele que a pessoa sente antes de entender, espero que voce sinta isso aqui antes mesmo de terminar de ler." },
    ],
  },
] satisfies SongPreview[];

const SLIDES = [
  { name1: "Sofia",     name2: "Kaique",   date: "desde 09.2023", photoUrl: "/2a3b54514bbd74ff3a9a60f733fe8ef1.jpg",  phrase: "Te escolho todo dia, sem hesitar." },
  { name1: "Fernanda",  name2: "Eduardo",  date: "desde 04.2020", photoUrl: "/casal-02.jpg",                          phrase: "Ao seu lado, tudo faz mais sentido." },
  { name1: "Camila",    name2: "Rodrigo",  date: "desde 12.2021", photoUrl: "/casal-03.jpg",                          phrase: "Você é minha paz e minha aventura." },
  { name1: "Isabela",   name2: "Gabriel",  date: "desde 02.2022", photoUrl: "/casal-beijo-chuva.jpg",                 phrase: "Com você, até a chuva é um presente." },
  { name1: "Carol",     name2: "Felipe",   date: "desde 07.2019", photoUrl: "/casal-beijo-classico.jpg",              phrase: "Um beijo seu vale uma vida inteira." },
  { name1: "Letícia",   name2: "Mateus",   date: "desde 05.2021", photoUrl: "/casal-por-sol-abraco.jpg",              phrase: "Cada pôr do sol contigo é inesquecível." },
  { name1: "Mariana",   name2: "Bruno",    date: "desde 02.2024", photoUrl: "/casal-praia-abraco.jpg",                phrase: "No seu abraço encontrei meu lar." },
  { name1: "Natália",   name2: "Diego",    date: "desde 08.2020", photoUrl: "/casal-praia-por-sol.jpg",               phrase: "Você é a cor mais bonita da minha história." },
  { name1: "Ana",       name2: "Lucas",    date: "desde 03.2023", photoUrl: "/casal-silhueta-beijo.jpg",              phrase: "Nosso amor é maior que qualquer distância." },
  { name1: "Bia",       name2: "Rafael",   date: "desde 11.2021", photoUrl: "/couple-pool-night.png",                 phrase: "A noite fica mais bonita quando estamos juntos." },
  { name1: "Lara",      name2: "Miguel",   date: "desde 01.2022", photoUrl: "/couple-slide-2-enhanced.webp",          phrase: "Você é o que eu não sabia que precisava." },
  { name1: "Vitória",   name2: "Thiago",   date: "desde 10.2020", photoUrl: "/couple-slide-3-enhanced.webp",          phrase: "Com você aprendi o que é felicidade de verdade." },
  { name1: "Beatriz",   name2: "Henrique", date: "desde 06.2021", photoUrl: "/couple-slide-4-enhanced.webp",          phrase: "Você é meu lar favorito." },
  { name1: "Aline",     name2: "Vinícius", date: "desde 03.2024", photoUrl: "/couple-slide-6.jpg",                   phrase: "A melhor decisão que tomei foi te escolher." },
  { name1: "Priya",     name2: "João",     date: "desde 07.2022", photoUrl: "/couple-slide-8.jpg",                   phrase: "Você chegou e mudou tudo pra melhor." },
  { name1: "Rayssa",    name2: "Arthur",   date: "desde 05.2023", photoUrl: "/d4597315b4074cc60367064d095f3632.jpg", phrase: "Todo amor que sinto, sinto por você." },
  { name1: "Laura",     name2: "Caio",     date: "desde 11.2022", photoUrl: "/download.jpg",                         phrase: "Você é meu começo, meu meio e meu fim." },
  { name1: "Valentina", name2: "Lucas",    date: "desde 08.2023", photoUrl: "/e4b32e592f9f24692b77348f6955581c.jpg", phrase: "Com você o tempo passa rápido demais." },
  { name1: "Camila",    name2: "Davi",     date: "desde 02.2023", photoUrl: "/images.jpg",                           phrase: "Nosso amor é a história mais bonita que vivo." },
];

function getNextSongIndex() {
  if (typeof window === "undefined") return 0;

  try {
    const prev = Number.parseInt(window.localStorage.getItem("eurora_song") ?? "-1", 10);
    const safePrev = Number.isFinite(prev) && prev >= 0 && prev < SONGS.length ? prev : -1;
    const next = (safePrev + 1) % SONGS.length;
    window.localStorage.setItem("eurora_song", String(next));
    return next;
  } catch {
    return Math.abs(Date.now()) % SONGS.length;
  }
}

function PoemOverlay({ song }: { song: SongPreview }) {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(false);

  useEffect(() => {
    const timers = song.captions.map((caption, index) =>
      window.setTimeout(() => {
        setCaptionIndex(index);
        setCaptionVisible(true);
      }, caption.at * 1000)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [song]);

  return (
    <AnimatePresence>
      {captionVisible && (
        <div className="absolute inset-x-0 top-[39%] -translate-y-1/2 flex flex-col items-center px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${song.id}-${captionIndex}`}
              className="lyrics-aurora max-w-[88%] text-center text-[10.5px] font-semibold leading-[1.5] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
              initial={{ opacity: 0, y: 14, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.99, filter: "blur(8px)" }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {song.captions[captionIndex]?.text}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function PreviewMockup({}: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("9:41");
  const [songIndex, setSongIndex] = useState(0);

  const slide = SLIDES[photoIndex];
  const song = SONGS[songIndex];
  const embedUrl = `https://open.spotify.com/embed/${song.type}/${song.id}?utm_source=generator`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSongIndex(getNextSongIndex());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Photo slideshow
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhotoIndex((idx) => (idx + 1) % SLIDES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  // Real clock
  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date())
      );
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto"
      style={{ perspective: 1600 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/30 blur-[120px]" />
        <div className="absolute left-[10%] top-[15%] h-48 w-48 rounded-full bg-amber-400/15 blur-[90px]" />
        <div className="absolute right-[10%] bottom-[15%] h-48 w-48 rounded-full bg-fuchsia-600/10 blur-[90px]" />
      </div>

      <motion.div
        animate={{ rotateX: [0, -1.5, 0], rotateY: [0, 2.5, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Phone shell */}
        <div className="mockup-iphone-shell relative mx-auto aspect-[9/19.2] w-75 rounded-[54px] p-[2.5px] sm:w-85">
          <div className="absolute -left-1.25 top-26.5 h-7 w-1 rounded-l bg-zinc-400/60" />
          <div className="absolute -left-1.25 top-38.5 h-14 w-1 rounded-l bg-zinc-400/60" />
          <div className="absolute -left-1.25 top-55.5 h-14 w-1 rounded-l bg-zinc-400/60" />
          <div className="absolute -right-1.25 top-40.5 h-19 w-1 rounded-r bg-zinc-400/60" />

          <div className="mockup-screen-border relative h-full w-full overflow-hidden rounded-[52px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
            <div className="absolute inset-[1.5px] overflow-hidden rounded-[51px] bg-[#06040a]">

              {/* Status bar */}
              <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-8 pt-3.5 text-white">
                <span className="text-[11px] font-bold leading-none tabular-nums">{currentTime}</span>
                <span className="flex items-center gap-1.5 opacity-90">
                  <svg width="13" height="10" viewBox="0 0 15 11" fill="none" aria-hidden="true">
                    <path d="M1 6C2.8 4 5 3 7.5 3C10 3 12.2 4 14 6" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M3.2 7.8C4.5 6.8 5.9 6.2 7.5 6.2C9.1 6.2 10.5 6.8 11.8 7.8" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="7.5" cy="9.5" r="1" fill="white" />
                  </svg>
                  <svg width="20" height="10" viewBox="0 0 22 11" fill="none" aria-hidden="true">
                    <rect x="0.5" y="1" width="17" height="9" rx="2" stroke="white" strokeOpacity="0.55" />
                    <rect x="2" y="2.5" width="12" height="6" rx="1" fill="white" />
                    <path d="M18.5 4.2v2.6a1.5 1.5 0 0 0 0-2.6z" fill="white" fillOpacity="0.4" />
                  </svg>
                </span>
              </div>

              {/* Dynamic Island — album cover + waveform in album's color */}
              <div className="absolute left-1/2 top-2 z-40 -translate-x-1/2">
                <motion.div
                  initial={{ width: 94, height: 26 }}
                  animate={{ width: 136, height: 32 }}
                  transition={{ delay: 0.8, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 overflow-hidden rounded-full bg-black px-2 shadow-[0_10px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.07)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={song.cover}
                    alt="Capa"
                    className="h-5.5 w-5.5 shrink-0 rounded-[7px] object-cover"
                    crossOrigin="anonymous"
                  />
                  <span className="flex-1 truncate text-[9px] font-semibold text-white/80">{song.title}</span>
                  <div className="flex h-4 shrink-0 items-end gap-0.5 pr-0.5">
                    {WAVEFORM.slice(0, 6).map((h, i) => (
                      <motion.span
                        key={i}
                        className="song-waveform-bar w-0.5 rounded-full"
                        animate={{ height: [h * 0.38, h * 0.78, h * 0.48, h * 0.72] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Screen content — song-theme-N sets --song-color for all children */}
              <div className={`relative flex h-full flex-col pt-14 song-theme-${songIndex}`}>

                {/* Hero photo with poem overlay */}
                <div className="mockup-photo-frame relative mx-2 mt-1 h-[55%] overflow-hidden rounded-[24px] bg-black shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)]">
                  {/* Blurred bg */}
                  <motion.img
                    key={`bg-${photoIndex}`}
                    src={slide.photoUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                    style={{ filter: "blur(18px)", transform: "scale(1.15)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* Main photo */}
                  <motion.img
                    key={photoIndex}
                    src={slide.photoUrl}
                    alt={`${slide.name1} e ${slide.name2}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    style={{ objectPosition: "center top" }}
                  />
                  {/* Full overlay gradient */}
                  <div className="mockup-photo-gradient absolute inset-0" />

                  {/* Poem preview */}
                  <PoemOverlay key={song.id} song={song} />

                  {/* Names + date at bottom of photo */}
                  <div className="absolute inset-x-0 bottom-4 px-4 text-center">
                    <motion.p
                      key={`date-${photoIndex}`}
                      className="mb-1 text-[7px] uppercase tracking-[0.4em] text-white/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {slide.date}
                    </motion.p>
                    <motion.h3
                      key={`name-${photoIndex}`}
                      className="font-heading text-[24px] font-bold leading-[0.95] tracking-tight text-white drop-shadow-lg"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {slide.name1}
                      <span className="song-accent-text mx-1.5 text-[16px] font-light">&</span>
                      {slide.name2}
                    </motion.h3>
                  </div>
                </div>

                {/* Phrase below photo */}
                <div className="mt-2 min-h-6 px-5 text-center">
                  <motion.p
                    key={photoIndex}
                    className="font-heading text-[10px] italic leading-snug text-white/55"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    &ldquo;{slide.phrase}&rdquo;
                  </motion.p>
                </div>

                {/* Spotify player */}
                <div className="mx-2 mt-2 overflow-hidden rounded-[16px] border border-white/8">
                  <iframe
                    key={song.id}
                    src={embedUrl}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Nossa música - Spotify"
                    className="block"
                  />
                </div>

                {/* CTAs — colored by album via song-theme-N CSS var */}
                <div className="mx-auto mt-2 grid w-[88%] grid-cols-2 gap-2">
                  <Link
                    href="/criar"
                    className="song-btn-primary rounded-full px-3 py-2 text-[10px] font-extrabold"
                  >
                    Faça o mesmo
                  </Link>
                  <Link
                    href="/presentes"
                    className="song-btn-secondary rounded-full px-3 py-2 text-[10px] font-extrabold"
                  >
                    Ver presentes
                  </Link>
                </div>

                {/* Home bar */}
                <div className="mt-auto flex justify-center pb-1.5 pt-2">
                  <div className="h-1 w-20 rounded-full bg-white/25" />
                </div>
              </div>

              {/* Screen gloss */}
              <div className="mockup-gloss-full pointer-events-none absolute inset-0 rounded-[49px]" />
              <div className="mockup-gloss-corner pointer-events-none absolute left-0 top-0 h-1/4 w-1/3 rounded-tl-[49px]" />
            </div>
          </div>

          <div className="pointer-events-none absolute -inset-px rounded-[53px] border border-white/10" />
        </div>

        {/* Phone shadow */}
        <div className="absolute -bottom-4 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl" />
      </motion.div>
    </motion.div>
  );
}
