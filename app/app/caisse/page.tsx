import * as React from 'react';
import Link from 'next/link';
import {
  Wallet,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getPaiements,
  getCommandes,
  getClients,
} from '@/lib/services/atelier-service';
import {
  genererLienWhatsApp,
  genererMessageRelancePaiement,
} from '@/lib/utils/whatsapp';

export default async function CaissePage() {
  const paiements = await getPaiements();
  const commandes = await getCommandes();
  const clients = await getClients();

  const clientsMap = new Map(clients.map((c) => [c.id, c]));

  // Calculs financiers
  const totalEncaisse = paiements.reduce((acc, p) => acc + (Number(p.montant) || 0), 0);
  const totalCreances = commandes.reduce((acc, c) => acc + (Number(c.solde_du) || 0), 0);

  // Commandes avec solde restant (Impayés)
  const commandesImpayees = commandes.filter((c) => c.solde_du > 0);

  // Ventilation par moyen de paiement
  const ventilation = paiements.reduce((acc, p) => {
    acc[p.moyen_paiement] = (acc[p.moyen_paiement] || 0) + Number(p.montant);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête Caisse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Gestion Financière
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Caisse & Suivi des Impayés
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-coton-600">
            Acomptes versés, soldes restants et relances WhatsApp en 1 clic.
          </p>
        </div>
      </div>

      {/* Cartes de synthèse de la caisse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total encaissé */}
        <div className="p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-jauge-vert">
              Total Encaissé
            </span>
            <div className="w-9 h-9 rounded-xl bg-jauge-vert-bg text-jauge-vert flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-jauge-vert font-mono">
            {totalEncaisse.toLocaleString('fr-FR')} <span className="text-base text-coton-600 font-bold">FCFA</span>
          </div>
          <div className="pt-2 border-t border-coton-100 flex flex-wrap gap-2 text-xs font-semibold text-coton-600">
            <span>Wave : {(ventilation['wave'] || 0).toLocaleString('fr-FR')} FCFA</span>
            <span>•</span>
            <span>Orange : {(ventilation['orange_money'] || 0).toLocaleString('fr-FR')} FCFA</span>
            <span>•</span>
            <span>Espèces : {(ventilation['especes'] || 0).toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        {/* Total à recouvrer / Impayés */}
        <div className="p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-terracotta-600">
              Créances Clients (Impayés)
            </span>
            <div className="w-9 h-9 rounded-xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-terracotta-600 font-mono">
            {totalCreances.toLocaleString('fr-FR')} <span className="text-base text-coton-600 font-bold">FCFA</span>
          </div>
          <p className="text-xs text-coton-600 pt-2 border-t border-coton-100 font-medium">
            {commandesImpayees.length} commande{commandesImpayees.length > 1 ? 's' : ''} en attente de solde complet.
          </p>
        </div>
      </div>

      {/* Liste des impayés avec bouton de relance WhatsApp 1-clic */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coton-100">
          <div>
            <h2 className="text-base font-extrabold text-primary-950">
              Clients avec un solde à régler ({commandesImpayees.length})
            </h2>
            <p className="text-xs text-coton-600">
              Relance ton client en 1 seconde par WhatsApp avec son décompte exact.
            </p>
          </div>
        </div>

        {commandesImpayees.length === 0 ? (
          <div className="p-6 text-center text-xs text-jauge-vert font-bold">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
            <span>Bravo ! Aucun impayé en attente dans l&apos;atelier.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {commandesImpayees.map((cmd) => {
              const client = clientsMap.get(cmd.client_id);
              const lienRelance =
                client?.telephone_whatsapp &&
                genererLienWhatsApp(
                  client.telephone_whatsapp,
                  genererMessageRelancePaiement({
                    nomClient: client.nom_complet,
                    codeCommande: cmd.code_commande,
                    soldeRestant: cmd.solde_du,
                    devise: 'FCFA',
                    nomAtelier: 'Atelier IZITAILLE',
                  })
                );

              return (
                <div
                  key={cmd.id}
                  className="p-4 rounded-2xl bg-coton-50 border border-coton-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-primary-950 font-mono">
                        {cmd.code_commande}
                      </span>
                      <span className="text-xs font-extrabold text-primary-950">
                        {client?.nom_complet}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {cmd.statut}
                      </Badge>
                    </div>
                    <p className="text-xs text-coton-600 mt-1">
                      {cmd.notes || 'Confection'} • Date promise : {cmd.date_promise}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-coton-500 block">Reste à payer</span>
                      <strong className="text-base font-black text-terracotta-600 font-mono">
                        {cmd.solde_du.toLocaleString('fr-FR')} FCFA
                      </strong>
                    </div>

                    {lienRelance && (
                      <a href={lienRelance} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2 font-bold text-xs text-jauge-vert border-jauge-vert/40 hover:bg-jauge-vert-bg shadow-xs"
                        >
                          <MessageCircle className="w-4 h-4 text-jauge-vert" />
                          <span>Relancer</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Journal des paiements récents */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950">
          Derniers encaissements enregistrés
        </h2>

        <div className="space-y-2">
          {paiements.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-coton-50 border border-coton-200/80 flex items-center justify-between text-xs font-medium"
            >
              <div>
                <span className="font-extrabold text-primary-950 block">
                  {p.reference_recu || 'Encaissement'} — {p.notes || 'Règlement'}
                </span>
                <span className="text-[11px] text-coton-500">
                  {new Date(p.created_at).toLocaleDateString('fr-FR')} • Moyen :{' '}
                  <span className="uppercase font-bold text-coton-700">
                    {p.moyen_paiement.replace('_', ' ')}
                  </span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-jauge-vert font-mono block">
                  +{p.montant.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
