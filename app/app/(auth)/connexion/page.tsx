'use client';

import * as React from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Phone, AlertCircle } from 'lucide-react';

export default function ConnexionPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-primary-950 tracking-tight">
          Connexion à ton atelier
        </h1>
        <p className="mt-1.5 text-sm text-coton-600">
          Retrouve tes dossiers clients, tes commandes et ta jauge de charge.
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
            name="identifiant"
            type="text"
            label="Numéro WhatsApp ou Email"
            placeholder="ex: +225 0708091011 ou contact@atelier.com"
            required
            autoComplete="username"
            disabled={isPending}
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            required
            autoComplete="current-password"
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
            Se connecter à l&apos;atelier
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-coton-200 text-center">
        <p className="text-sm text-coton-600">
          Tu n&apos;as pas encore d&apos;espace atelier ?
        </p>
        <Link
          href="/app/inscription"
          className="inline-block mt-1.5 text-sm font-bold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4"
        >
          Créer mon atelier en 1 minute
        </Link>
      </div>
    </div>
  );
}
