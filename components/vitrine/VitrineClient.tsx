'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Scissors,
  ArrowRight,
  Clock,
  BookX,
  PhoneOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  Layers,
  FolderLock,
  UserCheck,
  Send,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaitlistModal } from './WaitlistModal';
import { ClientFolderMockup } from './ClientFolderMockup';
import { CapacityGaugeShowcase } from './CapacityGaugeShowcase';

export interface VitrineClientProps {
  inscritsCount: number;
}

export function VitrineClient({ inscritsCount }: VitrineClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Est-ce que mes clients doivent télécharger une application ?',
      r: "Non, aucun compte ni application pour eux. Ils reçoivent simplement un message WhatsApp avec un lien direct pour voir l'avancée de leur tenue en toute autonomie.",
    },
    {
      q: 'Que se passe-t-il si je n’ai pas de connexion internet à l’atelier ?',
      r: "IZITAILLE fonctionne hors ligne. Tu saisis tes mesures et tes commandes normalement, et l'application met tout à jour automatiquement dès que le réseau revient.",
    },
    {
      q: 'Mes données de clients et mes mesures sont-elles en sécurité ?',
      r: 'Oui, ton atelier est entièrement privé. Aucun autre tailleur ne peut voir tes clients, leurs mesures ou tes prix. Tout est sauvegardé en lieu sûr dans le cloud.',
    },
    {
      q: 'Est-ce difficile à utiliser si je ne suis pas habitué aux ordinateurs ?',
      r: 'Non, tout est pensé pour ton téléphone Android habituel. C’est aussi simple que d’envoyer une note vocale ou une photo sur WhatsApp. En 5 minutes, tu as tout compris.',
    },
    {
      q: 'Comment s’effectue le paiement de l’abonnement ?',
      r: 'Tu paies directement par Orange Money, Wave ou MTN Mobile Money, sans carte bancaire ni démarche compliquée.',
    },
    {
      q: 'Puis-je utiliser IZITAILLE pour plusieurs couturiers dans mon atelier ?',
      r: 'Oui, avec la formule Pro, tu ajoutes tes employés couturiers pour leur assigner des confections et voir exactement ce que chacun doit coudre aujourd’hui.',
    },
  ];

  return (
    <div className="min-h-screen bg-coton-50 text-coton-900 flex flex-col selection:bg-terracotta-500 selection:text-white">
      {/* ---------------------------------------------------------------------
          BARRE DE NAVIGATION SUPÉRIEURE
      --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-coton-200 px-4 py-3.5 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary-950 flex items-center justify-center text-terracotta-400 shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-primary-950 block leading-none">
                IZITAILLE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600 block">
                Ateliers d&apos;Afrique de l&apos;Ouest
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-coton-700">
            <a href="#atelier" className="hover:text-terracotta-600 transition-colors">
              L&apos;atelier
            </a>
            <a href="#probleme" className="hover:text-terracotta-600 transition-colors">
              Le problème
            </a>
            <a href="#dossier" className="hover:text-terracotta-600 transition-colors">
              Dossier client
            </a>
            <a href="#photos" className="hover:text-terracotta-600 transition-colors">
              3 photos
            </a>
            <a href="#capacite" className="hover:text-terracotta-600 transition-colors">
              Jauge anti-surcharge
            </a>
            <a href="#prix" className="hover:text-terracotta-600 transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-terracotta-600 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/app/connexion">
              <Button variant="ghost" size="sm" className="font-bold text-coton-800">
                Connexion
              </Button>
            </Link>
            <Button
              variant="terracotta"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="font-bold shadow-sm"
            >
              Liste d&apos;attente
            </Button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------
          1. HERO SECTION (Atmosphère d'atelier ouest-africain authentique)
      --------------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-primary-950 text-white py-14 sm:py-20 md:py-24 px-4 sm:px-8 border-b border-primary-900">
        {/* Halos de lumière vivants & animés */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-terracotta-500/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-primary-600/25 rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '-3.5s' }} />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-terracotta-600/15 rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '-6s' }} />

        {/* Motif textile discret et halo d'atelier */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#c25e3e_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/75 via-primary-950/90 to-primary-950 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Badges de pays & spécialités ouest-africaines */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-500/20 border border-terracotta-400/35 text-terracotta-300 text-xs font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-500" />
              </span>
              <span>Conçu pour les maîtres tailleurs & couturières d&apos;Afrique de l&apos;Ouest</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-coton-300 text-[11px] font-bold backdrop-blur-xs">
              <span className="hover:text-terracotta-300 transition-colors">🇨🇮 Abidjan</span>
              <span>•</span>
              <span className="hover:text-terracotta-300 transition-colors">🇸🇳 Dakar</span>
              <span>•</span>
              <span className="hover:text-terracotta-300 transition-colors">🇧🇯 Cotonou</span>
              <span>•</span>
              <span className="hover:text-terracotta-300 transition-colors">🇲🇱 Bamako</span>
              <span>•</span>
              <span className="hover:text-terracotta-300 transition-colors">🇬🇳 Conakry</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Colonne gauche : Le message fort */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.12]">
                Arrête de promettre des dates que tu ne peux pas tenir.
              </h1>

              <p className="text-base sm:text-lg text-coton-200 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                IZITAILLE garde le dossier complet de chaque client (mesures, photos réelles des pagnes et modèles)
                et calcule combien de boubous ou robes ton atelier peut vraiment coudre d&apos;ici la Tabaski, la Korité ou Noël sans jamais être submergé.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  variant="terracotta"
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto gap-2 text-base font-extrabold shadow-xl shadow-terracotta-500/30 animate-shimmer-btn hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Rejoindre la liste d&apos;attente</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <a href="#atelier" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Voir l&apos;ambiance atelier
                  </Button>
                </a>
              </div>

              {/* Rassurance terrain Afrique */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-coton-400">
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Smartphone className="w-4 h-4 text-terracotta-400" />
                  <span>Smartphone Android habituel</span>
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <WifiOff className="w-4 h-4 text-jauge-vert" />
                  <span>100% utilisable sans connexion</span>
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4 text-terracotta-400" />
                  <span>Orange Money, Wave, MTN</span>
                </span>
              </div>
            </div>

            {/* Colonne droite : Composition visuelle authentique d'atelier */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Carte Principale : L'Atelier & Pagnes */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl bg-primary-900 group hover:border-terracotta-400/40 hover:shadow-terracotta-500/20 transition-all duration-500">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src="/images/atelier-pagnes.jpg"
                      alt="Couturière découpant des pagnes wax dans un atelier africain"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-terracotta-500 text-white text-[10px] font-extrabold uppercase">
                        À la table de coupe
                      </span>
                      <span className="text-[11px] text-coton-300 font-medium">Bazin & Wax certifiés</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      La photo du coupon est liée au client dès la dépose.
                    </p>
                  </div>
                </div>

                {/* Vignette Maître Tailleur en superposition flottante */}
                <div className="absolute -bottom-6 -left-3 sm:-left-5 w-36 sm:w-44 rounded-2xl overflow-hidden border-2 border-terracotta-400 shadow-2xl bg-primary-950 animate-float-delayed hover:scale-105 transition-transform duration-300 z-20">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/maitre-tailleur.jpg"
                      alt="Maître tailleur africain avec son mètre ruban"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 bg-primary-950 text-center">
                    <span className="text-[10px] font-black uppercase text-terracotta-400 block tracking-tight">
                      Maître Tailleur
                    </span>
                    <span className="text-[9px] text-coton-300 font-medium">Zéro retard de fête</span>
                  </div>
                </div>

                {/* Badge flottant Jauge Tabaski */}
                <div className="absolute -top-4 -right-2 sm:-right-4 px-3.5 py-2 rounded-2xl bg-primary-950/95 border border-jauge-vert/60 shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-float z-20 hover:scale-105 transition-transform duration-300">
                  <div className="w-7 h-7 rounded-full bg-jauge-vert/20 text-jauge-vert flex items-center justify-center font-black text-xs animate-pulse">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-jauge-vert block tracking-wider">
                      Jauge Anti-Surcharge
                    </span>
                    <span className="text-xs font-black text-white">
                      68% • 4 places libres
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          RUBAN TEXTILE D'AFRIQUE DE L'OUEST (DÉFILEMENT CONTINU INFINI)
      --------------------------------------------------------------------- */}
      <div className="bg-primary-900 border-b border-primary-800 py-3 overflow-hidden text-white relative">
        {/* Masque de fondu doux sur les bords */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-r from-primary-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-l from-primary-900 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-bold text-coton-200">
          <span className="text-terracotta-400 font-extrabold flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 shrink-0">
            <Scissors className="w-3.5 h-3.5 -rotate-45 text-terracotta-400" />
            <span>TISSUS & CÉRÉMONIES :</span>
          </span>
          <span className="hover:text-terracotta-400 transition-colors">✨ Bazin Riche Damassé</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🌺 Pagne Wax Hollandais & Vlisco</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🧵 Woodin & Uniwax</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">👑 Grand Boubou 3 pièces</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🕌 Tabaski & Korité</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">💍 Dots & Mariages coutumiers</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🌍 Kita & Kente royal</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">✨ Bogolan traditionnel</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🪡 Broderie fil d&apos;or & sequins</span>
          <span className="text-primary-700">•</span>

          {/* DUPLICAT POUR DÉFILEMENT CONTINU PARFAIT */}
          <span className="text-terracotta-400 font-extrabold flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 shrink-0">
            <Scissors className="w-3.5 h-3.5 -rotate-45 text-terracotta-400" />
            <span>TISSUS & CÉRÉMONIES :</span>
          </span>
          <span className="hover:text-terracotta-400 transition-colors">✨ Bazin Riche Damassé</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🌺 Pagne Wax Hollandais & Vlisco</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🧵 Woodin & Uniwax</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">👑 Grand Boubou 3 pièces</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🕌 Tabaski & Korité</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">💍 Dots & Mariages coutumiers</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🌍 Kita & Kente royal</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">✨ Bogolan traditionnel</span>
          <span className="text-primary-700">•</span>
          <span className="hover:text-terracotta-400 transition-colors">🪡 Broderie fil d&apos;or & sequins</span>
          <span className="text-primary-700">•</span>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          NOUVELLE SECTION : L'ATMOSPHÈRE DE NOS ATELIERS DE COUTURE
      --------------------------------------------------------------------- */}
      <section id="atelier" className="py-16 sm:py-24 px-4 sm:px-8 bg-coton-100/60 border-b border-coton-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
              Au cœur du métier
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
              Pensé pour la vraie vie d&apos;un atelier de couture africain.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-coton-700">
              Du dépôt des coupons de pagne jusqu&apos;à la veillée des fêtes, IZITAILLE protège la réputation de ton atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Carte 1 : Table de coupe */}
            <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 shadow-sm overflow-hidden flex flex-col hover:border-terracotta-300">
              <div className="relative aspect-16/10 w-full bg-coton-200 overflow-hidden">
                <Image
                  src="/images/atelier-pagnes.jpg"
                  alt="Découpe du pagne à l'atelier"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600 block">
                    1. La table de coupe
                  </span>
                  <h3 className="text-lg font-extrabold text-primary-950 mt-1 group-hover:text-terracotta-600 transition-colors">
                    Zéro mélange de pagnes
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-coton-600 leading-relaxed">
                    Entre les coupons de bazin damassé et de wax entassés sur les étagères, couper le mauvais tissu coûte une fortune. La photo du pagne certifie à qui appartient chaque coupon.
                  </p>
                </div>
                <div className="pt-2 border-t border-coton-100 text-[11px] font-bold text-primary-950 flex items-center justify-between">
                  <span>Preuve indiscutable à la dépose</span>
                  <span className="text-terracotta-500 font-extrabold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </div>
            </div>

            {/* Carte 2 : Maître Tailleur */}
            <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 shadow-sm overflow-hidden flex flex-col hover:border-jauge-vert/50">
              <div className="relative aspect-16/10 w-full bg-coton-200 overflow-hidden">
                <Image
                  src="/images/maitre-tailleur.jpg"
                  alt="Maître tailleur africain serein"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-jauge-vert block">
                    2. La gestion du maître
                  </span>
                  <h3 className="text-lg font-extrabold text-primary-950 mt-1 group-hover:text-jauge-vert transition-colors">
                    Le respect du Maître Tailleur
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-coton-600 leading-relaxed">
                    Plus de clients furieux qui crient devant l&apos;atelier. Tu sais exactement ce que tes apprentis doivent coudre chaque matin. Tu deviens le tailleur le plus ponctuel du quartier.
                  </p>
                </div>
                <div className="pt-2 border-t border-coton-100 text-[11px] font-bold text-primary-950 flex items-center justify-between">
                  <span>Clients fidélisés d&apos;année en année</span>
                  <span className="text-jauge-vert font-extrabold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </div>
            </div>

            {/* Carte 3 : Atelier sans surcharge */}
            <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 shadow-sm overflow-hidden flex flex-col hover:border-terracotta-400">
              <div className="relative aspect-16/10 w-full bg-coton-200 overflow-hidden">
                <Image
                  src="/images/hero-atelier.jpg"
                  alt="Les machines à coudre qui tournent sans surcharge"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-500 block">
                    3. La veille des fêtes
                  </span>
                  <h3 className="text-lg font-extrabold text-primary-950 mt-1 group-hover:text-terracotta-500 transition-colors">
                    Tabaski & Korité sans nuit blanche
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-coton-600 leading-relaxed">
                    Grâce à la jauge de charge, tu refuses poliment les commandes impossibles ou tu proposes une date réaliste. La veille de la fête, tout est repassé et livré à temps.
                  </p>
                </div>
                <div className="pt-2 border-t border-coton-100 text-[11px] font-bold text-primary-950 flex items-center justify-between">
                  <span>100% des habits livrés à l&apos;heure</span>
                  <span className="text-terracotta-500 font-extrabold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          2. LE PROBLÈME ("Ton cahier ne te dit pas quand tu es plein.")
      --------------------------------------------------------------------- */}
      <section id="probleme" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
            La réalité des ateliers
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
            Ton cahier ne te dit pas quand tu es plein.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-coton-700">
            Chaque veille de fête, c&apos;est la même panique. Les clients crient,
            tu passes des nuits blanches et tu recouds à tes frais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-jauge-rouge/40 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-jauge-rouge-bg text-jauge-rouge flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-jauge-rouge transition-colors">
              « Tu promets jeudi. Tu livres lundi. »
            </h3>
            <p className="mt-2 text-sm text-coton-700 leading-relaxed">
              Tu acceptes parce que tu ne veux pas perdre le client. Mais tu ne sais pas
              ce qui est déjà engagé sur les machines. Tu te retrouves submergé, le client
              s&apos;énerve et part chez le tailleur d&apos;en face.
            </p>
          </div>

          <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-jauge-orange/40 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-jauge-orange-bg text-jauge-orange flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <BookX className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-jauge-orange transition-colors">
              « Tu rappelles le client pour ses mesures. »
            </h3>
            <p className="mt-2 text-sm text-coton-700 leading-relaxed">
              Le cahier de l&apos;an dernier est taché, déchiré ou introuvable. Tu es obligé
              de rappeler le client pour lui redemander ses mesures. Tu as l&apos;air de ne pas
              le reconnaître, et la confiance s&apos;effrite.
            </p>
          </div>

          <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-terracotta-300 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-terracotta-600 transition-colors">
              « Les pagnes s&apos;entassent sans nom. »
            </h3>
            <p className="mt-2 text-sm text-coton-700 leading-relaxed">
              Dix coupons de basin et de wax sont posés sur l&apos;étagère. Quel tissu va
              avec quelle commande ? Tu coupes le mauvais pagne, et tu dois rembourser
              la cliente de ta poche.
            </p>
          </div>

          <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-primary-400 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-primary-900/10 text-primary-900 flex items-center justify-center font-bold mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-primary-800 transition-colors">
              « Le téléphone sonne toute la journée. »
            </h3>
            <p className="mt-2 text-sm text-coton-700 leading-relaxed">
              « C&apos;est prêt ? » « C&apos;est pour quand ? » Tu passes plus de temps à te
              justifier au téléphone qu&apos;à pédaler sur la machine à coudre.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          3. LE DOSSIER CLIENT (Section majeure + Mockup Mobile)
      --------------------------------------------------------------------- */}
      <section id="dossier" className="py-16 sm:py-24 bg-white border-y border-coton-200 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
              Le dossier client central
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight leading-tight">
              Chaque client a son dossier. Pour toujours.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-coton-700 leading-relaxed">
              Tu tapes son nom, tout est là. Même trois ans après.
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-jauge-vert-bg text-jauge-vert flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm sm:text-base text-primary-950 block font-bold">
                    Ses mesures complètes, avec schéma de silhouette
                  </strong>
                  <p className="text-xs sm:text-sm text-coton-600">
                    Tour de cou, poitrine, carrure, manches, longueur boubou ou pantalon.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-jauge-vert-bg text-jauge-vert flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm sm:text-base text-primary-950 block font-bold">
                    L&apos;historique de ses mesures dans le temps, daté
                  </strong>
                  <p className="text-xs sm:text-sm text-coton-600">
                    On n&apos;écrase jamais l&apos;ancienne prise. Tu compares l&apos;évolution au fil des ans.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-jauge-vert-bg text-jauge-vert flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm sm:text-base text-primary-950 block font-bold">
                    Ses préférences de confection
                  </strong>
                  <p className="text-xs sm:text-sm text-coton-600">
                    « Manches larges », « pas de fente », « col mao toujours ». Il n&apos;a plus besoin de répéter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-jauge-vert-bg text-jauge-vert flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm sm:text-base text-primary-950 block font-bold">
                    Toutes ses commandes passées avec photos
                  </strong>
                  <p className="text-xs sm:text-sm text-coton-600">
                    Retrouve en 1 seconde la tenue qu&apos;il a portée au mariage de son frère.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-jauge-vert-bg text-jauge-vert flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-sm sm:text-base text-primary-950 block font-bold">
                    Ce qu&apos;il a payé, ce qu&apos;il doit encore
                  </strong>
                  <p className="text-xs sm:text-sm text-coton-600">
                    Le décompte précis des acomptes et des soldes restants. Fini les disputes de caisse.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200">
              <p className="text-sm font-bold text-terracotta-800 leading-snug">
                « Un client qui n&apos;a plus jamais besoin de répéter ses mesures ne va pas chez le tailleur d&apos;en face. »
              </p>
            </div>
          </div>

          {/* Mockup interactif du téléphone */}
          <div className="flex justify-center">
            <ClientFolderMockup />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          4. LES PHOTOS ("Trois photos par commande. Plus jamais de confusion.")
      --------------------------------------------------------------------- */}
      <section id="photos" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
            Zéro erreur d&apos;attribution
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
            Trois photos par commande. Plus jamais de confusion.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-coton-700">
            Compressées automatiquement sur ton téléphone pour ne pas épuiser ton forfait internet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo 1: Le modèle voulu */}
          <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 overflow-hidden shadow-sm flex flex-col hover:border-primary-800">
            <div className="relative aspect-square w-full bg-coton-100 overflow-hidden">
              <Image
                src="/images/modele-voulu.jpg"
                alt="Modèle de boubou voulu par le client"
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-3 left-3 bg-primary-950 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md group-hover:bg-primary-900 transition-colors">
                1. LE MODÈLE VOULU
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-primary-950 group-hover:text-primary-800 transition-colors">
                  La photo montrée par le client
                </h3>
                <p className="mt-1.5 text-xs text-coton-600 leading-relaxed">
                  Celui qu&apos;il te montre sur son téléphone. Fini les : « Maître, ce n&apos;est pas
                  ce col que je vous avais demandé ! »
                </p>
              </div>
            </div>
          </div>

          {/* Photo 2: Le tissu remis */}
          <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 overflow-hidden shadow-sm flex flex-col hover:border-terracotta-400">
            <div className="relative aspect-square w-full bg-coton-100 overflow-hidden">
              <Image
                src="/images/tissu-remis.jpg"
                alt="Tissu et pagne remis à l'atelier"
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-3 left-3 bg-terracotta-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md group-hover:bg-terracotta-600 transition-colors">
                2. LE TISSU REMIS
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-primary-950 group-hover:text-terracotta-600 transition-colors">
                  Le coupon déposé à l&apos;atelier
                </h3>
                <p className="mt-1.5 text-xs text-coton-600 leading-relaxed">
                  Le pagne ou le basin qu&apos;il t&apos;a confié. Tu retrouves immédiatement
                  à qui appartient chaque morceau sur la table.
                </p>
              </div>
            </div>
          </div>

          {/* Photo 3: La tenue finie */}
          <div className="card-interactive group cursor-pointer rounded-3xl bg-white border border-coton-200 overflow-hidden shadow-sm flex flex-col hover:border-jauge-vert">
            <div className="relative aspect-square w-full bg-coton-100 overflow-hidden">
              <Image
                src="/images/tenue-finie.jpg"
                alt="Tenue confectionnée finie prête pour le client"
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-3 left-3 bg-jauge-vert text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md group-hover:bg-emerald-700 transition-colors">
                3. LA TENUE FINIE
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-primary-950 group-hover:text-jauge-vert transition-colors">
                  Ton chef-d&apos;œuvre repassé
                </h3>
                <p className="mt-1.5 text-xs text-coton-600 leading-relaxed">
                  La tenue finie ajoutée à la livraison. Tu construis le catalogue
                  de ton atelier sans aucun effort supplémentaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          5. LA JAUGE DE CHARGE (Fond contrasté & simulateur)
      --------------------------------------------------------------------- */}
      <section id="capacite" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <CapacityGaugeShowcase />
      </section>

      {/* ---------------------------------------------------------------------
          6. COMMENT ÇA MARCHE (3 étapes simples)
      --------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-white border-y border-coton-200 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
              Simple comme bonjour
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
              Comment ça marche au quotidien ?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-coton-700">
              Pas besoin d&apos;être informaticien. 3 étapes pour sécuriser ton atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-coton-50 border border-coton-200 flex flex-col hover:border-primary-900 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-primary-950 text-terracotta-400 font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                1
              </div>
              <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-terracotta-600 transition-colors">
                Le client arrive
              </h3>
              <p className="mt-2 text-sm text-coton-700 leading-relaxed">
                Tu crées son dossier en 60 secondes. Tu notes ses mesures ou tu les retrouves
                instantanément s&apos;il est déjà venu. Tu prends la photo du tissu remis.
              </p>
            </div>

            <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-coton-50 border border-coton-200 flex flex-col hover:border-terracotta-400 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                2
              </div>
              <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-terracotta-500 transition-colors">
                Tu regardes la jauge
              </h3>
              <p className="mt-2 text-sm text-coton-700 leading-relaxed">
                Tu indiques la date voulue. La jauge s&apos;allume en vert, orange ou rouge.
                Tu sais immédiatement si tu peux accepter sans risquer de décevoir.
              </p>
            </div>

            <div className="card-interactive group p-6 sm:p-7 rounded-3xl bg-coton-50 border border-coton-200 flex flex-col hover:border-jauge-vert cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-jauge-vert text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                3
              </div>
              <h3 className="text-lg font-extrabold text-primary-950 group-hover:text-jauge-vert transition-colors">
                Tu couds l&apos;esprit tranquille
              </h3>
              <p className="mt-2 text-sm text-coton-700 leading-relaxed">
                Le client suit son habit en direct sur son lien WhatsApp. Quand c&apos;est prêt,
                tu cliques pour lui envoyer le message pré-rempli. Il vient chercher et paie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          7. FONCTIONNALITÉS (Grille de 6)
      --------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
            Tout dans un seul outil
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
            Les outils indispensables de ton atelier
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-primary-900 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary-950 text-terracotta-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
              <FolderLock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-primary-800 transition-colors">
              Dossier client permanent
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Profils Homme, Femme, Enfant. Prise de mesures versionnée et datée qui ne s&apos;efface jamais.
            </p>
          </div>

          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-terracotta-400 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-terracotta-600 transition-colors">
              Calculateur anti-surcharge
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Calcule la charge en temps réel selon la capacité de tes machines et tes jours de repos.
            </p>
          </div>

          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-primary-800 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-primary-800 transition-colors">
              Gestion des 3 photos
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Modèle, tissu confié et tenue finie liés à chaque commande. Compression ultra-légère.
            </p>
          </div>

          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-jauge-vert cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-jauge-vert text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-jauge-vert transition-colors">
              Suivi client sans compte
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Lien public sécurisé que ton client ouvre sans mot de passe pour voir où en est son vêtement.
            </p>
          </div>

          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-terracotta-500 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-terracotta-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-terracotta-600 transition-colors">
              Suivi de caisse & impayés
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Acomptes versés, soldes restants et liste claire des clients qui te doivent encore de l&apos;argent.
            </p>
          </div>

          <div className="card-interactive group p-6 rounded-3xl bg-white border border-coton-200 shadow-sm hover:border-primary-700 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-primary-950 group-hover:text-primary-800 transition-colors">
              Répartition par couturier
            </h3>
            <p className="mt-2 text-xs text-coton-600 leading-relaxed">
              Assigne les coupes et la couture à tes employés pour savoir qui coud quoi chaque matin.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          8. HORS LIGNE ("Ça marche même sans connexion.")
      --------------------------------------------------------------------- */}
      <section className="py-16 sm:py-20 bg-primary-950 text-white px-4 sm:px-8 border-y border-primary-900">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-terracotta-500/20 text-terracotta-400 border border-terracotta-400/30 flex items-center justify-center shrink-0 shadow-lg">
            <WifiOff className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-terracotta-400 block mb-1">
              Fiabilité totale en Afrique de l&apos;Ouest
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ça marche même sans connexion internet.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-coton-300 leading-relaxed">
              Coupure de courant ? Panne de réseau ? Tu continues à prendre tes mesures
              et à enregistrer tes confections sur ton téléphone. Dès que la connexion
              revient, toutes les informations se synchronisent automatiquement.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          9. PRIX & TARIFS
      --------------------------------------------------------------------- */}
      <section id="prix" className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
            Des tarifs adaptés à nos ateliers
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
            Choisis la formule qui convient à ton atelier
          </h2>
          <p className="mt-2 text-sm text-coton-600">
            Paiement par Orange Money, MTN Money ou Wave. Sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Formule Gratuite */}
          <div className="card-interactive group p-8 rounded-3xl bg-white border border-coton-200 shadow-sm flex flex-col justify-between hover:border-primary-400 cursor-pointer">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-coton-500">
                Pour démarrer
              </span>
              <h3 className="text-2xl font-extrabold text-primary-950 mt-1 group-hover:text-primary-800 transition-colors">
                Formule Découverte
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary-950">0</span>
                <span className="text-lg font-bold text-coton-600">FCFA / mois</span>
              </div>
              <p className="mt-3 text-xs text-coton-600">
                Idéal pour tester l&apos;application ou pour un couturier qui travaille seul.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-coton-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jauge-vert" />
                  <span>Jusqu&apos;à <strong>15 commandes</strong> par mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jauge-vert" />
                  <span>Dossiers clients & mesures illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jauge-vert" />
                  <span>Jauge de charge anti-surcharge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-jauge-vert" />
                  <span>Fonctionne hors ligne</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="default"
                onClick={() => setIsModalOpen(true)}
                className="w-full font-bold border-coton-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Commencer gratuitement
              </Button>
            </div>
          </div>

          {/* Formule Atelier Pro */}
          <div className="card-interactive group p-8 rounded-3xl bg-primary-950 text-white border-2 border-terracotta-500 shadow-2xl flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] hover:shadow-terracotta-500/25 transition-all duration-300 cursor-pointer">
            <div className="absolute top-4 right-4 bg-terracotta-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Recommandé</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-400">
                Pour les ateliers actifs
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1 group-hover:text-terracotta-300 transition-colors">
                Atelier Pro
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-terracotta-400">4 900</span>
                <span className="text-lg font-bold text-coton-300">FCFA / mois</span>
              </div>
              <p className="mt-3 text-xs text-coton-300">
                Moins cher que le coût d&apos;un seul pagne gâché par erreur.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-coton-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span><strong>Commandes illimitées</strong> toute l&apos;année</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span>Ajout de tes couturiers employés</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span>Liens de suivi WhatsApp personnalisés</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span>Export des dossiers en PDF à imprimer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span>Support prioritaire sur WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="terracotta"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full font-extrabold shadow-lg shadow-terracotta-500/30 text-base animate-shimmer-btn hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Réserver ma place Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          10. FAQ (6 questions, réponses percutantes de 2-3 phrases)
      --------------------------------------------------------------------- */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-y border-coton-200 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-600 block mb-2">
              Questions fréquentes
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-950 tracking-tight">
              Tout ce que tu dois savoir
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-coton-200 overflow-hidden bg-coton-50/50 transition-all hover:border-terracotta-200 hover:shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-primary-950 flex items-center justify-between gap-4 cursor-pointer hover:text-terracotta-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-coton-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-terracotta-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-coton-700 leading-relaxed border-t border-coton-200/60 pt-3 animate-in fade-in duration-200">
                      {faq.r}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          SECTION TÉMOIGNAGES (STRICTEMENT CONFORME AUX RÈGLES : LAISSÉE VIDE & À REMPLIR)
      --------------------------------------------------------------------- */}
      <section className="py-12 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-2xl border border-dashed border-coton-300 bg-coton-100/40 text-coton-500 text-xs font-semibold hover:border-coton-400 transition-colors">
          <span className="uppercase tracking-wider font-bold block mb-1">
            Section Témoignages d&apos;ateliers
          </span>
          <span>
            [Section à remplir après les premiers retours réels des ateliers de la liste d&apos;attente — aucun faux avis]
          </span>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          11. CTA FINAL + COMPTEUR RÉEL DEPUIS LA BASE
      --------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-primary-950 text-white px-4 sm:px-8 border-t border-primary-900 text-center relative overflow-hidden">
        {/* Halos lumineux en fond */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-terracotta-500/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '-4s' }} />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Compteur réel lu depuis Supabase liste_attente */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900 border border-primary-800 text-coton-200 text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-jauge-vert opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-jauge-vert" />
            </span>
            <span>
              <strong>{inscritsCount} ateliers</strong> déjà inscrits sur la liste d&apos;attente
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Prêt à transformer la gestion de ton atelier ?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-coton-300 max-w-xl mx-auto leading-relaxed">
            Rejoins les couturiers précurseurs en Côte d&apos;Ivoire, Guinée, Sénégal, Mali et Bénin.
            Gratuit pour les 100 premiers inscrits.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="terracotta"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto gap-2 text-base sm:text-lg font-extrabold shadow-xl shadow-terracotta-500/30 animate-shimmer-btn hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <span>Rejoindre la liste d&apos;attente</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="mt-4 text-xs text-coton-400">
            Inscription en 30 secondes • Sans engagement
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          12. PIED DE PAGE
      --------------------------------------------------------------------- */}
      <footer className="bg-white border-t border-coton-200 py-10 px-4 sm:px-8 text-xs text-coton-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-950 flex items-center justify-center text-terracotta-400">
              <Scissors className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <span className="font-extrabold text-primary-950 text-sm block">
                IZITAILLE
              </span>
              <span className="text-[10px] text-coton-500 block">
                Guinée • Côte d&apos;Ivoire • Bénin • Sénégal • Mali
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold text-coton-700">
            <Link href="/app/connexion" className="hover:text-terracotta-600 transition-colors">
              Espace Atelier
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-terracotta-600 transition-colors cursor-pointer"
            >
              Liste d&apos;attente
            </button>
            <a
              href="https://wa.me/2250700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terracotta-600 transition-colors"
            >
              Contact WhatsApp
            </a>
          </div>

          <div className="text-center sm:text-right text-[11px] text-coton-500">
            &copy; {new Date().getFullYear()} IZITAILLE. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Modale d'inscription à 3 champs */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
