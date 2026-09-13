import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Scissors,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getCouturiers,
  getCommandes,
  getClients,
} from '@/lib/services/atelier-service';

export default async function CouturiersPage() {
  const couturiers = await getCouturiers();
  const commandes = await getCommandes();
  const clients = await getClients();

  const clientsMap = new Map(clients.map((c) => [c.id, c]));

  // Tâches prioritaires à coudre aujourd'hui (urgentes et en cours)
  const tachesAujourdhui = commandes
    .filter((c) => c.statut === 'coupee' || c.statut === 'en_couture' || c.statut === 'recue')
    .sort((a, b) => {
      if (a.est_urgent && !b.est_urgent) return -1;
      if (!a.est_urgent && b.est_urgent) return 1;
      return a.date_promise.localeCompare(b.date_promise);
    });

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Équipe de l&apos;Atelier
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Couturiers & Répartition des Tâches
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-coton-600">
            Visualise qui coud quoi et la liste des confections prioritaires du jour.
          </p>
        </div>
      </div>

      {/* VUE MAJEURE : "Ce que je dois coudre aujourd'hui" */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-primary-950 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coton-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-950 text-terracotta-400 flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-primary-950">
                Ce que l&apos;atelier doit coudre aujourd&apos;hui
              </h2>
              <span className="text-xs text-coton-600">
                Classé par priorité absolue (urgences en premier)
              </span>
            </div>
          </div>
          <Badge variant="default" className="font-bold text-xs">
            {tachesAujourdhui.length} confections
          </Badge>
        </div>

        {tachesAujourdhui.length === 0 ? (
          <div className="p-6 text-center text-xs text-jauge-vert font-bold">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
            <span>Toutes les pièces de l&apos;atelier ont été terminées !</span>
          </div>
        ) : (
          <div className="space-y-3">
            {tachesAujourdhui.map((tache, index) => {
              const client = clientsMap.get(tache.client_id);
              const assigne = couturiers.find((c) => c.id === tache.couturier_assigne_id);

              return (
                <div
                  key={tache.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    tache.est_urgent
                      ? 'bg-jauge-rouge-bg border-jauge-rouge/30'
                      : 'bg-coton-50 border-coton-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-950 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-extrabold text-primary-950">
                          {tache.code_commande} • {client?.nom_complet}
                        </strong>
                        {tache.est_urgent && (
                          <Badge variant="danger" className="text-[9px] py-0 px-1.5">
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {tache.statut}
                        </Badge>
                      </div>
                      <p className="text-xs text-coton-700 mt-0.5 font-medium">
                        {tache.notes || 'Confection sur mesure'} • Date promise :{' '}
                        <strong>{tache.date_promise}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-xs font-bold text-coton-600 bg-white px-2.5 py-1 rounded-lg border border-coton-200">
                      Assigné : {assigne?.nom_complet || 'Non assigné'}
                    </span>
                    <Link href={`/app/commandes/${tache.id}`}>
                      <Button variant="secondary" size="sm" className="font-bold text-xs">
                        Ouvrir
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Liste des membres de l'atelier */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950">
          Membres de l&apos;atelier ({couturiers.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {couturiers.map((couturier) => {
            const nbAssigne = commandes.filter(
              (c) => c.couturier_assigne_id === couturier.id && c.statut !== 'livree' && c.statut !== 'payee'
            ).length;

            return (
              <div
                key={couturier.id}
                className="p-4 rounded-2xl bg-coton-50 border border-coton-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary-950 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                    {couturier.nom_complet.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-primary-950 block">
                      {couturier.nom_complet}
                    </strong>
                    <span className="text-xs text-coton-500 capitalize">
                      Rôle : {couturier.role}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="outline" className="font-bold">
                    {nbAssigne} tenue{nbAssigne > 1 ? 's' : ''} en cours
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
