# Teste do Amor 2.0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o `/quiz` transformando-o em experiência emocional completa com arquétipo do casal, radar de 5 dimensões, 10 perguntas emocionais, revelação progressiva e CTAs conectados ao ecossistema — custo de IA: R$0.

**Architecture:** Toda lógica pura (tipos, constantes, cálculo de arquétipo, templates) vai para `quiz.data.ts`. O `QuizClient.tsx` usa só esses exports para renderizar. Links antigos (v1) continuam funcionando via fallback no decode.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind v4, Framer Motion (já instalado). SVG inline para o radar — sem libs externas.

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/app/quiz/quiz.data.ts` | Criar | Tipos, constantes, funções puras |
| `src/app/quiz/QuizClient.tsx` | Reescrever | Componentes React only |
| `src/app/quiz/page.tsx` | Sem mudança | Já correto |

---

## Task 1: Tipos e Constantes Base

**Files:**
- Create: `eurora-love/src/app/quiz/quiz.data.ts`

- [ ] **Step 1.1: Criar o arquivo com tipos e perguntas**

Criar `src/app/quiz/quiz.data.ts` com o seguinte conteúdo:

```ts
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
```

- [ ] **Step 1.2: Commitar**

```bash
cd eurora-love
git add src/app/quiz/quiz.data.ts
git commit -m "feat(quiz): criar quiz.data.ts com tipos e perguntas v2"
```

---

## Task 2: Arquétipos e Cálculo

**Files:**
- Modify: `eurora-love/src/app/quiz/quiz.data.ts` (append)

- [ ] **Step 2.1: Adicionar ARCHETYPES e calcArchetype ao quiz.data.ts**

Append ao final de `src/app/quiz/quiz.data.ts`:

```ts
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
```

- [ ] **Step 2.2: Verificar calcArchetype com node**

```bash
node -e "
const { calcArchetype } = require('./src/app/quiz/quiz.data.ts');
console.log('Esperado ninho:', calcArchetype([1,0,3,0,0,1,1,2,3,0]));
console.log('Esperado aventureiros:', calcArchetype([0,2,1,3,1,0,0,0,0,3]));
console.log('Esperado silenciosos:', calcArchetype([2,1,1,0,2,3,2,3,1,2]));
" 2>&1 || echo "node direto nao funciona em TS — verificar via tsc abaixo"

cd eurora-love && npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros de TypeScript.

- [ ] **Step 2.3: Commitar**

```bash
git add src/app/quiz/quiz.data.ts
git commit -m "feat(quiz): adicionar arquétipos e calcArchetype"
```

---

## Task 3: Templates de Resultado e Funções Auxiliares

**Files:**
- Modify: `eurora-love/src/app/quiz/quiz.data.ts` (append)

- [ ] **Step 3.1: Adicionar RESULT_TEMPLATES e funções auxiliares**

Append ao final de `src/app/quiz/quiz.data.ts`:

```ts
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
```

- [ ] **Step 3.2: Verificar type-check**

```bash
cd eurora-love && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros.

- [ ] **Step 3.3: Commitar**

```bash
git add src/app/quiz/quiz.data.ts
git commit -m "feat(quiz): adicionar templates de resultado e calcDimScores"
```

---

## Task 4: Encode/Decode v2 com Fallback v1

**Files:**
- Modify: `eurora-love/src/app/quiz/quiz.data.ts` (append)

- [ ] **Step 4.1: Adicionar encode/decode ao quiz.data.ts**

Append ao final de `src/app/quiz/quiz.data.ts`:

```ts
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
```

- [ ] **Step 4.2: Verificar type-check**

```bash
cd eurora-love && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros.

- [ ] **Step 4.3: Commitar**

```bash
git add src/app/quiz/quiz.data.ts
git commit -m "feat(quiz): encode/decode v2 com fallback v1"
```

---

## Task 5: Componente RadarChart (SVG inline)

**Files:**
- Modify: `eurora-love/src/app/quiz/QuizClient.tsx` (início do arquivo — adicionar componente antes de CreatorView)

Nesta task o `QuizClient.tsx` ainda mantém o conteúdo antigo. Apenas adiciona o RadarChart no topo do arquivo.

