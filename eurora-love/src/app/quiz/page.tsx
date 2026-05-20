import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Teste do Amor — Descubra seu match real | EURORA LOVE",
  description:
    "Quiz de compatibilidade científico. Resultado com porcentagem real, mapa do casal e card pronto pra Stories. Já testado por +210.000 casais.",
};

export default function Page() {
  return <QuizClient />;
}
