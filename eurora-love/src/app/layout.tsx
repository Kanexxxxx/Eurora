import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EURORA LOVE — A página do amor que ela nunca vai esquecer",
  description:
    "Crie uma página digital cinematográfica para a pessoa que você ama. Fotos, música, mensagem programada, QR code premium. Mais de 38.000 casais já se emocionaram.",
  metadataBase: new URL("https://eurora.love.br"),
  keywords: [
    "página do amor",
    "presente dia dos namorados",
    "site para namorado",
    "site para namorada",
    "QR code romântico",
    "carta de amor digital",
    "presente criativo dia dos namorados",
  ],
  openGraph: {
    title: "EURORA LOVE — A página do amor que ela nunca vai esquecer",
    description:
      "Mais de 38.000 casais. Fotos, música, mensagem programada, QR code premium. Crie em 3 minutos.",
    siteName: "EURORA LOVE",
    type: "website",
    locale: "pt_BR",
    url: "https://eurora.love.br",
  },
  twitter: {
    card: "summary_large_image",
    title: "EURORA LOVE — A página do amor que ela nunca vai esquecer",
    description: "Crie em 3 minutos. Compartilhe pra vida toda.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07050a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
