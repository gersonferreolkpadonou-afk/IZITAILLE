'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { signupAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function InscriptionPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gratuit pour les 100 premiers ateliers</span>
        </div>
        <h1 className="text-2xl font-extrabold text-primary-950 tracking-tight">
          Créer l&apos;espace de ton atelier
        </h1>
        <p className="mt-1.5 text-sm text-coton-600">
          Enregistre ton atelier, configure tes capacités et démarre sans désordre.
        </p>
      </div>

      {state?.error && (
        <div className="mb-5 p-3.5 rounded-xl bg-jauge-rouge-bg border border-jauge-rouge/30 text-jauge-rouge flex items-start gap-2.5 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <Input
            name="nomAtelier"
            type="text"
            label="Nom de ton atelier"
            placeholder="ex: Atelier Sylla & Frères"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <Input
            name="nomPatron"
            type="text"
            label="Ton nom complet (Patron)"
            placeholder="ex: Maître Ibrahima Diallo"
            required
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="pays"
              className="block text-sm font-semibold text-coton-900 mb-1.5"
            >
              Pays
            </label>
            <select
              id="pays"
              name="pays"
              defaultValue="Côte d'Ivoire"
              className="w-full h-[52px] px-3.5 rounded-xl border border-coton-300 bg-white text-coton-900 text-base font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500"
              disabled={isPending}
            >
              <option value="Côte d'Ivoire">Côte d&apos;Ivoire (XOF)</option>
              <option value="Guinée">Guinée (GNF)</option>
              <option value="Sénégal">Sénégal (XOF)</option>
              <option value="Mali">Mali (XOF)</option>
              <option value="Bénin">Bénin (XOF)</option>
              <option value="Togo">Togo (XOF)</option>
              <option value="Burkina Faso">Burkina Faso (XOF)</option>
              <option value="Autre">Autre pays</option>
            </select>
          </div>

          <div>
            <Input
              name="ville"
              type="text"
              label="Ville ou Commune"
              placeholder="ex: Abidjan (Treichville)"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Input
            name="whatsapp"
            type="tel"
            label="Numéro WhatsApp principal"
            placeholder="ex: +225 0701020304"
            required
            helperText="Sert à envoyer les suivis de commande à tes clients"
            disabled={isPending}
          />
        </div>

        <div>
          <Input
            name="identifiant"
            type="text"
            label="Email ou Identifiant de connexion"
            placeholder="ex: diallo@monatelier.com ou +2250701020304"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            label="Mot de passe (minimum 6 caractères)"
            placeholder="••••••••"
            required
            minLength={6}
            disabled={isPending}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="terracotta"
            size="default"
            className="w-full text-base font-bold"
            isLoading={isPending}
          >
            Créer mon atelier
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-coton-200 text-center">
        <p className="text-sm text-coton-600">
          Tu as déjà un compte d&apos;atelier ?
        </p>
        <Link
          href="/app/connexion"
          className="inline-block mt-1.5 text-sm font-bold text-primary-900 hover:text-primary-950 underline underline-offset-4"
        >
          Se connecter à l&apos;atelier
        </Link>
      </div>
    </div>
  );
}
