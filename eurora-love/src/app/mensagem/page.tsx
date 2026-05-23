import type { Metadata } from "next";
import MensagemClient from "./MensagemClient";

export const metadata: Metadata = {
  title: "Mensagem Programada | EURORA LOVE",
  description:
    "Escreva agora e programe uma mensagem por e-mail ou gere um link de WhatsApp pronto para enviar no momento certo.",
};

export default function Page() {
  return <MensagemClient />;
}
