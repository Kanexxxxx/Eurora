import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  tipo: z.enum(["carta", "poema", "musica", "presente", "bio", "convite"]),
  campos: z.record(z.string(), z.string()),
});

// Deterministic template selection based on input hash
function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return arr[h % arr.length];
}

function fill(template: string, campos: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => campos[key]?.trim() || "você");
}

// ─── TEMPLATE BANKS ──────────────────────────────────────────────────────────

const CARTAS = [
  `{para},

Existem pessoas que passam pela vida como ventos — e existem as que ficam, como você ficou em mim.

{lembranca}. Esse momento ainda mora aqui dentro, do jeito que só as coisas verdadeiras ficam.

Não sei te explicar o que é acordar e saber que você existe. Mas sei que é a melhor parte de qualquer dia.

Com tudo que eu sou,`,

  `{para},

Se eu pudesse guardar um só momento, seria aquele em que {lembranca}. Porque foi ali que eu percebi: isso é real. Isso é você. Isso é nós.

Às vezes o amor não chega como tempestade. Chega suave, como luz de tarde — e de repente tudo faz sentido.

Você faz sentido pra mim.

Com amor de verdade,`,

  `Para {para},

Tem coisas que a gente não sabe que está esperando até que elas chegam. Você chegou assim — sem aviso, sem pressa, e mudou tudo.

Lembro quando {lembranca}. Aquela sensação de encaixe perfeito que não precisa de explicação.

Obrigado(a) por ser o tipo de amor que transforma.

Sempre seu(sua),`,

  `{para},

Escrever sobre você é difícil. Não por falta de palavras — mas porque todas parecem pequenas demais.

O que eu sei é que {lembranca}, e desde então eu me tornei uma versão melhor de mim. Essa é a sua culpa. E eu te agradeço por isso todos os dias.

Você não é só amor. Você é lar.

Do(a) seu(sua) favorito(a),`,

  `{para} querido(a),

Existem momentos que a gente carrega na memória com mais cuidado do que qualquer coisa que já teve. Para mim, {lembranca} é um deles.

Naquele instante, sem perceber, eu entendi o que significa ter alguém que é completamente seu.

Você é meu presente favorito.

Com carinho infinito,`,

  `{para},

Hoje eu precisava te dizer: você importa. De um jeito que nenhuma palavra consegue dar conta completamente.

Cada momento ao seu lado — e especialmente quando {lembranca} — me prova que escolher você foi a melhor decisão que já tomei.

Te amo mais do que as palavras que eu sei usar.

Seu(Sua) para sempre,`,

  `Pra {para},

O amor de verdade não precisa de grandes gestos. Ele está nas pequenas coisas — no jeito como você ri, como cuida, como é você.

Mas quando {lembranca}, foi um grande gesto da vida me mostrando que eu tinha chegado onde deveria estar.

Ao seu lado.

Com todo o meu coração,`,
];

const POEMAS = [
  `{nome},

você não chegou como tempestade.
chegou como aquela luz de tarde
que entra pela janela sem pedir —
e de repente tudo fica mais bonito.

sinto {sentimento}
toda vez que penso em nós —
não sei se é amor ou milagre.
provavelmente os dois.`,

  `Para {nome}

Existem coisas que os olhos enxergam
antes das palavras alcançarem:
o jeito que você existe no espaço,
a forma como tudo para quando você fala.

{sentimento} —
é assim que eu te sinto.
Todos os dias, de formas diferentes,
mas sempre com a mesma certeza.`,

  `{nome},

Se o amor tivesse cor,
seria aquela que mistura
o aconchego do que é familiar
com o brilho do que ainda surpreende.

Sinto {sentimento}
quando estou com você —
como se o tempo soubesse
que vale a pena ser vivido.`,

  `Alguém me disse uma vez
que o amor verdadeiro
não faz barulho quando chega.

Que chega devagar,
em detalhes que só você percebe —
{sentimento},
{nome},
é exatamente isso.`,

  `Não preciso de grandes palavras
para dizer o que sinto.

Preciso de você.
De {nome}.
De {sentimento}
guardado dentro do peito
feito coisa preciosa.

E é o que você é.`,
];

