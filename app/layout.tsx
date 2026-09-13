import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F1020",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://izitaille.com'),
  title: "IZITAILLE — Gestion d'atelier de couture & calcul de capacité",
  description:
    "Garde le dossier complet de chaque client (mesures, photos, historique) et empêche le tailleur d'accepter plus de commandes qu'il ne peut coudre.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

import { MetaPixel } from "@/components/analytics/MetaPixel";
import { PwaRegister } from "@/components/pwa/PwaRegister";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} font-sans`}>
      <body className="min-h-screen bg-coton-50 text-coton-900 flex flex-col">
        <MetaPixel />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
