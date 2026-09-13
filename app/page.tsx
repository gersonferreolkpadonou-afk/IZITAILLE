import * as React from 'react';
import type { Metadata } from 'next';
import { getWaitlistCount } from '@/app/actions/waitlist';
import { VitrineClient } from '@/components/vitrine/VitrineClient';

export const metadata: Metadata = {
  title: "IZITAILLE — Arrête de promettre des dates que tu ne peux pas tenir",
  description:
    "IZITAILLE garde les mesures de tous tes clients, calcule combien de tenues tu peux vraiment coudre d'ici la fête, et prévient tes clients à ta place. Conçu pour les tailleurs en Guinée, Côte d'Ivoire, Bénin, Sénégal, Mali.",
  keywords: [
    "tailleur afrique",
    "gestion atelier couture",
    "mesures boubou",
    "couture abidjan",
    "couture dakar",
    "couture bamako",
    "logiciel tailleur",
    "mesures client couture",
    "anti surcharge couture",
  ],
  openGraph: {
    title: "IZITAILLE — L'outil indispensable des ateliers de couture d'Afrique de l'Ouest",
    description:
      "Garde les mesures de tous tes clients et calcule combien de tenues tu peux vraiment coudre avant la fête.",
    url: "https://izitaille.com",
    siteName: "IZITAILLE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/hero-atelier.jpg",
        width: 1200,
        height: 630,
        alt: "Atelier de couture ouest-africain avec IZITAILLE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IZITAILLE — Arrête de promettre des dates que tu ne peux pas tenir",
    description:
      "Garde le dossier complet de chaque client et empêche le tailleur d'accepter plus de commandes qu'il ne peut coudre.",
    images: ["/images/hero-atelier.jpg"],
  },
};

export default async function HomePage() {
  const inscritsCount = await getWaitlistCount();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IZITAILLE",
    operatingSystem: "Android, iOS, Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "XOF",
    },
    description:
      "Application de gestion et calcul de charge pour les ateliers de couture en Afrique de l'Ouest.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VitrineClient inscritsCount={inscritsCount} />
    </>
  );
}