const MUSICAS: Record<string, string[]> = {
  sertanejo: [
    `[Verso 1]
Anoiteceu e eu to aqui pensando em você
Nessa saudade que não some, que não quer me esquecer
{historia}

[Refrão]
Você chegou e foi ficando
Fez meu coração entender
Que amar de verdade é pousar
No peito de quem sabe nos fazer

[Verso 2]
O tempo passou e eu só fico mais seu(sua)
Em cada momento vivido, em cada beijo que eu te dei

[Final]
Você é meu lar, meu caminho, meu jeito de ser
E eu não trocaria nada do que temos por nada`,

    `[Verso 1]
Eu te olho e sinto
Que o mundo pode parar
{historia}
E só eu e você

[Refrão]
Que sorte a minha
Que vida boa essa
Ter você do meu lado
Em cada promessa

[Verso 2]
Tem coisa no amor
Que a gente não explica
Só sente no peito
E o coração publica`,
  ],
  pop: [
    `[Verso 1]
{historia}
Desde então não fui o(a) mesmo(a)
Você mudou tudo sem querer

[Pré-refrão]
E eu aprendi que amor de verdade
Não é perfeito — é real

[Refrão]
Você é a minha música favorita
Que eu coloco no repeat
O tipo de coisa que vicia
Que dá vontade de repetir

[Bridge]
Não quero imaginar um dia sem você
É simples assim`,
  ],
  mpb: [
    `[Verso 1]
{historia}
E ali entendi sem precisar de mais
Que alguns encontros mudam o que somos

[Refrão]
Você é o que fica
Depois que tudo passa
O amor que não explica
Mas que não cansa

[Verso 2]
Não é sobre palavras bonitas
É sobre o silêncio que cabe entre nós
E sobre acordar todo dia sabendo
Que existe você`,
  ],
};

const PRESENTES = [
  `{presente} para o(a) {momento} mais especial —

Não é o que está embrulhado que vale.
É o que veio junto: o pensamento, o cuidado, a certeza de que você merece ser lembrado(a) de um jeito especial.

Feliz {momento}. Você merece esse e muito mais. ❤️`,

  `Para meu(minha) favorito(a),

{presente} com todo o meu carinho — porque algumas pessoas merecem mais do que um "parabéns" ou um "boa sorte".

Você merece um gesto que diga: eu me lembro de você. Sempre.

Com amor,`,

  `{presente} para o(a) {momento} mais memorável —

Escolhi isso porque você merecia algo que ficasse. Um lembrete de que eu te vejo, te admiro e te amo do meu jeito.

Feliz {momento}! 🎁`,
];

const BIOS = [
  `{vibe} ✨
juntos desde {data} 💕
ele(a) me faz rir sem querer
ela(e) me faz escolher ficar
📍 dois, pra sempre`,

  `{data} — o dia que tudo mudou 💗
{vibe} em dose dupla
construindo a vida juntos, um dia de cada vez ☁️✨`,

  `dois loucos, uma história ❤️‍🔥
{vibe} | juntos desde {data}
ela(e) foi minha melhor decisão
(segunda melhor foi o sorvete)`,

  `{data} 💌
{vibe} — e muito mais
a melhor parte de qualquer dia
é saber que você existe 🌙`,
];

const CONVITES = [
  `Oi, {ocasiao} especial.

Tenho um convite:

{local}.

Só você e eu. Sem pressa. Do jeito que a gente gosta.

Me fala se você topa. (Já sei que você topa.)

Com carinho,`,

  `Para o(a) meu(minha) favorito(a),

Você está convidado(a) para um {ocasiao} que eu preparei só pra você.

📍 {local}

Não precisa trazer nada — só você já é mais do que suficiente.

Te espero. 💌`,

  `{ocasiao} especial.
{local}.

Não é grande coisa.
Mas é com você — e isso já faz de tudo a melhor versão.

Você vem? ❤️`,
];

// ─── GENERATOR ───────────────────────────────────────────────────────────────

function generate(tipo: string, campos: Record<string, string>): string {
  const seed = Object.values(campos).join("|");

  switch (tipo) {
    case "carta": {
      const template = pick(CARTAS, seed);
      return fill(template, campos);
    }
    case "poema": {
      const template = pick(POEMAS, seed);
      return fill(template, campos);
    }
    case "musica": {
      const estilo = (campos.estilo ?? "").toLowerCase();
      let pool = MUSICAS.pop;
      if (estilo.includes("sertanejo") || estilo.includes("country")) pool = MUSICAS.sertanejo;
      else if (estilo.includes("mpb") || estilo.includes("bossa")) pool = MUSICAS.mpb;
      else if (estilo.includes("pop")) pool = MUSICAS.pop;
      else pool = [...MUSICAS.sertanejo, ...MUSICAS.pop, ...MUSICAS.mpb];
      const template = pick(pool!, seed);
      return fill(template, campos);
    }
    case "presente": {
      const template = pick(PRESENTES, seed);
      return fill(template, campos);
    }
    case "bio": {
      const template = pick(BIOS, seed);
      return fill(template, campos);
    }
    case "convite": {
      const template = pick(CONVITES, seed);
      return fill(template, campos);
    }
    default:
      return "Texto gerado com carinho. 💌";
  }
}

// ─── RATE LIMIT ──────────────────────────────────────────────────────────────

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();

function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = RATE_LIMIT.get(ip);
  if (!e || now - e.ts > 60_000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return true;
  }
  if (e.count >= 30) return false;
  e.count++;
  return true;
}

// ─── HANDLER ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRL(ip)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde 1 minuto." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { tipo, campos } = parsed.data;
  const texto = generate(tipo, campos);

  return NextResponse.json({ texto });
}
