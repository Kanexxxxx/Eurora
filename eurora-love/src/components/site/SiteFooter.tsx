"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLovePage } from "@/lib/utils/isLovePage";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "oi@eurora.site";

const NAV_LINKS = [
  { href: "/criar", label: "Página do Amor" },
  { href: "/presentes", label: "Presentes" },
  { href: "/mensagem", label: "Mensagem" },
  { href: "/ia", label: "IA Romântica" },
  { href: "/quiz", label: "Quiz" },
  { href: `mailto:${SUPPORT_EMAIL}`, label: "Contato", external: true },
  { href: `https://wa.me/${WA}`, label: "WhatsApp", external: true },
  { href: "/termos", label: "Termos" },
  { href: "/privacidade", label: "Privacidade" },
];

export default function SiteFooter() {
  const pathname = usePathname();

  if (isLovePage(pathname)) return null;

  return (
    <footer className="relative mt-24 pb-10 px-4 overflow-hidden">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff2d6a]/30 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-[#ff2d6a]/6 rounded-full blur-[120px]" />

      {/* Divider topo */}
      <div className="relative max-w-4xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14" />

        {/* Logo + tagline centrados */}
        <div className="flex flex-col items-center text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff2d6a]/30 rounded-full blur-md scale-125 group-hover:scale-150 transition-transform duration-500" />
              <svg width="40" height="40" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative" aria-hidden="true">
                <defs>
                  <linearGradient id="footer-hg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff2d6a"/>
                    <stop offset="100%" stopColor="#f6c986"/>
                  </linearGradient>
                </defs>
                <circle cx="17" cy="17" r="17" fill="url(#footer-hg)" opacity="0.18"/>
                <path d="M17 25.5C17 25.5 7 19.3 7 13.5C7 10.5 9.5 8 12.5 8C14.2 8 15.8 8.9 17 10.2C18.2 8.9 19.8 8 21.5 8C24.5 8 27 10.5 27 13.5C27 19.3 17 25.5 17 25.5Z" fill="url(#footer-hg)"/>
              </svg>
            </div>
            <span className="font-heading text-2xl tracking-wide">
              <span className="text-white">EURORA</span>{" "}
              <span className="text-gradient-warm-ember">LOVE</span>
            </span>
          </Link>

          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            Cada detalhe foi pensado para tornar o amor <br className="hidden sm:block" />
            uma experiência inesquecível.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 pill pill-gold text-xs">
            <span className="tracking-widest">★ ★ ★ ★ ★</span>
            <span className="text-white/70">4.96 / 5</span>
          </div>
        </div>

        {/* Links centralizados em linha */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#ffb1c9] text-xs transition-colors duration-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/40 hover:text-[#ffb1c9] text-xs transition-colors duration-200"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Bottom bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© 2026 EURORA LOVE · Feito com 💗 no Brasil</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema online
            </span>
            <span className="flex items-center gap-1.5">
              🔒 Pagamento seguro
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
