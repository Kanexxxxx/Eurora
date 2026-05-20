import type { Metadata } from "next";
import IAClient from "./IAClient";

export const metadata: Metadata = {
  title: "IA Romântica — Cartas, poemas e letras por IA | EURORA LOVE",
  description:
    "Geradores de cartas, poemas, letras de música, bio de casal e convites românticos. Tudo criado em segundos por uma IA treinada em literatura romântica.",
};

export default function Page() {
  return <IAClient />;
}
