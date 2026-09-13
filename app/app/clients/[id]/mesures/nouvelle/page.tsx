import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getClientById,
  getProfilsByClientId,
  getVersionsByProfilId,
} from '@/lib/services/atelier-service';
import { ajouterVersionMesureAction } from '@/app/app/clients/actions';

export default async function NouvelleVersionMesuresPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const client = await getClientById(resolvedParams.id);

  if (!client) {
    notFound();
  }

  const profils = await getProfilsByClientId(client.id);
  const premierProfil = profils[0];
  const versions = premierProfil ? await getVersionsByProfilId(premierProfil.id) : [];
  const derniereVersion = versions[0];
  const derniereMesures = derniereVersion?.mesures || {};

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href={`/app/clients/${client.id}`}
          className="p-2 rounded-xl bg-white border border-coton-200 text-coton-700 hover:text-primary-950 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Historique & Évolution
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Nouvelle prise de mesures datée
          </h1>
          <p className="text-xs sm:text-sm text-coton-600">
            Client : <strong>{client.nom_complet}</strong> • L&apos;ancienne version sera conservée.
          </p>
        </div>
      </div>

      <form action={ajouterVersionMesureAction} className="space-y-6">
        <input type="hidden" name="client_id" value={client.id} />
        <input type="hidden" name="profil_id" value={premierProfil?.id} />

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-terracotta-500" />
            <span>Motif de la nouvelle prise</span>
          </h2>

          <div>
            <Input
              name="notes"
              label="Remarque ou événement daté"
              placeholder="ex: Prise de mesures Tabaski 2026, légère prise de taille..."
              defaultValue="Ajustement des mesures"
            />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-coton-100">
            <h2 className="text-base font-extrabold text-primary-950">
              Mesures (en cm)
            </h2>
            <span className="text-xs text-coton-500">
              Pré-rempli avec la dernière version
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'tour_cou',
              'carrure_epaules',
              'tour_poitrine',
              'tour_taille',
              'tour_bassin',
              'longueur_haut',
              'longueur_boubou',
              'longueur_pantalon',
              'longueur_manche_longue',
              'tour_bras',
              'tour_cuisse',
              'bas_pantalon',
            ].map((cle) => {
              const label = cle
                .replace(/_/g, ' ')
                .replace(/^tour /, 'T. ')
                .replace(/^longueur /, 'Long. ');

              return (
                <div key={cle}>
                  <Input
                    name={`m_${cle}`}
                    type="number"
                    step="0.5"
                    inputMode="decimal"
                    label={label}
                    defaultValue={derniereMesures[cle] as number | undefined}
                    suffix="cm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="terracotta"
            size="lg"
            className="w-full gap-2 text-base font-extrabold shadow-lg shadow-terracotta-500/25"
          >
            <Save className="w-5 h-5" />
            <span>Enregistrer cette nouvelle version datée</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
