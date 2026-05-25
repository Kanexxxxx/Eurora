import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Teste do Parceiro — Ele/ela te conhece bem? | EURORA LOVE",
  description:
    "Crie um teste personalizado sobre você, mande no WhatsApp e descubra o quanto seu parceiro(a) te conhece. Grátis e instantâneo.",
};

export default function Page() {
  return <QuizClient />;
}
