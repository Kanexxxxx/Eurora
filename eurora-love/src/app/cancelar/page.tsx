import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancelar Emails | EURORA LOVE",
  robots: { index: false },
};

export default function CancelarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff2d6a]/10 blur-[100px]" />
      </div>

      {/* Icon */}
      <div className="mb-6 text-6xl">💌</div>

      {/* Badge */}
      <div className="mb-8 inline-block rounded-full bg-gradient-to-r from-[#ff2d6a] to-[#f6c986] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#07050a]">
        EURORA LOVE
      </div>

      {/* Heading */}
      <h1 className="font-heading mb-4 text-3xl font-normal leading-snug text-[#fff5f0]">
        Você foi removido
        <br />
        <em className="text-[#ff2d6a]">com sucesso</em>
      </h1>

      <p className="mb-2 max-w-sm text-[15px] leading-relaxed text-[#fff5f0]/50">
        Não enviaremos mais emails para este endereço.
      </p>

      <p className="mb-10 max-w-sm text-[13px] leading-relaxed text-[#fff5f0]/30">
        Se isso foi um engano, entre em contato pelo{" "}
        <a
          href="mailto:eurora.com.br@gmail.com"
          className="text-[#ff2d6a] underline"
        >
          eurora.com.br@gmail.com
        </a>
        .
      </p>

      {/* Divider */}
      <div className="mb-10 h-px w-32 bg-gradient-to-r from-transparent via-[#ff2d6a]/30 to-transparent" />

      {/* Back link */}
      <Link
        href="/"
        className="rounded-full bg-gradient-to-r from-[#ff2d6a] to-[#f6c986] px-8 py-3 text-sm font-bold text-[#07050a] shadow-[0_10px_40px_-10px_rgba(255,45,106,0.55)] transition-all hover:scale-105 hover:shadow-[0_16px_48px_-10px_rgba(255,45,106,0.70)]"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
