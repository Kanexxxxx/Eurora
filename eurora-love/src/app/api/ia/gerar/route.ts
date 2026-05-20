import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const schema = z.object({
  tipo: z.enum(["carta", "poema", "musica", "presente", "bio", "convite"]),
  campos: z.record(z.string(), z.string()),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  carta:
    "Você é um escritor romântico especializado em cartas de amor profundas e emocionantes. Escreva com sinceridade, especificidade e emoção real. Evite clichês genéricos. Use os detalhes fornecidos pelo usuário para criar algo único e pessoal. Escreva em português brasileiro, estilo fluente e íntimo.",
  poema:
    "Você é um poeta contemporâneo brasileiro especializado em poesia romântica. Crie poemas com imagens concretas e emoção genuína. Pode usar verso livre ou com rima, conforme o pedido. Evite lugares-comuns. Escreva em português brasileiro.",
  musica:
    "Você é um compositor de música popular brasileira. Escreva letras com estrutura de verso, refrão e (opcionalmente) bridge. Adapte ao estilo musical pedido. Use linguagem natural, coloquial e emocionante. Escreva em português brasileiro.",
  presente:
    "Você escreve cartões e bilhetes românticos curtos para acompanhar presentes. O texto deve ser conciso (máx 100 palavras), elegante e pessoal. Sem clichês. Em português brasileiro.",
  bio:
    "Você cria bios criativas para perfis de casais no Instagram. Use emojis estrategicamente, seja conciso (máx 5 linhas), criativo e fiel à vibe do casal. Em português brasileiro.",
  convite:
    "Você escreve convites românticos elegantes para eventos especiais. O convite deve criar antecipação e emoção. Tom elegante mas caloroso. Em português brasileiro.",
};

const TIPO_LABELS: Record<string, string> = {
  carta: "Carta Romântica",
  poema: "Poema",
  musica: "Letra de Música",
  presente: "Texto para Presente",
  bio: "Bio de Casal",
  convite: "Convite Romântico",
};

function buildPrompt(tipo: string, campos: Record<string, string>): string {
  const entries = Object.entries(campos)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return `Crie um(a) ${TIPO_LABELS[tipo]} com base nestas informações:\n\n${entries}\n\nEscreva apenas o texto final, sem introduções ou explicações.`;
}

const RATE_LIMIT = new Map<string, { count: number; ts: number }>();
function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = RATE_LIMIT.get(ip);
  if (!e || now - e.ts > 60_000) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return true;
  }
  if (e.count >= 10) return false;
  e.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRL(ip))
    return NextResponse.json(
      { error: "Muitas requisições. Aguarde 1 minuto." },
      { status: 429 }
    );

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { tipo, campos } = parsed.data;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Serviço de IA não configurado." },
      { status: 503 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: SYSTEM_PROMPTS[tipo],
    messages: [{ role: "user", content: buildPrompt(tipo, campos) }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Erro ao gerar conteúdo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ texto: content.text });
}
