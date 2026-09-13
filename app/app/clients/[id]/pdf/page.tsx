import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Scissors, Printer, ArrowLeft } from 'lucide-react';
import {
  getClientById,
  getProfilsByClientId,
  getVersionsByProfilId,
  getCommandesByClientId,
} from '@/lib/services/atelier-service';

import { PrintButton } from '@/components/ui/print-button';

export default async function ClientPdfPage({
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
  const premierProfil = profils[0];
  const versions = premierProfil ? await getVersionsByProfilId(premierProfil.id) : [];
  const versionActive = versions[0];

  return (
    <div className="min-h-screen bg-white text-black p-6 sm:p-12 max-w-4xl mx-auto print:p-0">
      {/* Barre de contrôle à l'écran (masquée à l'impression) */}
      <div className="print:hidden mb-8 p-4 rounded-2xl bg-coton-100 border border-coton-300 flex items-center justify-between">
        <Link
          href={`/app/clients/${client.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-coton-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au dossier</span>
        </Link>
        <PrintButton />
      </div>

      {/* DOCUMENT FICHE CLIENT OFFICIELLE IMPRIMABLE */}
      <div className="border-2 border-black p-8 rounded-xl space-y-6">
        {/* En-tête de l'atelier */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Scissors className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">IZITAILLE</h1>
              <span className="text-xs font-bold text-gray-700 block">
                Fiche d&apos;Atelier & Mesures Client
              </span>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Date d&apos;édition : {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="text-gray-600">Réf : {client.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Coordonnées du client */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Client</span>
            <strong className="text-base font-extrabold">{client.nom_complet}</strong>
            <p className="text-xs text-gray-700 mt-1">Ville : {client.ville || 'Non renseignée'}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block">Contact</span>
            <strong className="font-mono text-sm">{client.telephone_whatsapp || 'Aucun'}</strong>
            <p className="text-xs text-gray-700 mt-1">
              Profil : {premierProfil?.nom_profil} ({premierProfil?.type_profil})
            </p>
          </div>
        </div>

        {/* Préférences & Remarques */}
        {client.preferences_remarques && (
          <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 text-xs">
            <strong className="block uppercase font-bold text-gray-700 mb-1">
              Habitudes de confection :
            </strong>
            <p className="font-medium italic">{client.preferences_remarques}</p>
          </div>
        )}

        {/* Tableau officiel des mesures en cm */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black uppercase tracking-wider">
              Mesures Précises (en centimètres)
            </h2>
            <span className="text-xs text-gray-600">
              Version {versionActive?.version_num || 1} • Prise le{' '}
              {versionActive
                ? new Date(versionActive.date_prise).toLocaleDateString('fr-FR')
                : '-'}
            </span>
          </div>

          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-black p-2 text-left">Zone / Ligne de coupe</th>
                <th className="border border-black p-2 text-right">Valeur (cm)</th>
                <th className="border border-black p-2 text-left">Zone / Ligne de coupe</th>
                <th className="border border-black p-2 text-right">Valeur (cm)</th>
              </tr>
            </thead>
            <tbody>
              {versionActive &&
                (() => {
                  const entries = Object.entries(versionActive.mesures);
                  const rows: React.ReactNode[] = [];
                  for (let i = 0; i < entries.length; i += 2) {
                    const [k1, v1] = entries[i];
                    const [k2, v2] = entries[i + 1] || ['', ''];
                    rows.push(
                      <tr key={i} className="border-b border-gray-300">
                        <td className="border border-black p-2 capitalize font-medium">
                          {k1.replace(/_/g, ' ')}
                        </td>
                        <td className="border border-black p-2 text-right font-bold font-mono">
                          {v1} cm
                        </td>
                        <td className="border border-black p-2 capitalize font-medium">
                          {k2 ? k2.replace(/_/g, ' ') : '-'}
                        </td>
                        <td className="border border-black p-2 text-right font-bold font-mono">
                          {v2 ? `${v2} cm` : '-'}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })()}
            </tbody>
          </table>
        </div>

        {/* Historique récent des commandes */}
        {commandes.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-2">
              Dernières commandes enregistrées
            </h2>
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-300 p-2">Réf.</th>
                  <th className="border border-gray-300 p-2">Modèle</th>
                  <th className="border border-gray-300 p-2">Date promise</th>
                  <th className="border border-gray-300 p-2">Statut</th>
                  <th className="border border-gray-300 p-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((cmd) => (
                  <tr key={cmd.id}>
                    <td className="border border-gray-300 p-2 font-bold">{cmd.code_commande}</td>
                    <td className="border border-gray-300 p-2">{cmd.notes || 'Confection'}</td>
                    <td className="border border-gray-300 p-2">{cmd.date_promise}</td>
                    <td className="border border-gray-300 p-2 capitalize">{cmd.statut}</td>
                    <td className="border border-gray-300 p-2 text-right font-mono font-bold">
                      {cmd.prix_total.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature & Visa atelier */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-xs border-t border-gray-300">
          <div>
            <p className="font-bold">Visa du Tailleur / Chef d&apos;Atelier :</p>
            <div className="h-14 border-b border-dashed border-gray-400 mt-2" />
          </div>
          <div className="text-right">
            <p className="font-bold">Date & Accord Client :</p>
            <div className="h-14 border-b border-dashed border-gray-400 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
