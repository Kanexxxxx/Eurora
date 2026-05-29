import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/server/rateLimit";

const schema = z.object({
  tipo: z.enum(["carta", "poema", "musica", "presente", "bio", "convite"]),
  campos: z.record(z.string(), z.string()),
});

function pick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return arr[h % arr.length];
}

function fill(template: string, campos: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => campos[key]?.trim() || "você");
}

// ─── CARTAS ──────────────────────────────────────────────────────────────────

const CARTAS = [
  `{para},

Existem pessoas que passam pela vida como ventos — e existem as que ficam, como você ficou em mim.

{lembranca}. Esse momento ainda mora aqui dentro, do jeito que só as coisas verdadeiras ficam.

Não sei te explicar o que é acordar e saber que você existe no mundo. Mas sei que é a melhor parte de qualquer dia — mesmo antes do café, mesmo antes de tudo.

Você não precisa fazer nada especial pra me fazer feliz. Só precisa ser você. E você faz isso tão bem que às vezes eu fico com medo de não merecer.

Mas vou passar o resto da vida tentando merecer.

Com tudo que eu sou,`,

  `{para},

Se eu pudesse guardar um só momento na memória para sempre, seria aquele em que {lembranca}. Porque foi ali que eu percebi: isso é real. Isso é você. Isso é nós.

Às vezes o amor não chega como tempestade. Chega suave, como luz de tarde — e de repente você olha em volta e tudo faz sentido de um jeito que antes não fazia.

Eu não sabia que estava esperando por algo assim. Não tinha nome pra esse buraco. Até que você apareceu e preencheu sem nem perceber.

Obrigado(a) por aparecer. Por ficar. Por ser você.

Com amor de verdade,`,

  `Para {para},

Tem coisas que a gente não sabe que está esperando até que elas chegam. Você chegou assim — sem aviso, sem pressa, e mudou tudo.

Lembro quando {lembranca}. Aquela sensação de encaixe perfeito que não precisa de explicação. Que não cabe em palavras. Que a gente só sente e entende.

Não sei como seria minha vida sem você. E honestamente, não quero nem imaginar. Porque você não é só parte da minha história — você é o capítulo que eu mais gosto de reler.

Obrigado(a) por ser o tipo de amor que transforma.

Sempre seu(sua),`,

  `{para},

Escrever sobre você é difícil. Não por falta de palavras — mas porque todas elas parecem pequenas demais perto do que você representa.

O que eu sei é que {lembranca}, e desde então me tornei uma versão melhor de mim mesmo(a). Essa é a sua culpa. E eu te agradeço por isso todos os dias, mesmo quando não digo em voz alta.

Você me ensinou que amor de verdade não é um furacão. É uma chama constante que aquece sem queimar. Que ilumina sem cegar.

Você não é só amor. Você é lar. E a gente não abandona o lar.

Do(a) seu(sua) favorito(a),`,

  `{para} querido(a),

Existem momentos que a gente carrega com mais cuidado do que qualquer objeto precioso. Para mim, {lembranca} é um desses momentos.

Naquele instante, sem perceber, eu entendi o que significa ter alguém que é completamente seu — não no sentido de posse, mas no sentido de pertencer. De chegar em casa.

Hoje eu quero te dizer: obrigado(a) por me deixar te conhecer. Pela bagunça, pelos silêncios, pela forma como você ri de um jeito que ninguém mais ri. Por me fazer sentir que existe um lugar no mundo feito só pra mim.

Você é meu presente favorito.

Com carinho infinito,`,

  `{para},

Hoje eu precisava te dizer o que normalmente eu guardo pra mim.

Que você importa. De um jeito que nenhuma palavra consegue dar conta completamente. Que quando {lembranca}, eu soube que estava no lugar certo. Do jeito certo. Com a pessoa certa.

Que cada vez que você entra num ambiente, o ambiente muda. Fica mais leve. Mais vivo. E eu fico do lado tentando disfarçar que te observo feito idiota apaixonado(a).

Que eu te escolheria de novo. Em qualquer versão da minha vida, em qualquer universo paralelo, em qualquer linha do tempo — eu te escolheria.

Te amo mais do que as palavras que eu sei usar.

Seu(Sua) para sempre,`,

  `Pra {para},

O amor de verdade não precisa de grandes gestos. Ele está nas pequenas coisas — no jeito como você cuida sem perceber, no como você aparece nos momentos em que eu mais preciso e fingiu que era coincidência.

Mas quando {lembranca}, foi um grande gesto da vida me dizendo: presta atenção aqui. Isso é importante. Isso é raro.

E era mesmo.

Você é raro(a). Do tipo que não se encontra. Do tipo que faz a gente acreditar outra vez quando achava que não conseguia mais.

Ao seu lado — agora e sempre.

Com todo o meu coração,`,

  `{para},

Quero te contar uma coisa que nunca disse direito.

Antes de você, eu achava que sabia o que era amor. Tinha lido sobre isso, tinha sentido algo parecido, tinha acreditado algumas vezes. Mas quando {lembranca}, eu entendi que estava completamente errado(a).

Porque aquilo era outra coisa. Era maior. Mais quieto e mais barulhento ao mesmo tempo. Era do tipo que faz você querer ser melhor — não pra impressionar, mas porque a pessoa do seu lado merece o melhor de você.

Você merece o melhor de mim. E eu ainda estou aprendendo a te dar isso. Mas enquanto eu aprendo, quero que saiba:

Você é a história mais bonita que eu já vivi.

Com amor real,`,

  `Para {para}, com tudo que eu tenho,

Existem amores que ensinam. Existem amores que curam. E aí tem o seu, que faz as duas coisas em silêncio, todo dia, sem você nem perceber.

{lembranca} — lembro como se fosse hoje. Lembro do que eu senti. Lembro de pensar: quero que isso dure. E durou. E continua durando. E eu espero que dure para sempre.

Não tenho muito a oferecer. Tenho meus defeitos, minhas limitações, meus dias ruins. Mas tenho isso aqui — essa certeza de que você é onde eu quero estar.

E tenho a intenção honesta de te fazer feliz, um dia de cada vez.

Seu(sua), completamente,`,

  `{para},

Já tentei escrever essa carta umas três vezes. Apaguei tudo porque ficava parecendo pouco. Mas talvez seja essa a questão: o que eu sinto por você é mais do que palavras alcançam.

Então vou tentar assim: quando {lembranca}, eu não precisei de mais nada. Aquele momento foi suficiente pra eu entender que você é diferente. Que nós somos diferentes.

O mundo pode ser barulhento, cheio de distração, de coisas que puxam pra todo lado. Mas quando estou com você, é como se tudo desacelerasse. Como se houvesse tempo. Como se houvesse paz.

Você é a minha paz favorita.

Com amor que não cabe aqui dentro,`,

  `Querido(a) {para},

Se o amor fosse uma linguagem, a sua seria aquela que eu entendo mesmo sem aprender. Que faz sentido nos detalhes — no café que você lembra que eu gosto, no silêncio que você sabe quando guardar, no abraço que chega antes de eu pedir.

{lembranca} foi o dia em que eu parei de tentar entender e simplesmente aceitei: você é boa(bom) demais pra mim tentar explicar. Você só é. E tudo que você é, é suficiente. É mais que suficiente.

Obrigado(a) por me amar do jeito que você ama — sem fazer isso parecer esforço.

Eternamente seu(sua),`,

  `{para},

Tem uma coisa engraçada sobre amar alguém de verdade: a gente não percebe o exato momento em que acontece.

De repente você olha pra trás e vê que {lembranca}, que aquilo foi o começo de tudo, e que você não trocaria por nada. Nem pelos caminhos que não foram. Nem pelas versões alternativas onde as coisas teriam dado diferente.

Porque o caminho que me trouxe até você valeu cada desvio.

Você é onde eu quero chegar todo dia. Você é o motivo de eu querer acordar. Você é a prova de que as coisas boas existem de verdade.

Feliz de te ter,`,
];

