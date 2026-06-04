"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notifyMetaPixelReady } from "@/lib/metaPixel";

const CONSENT_KEY = "eurora_cookie_consent";

function initPixel() {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.fbq) {
    notifyMetaPixelReady();
    return;
  }
  w._fbq = w.fbq = function (...a: unknown[]) { w.fbq.queue.push(a); };
  w.fbq.push = w.fbq;
  w.fbq.loaded = true;
  w.fbq.version = "2.0";
  w.fbq.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  w.fbq("init", "1950883682456826");
  w.fbq("track", "PageView");
  notifyMetaPixelReady();
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      initPixel();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    initPixel();
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0e0a14] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-white font-semibold text-sm mb-1">🍪 Usamos cookies</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Utilizamos cookies para melhorar sua experiência e personalizar anúncios.
            Ao aceitar, você concorda com nossa{" "}
            <Link href="/privacidade" className="text-[#ffb1c9] underline hover:text-white transition-colors">
              Política de Privacidade
            </Link>{" "}
            e com o uso de dados conforme a <strong className="text-white/80">LGPD</strong>.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="px-4 py-2 rounded-full text-xs font-medium text-white/60 border border-white/10 hover:border-white/20 hover:text-white/80 transition-all"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-linear-to-r from-[#ff2d6a] to-[#d6195a] text-white shadow-[0_4px_20px_-4px_rgba(255,45,106,0.5)] hover:scale-105 active:scale-95 transition-transform"
          >
            Aceitar cookies
          </button>
        </div>
      </div>
    </div>
  );
}
