import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Scissors,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSuiviPublicByToken } from '@/lib/services/atelier-service';
import { SuiviPhotosClient } from '@/components/suivi/SuiviPhotosClient';
import { CommandeStatut } from '@/lib/supabase/types';

export default async function SuiviCommandePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const suivi = await getSuiviPublicByToken(resolvedParams.token);

  if (!suivi) {
    notFound();
  }

  const etapes: { id: CommandeStatut; label: string; description: string }[] = [
    { id: 'recue', label: 'Commande reçue', description: 'Tissu déposé et mesures enregistrées' },
    { id: 'coupee', label: 'Tissu coupé', description: 'Le patron de coupe est tracé et découpé' },
    { id: 'en_couture', label: 'En couture', description: 'Les pièces sont en cours d’assemblage à la machine' },
    { id: 'finitions', label: 'Finitions & Broderie', description: 'Pose des boutons, ourlets et repassage' },
    { id: 'prete', label: 'Tenue prête !', description: 'Votre habit est prêt à être récupéré à l’atelier' },
    { id: 'livree', label: 'Livrée', description: 'Commande remise avec succès' },
  ];

  const indexActuel = etapes.findIndex((e) => e.id === suivi.statut);
  const estPrete = suivi.statut === 'prete' || suivi.statut === 'livree' || suivi.statut === 'payee';

  const waAtelierLien = suivi.whatsapp_atelier
    ? `https://wa.me/${suivi.whatsapp_atelier.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour ${suivi.nom_atelier}, je vous contacte au sujet de ma commande ${suivi.code_commande}.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-coton-50 text-coton-900 flex flex-col justify-between pattern-wax">
      {/* En-tête officiel du suivi */}
      <header className="p-4 sm:p-6 bg-white border-b border-coton-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-950 flex items-center justify-center text-terracotta-400 shadow-md">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-primary-950 block leading-tight">
                {suivi.nom_atelier}
              </span>
              <span className="text-[11px] font-bold text-coton-500 block">
                {suivi.ville_atelier}
              </span>
            </div>
          </div>

          <Badge variant="outline" className="font-mono font-bold text-xs">
            {suivi.code_commande}
          </Badge>
        </div>
      </header>

      {/* Contenu principal du suivi */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Statut principal en grand */}
        <div
          className={`p-6 rounded-3xl border-2 text-center shadow-sm space-y-3 ${
            estPrete
              ? 'bg-jauge-vert-bg border-jauge-vert/40 text-jauge-vert'
              : 'bg-white border-coton-200'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
              estPrete
                ? 'bg-jauge-vert text-white shadow-md'
                : 'bg-primary-950 text-terracotta-400'
            }`}
          >
            {estPrete ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider opacity-75 block">
              État d&apos;avancement
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-primary-950">
              {estPrete ? 'Votre tenue est prête !' : 'En cours de confection'}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-coton-700 max-w-md mx-auto leading-relaxed">
            {estPrete
              ? 'Votre habit a été repassé et soigneusement emballé. Vous pouvez passer le récupérer à l’atelier.'
              : `Livraison prévue au plus tard le : ${new Date(suivi.date_promise).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.`}
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-primary-950">
            Étapes de votre commande
          </h2>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-coton-200">
            {etapes.map((etape, idx) => {
              const isPast = idx < indexActuel;
              const isCurrent = idx === indexActuel;

              return (
                <div key={etape.id} className="relative flex items-start gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                      isCurrent
                        ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-400/20'
                        : isPast
                        ? 'bg-jauge-vert text-white'
                        : 'bg-coton-100 text-coton-400 border border-coton-300'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <h3
                      className={`text-sm font-extrabold ${
                        isCurrent
                          ? 'text-terracotta-600'
                          : isPast
                          ? 'text-primary-950'
                          : 'text-coton-400'
                      }`}
                    >
                      {etape.label}
                    </h3>
                    <p className="text-xs text-coton-600 mt-0.5">{etape.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photos réelles certifiées de la commande */}
        <SuiviPhotosClient photos={suivi.photos} statut={suivi.statut} />

        {/* Contact rapide avec l'atelier via WhatsApp */}
        {waAtelierLien && (
          <div className="p-5 rounded-3xl bg-white border border-coton-200 shadow-sm text-center space-y-3">
            <h3 className="font-extrabold text-sm text-primary-950">
              Une question pour l&apos;atelier ?
            </h3>
            <a
              href={waAtelierLien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button
                variant="secondary"
                size="default"
                className="w-full gap-2 font-bold text-jauge-vert border-jauge-vert/30 hover:bg-jauge-vert-bg"
              >
                <MessageCircle className="w-5 h-5 text-jauge-vert" />
                <span>Écrire à l&apos;atelier sur WhatsApp</span>
              </Button>
            </a>
          </div>
        )}
      </main>

      {/* Pied de page public */}
      <footer className="p-6 text-center text-xs text-coton-500 font-medium">
        Suivi propulsé par <strong>IZITAILLE</strong> — La sérénité des ateliers et de leurs clients.
      </footer>
    </div>
  );
}
