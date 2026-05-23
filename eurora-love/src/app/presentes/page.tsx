import type { Metadata } from "next";
import PresentesClient from "./PresentesClient";

export const metadata: Metadata = {
  title: "Presentes Secretos — IA escolhe o presente perfeito | EURORA LOVE",
  description:
    "Guia com mais de 250 ideias reais de presentes românticos, baratos e separados por categoria. Desbloqueie por R$ 8.",
};

export default function Page() {
  return <PresentesClient />;
}
