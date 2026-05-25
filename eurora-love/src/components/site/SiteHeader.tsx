"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isLovePage } from "@/lib/utils/isLovePage";

const NAV = [
  { href: "/criar", label: "Página do Amor", emoji: "💌" },
  { href: "/presentes", label: "Presentes Secretos", emoji: "🎁", badge: "NOVO" },
  { href: "/mensagem", label: "Mensagem Programada", emoji: "⏰" },
  { href: "/quiz", label: "Teste do Amor", emoji: "🔮" },
  { href: "/ia", label: "IA Romântica", emoji: "✨" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const lovePage = isLovePage(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (lovePage) return null;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div
            className={`flex items-center justify-between rounded-full px-4 sm:px-5 py-2.5 transition-all duration-500 ${
              scrolled
                ? "glass-dark shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
                : "bg-transparent"
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="EURORA LOVE — Início"
            >
              <span className="relative inline-flex shrink-0">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#C8917A"/>
                      <stop offset="100%" stopColor="#D4AF70"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <circle cx="17" cy="17" r="17" fill="url(#hg)" opacity="0.15"/>
                  <path filter="url(#glow)" d="M17 25.5C17 25.5 7 19.3 7 13.5C7 10.5 9.5 8 12.5 8C14.2 8 15.8 8.9 17 10.2C18.2 8.9 19.8 8 21.5 8C24.5 8 27 10.5 27 13.5C27 19.3 17 25.5 17 25.5Z" fill="url(#hg)"/>
                  <path d="M17 25.5C17 25.5 7 19.3 7 13.5C7 10.5 9.5 8 12.5 8C14.2 8 15.8 8.9 17 10.2C18.2 8.9 19.8 8 21.5 8C24.5 8 27 10.5 27 13.5C27 19.3 17 25.5 17 25.5Z" fill="url(#hg)"/>
                </svg>
              </span>
              <span className="font-heading text-lg leading-none tracking-tight">
                <span className="text-white">EURORA</span>{" "}
                <span className="text-gradient-warm-ember">LOVE</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "text-white bg-white/5"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#C8917A] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/criar"
                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#C8917A] to-[#A8705C] shadow-[0_8px_30px_-8px_rgba(200,145,122,0.55)] hover:shadow-[0_12px_40px_-8px_rgba(200,145,122,0.75)] hover:scale-[1.02] transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 blur-md transition-opacity" />
                <span className="relative">Criar agora →</span>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block h-[2px] w-6 bg-white transition-all ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-white transition-all ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-white transition-all ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 left-4 right-4 glass-premium rounded-3xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col">
                {NAV.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-colors"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-white font-medium">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#C8917A] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <Link
                  href="/criar"
                  onClick={() => setOpen(false)}
                  className="mt-2 mx-2 btn-premium text-center"
                >
                  Criar minha página agora
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" aria-hidden />
    </>
  );
}
