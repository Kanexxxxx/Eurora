// ─── Types ─────────────────────────────────────────────────────────────
export type ArchetypeId =
  | "cumplices"
  | "aventureiros"
  | "ninho"
  | "intensos"
  | "solares"
  | "silenciosos";

export type CustomQ = { q: string; opts: string[]; a: number };

export type QuizDataV1 = {
  n: string;
  q: number[];
  c: CustomQ[];
};

export type QuizDataV2 = {
  v: 2;
  n: string;
  nick: string;
  q: number[];
  c: CustomQ[];
  arch: ArchetypeId;
};

export type QuizData = QuizDataV1 | QuizDataV2;

export function isV2(d: QuizData): d is QuizDataV2 {
  return (d as QuizDataV2).v === 2;
}

// ─── 10 Perguntas (5 dimensões × 2) ────────────────────────────────────
// dim index: 0=amor 1=reacao 2=mundo 3=energia 4=cuidado
export const QUESTIONS: { q: string; opts: string[]; dim: number }[] = [
  // dim 0 — amor
  {
    dim: 0,
    q: "Quando gosto muito de alguém, o que faço naturalmente?",
    opts: [
      "Mando mensagem e ligo sem parar 📱",
      "Faço coisas práticas pra facilitar a vida da pessoa 🔧",
      "Fico do lado sem precisar de palavras 🤫",
      "Elogio e valorizo em voz alta com frequência 💬",
    ],
  },
  {
    dim: 0,
    q: "Me sinto mais amado(a) quando ele/ela...",
    opts: [
      "Me surpreende com algo pequeno sem motivo 🎁",
      "Fica do meu lado em silêncio quando estou mal 🫂",
      "Fala o que sente, sem rodeios ❤️",
      "Faz coisas práticas pra me ajudar sem eu pedir 🛠️",
    ],
  },
  // dim 1 — reacao
  {
    dim: 1,
    q: "Quando digo 'não tem nada' mas tem...",
    opts: [
      "Quero que me perguntem de novo com mais carinho 🥺",
      "Preciso resolver sozinho(a) antes de falar 🧠",
      "Estou esperando o momento certo pra abrir 🕐",
      "Quero que a pessoa simplesmente fique perto 🤝",
    ],
  },
  {
    dim: 1,
    q: "Quando fico com raiva, minha reação natural é...",
    opts: [
      "Fico em silêncio e me fecho 😶",
      "Falo tudo na hora, sem filtro 💥",
      "Choro e processo por dentro 😢",
      "Me afasto por um tempo pra respirar 🚶",
    ],
  },
  // dim 2 — mundo
  {
    dim: 2,
    q: "Quando preciso me recuperar de um dia horrível, o que me restaura de verdade?",
    opts: [
      "Séries ou filmes no conforto de casa 🛋️",
      "Sair — um jantar, uma caminhada, qualquer coisa fora de casa 🚶‍♀️",
      "Silêncio e meu próprio espaço 🧘",
      "Conversar com quem me importa 💬",
    ],
  },
  {
    dim: 2,
    q: "Se eu pudesse fazer uma coisa esse fim de semana sem limitação, faria...",
    opts: [
      "Planejaria uma viagem de última hora ✈️",
      "Ficaria em casa com a pessoa que amo sem fazer nada 🏠",
      "Reuniria amigos pra rir muito 🎉",
      "Aprenderia algo novo ou terminaria um projeto pessoal 📚",
    ],
  },
  // dim 3 — energia
  {
    dim: 3,
    q: "Num dia livre ideal, eu prefiro...",
    opts: [
      "Explorar um lugar novo que nunca fui 🗺️",
      "Ter uma rotina gostosa e previsível 📆",
      "Ficar em casa sem compromisso nenhum 😴",
      "Fazer algo criativo ou aprender uma habilidade nova 🎨",
    ],
  },
  {
    dim: 3,
    q: "Numa festa, eu normalmente...",
    opts: [
      "Sou um dos últimos a ir embora e conheço todo mundo 🎊",
      "Fico com meu grupo e curto assim 👫",
      "Apareço, socializo um pouco e fico com vontade de ir embora 😅",
      "Prefiro não ir, mas se for, fico quieto(a) num canto 🪑",
    ],
  },
  // dim 4 — cuidado
  {
    dim: 4,
    q: "Minha forma favorita de cuidar de quem amo é...",
    opts: [
      "Fazer surpresas e presentear ✨",
      "Estar presente nos momentos difíceis sem precisar ser chamado(a) 🫂",
      "Dizer o que sinto com frequência ❤️",
      "Resolver problemas práticos e ajudar no que for preciso 🔧",
    ],
  },
  {
    dim: 4,
    q: "Quando estou mal, o que mais me ajuda é...",
    opts: [
      "Um abraço longo sem precisar falar nada 🤗",
      "Alguém que me escute sem dar conselho 👂",
      "Me deixarem resolver no meu tempo 🕰️",
      "Distração — algo pra fazer, assistir ou conversar sobre outra coisa 🎮",
    ],
  },
];

