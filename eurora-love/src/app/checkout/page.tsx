import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Pagamento | EURORA LOVE",
  description: "Finalize seu pagamento via Pix ou cartao.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
