'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { rejoindreListeAttenteAction } from '@/app/actions/waitlist';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [state, formAction, isPending] = useActionState(
    rejoindreListeAttenteAction,
    null
  );

  // Fermer la modale avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Déclencher l'événement Meta Pixel Lead avant la soumission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead');
      } catch (err) {
        console.warn('Erreur Meta Pixel Lead:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-coton-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-coton-500 hover:text-coton-900 hover:bg-coton-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête de la modale */}
        <div className="text-center pr-6 sm:pr-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Offre de lancement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Rejoins la liste d&apos;attente
          </h2>
          <p className="mt-2 text-sm text-coton-600">
            Gratuit à vie pour les 100 premiers ateliers. Pas de carte bancaire,
            pas d&apos;engagement.
          </p>
        </div>

        {state?.error && (
          <div className="mt-4 p-3.5 rounded-xl bg-jauge-rouge-bg border border-jauge-rouge/30 text-jauge-rouge flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Formulaire à 3 champs */}
        <form
          action={formAction}
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 text-left"
        >
          <div>
            <Input
              name="nomAtelier"
              type="text"
              label="1. Nom de ton atelier"
              placeholder="ex: Atelier Maître Diallo & Fils"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Input
              name="whatsapp"
              type="tel"
              label="2. Ton numéro WhatsApp"
              placeholder="ex: +225 07 12 34 56 78"
              required
              helperText="Nous t'enverrons ton accès prioritaire directement sur WhatsApp."
              disabled={isPending}
            />
          </div>

          <div>
            <Input
              name="ville"
              type="text"
              label="3. Ta ville ou commune"
              placeholder="ex: Abidjan (Adjamé), Conakry, Dakar, Bamako, Cotonou..."
              required
              disabled={isPending}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="terracotta"
              size="lg"
              className="w-full gap-2 text-base font-extrabold shadow-lg shadow-terracotta-500/20"
              isLoading={isPending}
            >
              <span>Réserver ma place gratuite</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-[11px] text-center text-coton-500 font-medium">
            Tes informations restent strictement confidentielles. Aucun spam.
          </p>
        </form>
      </div>
    </div>
  );
}
