"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pricingRef = useRef<Element | null>(null);

  useEffect(() => {
    pricingRef.current = document.getElementById("precos");

    const onScroll = () => {
      const scrolled = window.scrollY > 420;
      const pricingVisible =
        pricingRef.current
          ? pricingRef.current.getBoundingClientRect().top < window.innerHeight * 0.8
          : false;
      setVisible(scrolled && !pricingVisible);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 inset-x-0 z-50 sm:hidden safe-bottom"
        >
          <div className="mx-3 mb-3 overflow-hidden rounded-2xl shadow-[0_-4px_40px_rgba(255,45,106,0.35)]">
            <div className="bg-gradient-to-r from-[#d6195a] via-[#ff2d6a] to-[#f6c986] p-px rounded-2xl">
              <div className="bg-[#0e0610] rounded-[calc(1rem-1px)] px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate">
                    Criar minha página do amor
                  </p>
                  <p className="text-white/55 text-xs mt-0.5">
                    a partir de <span className="text-[#ffb1c9] font-semibold">R$&nbsp;19</span> · entrega imediata
                  </p>
                </div>
                <Link
                  href="/criar"
                  className="shrink-0 bg-gradient-to-r from-[#ff2d6a] to-[#f6c986] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_18px_rgba(255,45,106,0.5)] active:scale-95 transition-transform"
                >
                  Começar →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
