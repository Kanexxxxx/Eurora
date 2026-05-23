import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | EURORA LOVE",
  description: "Como a EURORA LOVE coleta, usa e protege seus dados pessoais.",
};

const UPDATED = "20 de maio de 2026";

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="text-white/50 text-sm">Última atualização: {UPDATED}</p>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <Section title="1. Quem Somos">
            <p>
              A <strong>EURORA LOVE</strong> é uma plataforma digital brasileira de experiências românticas.
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados pessoais,
              em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </Section>

          <Section title="2. Dados que Coletamos">
            <p>Coletamos apenas o necessário para prestar o serviço:</p>
            <ul>
              <li><strong>Dados de criação de página:</strong> nomes do casal, data do relacionamento, mensagem personalizada, fotos enviadas e URL de música;</li>
              <li><strong>Dados de pagamento:</strong> apenas o ID da transação gerado pelo Asaas — não armazenamos dados de cartão ou conta bancária;</li>
              <li><strong>Dados técnicos:</strong> endereço IP (para rate limiting), tipo de navegador e logs de acesso.</li>
            </ul>
            <p>Não coletamos dados de menores de 18 anos intencionalmente.</p>
          </Section>

          <Section title="3. Como Usamos seus Dados">
            <ul>
              <li>Criar e exibir sua página de amor personalizada;</li>
              <li>Processar pagamentos via Asaas;</li>
              <li>Gerar e armazenar o QR Code da sua página;</li>
              <li>Prevenir fraudes e abusos (rate limiting por IP);</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
            <p>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</p>
          </Section>

          <Section title="4. Armazenamento e Segurança">
            <p>
              Seus dados são armazenados em servidores seguros do <strong>Supabase</strong> (infraestrutura
              AWS), com criptografia em trânsito (TLS) e em repouso. Fotos são armazenadas em bucket privado
              com acesso controlado.
            </p>
            <p>
              Pagamentos são processados integralmente pelo <strong>Asaas</strong>. Dados sensíveis de cartão
              não são armazenados pela EURORA LOVE.
            </p>
          </Section>

          <Section title="5. Retenção de Dados">
            <p>
              Páginas pagas ficam disponíveis por tempo indeterminado (vitalício). Dados de páginas não pagas
              são excluídos automaticamente após 48 horas. Você pode solicitar a exclusão da sua página e de
              todos os seus dados a qualquer momento.
            </p>
          </Section>

          <Section title="6. Seus Direitos (LGPD)">
            <p>Você tem direito a:</p>
            <ul>
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar seus dados pessoais;</li>
              <li>Corrigir dados incompletos ou desatualizados;</li>
              <li>Solicitar a exclusão dos seus dados;</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato:{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.site"}`} className="text-rose-300 hover:text-rose-200">
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.site"}
              </a>
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Utilizamos apenas cookies funcionais essenciais para o funcionamento da Plataforma
              (sessão de navegação). Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </Section>

          <Section title="8. Terceiros">
            <p>A Plataforma integra com os seguintes serviços, cada um com sua própria política de privacidade:</p>
            <ul>
              <li><strong>Supabase</strong> — banco de dados e armazenamento de arquivos;</li>
              <li><strong>Asaas</strong> — processamento de pagamentos;</li>
              <li><strong>Spotify / YouTube</strong> — incorporação de músicas (opcional, via link).</li>
            </ul>
          </Section>

          <Section title="9. Alterações nesta Política">
            <p>
              Podemos atualizar esta Política periodicamente. Notificaremos mudanças significativas com
              antecedência de 30 dias. A data de &ldquo;última atualização&rdquo; no topo indica a versão vigente.
            </p>
          </Section>

          <Section title="10. Contato">
            <p>
              Para dúvidas, solicitações ou reclamações relacionadas a privacidade:{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.site"}`} className="text-rose-300 hover:text-rose-200">
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.site"}
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link href="/termos" className="text-rose-300 hover:text-rose-200 text-sm transition-colors">
            Ver Termos de Uso →
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
