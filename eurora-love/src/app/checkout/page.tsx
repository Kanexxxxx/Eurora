import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Pagamento | EURORA LOVE",
  description: "Finalize seu pagamento via PIX.",
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
