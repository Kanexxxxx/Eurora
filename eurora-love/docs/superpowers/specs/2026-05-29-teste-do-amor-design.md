# Spec: Teste do Amor 2.0

**Data:** 2026-05-29
**Rota:** `/quiz` (inalterada)
**Nome público:** Teste do Amor (inalterado em título, menu e URL)
**Custo de IA:** R$0 — 100% templates locais

---

## Objetivo

Transformar o Teste do Amor de um quiz simples de "acertou/errou" em uma experiência emocional completa que revela o **arquétipo do casal**, um **radar de sintonia em 5 dimensões**, textos personalizados via template e CTAs conectados ao ecossistema (presentes, LovePage, IA Romântica). Manter viralidade para WhatsApp, Instagram e TikTok.

---

## Restrições

- Nome público "Teste do Amor" inalterado em título H1, meta, menu e rota
- Rota permanece `/quiz`
- Links antigos (com `?t=...` gerados hoje) devem continuar funcionando via fallback
- Zero custo de API — tudo local
- Stack: Next.js App Router, TypeScript, Framer Motion, Tailwind v4
- Sem novos pacotes (nenhuma lib de gráfico — radar visual feito em SVG inline ou CSS)

---

## Estrutura de Dados

### Hoje (QuizData)
```ts
type QuizData = { n: string; q: number[]; c: CustomQ[] }
```

### Nova (QuizData v2)
```ts
type QuizData = {
  v: 2;                    // versão — distingue links novos dos antigos
  n: string;               // nome do criador
  nick: string;            // apelido do parceiro ("meu amor", "Pedro", etc.)
  q: number[];             // respostas do criador (10 itens)
  c: CustomQ[];            // perguntas customizadas (mantido para compatibilidade)
  arch: ArchetypeId;       // arquétipo calculado do criador
}

type ArchetypeId = "cumplices" | "aventureiros" | "ninho" | "intensos" | "solares" | "silenciosos"
```

**Fallback de compatibilidade:** se `v` estiver ausente ou for `1`, usar o fluxo de resultado antigo (TIERS por score %). Isso garante que links já compartilhados hoje continuem funcionando.

---

## As 10 Perguntas (substituem as 8 atuais)

Organizadas em 5 dimensões, 2 perguntas cada. O índice da resposta é salvo em `q[]`.

### Dimensão 0 — `amor` (Como me expresso e como me sinto amado)

**Q0:** "Quando gosto muito de alguém, o que faço naturalmente?"
- 0: Mando mensagem e ligo sem parar 📱
- 1: Faço coisas práticas pra facilitar a vida da pessoa 🔧
- 2: Fico do lado sem precisar de palavras 🤫
- 3: Elogio e valorizo em voz alta com frequência 💬

**Q1:** "Me sinto mais amado(a) quando ele/ela..."
- 0: Me surpreende com algo pequeno sem motivo 🎁
- 1: Fica do meu lado em silêncio quando estou mal 🫂
- 2: Fala o que sente, sem rodeios ❤️
- 3: Faz coisas práticas pra me ajudar sem eu pedir 🛠️

### Dimensão 1 — `reacao` (Como reajo em conflito e em silêncio)

**Q2:** "Quando digo 'não tem nada' mas tem..."
- 0: Quero que me perguntem de novo com mais carinho 🥺
- 1: Preciso resolver sozinho(a) antes de falar 🧠
- 2: Estou esperando o momento certo pra abrir 🕐
- 3: Quero que a pessoa simplesmente fique perto 🤝

**Q3:** "Quando fico com raiva, minha reação natural é..."
- 0: Fico em silêncio e me fecho 😶
- 1: Falo tudo na hora, sem filtro 💥
- 2: Choro e processo por dentro 😢
- 3: Me afasto por um tempo pra respirar 🚶

### Dimensão 2 — `mundo` (Meu escape e meu sonho)

**Q4:** "Quando preciso me recuperar de um dia horrível, o que me restaura de verdade?"
- 0: Séries ou filmes no conforto de casa 🛋️
- 1: Sair — um jantar, uma caminhada, qualquer coisa fora de casa 🚶‍♀️
- 2: Silêncio e meu próprio espaço 🧘
- 3: Conversar com quem me importa 💬