// ─── POEMAS ──────────────────────────────────────────────────────────────────

const POEMAS = [
  `{nome},

você não chegou como tempestade.
chegou como aquela luz de tarde
que entra pela janela sem pedir —
e de repente tudo fica mais bonito.

sinto {sentimento}
toda vez que penso em nós —
não sei se é amor ou milagre.
provavelmente os dois.

e já não importa saber.
só importa você.`,

  `Para {nome}

Existem coisas que os olhos enxergam
antes das palavras alcançarem:
o jeito que você existe no espaço,
a forma como tudo desacelera quando você fala.

{sentimento} —
é assim que eu te sinto.
Todos os dias, de formas diferentes,
mas sempre com a mesma certeza
de que você é onde eu quero estar.`,

  `{nome},

Se o amor tivesse cor,
seria aquela que mistura
o aconchego do que é familiar
com o brilho do que ainda surpreende.

Sinto {sentimento}
quando estou com você —
como se o tempo soubesse
que vale a pena ser vivido.

E talvez seja isso.
Talvez amor seja só isso:
querer que o tempo passe devagar.`,

  `Não preciso de grandes palavras
para dizer o que sinto.

Preciso de {nome}.
De {sentimento}
guardado dentro do peito
feito coisa preciosa,
feito lembrança que a gente
não quer virar saudade.

E é o que você é.
A coisa mais preciosa que eu tenho.`,

  `{nome},

existe um tipo de silêncio
que só acontece com certas pessoas —
o silêncio que não pesa,
que não pede nada,
que simplesmente cabe.

com você, eu aprendi
que {sentimento}
não precisa ser barulhento
pra ser real.

pode ser quieto.
pode ser simples.
pode ser este momento, agora,
com você existindo.`,

  `Para {nome}, que chegou e ficou

Alguém me disse uma vez
que o amor verdadeiro
não faz barulho quando chega.

Que chega devagar,
em detalhes que só você percebe —
no café, no olhar, no abraço de quarta-feira
que não tinha motivo nenhum.

{sentimento}, {nome} —
é exatamente assim.
Sem aviso. Sem pressa.
Com tudo.`,

  `{nome},

eu não sabia que estava com fome
até você chegar com o jantar.
não sabia que estava com frio
até você me cobrir sem eu pedir.

{sentimento} —
essa palavra que antes era teoria
virou prática nas suas mãos.

obrigado(a) por me ensinar
que amor se aprende fazendo.`,

  `Para {nome}

o amor não mora no extraordinário.
mora no ordinário que você faz especial.

na forma como você diz meu nome.
na maneira que você ri quando acha que ninguém vê.
em {sentimento} que eu sinto
toda vez que você simplesmente existe perto de mim.

você transformou o comum em cinema.
e eu quero assistir esse filme
pelo resto da vida.`,

  `{nome},

se eu fosse poeta de verdade
escreveria sobre o exato segundo
em que percebi que estava perdido(a) —
perdido(a) em você, que é diferente de perdido(a) no vazio.

{sentimento}.
três sílabas que não dão conta.
que precisariam de um livro inteiro.

mas enquanto o livro não vem,
fica isso:
você é meu verso favorito.`,

  `Para {nome}, com amor sem rascunho

Tem poemas que a gente escreve com calma.
Tem outros que saem de uma vez,
como coisa que estava esperando a hora.

Esse é do segundo tipo.

{sentimento} —
sem edição, sem revisão,
do jeito que você me faz sentir:
urgente, verdadeiro,
e sem nenhuma vírgula no lugar errado.`,
];

