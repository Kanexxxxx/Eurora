import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | EURORA LOVE",
  description: "Termos e condições de uso da plataforma EURORA LOVE.",
};

const UPDATED = "20 de maio de 2026";

export default function TermosPage() {
  return (
    <main className="relative min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-rose-400 text-sm hover:text-rose-300 transition-colors mb-6 inline-block">
            ← Voltar ao início
          </Link>
          <p className="pill pill-live mb-4">Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Termos de Uso
          </h1>
          <p className="text-white/50 text-sm">Última atualização: {UPDATED}</p>
        </div>

        {/* Content */}
        <div className="prose-eurora space-y-10">
          <Section title="1. Aceitação dos Termos">
            <p>
              Ao acessar ou usar os serviços da EURORA LOVE (&ldquo;Plataforma&rdquo;), você concorda com estes
              Termos de Uso. Se não concordar com qualquer parte, não utilize a Plataforma.
            </p>
          </Section>

          <Section title="2. Descrição dos Serviços">
            <p>
              A EURORA LOVE oferece ferramentas digitais românticas, incluindo criação de páginas personalizadas
              de amor, mensagens programadas, geração de conteúdo por IA e curadoria de presentes.
            </p>
            <p>
              Alguns serviços são gratuitos; outros exigem pagamento único via PIX. Não há cobranças recorrentes
              salvo indicação expressa.
            </p>
          </Section>

          <Section title="3. Pagamentos e Reembolso">
            <p>
              Os pagamentos são processados pelo <strong>Mercado Pago</strong>, plataforma regulamentada pelo
              Banco Central do Brasil. Após a confirmação do PIX, sua página é ativada instantaneamente.
            </p>
            <p>
              Garantimos reembolso integral em até <strong>7 (sete) dias</strong> corridos a partir da data do
              pagamento, sem necessidade de justificativa, conforme o Código de Defesa do Consumidor (Art. 49,
              CDC). Para solicitar, envie e-mail para{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.love.br"}`} className="text-rose-300 hover:text-rose-200">
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.love.br"}
              </a>.
            </p>
          </Section>

          <Section title="4. Conteúdo do Usuário">
            <p>
              Você é o único responsável pelas fotos, textos e outros conteúdos que inserir na Plataforma. É
              proibido enviar conteúdo que:
            </p>
            <ul>
              <li>Viole direitos de terceiros (direitos autorais, imagem, privacidade);</li>
              <li>Contenha nudez, violência ou material ilegal;</li>
              <li>Seja de natureza discriminatória ou ofensiva.</li>
            </ul>
            <p>
              A EURORA LOVE se reserva o direito de remover conteúdos que violem estas diretrizes, sem aviso
              prévio e sem reembolso.
            </p>
          </Section>

          <Section title="5. Propriedade Intelectual">
            <p>
              Todo o código, design, textos e marcas da Plataforma pertencem à EURORA LOVE. O conteúdo que você
              cria (fotos, mensagens) permanece de sua propriedade. Você nos concede licença limitada para
              exibir esse conteúdo na sua página gerada.
            </p>
          </Section>

          <Section title="6. Disponibilidade">
            <p>
              Páginas do plano Basic e Premium ficam disponíveis por tempo indeterminado, enquanto a Plataforma
              estiver em operação. Em caso de encerramento das atividades, notificaremos os usuários com
              antecedência mínima de 30 dias.
            </p>
          </Section>

          <Section title="7. Limitação de Responsabilidade">
            <p>
              A EURORA LOVE não se responsabiliza por danos indiretos, perda de dados causada por falhas de
              terceiros (Supabase, Mercado Pago), ou interrupções temporárias de serviço. Nossa responsabilidade
              máxima é limitada ao valor pago pelo serviço.
            </p>
          </Section>

          <Section title="8. Alterações">
            <p>
              Podemos atualizar estes Termos a qualquer momento. Mudanças significativas serão comunicadas com
              30 dias de antecedência. O uso contínuo após as mudanças implica aceitação.
            </p>
          </Section>

          <Section title="9. Lei Aplicável">
            <p>
              Estes Termos são regidos pelas leis brasileiras. Foro: comarca de São Paulo, SP, com renúncia
              expressa a qualquer outro.
            </p>
          </Section>

          <Section title="10. Contato">
            <p>
              Dúvidas?{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.love.br"}`} className="text-rose-300 hover:text-rose-200">
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.love.br"}
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/privacidade" className="text-rose-300 hover:text-rose-200 text-sm transition-colors">
            Ver Política de Privacidade →
          </Link>
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-premium p-6 sm:p-8">
      <h2 className="font-heading text-xl sm:text-2xl text-white mb-4 tracking-tight">{title}</h2>
      <div className="space-y-3 text-white/65 text-sm sm:text-base leading-relaxed [&_a]:text-rose-300 [&_a:hover]:text-rose-200 [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:pl-4 [&_li]:list-disc [&_strong]:text-white/90">
        {children}
      </div>
    </section>
  );
}
