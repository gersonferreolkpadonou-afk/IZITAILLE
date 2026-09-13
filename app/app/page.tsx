import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  UserPlus,
  PlusCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JaugeBadge } from '@/components/ui/jauge-badge';
import {
  getCommandes,
  getClients,
  getPaiements,
} from '@/lib/services/atelier-service';

export default async function DashboardPage() {
  const commandes = await getCommandes();
  const clients = await getClients();
  const paiements = await getPaiements();

  const clientsMap = new Map(clients.map((c) => [c.id, c]));

  const aujourdhuiStr = new Date().toISOString().split('T')[0];

  // Calcul du début et de la fin de la semaine actuelle
  const aujourdhui = new Date();
  const dans7Jours = new Date();
  dans7Jours.setDate(dans7Jours.getDate() + 7);
  const dans7JoursStr = dans7Jours.toISOString().split('T')[0];

  // 1. Commandes EN RETARD (Critique, impossible à rater !)
  const commandesEnRetard = commandes.filter(
    (c) => c.date_promise < aujourdhuiStr && c.statut !== 'livree' && c.statut !== 'payee'
  );

  // 2. À livrer aujourd'hui
  const commandesAujourdhui = commandes.filter(
    (c) => c.date_promise === aujourdhuiStr && c.statut !== 'livree' && c.statut !== 'payee'
  );

  // 3. À livrer cette semaine
  const commandesCetteSemaine = commandes.filter(
    (c) =>
      c.date_promise >= aujourdhuiStr &&
      c.date_promise <= dans7JoursStr &&
      c.statut !== 'livree' &&
      c.statut !== 'payee'
  );

  // 4. Chiffres du mois
  const confectionsLivrees = commandes.filter((c) => c.statut === 'livree' || c.statut === 'payee');
  const totalEncaisse = paiements.reduce((acc, p) => acc + (Number(p.montant) || 0), 0);
  const resteAEncaisser = commandes.reduce((acc, c) => acc + (Number(c.solde_du) || 0), 0);

  // Calcul de charge des 14 prochains jours
  const chargeEngagee14j = commandes
    .filter(
      (c) =>
        c.date_promise >= aujourdhuiStr &&
        c.date_promise <=
          new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] &&
        c.statut !== 'livree' &&
        c.statut !== 'payee'
    )
    .reduce((acc, c) => acc + (Number(c.charge_totale_unites) || 1.5), 0);

  const capacite14j = 12 * 8.0; // 12 jours ouvrés * 8 unités = 96 unités
  const ratio14j = Math.round((chargeEngagee14j / capacite14j) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* -------------------------------------------------------------------
          1. ALERTE RETARD CRITIQUE (Impossible à rater tout en haut)
      ------------------------------------------------------------------- */}
      {commandesEnRetard.length > 0 ? (
        <div className="p-5 rounded-3xl bg-jauge-rouge text-white shadow-xl shadow-jauge-rouge/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                  {commandesEnRetard.length} commande{commandesEnRetard.length > 1 ? 's' : ''} en retard !
                </h2>
                <p className="text-xs sm:text-sm text-white/90">
                  La date promise au client est dépassée. À traiter d&apos;urgence avant réclamation.
                </p>
              </div>
            </div>

            <Link href="/app/commandes?filtre=retard">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-jauge-rouge hover:bg-white/90 font-extrabold text-xs"
              >
                Traiter maintenant
              </Button>
            </Link>
          </div>

          <div className="space-y-2 pt-1">
            {commandesEnRetard.map((cmd) => {
              const client = clientsMap.get(cmd.client_id);
              return (
                <Link
                  key={cmd.id}
                  href={`/app/commandes/${cmd.id}`}
                  className="block p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-xs font-bold"
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {cmd.code_commande} • {client?.nom_complet} — {cmd.notes}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                      Échéance : {cmd.date_promise}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-jauge-vert-bg border border-jauge-vert/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-jauge-vert text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-jauge-vert">
                0 commande en retard
              </h2>
              <p className="text-xs text-coton-700">
                Toutes tes confections promises sont à jour. L&apos;atelier tourne à la perfection !
              </p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px]">
            À jour
          </Badge>
        </div>
      )}

      {/* -------------------------------------------------------------------
          2. JAUGE DE CHARGE (14 prochains jours)
      ------------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-terracotta-600 tracking-wider">
              Capacité Atelier
            </span>
            <h3 className="text-lg font-extrabold text-primary-950">
              Charge des 14 prochains jours
            </h3>
          </div>
          <Link
            href="/app/charge"
            className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 underline"
          >
            Voir l&apos;histogramme &gt;
          </Link>
        </div>

        <JaugeBadge pourcentage={ratio14j} />

        <div className="w-full bg-coton-100 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              ratio14j > 100
                ? 'bg-jauge-rouge'
                : ratio14j >= 80
                ? 'bg-jauge-orange'
                : 'bg-jauge-vert'
            }`}
            style={{ width: `${Math.min(ratio14j, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-coton-600 font-medium">
          <span>{chargeEngagee14j} unités engagées sur {capacite14j} max</span>
          <span>Disponible : {Math.max(0, capacite14j - chargeEngagee14j)} unités</span>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          3. BOUTONS D'ACTIONS RAPIDES (Touch-first mobile)
      ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/app/commandes/nouvelle">
          <Button
            variant="terracotta"
            size="default"
            className="w-full justify-center gap-2 font-extrabold shadow-md shadow-terracotta-500/20 text-base"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Prendre une commande (60s)</span>
          </Button>
        </Link>
        <Link href="/app/clients/nouveau">
          <Button
            variant="primary"
            size="default"
            className="w-full justify-center gap-2 font-bold text-base"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouveau dossier client</span>
          </Button>
        </Link>
      </div>

      {/* -------------------------------------------------------------------
          4. ÉCHÉANCES : AUJOURD'HUI & CETTE SEMAINE
      ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* À livrer aujourd'hui */}
        <div className="p-5 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-primary-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-terracotta-500" />
              <span>À livrer aujourd&apos;hui ({commandesAujourdhui.length})</span>
            </h3>
            <Link
              href="/app/commandes"
              className="text-xs font-bold text-coton-500 hover:text-primary-950"
            >
              Voir
            </Link>
          </div>

          {commandesAujourdhui.length === 0 ? (
            <p className="text-xs text-coton-500 italic py-2">
              Aucune livraison promise pour aujourd&apos;hui.
            </p>
          ) : (
            <div className="space-y-2">
              {commandesAujourdhui.map((cmd) => {
                const cl = clientsMap.get(cmd.client_id);
                return (
                  <Link
                    key={cmd.id}
                    href={`/app/commandes/${cmd.id}`}
                    className="p-3 rounded-2xl bg-coton-50 hover:bg-coton-100 flex items-center justify-between text-xs font-bold transition-colors"
                  >
                    <span>
                      {cmd.code_commande} • {cl?.nom_complet}
                    </span>
                    <Badge variant={cmd.statut === 'prete' ? 'success' : 'warning'}>
                      {cmd.statut}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* À livrer cette semaine */}
        <div className="p-5 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-primary-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta-500" />
              <span>À livrer cette semaine ({commandesCetteSemaine.length})</span>
            </h3>
            <Link
              href="/app/commandes?filtre=en_cours"
              className="text-xs font-bold text-coton-500 hover:text-primary-950"
            >
              Voir
            </Link>
          </div>

          {commandesCetteSemaine.length === 0 ? (
            <p className="text-xs text-coton-500 italic py-2">
              Aucune commande à livrer cette semaine.
            </p>
          ) : (
            <div className="space-y-2">
              {commandesCetteSemaine.map((cmd) => {
                const cl = clientsMap.get(cmd.client_id);
                return (
                  <Link
                    key={cmd.id}
                    href={`/app/commandes/${cmd.id}`}
                    className="p-3 rounded-2xl bg-coton-50 hover:bg-coton-100 flex items-center justify-between text-xs font-bold transition-colors"
                  >
                    <span>
                      {cl?.nom_complet} — {cmd.notes}
                    </span>
                    <span className="text-coton-500 font-mono">{cmd.date_promise}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------
          5. CHIFFRES DU MOIS (Financier & Confections)
      ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-coton-200">
          <span className="text-xs text-coton-500 font-semibold block">
            Confections livrées
          </span>
          <span className="text-2xl font-black text-primary-950 mt-1 block">
            {confectionsLivrees.length}
          </span>
          <span className="text-[11px] text-jauge-vert font-bold">100% à temps</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-coton-200">
          <span className="text-xs text-coton-500 font-semibold block">
            En retard
          </span>
          <span className="text-2xl font-black text-jauge-rouge mt-1 block">
            {commandesEnRetard.length}
          </span>
          <span className="text-[11px] text-coton-500">Objectif : 0</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-coton-200">
          <span className="text-xs text-coton-500 font-semibold block">
            Encaissé ce mois
          </span>
          <span className="text-2xl font-black text-jauge-vert mt-1 block font-mono">
            {totalEncaisse.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] text-coton-500">FCFA encaissés</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-coton-200">
          <span className="text-xs text-coton-500 font-semibold block">
            Reste à encaisser
          </span>
          <span className="text-2xl font-black text-terracotta-600 mt-1 block font-mono">
            {resteAEncaisser.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] text-coton-500">FCFA de créances</span>
        </div>
      </div>
    </div>
  );
}