// ─── MÚSICAS ─────────────────────────────────────────────────────────────────

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
Eu te olho e sinto que o mundo pode parar
{historia}
Só eu e você, nesse amor que veio pra ficar

[Refrão]
Que sorte a minha, que vida boa essa
Ter você do meu lado em cada promessa
Amor do interior que o asfalto não apaga
Você chegou pra ficar, nem tenta mais escapar

[Verso 2]
Tem coisa no amor que a gente não explica
Só sente no peito e o coração publica
Em cada olhar, em cada abraço dado
Eu sei que fui o(a) mais sortudo(a) que já existiu nesse lado

[Final]
Fica comigo, meu bem
Que eu te amo sem mais ninguém`,
  ],

  pagode: [
    `[Verso 1]
Tava na minha, sem pensar em nada
Quando você chegou e me pegou na caminhada
{historia}
E hoje eu entendo o que é amar de verdade

[Refrão]
Você virou meu samba preferido
Aquele pagode que eu não canso de ouvir
O amor que eu tanto fiz de despedida
Voltou em você pra me fazer sorrir

[Verso 2]
Não precisa de muita coisa, só precisa de você
De um abraço seu pra tudo ficar bem
No fim do dia cansado, quando chego no portão
É seu sorriso que recarrega meu coração

[Final]
Fica, meu bem
Fica comigo
Você é o pagode que eu quero a vida toda`,
  ],

  funk: [
    `[Intro]
Ela(Ele) chegou e virou minha vida de cabeça pra baixo
{historia}