**Q5:** "Se eu pudesse fazer uma coisa esse fim de semana sem limitação, faria..."
- 0: Planejaria uma viagem de última hora ✈️
- 1: Ficaria em casa com a pessoa que amo sem fazer nada 🏠
- 2: Reuniria amigos pra rir muito 🎉
- 3: Aprenderia algo novo ou terminaria um projeto pessoal 📚

### Dimensão 3 — `energia` (Introvertido/extrovertido, rotina vs. aventura)

**Q6:** "Num dia livre ideal, eu prefiro..."
- 0: Explorar um lugar novo que nunca fui 🗺️
- 1: Ter uma rotina gostosa e previsível 📆
- 2: Ficar em casa sem compromisso nenhum 😴
- 3: Fazer algo criativo ou aprender uma habilidade nova 🎨

**Q7:** "Numa festa, eu normalmente..."
- 0: Sou um dos últimos a ir embora e conheço todo mundo 🎊
- 1: Fico com meu grupo e curto assim 👫
- 2: Apareço, socializo um pouco e fico com vontade de ir embora 😅
- 3: Prefiro não ir, mas se for, fico quieto(a) num canto 🪑

### Dimensão 4 — `cuidado` (Como cuido e como quero ser cuidado)

**Q8:** "Minha forma favorita de cuidar de quem amo é..."
- 0: Fazer surpresas e presentear ✨
- 1: Estar presente nos momentos difíceis sem precisar ser chamado(a) 🫂
- 2: Dizer o que sinto com frequência ❤️
- 3: Resolver problemas práticos e ajudar no que for preciso 🔧

**Q9:** "Quando estou mal, o que mais me ajuda é..."
- 0: Um abraço longo sem precisar falar nada 🤗
- 1: Alguém que me escute sem dar conselho 👂
- 2: Me deixarem resolver no meu tempo 🕰️
- 3: Distração — algo pra fazer, assistir ou conversar sobre outra coisa 🎮

---

## Cálculo do Arquétipo

O arquétipo é calculado a partir das respostas do **criador** no momento de gerar o link. Não muda com o resultado do parceiro.

```ts
function calcArchetype(answers: number[]): ArchetypeId {
  // Cada resposta vota em características
  // Mapeamento simplificado por dimensão dominante + combinação

  const scores: Record<ArchetypeId, number> = {
    cumplices: 0,
    aventureiros: 0,
    ninho: 0,
    intensos: 0,
    solares: 0,
    silenciosos: 0,
  };

  // Q0 (amor — expressão)
  const q0map: ArchetypeId[] = ["intensos", "ninho", "silenciosos", "solares"];
  scores[q0map[answers[0]]] += 2;

  // Q1 (amor — receber)
  const q1map: ArchetypeId[] = ["ninho", "cumplices", "intensos", "ninho"];
  scores[q1map[answers[1]]] += 2;

  // Q2 (reação silêncio)
  const q2map: ArchetypeId[] = ["intensos", "silenciosos", "cumplices", "ninho"];
  scores[q2map[answers[2]]] += 1;

  // Q3 (raiva)
  const q3map: ArchetypeId[] = ["silenciosos", "intensos", "cumplices", "aventureiros"];
  scores[q3map[answers[3]]] += 1;

  // Q4 (escape)
  const q4map: ArchetypeId[] = ["ninho", "aventureiros", "silenciosos", "cumplices"];
  scores[q4map[answers[4]]] += 2;

  // Q5 (fim de semana)
  const q5map: ArchetypeId[] = ["aventureiros", "ninho", "solares", "silenciosos"];
  scores[q5map[answers[5]]] += 2;

  // Q6 (dia livre)
  const q6map: ArchetypeId[] = ["aventureiros", "ninho", "silenciosos", "cumplices"];
  scores[q6map[answers[6]]] += 1;

  // Q7 (festa)
  const q7map: ArchetypeId[] = ["solares", "cumplices", "ninho", "silenciosos"];
  scores[q7map[answers[7]]] += 1;

  // Q8 (cuidar)
  const q8map: ArchetypeId[] = ["intensos", "cumplices", "solares", "ninho"];
  scores[q8map[answers[8]]] += 2;

  // Q9 (quando mal)
  const q9map: ArchetypeId[] = ["ninho", "cumplices", "silenciosos", "aventureiros"];
  scores[q9map[answers[9]]] += 2;

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as ArchetypeId;
}
```