- [ ] **Step 5.1: Adicionar import do quiz.data.ts e componente RadarChart**

No topo do `QuizClient.tsx` existente, adicionar:

1. Após os imports existentes, adicionar:
```ts
import {
  ARCHETYPES, DIM_LABELS, type ArchetypeId,
} from "./quiz.data";
```

2. Antes da função `CreatorView`, adicionar o componente `RadarChart`:

```tsx
/* ─── RadarChart ─── */
// cx=100 cy=100 r=75. 5 pontos a 72° partindo do topo (-90°).
// Ângulos em graus: -90, -18, 54, 126, 198
const RADAR_ANGLES = [-90, -18, 54, 126, 198].map((d) => (d * Math.PI) / 180);
const CX = 100, CY = 100, R = 75;

function radarPoint(angle: number, score: number) {
  const r = R * Math.max(score, 0.05); // mínimo 5% pra não colapsar
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function RadarChart({
  dims,
  size = 200,
  mini = false,
}: {
  dims: [number, number, number, number, number];
  size?: number;
  mini?: boolean;
}) {
  // Polígono preenchido (score do parceiro)
  const pts = dims.map((d, i) => radarPoint(RADAR_ANGLES[i], d));
  const filled = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // Polígono externo (score = 1.0)
  const outerPts = RADAR_ANGLES.map((a) => radarPoint(a, 1.0));
  const outer = outerPts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="overflow-visible"
    >
      {/* Grade externa */}
      <polygon
        points={outer}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Grade 50% */}
      <polygon
        points={RADAR_ANGLES.map((a) => {
          const p = radarPoint(a, 0.5);
          return `${p.x},${p.y}`;
        }).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      {/* Linhas do centro para cada ponta */}
      {outerPts.map((p, i) => (
        <line
          key={i}
          x1={CX} y1={CY}
          x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {/* Área preenchida */}
      <polygon
        points={filled}
        fill="url(#radarGrad)"
        fillOpacity="0.5"
        stroke="url(#radarStroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Pontos nas extremidades */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={mini ? 2.5 : 4}
          fill="#ff2d6a"
          fillOpacity="0.9"
        />
      ))}
      {/* Labels (só no radar grande) */}
      {!mini &&
        outerPts.map((p, i) => {
          const lx = CX + (R + 22) * Math.cos(RADAR_ANGLES[i]);
          const ly = CY + (R + 22) * Math.sin(RADAR_ANGLES[i]);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="8"
              style={{ whiteSpace: "pre" }}
            >
              {DIM_LABELS[i].split("\n").map((line, li) => (
                <tspan key={li} x={lx} dy={li === 0 ? 0 : 10}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      {/* Gradientes */}
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f6c986" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2d6a" />
          <stop offset="100%" stopColor="#ffb1c9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 5.2: Verificar type-check**

```bash
cd eurora-love && npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros.

- [ ] **Step 5.3: Commitar**

```bash
git add src/app/quiz/QuizClient.tsx
git commit -m "feat(quiz): componente RadarChart SVG inline"
```

---

## Task 6: Reescrever CreatorView (Fluxo do Criador)

**Files:**
- Modify: `eurora-love/src/app/quiz/QuizClient.tsx` — substituir `CreatorView` completa

- [ ] **Step 6.1: Substituir CreatorView**

Substituir a função `CreatorView` inteira por:

```tsx
/* ════════════════════════════════
   CREATOR VIEW
════════════════════════════════ */
function CreatorView() {
  type Step = "name" | "quiz" | "custom" | "preview" | "share";
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [customQs, setCustomQs] = useState<CustomQ[]>([]);
  const [editQ, setEditQ] = useState({ q: "", opts: ["", "", "", ""], a: 0 });
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://eurora.site";

  const quizData = buildQuizDataV2(name, nick, answers, customQs);
  const encoded = step === "share" || step === "preview" ? encodeQuiz(quizData) : "";
  const shareUrl = `${origin}/quiz?t=${encoded}`;
  const arch = step === "preview" || step === "share" ? calcArchetype(answers) : "ninho";
  const archData = ARCHETYPES[arch];

  const whatsappMsg =
    `Será que você me conhece mesmo? 🤔\n` +
    `Tenho um arquétipo secreto aqui. Descobre →\n${shareUrl}`;

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setStep("custom");
    }
  }

  function addCustomQ() {
    const validOpts = editQ.opts.filter((o) => o.trim());
    if (!editQ.q.trim() || validOpts.length < 2) return;
    const finalOpts = editQ.opts.filter((o) => o.trim());
    setCustomQs([...customQs, { q: editQ.q.trim(), opts: finalOpts, a: Math.min(editQ.a, finalOpts.length - 1) }]);
    setEditQ({ q: "", opts: ["", "", "", ""], a: 0 });
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <AnimatePresence mode="wait">

      {/* ── STEP: NAME ── */}
      {step === "name" && (
        <motion.section
          key="name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Teste do Amor
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight leading-[0.95]">
            Ele/ela te<br />
            <span className="text-gradient-rose">conhece bem?</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Responda perguntas sobre você, gere um link e manda no WhatsApp.
            O resultado revela o <span className="text-[#ffb1c9] font-medium">arquétipo do casal</span>.
          </p>

          <div className="card-premium p-6 mb-5 space-y-4">
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 text-left">
                Seu nome
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como você se chama?"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 text-left">
                Como você chama ele/ela?
              </label>
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Meu amor, Pedro, Lulinha…"
                className={inputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim() && nick.trim()) setStep("quiz");
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("quiz")}
            disabled={!name.trim() || !nick.trim()}
            className="btn-premium w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Criar meu teste →
          </button>
          <p className="mt-6 text-white/35 text-xs">
            Grátis · Sem cadastro · Link instantâneo
          </p>
        </motion.section>
      )}

      {/* ── STEP: QUIZ (10 perguntas) ── */}
      {step === "quiz" && (
        <motion.section
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative px-4 pt-12 pb-20 max-w-2xl mx-auto"
        >
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-sm">{qIdx + 1} / {QUESTIONS.length}</p>
              <p className="text-[#ffb1c9] text-sm font-semibold">
                {Math.round(((qIdx + 1) / QUESTIONS.length) * 100)}%
              </p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                animate={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className="text-white/45 text-sm mb-2 uppercase tracking-wider">
            Sobre você, {name}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 leading-tight tracking-tight">
                {QUESTIONS[qIdx].q}
              </h2>
              <div className="space-y-3">
                {QUESTIONS[qIdx].opts.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(i)}
                    className="card-premium w-full text-left px-6 py-4 text-white/85 font-medium"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}

      {/* ── STEP: CUSTOM QUESTIONS ── */}
      {step === "custom" && (
        <motion.section
          key="custom"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-12 pb-24 max-w-xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">✨</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
              Quer adicionar perguntas suas?
            </h2>
            <p className="text-white/50 text-sm">
              Opcional — até 2 perguntas personalizadas sobre você.
            </p>
          </div>

          {customQs.length > 0 && (
            <div className="space-y-3 mb-6">
              {customQs.map((cq, i) => (
                <div key={i} className="card-premium p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white/85 text-sm font-medium truncate">{cq.q}</p>
                    <p className="text-white/40 text-xs mt-1">Resposta correta: {cq.opts[cq.a]}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomQs(customQs.filter((_, j) => j !== i))}
                    className="shrink-0 text-white/30 hover:text-white/70 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {customQs.length < 2 && (
            <div className="card-premium p-5 mb-5 space-y-3">
              <input
                value={editQ.q}
                onChange={(e) => setEditQ({ ...editQ, q: e.target.value })}
                placeholder="Sua pergunta… ex: Qual é meu prato favorito?"
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-2">
                {editQ.opts.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const next = [...editQ.opts];
                      next[i] = e.target.value;
                      setEditQ({ ...editQ, opts: next });
                    }}
                    placeholder={`Opção ${String.fromCharCode(65 + i)}${i < 2 ? " *" : ""}`}
                    className={inputClass + " text-sm"}
                  />
                ))}
              </div>
              <div>
                <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">
                  Qual é a resposta certa?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {editQ.opts.map((opt, i) =>
                    opt.trim() ? (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setEditQ({ ...editQ, a: i })}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          editQ.a === i
                            ? "bg-[#ff2d6a] text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}: {opt.trim().slice(0, 18)}
                      </button>
                    ) : null
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={addCustomQ}
                disabled={!editQ.q.trim() || editQ.opts.filter((o) => o.trim()).length < 2}
                className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                + Adicionar pergunta
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep("preview")}
            className="btn-premium w-full text-base"
          >
            {customQs.length === 0 ? "Ver meu arquétipo →" : "Ver meu arquétipo →"}
          </button>
        </motion.section>
      )}

      {/* ── STEP: PREVIEW (arquétipo do criador) ── */}
      {step === "preview" && (
        <motion.section
          key="preview"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-6">
            Com base em você, {name}...
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 0.15 }}
            className={`relative rounded-[28px] p-8 bg-gradient-to-br ${archData.gradient} border border-white/10 mb-8`}
          >
            <p className="text-6xl mb-4">{archData.emoji}</p>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Seu arquétipo</p>
            <h2 className="font-heading text-3xl text-white mb-2 tracking-tight">
              {archData.name}
            </h2>
            <p className="text-white/60 text-sm italic">{archData.tagline}</p>
          </motion.div>

          <p className="text-white/55 mb-8 leading-relaxed">
            Agora vamos ver se <span className="text-[#ffb1c9] font-medium">{nick || "seu parceiro(a)"}</span> te conhece.
          </p>

          <button
            type="button"
            onClick={() => setStep("share")}
            className="btn-premium w-full text-base"
          >
            Gerar link do teste →
          </button>
        </motion.section>
      )}

      {/* ── STEP: SHARE ── */}
      {step === "share" && (
        <motion.section
          key="share"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-12 pb-24 max-w-xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            className="text-6xl mb-5"
          >
            🎉
          </motion.div>
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3 tracking-tight">
            Teste criado, {name}!
          </h2>
          <p className="text-white/55 mb-8 leading-relaxed">
            Manda pro {nick || "seu parceiro(a)"} e descobre se ele/ela<br className="hidden sm:block" />
            conhece o seu arquétipo. 💕
          </p>

          <div className="card-premium p-4 mb-3 flex items-center gap-3">
            <p className="text-white/45 text-xs font-mono flex-1 truncate text-left">
              {shareUrl}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-xs transition-all"
            >
              {copied ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium w-full text-base flex items-center justify-center gap-2 mb-4"
          >
            <span>📲</span> Enviar no WhatsApp
          </a>
          <p className="text-white/30 text-xs">
            O link já contém o teste completo — sem cadastro nem conta.
          </p>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-white/40 text-xs mb-3">Enquanto espera a resposta...</p>
            <Link href="/criar" className="btn-ghost-glow inline-flex items-center gap-2 text-sm">
              💌 Criar página do amor →
            </Link>
          </div>
        </motion.section>
      )}

    </AnimatePresence>
  );
}
```