[Verso 1]
Não tô de brincadeira, não tô de jogo sujo
Quando falo que te amo, é real, não é um truque
Você chegou calada(o), foi me conquistando
E hoje eu tô aqui, na sua vibe entrando

[Refrão]
Você é meu plano, meu futuro, minha paz
A pessoa que eu procurei e não sabia onde tava
{historia}
Agora tô completo(a), não preciso de mais

[Verso 2]
Não é a vida fácil que me fez te amar
É nos dias difíceis que você faz eu aguentar
Parceiro(a) de verdade, de fé, de coração
Você é minha escolha, minha melhor decisão`,
  ],

  forro: [
    `[Verso 1]
No forró da vida eu encontrei você
{historia}
Aí eu entendi o que era me perder

[Refrão]
Me perder em você, que delícia
Dançar nesse amor sem ter pressa
O baião do coração que não mente
Diz que você é pra mim, definitivamente

[Verso 2]
Sanfona toca, triângulo bate
Mas o ritmo que eu gosto é o do seu olhar
Quando você me sorri, tudo se debate
Nesse amor nordestino que não dá pra explicar

[Final]
Fica aqui comigo
Dança mais um pouco
Que eu tô apaixonado(a)
E tô ficando louco(a)`,
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
E eu tô aqui, no replay
Do melhor que já me aconteceu

[Bridge]
Não quero imaginar um dia sem você
É simples assim
Você virou necessário(a) pra mim`,
  ],

  mpb: [
    `[Verso 1]
{historia}
E ali entendi sem precisar de mais
Que alguns encontros mudam o que somos

[Refrão]
Você é o que fica
Depois que tudo passa
O amor que não se explica
Mas que nunca cansa

[Verso 2]
Não é sobre palavras bonitas
É sobre o silêncio que cabe entre nós
E sobre acordar todo dia sabendo
Que existe você

[Ponte]
E que você existe por mim também
Que nós somos esse lugar
Onde o mundo lá fora
Pode esperar`,
  ],

  rock: [
    `[Verso 1]
{historia}
E foi assim que tudo começou
No meio do caos, você chegou

[Pré-refrão]
Não precisei de mais nada
Só de você olhando assim

[Refrão]
Você é minha revolução
Minha melhor distorção
A nota certa na hora certa
Que fez tudo fazer sentido pra mim

[Verso 2]
Não é sobre perfeição
É sobre a imperfeição que encaixa
Os dois desafinados juntos
Fazendo a música mais bonita

[Bridge]
E eu gritaria o seu nome
Em cima de qualquer palco
Porque você merece ser ouvida(o)
Pelo mundo todo`,
  ],

  indie: [
    `[Verso 1]
{historia}
Não sei como te explicar
O que eu sinto quando você está aqui

[Refrão]
É como aquela música
Que ninguém conhece mas você adora
É como descobrir um lugar novo
E querer ficar pra sempre

É você
Você é esse lugar
Onde eu quero ficar

[Verso 2]
Não precisa de barulho
Não precisa de multidão
Só eu, você, e essa sensação
De que encontrei onde pertencer

[Outro]
E talvez amor seja isso —
Encontrar alguém e pensar:
aqui. é aqui.`,
  ],
};

// ─── PRESENTES ───────────────────────────────────────────────────────────────

const PRESENTES = [
  `{presente} para o(a) {momento} mais especial da minha vida —

Não é o que está embrulhado que vale mais.
É o que veio junto: o pensamento, o cuidado, a certeza de que você merece ser lembrado(a) de um jeito especial.

Você faz isso por mim todos os dias — só com a sua presença. Com o jeito que você é. Com o cuidado que você nem percebe que tem.

Essa é minha forma de retribuir, mesmo que saiba que não dá pra equilibrar.

Feliz {momento}. Você merece esse e muito mais. ❤️`,

  `Para meu(minha) favorito(a),

{presente} com todo o meu carinho — porque algumas pessoas merecem mais do que um "parabéns" comum ou um "boa sorte" genérico.

Você merece um gesto que diga: eu te vejo. Eu me lembro de você. Sempre. Mesmo quando a vida está barulhenta demais pra eu dizer isso direito.

Então fica esse presente. E fica junto a certeza de que você é importante pra mim de um jeito que nenhum objeto vai conseguir representar completamente.

Com amor de verdade,`,

  `{presente} para o(a) {momento} mais memorável —

Escolhi isso porque você merecia algo que ficasse. Um lembrete de que eu te vejo, te admiro, te amo — do meu jeito, com as minhas limitações, mas com tudo que eu tenho.

Você aparece na minha vida todo dia fazendo dela melhor. Hoje é minha vez de aparecer na sua.

Feliz {momento}! Com carinho, 🎁`,
];