---

## Os 6 Arquétipos

```ts
const ARCHETYPES: Record<ArchetypeId, {
  name: string;
  tagline: string;
  emoji: string;
  color: string;         // Tailwind gradient para o card
  presentes: string;     // query param para /presentes
  desc: string;          // descrição pública (exibida no resultado)
}> = {
  cumplices: {
    name: "Os Cúmplices",
    tagline: "Se entendem com um olhar",
    emoji: "🤫",
    color: "from-[#ff2d6a]/30 to-[#ffb1c9]/10",
    presentes: "cumplices",
    desc: "Vocês não precisam de palavras pra se entender. Têm uma linguagem própria — silêncios que falam, olhares que traduzem.",
  },
  aventureiros: {
    name: "Os Aventureiros",
    tagline: "Colecionam experiências, não coisas",
    emoji: "✈️",
    color: "from-amber-500/30 to-amber-700/10",
    presentes: "aventureiros",
    desc: "Pra vocês, amor é movimento. Uma viagem de última hora, um lugar nunca visitado, um plano que nasce na hora.",
  },
  ninho: {
    name: "O Ninho",
    tagline: "Transformam qualquer lugar em lar",
    emoji: "🏠",
    color: "from-emerald-500/30 to-teal-700/10",
    presentes: "ninho",
    desc: "Vocês não precisam do mundo inteiro — só do espaço de vocês dois. O conforto é a linguagem do amor de vocês.",
  },
  intensos: {
    name: "Os Intensos",
    tagline: "Amam forte, sentem forte",
    emoji: "🔥",
    color: "from-orange-500/30 to-red-700/10",
    presentes: "intensos",
    desc: "Vocês nunca fazem nada pela metade. O amor de vocês tem volume, tem cor, tem peso. E é exatamente por isso que é inesquecível.",
  },
  solares: {
    name: "Os Solares",
    tagline: "O amor deles ilumina todo mundo ao redor",
    emoji: "☀️",
    color: "from-yellow-400/30 to-amber-600/10",
    presentes: "solares",
    desc: "Onde vocês aparecem, a energia muda. São o casal que todo mundo quer estar por perto — e que contagia com a própria felicidade.",
  },
  silenciosos: {
    name: "Os Silenciosos",
    tagline: "O amor deles não precisa de palco",
    emoji: "🌙",
    color: "from-violet-500/30 to-purple-900/10",
    presentes: "silenciosos",
    desc: "Vocês não performam o amor — vivem ele. A profundidade de vocês é o tipo de coisa que só quem está por dentro entende.",
  },
};
```

---

## Templates de Resultado (30 combinações)

5 faixas de score × 6 arquétipos. Variáveis disponíveis nos templates: `{name}`, `{partner}`, `{score}`, `{total}`.

Faixas:
- `perfect`: score === total
- `high`: score >= 80% total
- `mid`: score >= 60% total
- `low`: score >= 40% total
- `miss`: score < 40% total

```ts
const RESULT_TEMPLATES: Record<ArchetypeId, Record<"perfect"|"high"|"mid"|"low"|"miss", string>> = {
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
    mid: "{partner} conhece o essencial — onde você se sente seguro(a), o que te conforta. O resto vem com o tempo de convivência que vocês ainda vão ter.",
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
    high: "Quase perfeito. {partner} sabe o que te acende — faltou só um detalhe da sua luz mais interna. Logo logo ele/ela vai encontrar.",
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
```

---

## Radar Visual — 5 Dimensões

O radar é um SVG inline animado com Framer Motion. Sem libs externas.

**Dimensões exibidas:**
- `amor` — Linguagem do Amor
- `reacao` — Como Reage
- `mundo` — Universo Pessoal
- `energia` — Energia do Casal
- `cuidado` — Forma de Cuidar

**Score por dimensão:** 0.0 – 1.0, calculado por quantas das 2 perguntas daquela dimensão o parceiro acertou (0 = 0.0, 1 = 0.5, 2 = 1.0).