// ─── Arquétipos ─────────────────────────────────────────────────────────
export const ARCHETYPES: Record<
  ArchetypeId,
  {
    name: string;
    tagline: string;
    emoji: string;
    gradient: string;
    presentes: string;
    desc: string;
  }
> = {
  cumplices: {
    name: "Os Cúmplices",
    tagline: "Se entendem com um olhar",
    emoji: "🤫",
    gradient: "from-[#ff2d6a]/30 to-[#ffb1c9]/10",
    presentes: "cumplices",
    desc: "Vocês não precisam de palavras pra se entender. Têm uma linguagem própria — silêncios que falam, olhares que traduzem.",
  },
  aventureiros: {
    name: "Os Aventureiros",
    tagline: "Colecionam experiências, não coisas",
    emoji: "✈️",
    gradient: "from-amber-500/30 to-amber-700/10",
    presentes: "aventureiros",
    desc: "Pra vocês, amor é movimento. Uma viagem de última hora, um lugar nunca visitado, um plano que nasce na hora.",
  },
  ninho: {
    name: "O Ninho",
    tagline: "Transformam qualquer lugar em lar",
    emoji: "🏠",
    gradient: "from-emerald-500/30 to-teal-700/10",
    presentes: "ninho",
    desc: "Vocês não precisam do mundo inteiro — só do espaço de vocês dois. O conforto é a linguagem do amor de vocês.",
  },
  intensos: {
    name: "Os Intensos",
    tagline: "Amam forte, sentem forte",
    emoji: "🔥",
    gradient: "from-orange-500/30 to-red-700/10",
    presentes: "intensos",
    desc: "Vocês nunca fazem nada pela metade. O amor de vocês tem volume, tem cor, tem peso. E é exatamente por isso que é inesquecível.",
  },
  solares: {
    name: "Os Solares",
    tagline: "O amor deles ilumina todo mundo ao redor",
    emoji: "☀️",
    gradient: "from-yellow-400/30 to-amber-600/10",
    presentes: "solares",
    desc: "Onde vocês aparecem, a energia muda. São o casal que todo mundo quer estar por perto — e que contagia com a própria felicidade.",
  },
  silenciosos: {
    name: "Os Silenciosos",
    tagline: "O amor deles não precisa de palco",
    emoji: "🌙",
    gradient: "from-violet-500/30 to-purple-900/10",
    presentes: "silenciosos",
    desc: "Vocês não performam o amor — vivem ele. A profundidade de vocês é o tipo de coisa que só quem está por dentro entende.",
  },
};

// ─── Mapeamento de respostas → voto de arquétipo ─────────────────────────
// [questao][resposta] = ArchetypeId que recebe ponto (peso: questoes 0,1,4,5,8,9 = 2pts; demais = 1pt)
const Q_ARCH: ArchetypeId[][] = [
  // Q0: amor — expressão
  ["intensos", "ninho", "silenciosos", "solares"],
  // Q1: amor — receber
  ["ninho", "cumplices", "intensos", "ninho"],
  // Q2: reacao — silêncio
  ["intensos", "silenciosos", "cumplices", "ninho"],
  // Q3: reacao — raiva
  ["silenciosos", "intensos", "cumplices", "aventureiros"],
  // Q4: mundo — escape
  ["ninho", "aventureiros", "silenciosos", "cumplices"],
  // Q5: mundo — fim de semana
  ["aventureiros", "ninho", "solares", "silenciosos"],
  // Q6: energia — dia livre
  ["aventureiros", "ninho", "silenciosos", "cumplices"],
  // Q7: energia — festa
  ["solares", "cumplices", "ninho", "silenciosos"],
  // Q8: cuidado — dar
  ["intensos", "cumplices", "solares", "ninho"],
  // Q9: cuidado — receber
  ["ninho", "cumplices", "silenciosos", "aventureiros"],
];

const HIGH_WEIGHT_QS = new Set([0, 1, 4, 5, 8, 9]);

export function calcArchetype(answers: number[]): ArchetypeId {
  const scores: Record<ArchetypeId, number> = {
    cumplices: 0, aventureiros: 0, ninho: 0,
    intensos: 0, solares: 0, silenciosos: 0,
  };
  answers.forEach((ans, qi) => {
    const arch = Q_ARCH[qi]?.[ans];
    if (arch) scores[arch] += HIGH_WEIGHT_QS.has(qi) ? 2 : 1;
  });
  return (
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as ArchetypeId
  );
}
