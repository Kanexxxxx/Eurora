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

// ─── Score Faixa ─────────────────────────────────────────────────────────
export type ScoreFaixa = "perfect" | "high" | "mid" | "low" | "miss";

export function getScoreFaixa(score: number, total: number): ScoreFaixa {
  if (score === total) return "perfect";
  const pct = score / total;
  if (pct >= 0.8) return "high";
  if (pct >= 0.6) return "mid";
  if (pct >= 0.4) return "low";
  return "miss";
}

// ─── Templates de Resultado (30 combinações) ─────────────────────────────
const RESULT_TEMPLATES: Record<ArchetypeId, Record<ScoreFaixa, string>> = {
  cumplices: {
    perfect: "{partner} te conhece de um jeito que vai além das palavras. Acertou tudo — incluindo as partes que você raramente conta pra alguém. Isso tem nome: cumplicidade.",
    high: "{partner} capturou quase tudo de você. Errou só o que você guarda com mais cuidado — e isso faz sentido pra Os Cúmplices. Essas partes se revelam no tempo certo.",
    mid: "{partner} conhece sua superfície e parte do que está embaixo. As dimensões que faltaram são exatamente onde o amor de vocês ainda vai crescer.",
    low: "Tem muito de você que {partner} ainda vai descobrir. Pra Os Cúmplices, isso não é falha — é promessa. A linguagem de vocês ainda está sendo escrita.",
    miss: "{partner} está no começo de te decifrar — e isso é bom. Os Cúmplices de verdade levam tempo pra aprender o idioma um do outro. Vocês estão nesse processo.",
  },
  aventureiros: {
    perfect: "{partner} conhece cada parte do seu universo aventureiro — inclusive as viagens que você ainda não fez. Isso é sintonia de quem foi feito pra explorar junto.",
    high: "Quase tudo certo. {partner} te acompanha na maioria das aventuras — mas ainda tem rotas que você vai ter que mostrar pessoalmente.",
    mid: "{partner} conhece seu espírito, mas não todos os seus destinos. A boa notícia: Os Aventureiros aprendem melhor vivendo do que estudando.",
    low: "{partner} ainda está mapeando seu universo. Mas que viagem melhor do que essa — descobrir você do zero?",
    miss: "Parece que {partner} tem muito terreno a explorar sobre você. Sugestão: façam uma viagem. É o jeito mais rápido que Os Aventureiros têm pra se conhecer de verdade.",
  },
  ninho: {
    perfect: "{partner} te conhece como conhece o próprio lar — cada canto, cada detalhe, cada silêncio. Isso só vem de quem realmente ficou.",
    high: "Quase todos os cômodos do seu universo foram encontrados. Faltou um ou dois cantinhos — mas O Ninho tem espaço pra ser descoberto aos poucos.",
    mid: "{partner} já sabe o essencial — onde você se sente seguro(a), o que te conforta. O resto vem com o tempo de convivência que vocês ainda vão ter.",
    low: "{partner} ainda está aprendendo a planta do seu mundo. Mas nos casais tipo O Ninho, o lar é construído juntos — não entregue pronto.",
    miss: "Parece que {partner} ainda está na soleira da porta. A boa notícia é que O Ninho se revela pra quem fica — e vocês claramente ficaram.",
  },
  intensos: {
    perfect: "{partner} te conhece forte — do jeito que Os Intensos merecem ser conhecidos. Sem meias palavras, sem suavizar. Inteiro(a).",
    high: "Quase tudo acertado. {partner} sente você — não só entende. Isso é raro. Muito mais do que um quiz consegue medir.",
    mid: "{partner} sente sua energia, mas ainda está aprendendo os detalhes. Os Intensos são complexos — e o amor de vocês tem camadas.",
    low: "{partner} ainda está aprendendo a intensidade de você. Faz sentido — Os Intensos não se revelam de uma vez. São muitas ondas.",
    miss: "Tem muito volume em você que {partner} ainda não ouviu. Isso vai mudar — Os Intensos têm jeito de se fazer entender quando é pra valer.",
  },
  solares: {
    perfect: "{partner} te conhece de fora a dentro — a parte que brilha pra todo mundo e a que só aparece no privado. Sintonia total.",
    high: "Quase perfeito. {partner} sabe o que te acende — faltou só um detalhe da sua luz mais interna. Logo logo vai encontrar.",
    mid: "{partner} conhece sua energia pública — mas o brilho mais íntimo ainda está pra ser revelado. Os Solares guardam uma chama só pra quem fica de verdade.",
    low: "{partner} viu você brilhar, mas ainda não sabe exatamente de onde vem essa luz. Vai descobrir — e vai ser bonito.",
    miss: "Parece que {partner} ainda está no processo de entender como você funciona. Os Solares parecem simples por fora — mas têm muito mais dentro.",
  },
  silenciosos: {
    perfect: "{partner} te conhece sem precisar de declaração. Entendeu o que você não disse, sentiu o que você não explicou. Isso é tudo.",
    high: "Quase tudo captado — e o que faltou provavelmente ainda nem foi dito em voz alta. Os Silenciosos guardam as partes mais bonitas por mais tempo.",
    mid: "{partner} já entrou em partes de você que poucas pessoas acessam. O que faltou ainda está esperando ser revelado — no tempo certo, do jeito certo.",
    low: "{partner} está na superfície do seu universo — mas a parte mais profunda de Os Silenciosos só aparece quando a confiança está bem construída.",
    miss: "Você tem um mundo interno imenso que {partner} ainda vai descobrir. Isso não é distância — é o começo de uma das histórias mais bonitas.",
  },
};

export function getResultText(
  arch: ArchetypeId,
  score: number,
  total: number,
  name: string,
  partner: string
): string {
  const faixa = getScoreFaixa(score, total);
  const template = RESULT_TEMPLATES[arch][faixa];
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{partner\}/g, partner);
}

// ─── Cálculo de score por dimensão ────────────────────────────────────────
// Retorna array de 5 valores [0.0, 0.5, 1.0] — um por dimensão
export function calcDimScores(
  answers: number[],
  correctAnswers: number[]
): [number, number, number, number, number] {
  const hits = [0, 0, 0, 0, 0];
  QUESTIONS.forEach((q, i) => {
    if (answers[i] === correctAnswers[i]) hits[q.dim]++;
  });
  // Cada dimensão tem 2 perguntas → 0, 0.5 ou 1.0
  return hits.map((h) => h / 2) as [number, number, number, number, number];
}

// ─── Dimensões (labels para o radar) ─────────────────────────────────────
export const DIM_LABELS = [
  "Linguagem\ndo Amor",
  "Como\nReage",
  "Universo\nPessoal",
  "Energia\ndo Casal",
  "Forma de\nCuidar",
];

// ─── Encode / Decode (UTF-8 safe base64url) ──────────────────────────────
export function encodeQuiz(data: QuizData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeQuiz(s: string): QuizData | null {
  try {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as QuizData;
  } catch {
    return null;
  }
}

// ─── Helper: monta QuizDataV2 ─────────────────────────────────────────────
export function buildQuizDataV2(
  name: string,
  nick: string,
  answers: number[],
  customQs: CustomQ[]
): QuizDataV2 {
  return {
    v: 2,
    n: name,
    nick,
    q: answers,
    c: customQs,
    arch: calcArchetype(answers),
  };
}
