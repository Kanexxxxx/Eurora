import type { Metadata } from "next";
import PresentesClient from "./PresentesClient";

export const metadata: Metadata = {
  title: "Presentes Secretos — IA escolhe o presente perfeito | EURORA LOVE",
  description:
    "Nossa IA Romântica encontra o presente perfeito pra ela. Selecionado em tempo real do TikTok Shop, Shopee, Amazon e Mercado Livre. Desbloqueia por R$ 8.",
};

export default function Page() {
  return <PresentesClient />;
}