// ─── BIOS ─────────────────────────────────────────────────────────────────────

const BIOS = [
  `{vibe} ✨
juntos desde {data} 💕
ele(a) me faz rir sem querer
ela(e) me faz querer ficar
📍 dois, pra sempre`,

  `{data} — o dia que tudo mudou 💗
{vibe} em dose dupla
construindo a vida juntos, um dia de cada vez ☁️✨
porque separado(a) era bom, junto é melhor`,

  `dois loucos, uma história ❤️‍🔥
{vibe} | juntos desde {data}
ela(e) foi minha melhor decisão
(segunda melhor foi o sorvete, mas não conta)`,

  `{data} 💌
{vibe} — e muito mais
a melhor parte de qualquer dia
é saber que você existe 🌙
e que você é meu(minha)`,
];

// ─── CONVITES ─────────────────────────────────────────────────────────────────

const CONVITES = [
  `Oi, {ocasiao} especial.

Tenho um convite:

{local}.

Só você e eu. Sem pressa. Do jeito que a gente gosta.
Sem celular. Sem preocupação. Sem desculpa.

Me fala se você topa. (Já sei que você topa.)

Com carinho,`,

  `Para o(a) meu(minha) favorito(a),

Você está oficialmente convidado(a) para um {ocasiao} que eu preparei pensando em você.

📍 {local}

Não precisa trazer nada — só você já é mais do que suficiente.
Na verdade, você é o motivo do convite inteiro.

Te espero. 💌`,

  `{ocasiao}.
{local}.

Não é grande coisa.
Não tem confete, não tem multidão.
Mas tem você — e isso já faz de tudo a melhor versão possível.

Você vem? ❤️`,
];

// ─── TEMPLATE GENERATOR ──────────────────────────────────────────────────────

function generate(tipo: string, campos: Record<string, string>): string {
  const seed = Object.values(campos).join("|");

  switch (tipo) {
    case "carta":
      return fill(pick(CARTAS, seed), campos);
    case "poema":
      return fill(pick(POEMAS, seed), campos);
    case "musica": {
      const estilo = (campos.estilo ?? "").toLowerCase();
      let pool: string[];
      if (estilo.includes("sertanejo") || estilo.includes("country")) pool = MUSICAS.sertanejo;
      else if (estilo.includes("pagode") || estilo.includes("samba")) pool = MUSICAS.pagode;
      else if (estilo.includes("funk")) pool = MUSICAS.funk;
      else if (estilo.includes("forró") || estilo.includes("forro") || estilo.includes("nordestino")) pool = MUSICAS.forro;
      else if (estilo.includes("mpb") || estilo.includes("bossa")) pool = MUSICAS.mpb;
      else if (estilo.includes("rock")) pool = MUSICAS.rock;
      else if (estilo.includes("indie") || estilo.includes("alternativo")) pool = MUSICAS.indie;
      else if (estilo.includes("pop")) pool = MUSICAS.pop;
      else pool = [
        ...MUSICAS.sertanejo,
        ...MUSICAS.pagode,
        ...MUSICAS.pop,
        ...MUSICAS.mpb,
        ...MUSICAS.funk,
        ...MUSICAS.forro,
        ...MUSICAS.rock,
        ...MUSICAS.indie,
      ];
      return fill(pick(pool, seed), campos);
    }
    case "presente":
      return fill(pick(PRESENTES, seed), campos);
    case "bio":
      return fill(pick(BIOS, seed), campos);
    case "convite":
      return fill(pick(CONVITES, seed), campos);
    default:
      return "Texto gerado com carinho. 💌";
  }
}

// ─── DEEPSEEK ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é um escritor especializado em textos românticos em português brasileiro. Seu estilo é moderno, profundo e poético — sem clichês baratos. Crie textos que pareçam escritos por uma pessoa real apaixonada. Use linguagem natural, frases variadas, metáforas sutis. Nunca use "nosso amor é eterno", "você é minha metade" ou frases genéricas de cartão de Natal. Responda APENAS com o texto solicitado, sem introduções, sem explicações, sem aspas, sem comentários.`;

