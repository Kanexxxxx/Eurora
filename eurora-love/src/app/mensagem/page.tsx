import type { Metadata } from "next";
import MensagemClient from "./MensagemClient";

export const metadata: Metadata = {
  title: "Mensagem Programada Automática | EURORA LOVE",
  description:
    "Escreva agora, envie automaticamente no Dia dos Namorados. WhatsApp, SMS ou e-mail. Templates feitos por IA — pedido de namoro, desculpa, ex, distância.",
};

export default function Page() {
  return <MensagemClient />;
}
