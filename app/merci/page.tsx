import * as React from 'react';
import Link from 'next/link';
import { Scissors, CheckCircle2, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ atelier?: string; ville?: string }>;
}) {
  const resolvedParams = await searchParams;
  const nomAtelier = resolvedParams.atelier || 'Ton atelier';
  const ville = resolvedParams.ville || 'ta ville';

  const shareText = encodeURIComponent(
    `Salam mon frère / ma sœur couturier, regarde cette solution pour nos ateliers : IZITAILLE. Ça garde toutes les mesures de tes clients et ça calcule combien de tenues tu peux vraiment coudre avant la fête pour ne plus jamais être en retard. Les 100 premiers ateliers sont gratuits : https://izitaille.com`
  );

  const contactSupportText = encodeURIComponent(
    `Bonjour IZITAILLE, j'ai inscrit mon atelier "${nomAtelier}" (${ville}) sur la liste d'attente. Je souhaite en savoir plus sur le lancement !`
  );

  return (
    <div className="min-h-screen bg-coton-50 flex flex-col justify-between pattern-wax">
      {/* En-tête sobre */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-4xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary-950 flex items-center justify-center text-terracotta-400 shadow-md">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-primary-950 block leading-none">
              IZITAILLE
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600 block">
              Afrique de l&apos;Ouest
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-coton-600 hover:text-primary-950 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Link>
      </header>

      {/* Contenu principal de remerciement */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-coton-200 p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-jauge-vert-bg text-jauge-vert flex items-center justify-center mx-auto mb-5 border border-jauge-vert/30 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight leading-tight">
            Félicitations, {nomAtelier} est bien pré-inscrit !
          </h1>

          <p className="mt-3 text-base text-coton-700 leading-relaxed">
            Tu es officiellement parmi les <strong>100 premiers ateliers</strong> d&apos;Afrique de l&apos;Ouest.
            Ton accès gratuit te sera envoyé directement sur ton WhatsApp dès l&apos;ouverture des accès.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-coton-50 border border-coton-200 text-left space-y-2">
            <span className="text-xs font-bold uppercase text-terracotta-600 tracking-wider block">
              Ce qui va se passer maintenant :
            </span>
            <ul className="text-xs sm:text-sm text-coton-700 space-y-1.5 list-disc list-inside">
              <li>Nous validons la priorité de ton atelier pour <strong>{ville}</strong>.</li>
              <li>Tu recevras un message WhatsApp avec ton lien de connexion personnalisé.</li>
              <li>Tu seras accompagné pas à pas pour configurer tes confections et mesures.</li>
            </ul>
          </div>

          {/* Actions WhatsApp */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="terracotta"
                size="lg"
                className="w-full gap-2.5 font-bold shadow-md shadow-terracotta-500/20"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager à un confrère couturier sur WhatsApp</span>
              </Button>
            </a>

            <a
              href={`https://wa.me/2250700000000?text=${contactSupportText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="secondary"
                size="default"
                className="w-full gap-2 font-semibold text-coton-800"
              >
                <MessageCircle className="w-5 h-5 text-jauge-vert" />
                <span>Écrire à l&apos;équipe IZITAILLE sur WhatsApp</span>
              </Button>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-coton-200">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-coton-600 hover:text-primary-950 underline underline-offset-4"
            >
              Retourner à l&apos;accueil du site
            </Link>
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="p-4 text-center text-xs text-coton-500 font-medium">
        IZITAILLE &copy; {new Date().getFullYear()} — La gestion d&apos;atelier sans fausses promesses.
      </footer>
    </div>
  );
}