- [ ] **Step 6.2: Adicionar import dos exports que faltam no topo do QuizClient.tsx**

No topo do arquivo, atualizar o import de `./quiz.data` para incluir tudo:

```ts
import {
  ARCHETYPES,
  QUESTIONS,
  DIM_LABELS,
  calcArchetype,
  calcDimScores,
  getResultText,
  buildQuizDataV2,
  encodeQuiz,
  decodeQuiz,
  isV2,
  type ArchetypeId,
  type QuizData,
  type QuizDataV2,
  type CustomQ,
} from "./quiz.data";
```

Remover do `QuizClient.tsx` as definições antigas de `encodeQuiz`, `decodeQuiz`, `PRESET`, `TIERS`, `CustomQ`, `QuizData` (agora estão em `quiz.data.ts`).

- [ ] **Step 6.3: Verificar type-check**

```bash
cd eurora-love && npx tsc --noEmit 2>&1 | head -40
```

Esperado: sem erros.

- [ ] **Step 6.4: Commitar**

```bash
git add src/app/quiz/QuizClient.tsx
git commit -m "feat(quiz): reescrever CreatorView com nick, 10 perguntas, preview e share v2"
```

---

## Task 7: Reescrever PartnerView (Fluxo do Parceiro)

**Files:**
- Modify: `eurora-love/src/app/quiz/QuizClient.tsx` — substituir `PartnerView` completa