function buildUserPrompt(tipo: string, campos: Record<string, string>): string {
  const c = campos;
  switch (tipo) {
    case "carta":
      return `Escreva uma carta romântica íntima para ${c.para || "meu amor"}. Lembrança especial mencionada: "${c.lembranca || "um momento inesquecível"}". Tom desejado: ${c.tom || "profundo e sincero"}. Use 3-4 parágrafos curtos. Termine com uma despedida carinhosa mas sem nome do remetente.`;
    case "poema":
      return `Escreva um poema romântico para ${c.nome || "meu amor"}. Sentimento expresso: "${c.sentimento || "amor profundo"}". Formato: verso livre, 3-4 estrofes curtas. Comece com o nome da pessoa.`;
    case "musica":
      return `Escreva uma letra de música no estilo ${c.estilo || "pop romântico"}. História do casal: "${c.historia || "nos conhecemos e nos apaixonamos"}". Estrutura: [Verso 1], [Refrão], [Verso 2], [Final]. 3-4 linhas por seção.`;
    case "presente":
      return `Escreva uma mensagem curta (3-4 parágrafos) para acompanhar o presente "${c.presente || "este presente"}" na ocasião "${c.momento || "data especial"}". Íntima, carinhosa, personalizada.`;
    case "bio":
      return `Escreva uma bio romântica para perfil de casal no Instagram. Juntos desde: ${c.data || "algum tempo"}. Vibe do casal: ${c.vibe || "apaixonados"}. Máximo 4 linhas curtas. Use emojis sutis. Seja criativo e único.`;
    case "convite":
      return `Escreva um convite romântico para ${c.ocasiao || "um encontro especial"} em ${c.local || "um lugar especial"}. Curto (3-4 linhas), íntimo, como escrito à mão. Pode ter um toque gentil de humor.`;
    default:
      return `Escreva um texto romântico personalizado em português brasileiro.`;
  }
}

async function callDeepSeek(tipo: string, campos: Record<string, string>): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return generate(tipo, campos);

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(tipo, campos) },
        ],
        max_tokens: 600,
        temperature: 0.92,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return generate(tipo, campos);

    const data = await res.json();
    const texto = data.choices?.[0]?.message?.content?.trim();
    return texto || generate(tipo, campos);
  } catch {
    return generate(tipo, campos);
  }
}

// ─── SESSION TRACKING (server-side, corrige bypass de paywall) ───────────────
// Usa header Cookie/Set-Cookie diretamente para evitar dependência de
// next/dist/compiled/cookie que pode falhar em builds standalone.

const SESSION_MAP = new Map<string, number>();

function getSessionCount(sessionId: string): number {
  return SESSION_MAP.get(sessionId) ?? 0;
}

function incrementSession(sessionId: string): void {
  SESSION_MAP.set(sessionId, (SESSION_MAP.get(sessionId) ?? 0) + 1);
}

function parseCookieHeader(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k.trim() === name) return v?.trim() ?? null;
  }
  return null;
}

const FREE_AI_GENERATIONS = 1;

// ─── HANDLER ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, { key: "romantic-ai", limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde 1 minuto." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { tipo, campos } = parsed.data;
  const hasAI = !!process.env.DEEPSEEK_API_KEY;

  // Sem chave de API → templates grátis ilimitados (modo dev/fallback)
  if (!hasAI) {
    return NextResponse.json({ texto: generate(tipo, campos), source: "template" });
  }

  // Com chave de API → verificar sessão server-side via header raw
  const cookieHeader = req.headers.get("cookie");
  const existingId = parseCookieHeader(cookieHeader, "ia_sid");
  const sessionId = existingId ?? crypto.randomUUID();
  const count = getSessionCount(sessionId);

  if (count >= FREE_AI_GENERATIONS) {
    return NextResponse.json({ error: "Limite gratuito atingido.", paywall: true }, { status: 403 });
  }

  const texto = await callDeepSeek(tipo, campos);
  incrementSession(sessionId);

  const response = NextResponse.json({ texto, source: "ai" });
  // Set-Cookie via header raw — sem depender de next/dist/compiled/cookie
  response.headers.set(
    "Set-Cookie",
    `ia_sid=${sessionId}; HttpOnly; Max-Age=86400; SameSite=Lax; Path=/`
  );

  return response;
}
