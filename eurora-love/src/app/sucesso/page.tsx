import { Suspense } from "react";
import type { Metadata } from "next";
import SucessoClient from "./SucessoClient";

export const metadata: Metadata = {
  title: "Página Criada! | EURORA LOVE",
};

export default function SucessoPage() {
  return (
    <Suspense>
      <SucessoClient />
    </Suspense>
  );
}