- [ ] **Step 7.1: Substituir PartnerView**

Substituir a função `PartnerView` inteira por:

```tsx
/* ════════════════════════════════
   PARTNER VIEW
════════════════════════════════ */
function PartnerView({ encoded }: { encoded: string }) {
  const data = decodeQuiz(encoded);
  const v2 = data && isV2(data) ? data : null;

  // Monta lista de perguntas (preset v2 + custom de ambas versões)
  const presetQs = v2
    ? QUESTIONS.map((pq, i) => ({ q: pq.q, opts: pq.opts, correct: v2.q[i] ?? 0 }))
    : data
    ? [
        // Fallback v1: usa perguntas hardcoded legadas inline
        { q: "Qual é a minha cor favorita?", opts: ["Azul 💙","Rosa / Lilás 🌸","Verde 🌿","Preto / Branco 🖤"], correct: data.q[0] ?? 0 },
        { q: "Como prefiro passar meu fim de semana ideal?", opts: ["Em casa relaxando 🛋️","Saindo pra comer e explorar 🍕","Aventura na natureza 🌿","Com muita gente 🎉"], correct: data.q[1] ?? 0 },
        { q: "O que eu não consigo viver sem?", opts: ["Café ou chá ☕","Música 🎵","Celular 📱","Séries ou filmes 🎬"], correct: data.q[2] ?? 0 },
        { q: "Como fico quando estou com raiva?", opts: ["Fico em silêncio 😶","Falo tudo na hora 💬","Choro 😢","Me afasto por um tempo 🚶"], correct: data.q[3] ?? 0 },
        { q: "Minha maior qualidade é...", opts: ["Lealdade e honestidade","Senso de humor 😂","Cuidar dos outros ❤️","Determinação 💪"], correct: data.q[4] ?? 0 },
        { q: "O que me deixa mais feliz?", opts: ["Momentos em casal ❤️","Conquistas e vitórias 🏆","Viajar e explorar 🌍","Comida boa 🍽️"], correct: data.q[5] ?? 0 },
        { q: "Onde sonho em viajar?", opts: ["Europa (Paris, Roma...)","Praia tropical 🏖️","Japão ou Ásia 🗾","EUA (NY, Miami...)"], correct: data.q[6] ?? 0 },
        { q: "Meu gênero favorito de série ou filme?", opts: ["Romance / Drama 💕","Comédia 😂","Terror / Suspense 👻","Ação / Aventura 💥"], correct: data.q[7] ?? 0 },
      ]
    : [];

  const customQs = data
    ? data.c.map((cq) => ({ q: cq.q, opts: cq.opts, correct: cq.a }))
    : [];

  const allQuestions = [...presetQs, ...customQs];

  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white/60 mb-6">Link inválido ou corrompido.</p>
        <Link href="/quiz" className="btn-premium">Criar novo teste</Link>
      </div>
    );
  }

  const score = answers.filter((a, i) => a === allQuestions[i]?.correct).length;
  const total = allQuestions.length;

  // Dimensões apenas para v2
  const dimScores = v2
    ? calcDimScores(answers, v2.q)
    : ([0.5, 0.5, 0.5, 0.5, 0.5] as [number, number, number, number, number]);

  const arch: ArchetypeId = v2?.arch ?? "ninho";
  const archData = ARCHETYPES[arch];
  const partnerName = data.n;
  const nick = v2?.nick ?? "você";

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (qIdx < allQuestions.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setStep("result");
    }
  }

  // Mini-radar: dims acertadas até agora (parcial, durante o quiz)
  const partialDims = v2
    ? (calcDimScores(
        [...answers, ...(Array(QUESTIONS.length - answers.length).fill(-1))],
        v2.q
      ) as [number, number, number, number, number])
    : ([0, 0, 0, 0, 0] as [number, number, number, number, number]);

  return (
    <AnimatePresence mode="wait">

      {/* ── INTRO ── */}
      {step === "intro" && (
        <motion.section
          key="intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative px-4 pt-16 pb-24 max-w-xl mx-auto text-center"
        >
          <span className="text-6xl block mb-6">💌</span>
          <p className="pill pill-live mb-6 mx-auto">
            <span className="live-dot" /> Teste especial pra você
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            <span className="text-gradient-rose">{partnerName}</span> criou<br />
            um teste pra você!
          </h1>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            {partnerName} tem um arquétipo secreto. Você consegue descobrir qual é?
          </p>

          {/* Arquétipo desfocado */}
          {v2 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative mb-8"
            >
              <div
                className={`rounded-[28px] p-8 bg-gradient-to-br ${archData.gradient} border border-white/10`}
                style={{ filter: "blur(12px) grayscale(1)" }}
              >
                <p className="text-6xl mb-3">{archData.emoji}</p>
                <p className="font-heading text-2xl text-white">{archData.name}</p>
                <p className="text-white/60 text-sm mt-1">{archData.tagline}</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl">🔒</p>
                <p className="text-white/70 text-sm mt-2 font-medium">Responda pra revelar</p>
              </div>
            </motion.div>
          )}

          <div className="card-premium p-5 mb-8 grid grid-cols-3 divide-x divide-white/5">
            <div className="text-center px-2">
              <p className="text-2xl mb-1">🧠</p>
              <p className="text-white/70 text-xs">{allQuestions.length} perguntas</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl mb-1">⏱️</p>
              <p className="text-white/70 text-xs">~2 minutos</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl mb-1">💕</p>
              <p className="text-white/70 text-xs">100% revelador</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("quiz")}
            className="btn-premium w-full text-lg"
          >
            Começar o teste →
          </button>
        </motion.section>
      )}

      {/* ── QUIZ ── */}
      {step === "quiz" && (
        <motion.section
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative px-4 pt-12 pb-20 max-w-2xl mx-auto"
        >
          {/* Progress + mini-radar */}
          <div className="mb-10 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/60 text-sm">{qIdx + 1} / {allQuestions.length}</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986]"
                  animate={{ width: `${((qIdx + 1) / allQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            {/* Mini-radar (só v2) */}
            {v2 && (
              <div className="shrink-0 -mt-1">
                <RadarChart dims={partialDims} size={52} mini />
              </div>
            )}
          </div>

          <p className="text-white/40 text-sm mb-2 uppercase tracking-wider">
            Sobre {partnerName}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl text-white mb-8 leading-tight tracking-tight">
                {allQuestions[qIdx].q}
              </h2>
              <div className="space-y-3">
                {allQuestions[qIdx].opts.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(i)}
                    className="card-premium w-full text-left px-6 py-4 text-white/85 font-medium"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}

      {/* ── RESULT ── */}
      {step === "result" && (
        <motion.section
          key="result"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative px-4 pt-12 pb-24 max-w-3xl mx-auto"
        >
          {v2 ? (
            /* ─── RESULTADO V2 (novo) ─── */
            <>
              {/* Card do Arquétipo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[36px] overflow-hidden p-px mb-6"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986] opacity-80" />
                <div className="relative rounded-[35px] bg-[#0a0710]/90 backdrop-blur-md p-8 sm:p-12 text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-4">
                    Vocês são
                  </p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    {archData.emoji}
                  </motion.p>
                  <h3 className="font-heading text-3xl sm:text-4xl text-white mb-2 tracking-tight">
                    {archData.name}
                  </h3>
                  <p className="text-[#ffb1c9] text-sm italic mb-6">{archData.tagline}</p>
                  <p className="text-white/70 leading-relaxed max-w-md mx-auto text-sm sm:text-base">
                    {getResultText(arch, score, total, partnerName, nick)}
                  </p>
                </div>
              </motion.div>

              {/* Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-premium p-6 mb-6 flex flex-col items-center"
              >
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">
                  Radar de Sintonia
                </p>
                <RadarChart dims={dimScores} size={220} />
                <p className="text-white/50 text-sm mt-4">
                  {score}/{total} dimensões descobertas
                </p>
              </motion.div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href={`/presentes?tipo=${archData.presentes}`}
                  className="btn-premium w-full text-base flex items-center justify-center gap-2"
                >
                  🎁 Ver presentes para {archData.name} →
                </a>
                <Link
                  href="/criar"
                  className="block text-center py-3.5 rounded-full text-white font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  💌 Criar a página de vocês →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      `Fiz o teste de ${partnerName} e descobrimos que somos "${archData.name}" 💕\n` +
                      `Acertei ${score}/${total} sobre ela/ele — e o resultado me surpreendeu.\n` +
                      `Descubra o arquétipo do seu casal também →\n${window.location.origin}/quiz`;
                    if (navigator.share) {
                      navigator.share({ title: `Somos ${archData.name}!`, text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  className="w-full py-3.5 rounded-full text-white/70 font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  📲 Compartilhar resultado
                </button>
                <Link
                  href="/quiz"
                  className="block text-center py-3 text-white/40 text-sm hover:text-white/60 transition-colors"
                >
                  Criar o teste sobre mim também →
                </Link>
              </div>
            </>
          ) : (
            /* ─── RESULTADO V1 FALLBACK (legado) ─── */
            (() => {
              const pct = total > 0 ? score / total : 0;
              const TIERS_LEGACY = [
                { min: 1.0, emoji: "💎", title: "Você me conhece de cor e salteado!", text: "Acertou tudo! Isso só prova que a gente foi feito um pro outro." },
                { min: 0.75, emoji: "🔥", title: "Você me conhece muito bem!", text: "Quase perfeito! A ligação entre vocês é real e profunda." },
                { min: 0.5, emoji: "❤️", title: "Você me conhece bastante!", text: "Mais da metade certa! Vocês têm uma boa conexão." },
                { min: 0.25, emoji: "🌱", title: "Ainda tem segredos pra descobrir!", text: "Tá chegando lá! O relacionamento de vocês ainda tem muita história pela frente." },
                { min: 0, emoji: "😄", title: "A gente ainda vai se conhecer muito!", text: "Pontuação baixa não quer dizer nada — significa que vocês têm muito pra explorar juntos." },
              ];
              const tier = TIERS_LEGACY.find((t) => pct >= t.min) ?? TIERS_LEGACY[TIERS_LEGACY.length - 1];
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-[36px] overflow-hidden p-px mb-8"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#ff2d6a] via-[#ffb1c9] to-[#f6c986] opacity-80" />
                  <div className="relative rounded-[35px] bg-[#0a0710]/90 backdrop-blur-md p-8 sm:p-12 text-center">
                    <p className="text-7xl mb-4">{tier.emoji}</p>
                    <p className="font-heading text-7xl sm:text-9xl font-bold animate-shimmer-text leading-none my-6">
                      {score}/{total}
                    </p>
                    <h3 className="font-heading text-2xl sm:text-3xl text-white mb-3">{tier.title}</h3>
                    <p className="text-white/65 leading-relaxed">{tier.text}</p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href="/criar" className="btn-premium inline-flex items-center gap-2">
                        💌 Criar página do amor →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })()
          )}

          {/* Gabarito (ambas versões) */}
          <p className="text-white/40 text-xs uppercase tracking-wider mb-4 text-center mt-8">
            Gabarito completo
          </p>
          <div className="space-y-3">
            {allQuestions.map((q, i) => {
              const correct = answers[i] === q.correct;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                  className="card-premium p-4"
                >
                  <p className="text-white/75 text-sm font-medium mb-2">{q.q}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      correct ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {correct ? "✓ Acertou" : "✗ Errou"}
                    </span>
                    <span className="text-white/40 text-xs">
                      Resposta de {partnerName}: {q.opts[q.correct]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

    </AnimatePresence>
  );
}
```

- [ ] **Step 7.2: Verificar type-check**

```bash
cd eurora-love && npx tsc --noEmit 2>&1 | head -40
```

Esperado: sem erros.

- [ ] **Step 7.3: Commitar**

```bash
git add src/app/quiz/QuizClient.tsx
git commit -m "feat(quiz): reescrever PartnerView com radar, arquétipo e fallback v1"
```

---

## Task 8: Atualizar QuizInner e Shell

**Files:**
- Modify: `eurora-love/src/app/quiz/QuizClient.tsx` — atualizar `QuizInner` e `QuizClient`

- [ ] **Step 8.1: QuizInner e QuizClient já estão corretos (sem mudança necessária)**

O `QuizInner` atual detecta `?t=` e roteia entre `CreatorView` e `PartnerView` — isso continua igual. Verificar que permanece:

```tsx
function QuizInner() {
  const params = useSearchParams();
  const t = params.get("t");
  return t ? <PartnerView encoded={t} /> : <CreatorView />;
}

export default function QuizClient() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingHearts count={10} />
      <FakeNotifications />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-white/40">Carregando...</p>
          </div>
        }
      >
        <QuizInner />
      </Suspense>
    </main>
  );
}
```

Se estiver diferente, restaurar para o formato acima.

- [ ] **Step 8.2: Verificar build completo**

```bash
cd eurora-love && npm run build 2>&1 | tail -30
```

Esperado: `✓ Compiled successfully` sem erros. Warnings de tipagem são aceitáveis mas erros de compilação devem ser corrigidos antes de prosseguir.

- [ ] **Step 8.3: Commitar**

```bash
git add src/app/quiz/QuizClient.tsx src/app/quiz/quiz.data.ts
git commit -m "feat(quiz): Teste do Amor 2.0 — arquétipo, radar e templates locais"
```

---

## Task 9: Teste Manual End-to-End

**Files:** Nenhum arquivo modificado — verificação de comportamento.

- [ ] **Step 9.1: Iniciar servidor dev**

```bash
cd eurora-love && npm run dev
```

Abrir http://localhost:3000/quiz

- [ ] **Step 9.2: Testar fluxo do criador (v2)**

Verificar em sequência:
1. Tela `name` aparece com dois campos (nome + apelido do parceiro)
2. Botão desabilitado enquanto campos estão vazios
3. Após preencher, clicar em "Criar meu teste →"
4. 10 perguntas aparecem com barra de progresso
5. Após responder todas, ir para perguntas customizadas
6. Clicar "Ver meu arquétipo →" — tela preview mostra card com nome do arquétipo
7. Clicar "Gerar link do teste →" — tela share com link e botão WhatsApp
8. Copiar o link gerado

- [ ] **Step 9.3: Testar fluxo do parceiro (v2)**

Colar o link copiado no browser. Verificar:
1. Intro mostra card borrado com 🔒
2. Quiz mostra 10 perguntas + mini-radar no canto superior direito
3. Após responder, tela de resultado mostra:
   - Card do arquétipo com emoji + nome + tagline
   - Texto emocional personalizado (com nome do criador)
   - Radar SVG pentagonal
   - 4 CTAs (presentes, criar página, compartilhar, criar teste sobre mim)
4. Gabarito completo aparece abaixo

- [ ] **Step 9.4: Testar compatibilidade v1**

Usar um link antigo (gerado antes desta implementação — se não tiver, gerar um link v1 manualmente):
```
# Gerar link v1 manualmente no browser console:
const d = {n:"Ana",q:[0,1,2,3,4,5,6,7],c:[]};
const j = JSON.stringify(d);
const b = new TextEncoder().encode(j);
let bin=""; b.forEach(x=>bin+=String.fromCharCode(x));
const enc = btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
console.log("http://localhost:3000/quiz?t="+enc);
```

Verificar que o link abre e mostra o resultado v1 legacy (score numérico simples, sem radar).

- [ ] **Step 9.5: Commitar resultado dos testes**

```bash
git add . && git commit -m "test(quiz): verificação manual v2 e compatibilidade v1 ok" --allow-empty
```

---

## Checklist de Critérios de Sucesso (do Spec)

- [ ] Links antigos (`v1`) continuam funcionando
- [ ] Arquétipo calculado localmente, zero API
- [ ] Radar SVG animado visível no resultado
- [ ] Texto de resultado usa variáveis `{name}`, `{partner}`, `{score}`, `{total}`
- [ ] 4 CTAs presentes no resultado (presentes, criar página, compartilhar, criar teste)
- [ ] Revelação progressiva do mini-radar durante o quiz do parceiro
- [ ] Texto de WhatsApp menciona o arquétipo (no share do criador)
- [ ] Nome "Teste do Amor" inalterado em título H1, metadata e menu
