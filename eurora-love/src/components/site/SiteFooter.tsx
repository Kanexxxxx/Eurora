"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRODUCTS = [
  { href: "/criar", label: "Página do Amor" },
  { href: "/presentes", label: "Presentes Secretos" },
  { href: "/mensagem", label: "Mensagem Programada" },
  { href: "/ia", label: "IA Romântica" },
  { href: "/quiz", label: "Teste de Compatibilidade" },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.love.br";

const SUPPORT = [
  { href: `mailto:${SUPPORT_EMAIL}`, label: "Contato" },
  { href: `https://wa.me/${WA}`, label: "WhatsApp" },
];

const LEGAL = [
  { href: "/termos", label: "Termos de uso" },
  { href: "/privacidade", label: "Privacidade" },
];

export default function SiteFooter() {
  const pathname = usePathname();

  const isLovePage =
    pathname &&
    !pathname.startsWith("/criar") &&
    !pathname.startsWith("/checkout") &&
    !pathname.startsWith("/sucesso") &&
    !pathname.startsWith("/presentes") &&
    !pathname.startsWith("/mensagem") &&
    !pathname.startsWith("/quiz") &&
    !pathname.startsWith("/ia") &&
    pathname !== "/" &&
    pathname.length > 1;

  if (isLovePage) return null;

  return (
    <footer className="relative mt-20 pt-14 pb-10 px-4 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-rose-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Mobile: stacked brand + 3 cols | Desktop: 1 brand + 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="relative inline-flex w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 items-center justify-center shadow-[0_0_24px_rgba(255,45,106,0.5)]">
                <span className="text-white text-sm">♥</span>
              </span>
              <span className="font-heading text-xl">
                <span className="text-white">EURORA</span>{" "}
                <span className="text-gradient-ember">LOVE</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Transforma o amor em uma experiência digital cinematográfica.
              Feito com 💗 no Brasil.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 pill pill-gold">
              <span>★ ★ ★ ★ ★</span>
              <span>4.96/5</span>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Produtos</h3>
            <ul className="space-y-2.5">
              {PRODUCTS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-rose-300 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Suporte</h3>
            <ul className="space-y-2.5">
              {SUPPORT.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/55 hover:text-rose-300 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">Legal</h3>
            <ul className="space-y-2.5">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-rose-300 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © 2026 EURORA LOVE · eurora.love.br
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white/40">
              <span className="text-emerald-400">●</span> Sistema online
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1 text-white/40">
              🔒 Pagamento criptografado
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
