import { Suspense } from "react";
import type { Metadata } from "next";
import WizardClient from "./WizardClient";

export const metadata: Metadata = {
  title: "Criar Página | EURORA LOVE",
  description: "Crie sua página do amor em 8 passos simples.",
};

export default function CriarPage() {
  return (
    <Suspense>
      <WizardClient />
    </Suspense>
  );
}
