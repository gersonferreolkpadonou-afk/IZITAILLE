import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Printer,
  PlusCircle,
  Scissors,
  CheckCircle,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getClientById,
  getProfilsByClientId,
  getVersionsByProfilId,
  getCommandesByClientId,
} from '@/lib/services/atelier-service';
import { genererLienWhatsApp } from '@/lib/utils/whatsapp';

export default async function ClientDetailPage({
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
  const commandes = await getCommandesByClientId(client.id);

  // Charger les versions pour le premier profil
  const premierProfil = profils[0];
  const versions = premierProfil ? await getVersionsByProfilId(premierProfil.id) : [];
  const versionActive = versions[0];

  const waLien = client.telephone_whatsapp
    ? genererLienWhatsApp(
        client.telephone_whatsapp,
        `Bonjour ${client.nom_complet}, nous vous contactons depuis votre atelier de couture.`
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Barre de retour et actions d'en-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app/clients"
            className="p-2 rounded-xl bg-white border border-coton-200 text-coton-700 hover:text-primary-950 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Fiche Dossier Client
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
              {client.nom_complet}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/app/clients/${client.id}/pdf`} target="_blank">
            <Button variant="secondary" size="default" className="gap-2 font-bold text-sm">
              <Printer className="w-4 h-4" />
              <span>Imprimer PDF</span>
            </Button>
          </Link>
          <Link href={`/app/commandes/nouvelle?client_id=${client.id}`}>
            <Button variant="terracotta" size="default" className="gap-2 font-bold text-sm shadow-sm">
              <Scissors className="w-4 h-4" />
              <span>Nouvelle commande</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Carte Résumé Client */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coton-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-950 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              {client.nom_complet.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-primary-950">
                {client.nom_complet}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-coton-600 mt-1 font-medium">
                {client.telephone_whatsapp && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-jauge-vert" />
                    {client.telephone_whatsapp}
                  </span>
                )}
                {client.ville && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                    {client.ville}
                  </span>
                )}
              </div>
            </div>
          </div>

          {waLien && (
            <a href={waLien} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-jauge-vert/40 text-jauge-vert hover:bg-jauge-vert-bg font-bold"
              >
                <Phone className="w-4 h-4" />
                <span>Ouvrir WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>

        {/* Préférences mémorisées */}
        {client.preferences_remarques && (
          <div className="p-3.5 rounded-2xl bg-terracotta-50 border border-terracotta-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700 block mb-1">
              Habitudes & Préférences mémorisées
            </span>
            <p className="text-sm font-semibold text-terracotta-900">
              &ldquo;{client.preferences_remarques}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Profils & Mesures Versionnées */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-coton-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
              Profil actif : {premierProfil?.nom_profil || 'Principal'} ({premierProfil?.type_profil})
            </span>
            <h3 className="text-lg font-extrabold text-primary-950">
              Mesures versionnées dans le temps
            </h3>
          </div>

          <Link href={`/app/clients/${client.id}/mesures/nouvelle`}>
            <Button variant="secondary" size="sm" className="gap-2 font-bold text-xs">
              <PlusCircle className="w-4 h-4 text-terracotta-600" />
              <span>Nouvelle prise datée</span>
            </Button>
          </Link>
        </div>

        {/* Sélecteur de version dans le temps (On n'écrase JAMAIS l'ancienne !) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {versions.map((ver) => (
              <span
                key={ver.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-coton-100 text-coton-800 border border-coton-200"
              >
                <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                <span>
                  Version {ver.version_num} • {new Date(ver.date_prise).toLocaleDateString('fr-FR')}
                </span>
                {ver.notes && <span className="opacity-70 font-normal">({ver.notes})</span>}
              </span>
            ))}
          </div>

          {/* Grille des mesures de la version active */}
          {versionActive ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(versionActive.mesures).map(([cle, valeur]) => {
                if (valeur === undefined || valeur === null) return null;
                const nomPropre = cle
                  .replace(/_/g, ' ')
                  .replace(/^tour /, 'T. ')
                  .replace(/^longueur /, 'Long. ');

                return (
                  <div
                    key={cle}
                    className="p-3 rounded-2xl bg-coton-50 border border-coton-200/80"
                  >
                    <span className="text-[11px] text-coton-500 capitalize block truncate">
                      {nomPropre}
                    </span>
                    <span className="text-base font-extrabold text-primary-950 font-mono">
                      {valeur} <span className="text-xs font-semibold text-coton-500">cm</span>
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-coton-500 italic">Aucune mesure saisie pour ce profil.</p>
          )}
        </div>
      </div>

      {/* Historique des commandes de ce client */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-primary-950">
            Historique des confections ({commandes.length})
          </h3>
          <Link
            href={`/app/commandes/nouvelle?client_id=${client.id}`}
            className="text-xs font-bold text-terracotta-600 hover:underline"
          >
            + Ajouter une tenue
          </Link>
        </div>

        {commandes.length === 0 ? (
          <p className="text-xs text-coton-500 italic">
            Aucune commande enregistrée pour ce client pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {commandes.map((cmd) => (
              <Link
                key={cmd.id}
                href={`/app/commandes/${cmd.id}`}
                className="block p-4 rounded-2xl bg-coton-50 border border-coton-200 hover:border-terracotta-400 transition-colors"
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="text-primary-950">
                    {cmd.code_commande} — {cmd.notes || 'Confection sur mesure'}
                  </span>
                  <Badge variant={cmd.statut === 'prete' ? 'success' : 'default'}>
                    {cmd.statut}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-coton-600 font-medium">
                  <span>Date promise : {cmd.date_promise}</span>
                  <span>
                    Prix : {cmd.prix_total.toLocaleString('fr-FR')} FCFA (Solde :{' '}
                    {cmd.solde_du.toLocaleString('fr-FR')} FCFA)
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