**Visual:** Pentágono regular. Fundo semitransparente, preenchimento com gradiente rose gold. Animação de `scale: 0 → 1` com spring ao montar.

**Revelação progressiva:** durante o quiz do parceiro, a cada pergunta respondida, a dimensão correspondente "acende" num mini-radar de 5 pontas posicionado no canto superior direito da tela, substituindo o percentual numérico que existe hoje. Dimensão acertada → preenche em rose gold. Errada → fica cinza translúcido.

---

## Fluxo Completo de Telas

### Criador (sem `?t=`)

1. **`name`** — Nome + apelido do parceiro
2. **`quiz`** — 10 perguntas (substituem o `preset` atual)
3. **`custom`** — Perguntas customizadas (mantido, opcional, até 2)
4. **`preview`** — **NOVO** — Mostra arquétipo do criador (nome + emoji) como prévia parcial. "Agora vamos ver se {nick} te conhece."
5. **`share`** — Link + WhatsApp + CTA

### Parceiro (com `?t=...`)

1. **`intro`** — Card do arquétipo com `filter: blur(12px) grayscale(1)` + emoji `?` por cima + label "Responda pra revelar o arquétipo de vocês". O blur é estático nesta tela; a revelação completa acontece só na tela `result` após responder todas as perguntas.
2. **`quiz`** — 10 perguntas com mini-radar lateral acendendo progressivamente
3. **`result`** — Resultado completo

### Tela de Resultado (nova)

```
[ Card do Arquétipo ]
  └── Emoji grande + nome + tagline
  └── Descrição emocional (template local com variáveis)

[ Radar do Casal ]
  └── SVG pentagonal animado
  └── Labels das 5 dimensões
  └── Score % em cada ponta

[ Score secundário ]
  └── "{score}/{total} dimensões descobertas"
  └── Barra visual (não o número bruto como hoje)

[ CTAs ]
  ├── "Ver presentes para {archetype.name} →"  → /presentes?tipo={arch}
  ├── "Criar a página de vocês →"               → /criar
  ├── "Compartilhar resultado →"                 (card + texto shareable)
  └── "Criar o teste sobre mim →"               → /quiz (loop viral, sem parâmetro)
```

---

## Texto de Compartilhamento (novo)

**WhatsApp (do parceiro depois de fazer o quiz):**
```
Fiz o teste de {name} e descobrimos que somos "{archetype.name}" 💕
Acertei {score}/{total} sobre ela/ele — e o resultado me surpreendeu.
Descubra o arquétipo do seu casal também →
[url]/quiz
```

**WhatsApp (do criador ao enviar o link):**
```
Será que você me conhece mesmo? 🤔
Tenho um arquétipo secreto aqui. Descobre →
[shareUrl]
```

---

## Compatibilidade com Links Antigos

```ts
// No QuizData decoder: se não houver campo v, tratar como v1
const isV1 = !data.v || data.v < 2;

// No PartnerView: se isV1, renderizar resultado com TIERS antigo
// Se v2, renderizar resultado novo com arquétipo + radar
```

---

## Arquivos Afetados

| Arquivo | Mudança |
|---|---|
| `src/app/quiz/QuizClient.tsx` | Substituição completa (mantém encode/decode, adiciona campos v2) |
| Nenhum outro arquivo | O quiz é self-contained no client |

---

## Fora do Escopo deste Spec

- Filtro de presentes por arquétipo em `/presentes` (requer spec separado)
- Card de compartilhamento renderizado como imagem (requer OG route separada)
- Arquétipo salvo em banco para analytics (requer schema change separado)
- Qualquer custo de API de IA

---

## Critérios de Sucesso

- [ ] Links antigos (`v1`) continuam funcionando
- [ ] Arquétipo calculado localmente, zero API
- [ ] Radar SVG animado visível no resultado
- [ ] Texto de resultado usa variáveis `{name}`, `{partner}`, `{score}`, `{total}`
- [ ] 4 CTAs presentes no resultado
- [ ] Revelação progressiva do radar durante o quiz do parceiro
- [ ] Texto de WhatsApp menciona o arquétipo
- [ ] Nome "Teste do Amor" inalterado em título H1, metadata e menu
