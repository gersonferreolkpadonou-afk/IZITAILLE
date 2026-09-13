import * as React from 'react';
import Link from 'next/link';
import {
  Gauge,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Scissors,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JaugeBadge } from '@/components/ui/jauge-badge';
import { getCommandes } from '@/lib/services/atelier-service';
import { estJourOuvre } from '@/lib/utils/capacite';

export default async function ChargePage() {
  const commandes = await getCommandes();
  const joursRepos = [0]; // 0 = Dimanche
  const capaciteJour = 8.0;

  // Calcul des 14 prochains jours
  const prochainsJours = [];
  const aujourdhui = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(aujourdhui);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isOuvre = estJourOuvre(d, joursRepos);

    // Commandes promises ce jour-là
    const cmdsDuJour = commandes.filter(
      (c) => c.date_promise === dateStr && c.statut !== 'livree' && c.statut !== 'payee'
    );
    const chargeDuJour = cmdsDuJour.reduce(
      (acc, c) => acc + (Number(c.charge_totale_unites) || 1.0),
      0
    );

    const ratio = isOuvre ? Math.round((chargeDuJour / capaciteJour) * 100) : 0;
    const statutJour: 'repos' | 'vert' | 'orange' | 'rouge' = !isOuvre
      ? 'repos'
      : ratio > 100
      ? 'rouge'
      : ratio >= 80
      ? 'orange'
      : 'vert';

    prochainsJours.push({
      date: d,
      dateStr,
      nomJour: new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d),
      isOuvre,
      chargeDuJour,
      capaciteJour: isOuvre ? capaciteJour : 0,
      ratio,
      statutJour,
      nbCommandes: cmdsDuJour.length,
    });
  }

  // Charge cumulée des 14 jours
  const totalCharge14j = prochainsJours.reduce((acc, j) => acc + j.chargeDuJour, 0);
  const totalCapacite14j = prochainsJours.reduce((acc, j) => acc + j.capaciteJour, 0);
  const ratioGlobal14j = Math.round((totalCharge14j / Math.max(totalCapacite14j, 1)) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Moteur Anti-Surcharge
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Charge de travail des 14 prochains jours
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-coton-600">
            Visualise l&apos;occupation de tes machines avant d&apos;accepter une nouvelle promesse.
          </p>
        </div>

        <Link href="/app/commandes/nouvelle">
          <Button
            variant="terracotta"
            size="default"
            className="w-full sm:w-auto gap-2 font-bold shadow-md shadow-terracotta-500/20"
          >
            <Scissors className="w-5 h-5" />
            <span>Tester une commande</span>
          </Button>
        </Link>
      </div>

      {/* Résumé de capacité globale */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-primary-950">
            Niveau de tension globale (2 prochaines semaines)
          </h2>
          <span className="text-xs font-bold text-coton-500">
            {totalCharge14j} unités engagées / {totalCapacite14j} unités max
          </span>
        </div>

        <JaugeBadge pourcentage={ratioGlobal14j} />

        <div className="w-full h-4 bg-coton-100 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              ratioGlobal14j > 100
                ? 'bg-jauge-rouge'
                : ratioGlobal14j >= 80
                ? 'bg-jauge-orange'
                : 'bg-jauge-vert'
            }`}
            style={{ width: `${Math.min(ratioGlobal14j, 100)}%` }}
          />
        </div>
      </div>

      {/* Histogramme quotidien détaillé (14 prochains jours) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coton-100">
          <h2 className="text-base font-extrabold text-primary-950">
            Planning jour par jour (Engagé vs Capacité)
          </h2>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-jauge-vert">
              <span className="w-2.5 h-2.5 rounded-full bg-jauge-vert" /> Libre (&lt;80%)
            </span>
            <span className="flex items-center gap-1 text-jauge-orange">
              <span className="w-2.5 h-2.5 rounded-full bg-jauge-orange" /> Tendu (80-100%)
            </span>
            <span className="flex items-center gap-1 text-jauge-rouge">
              <span className="w-2.5 h-2.5 rounded-full bg-jauge-rouge" /> Surchargé (&gt;100%)
            </span>
          </div>
        </div>

        {/* Grille des 14 jours */}
        <div className="space-y-2.5">
          {prochainsJours.map((jour) => {
            return (
              <div
                key={jour.dateStr}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  jour.statutJour === 'repos'
                    ? 'bg-coton-100/60 border-coton-200 opacity-70'
                    : jour.statutJour === 'rouge'
                    ? 'bg-jauge-rouge-bg border-jauge-rouge/30'
                    : jour.statutJour === 'orange'
                    ? 'bg-jauge-orange-bg border-jauge-orange/30'
                    : 'bg-coton-50 border-coton-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <Calendar className="w-4 h-4 text-coton-500 shrink-0" />
                  <span className="font-extrabold text-sm text-primary-950 capitalize">
                    {jour.nomJour}
                  </span>
                </div>

                {jour.statutJour === 'repos' ? (
                  <div className="text-xs text-coton-500 font-bold italic flex-1 text-center sm:text-left">
                    Repos hebdomadaire atelier
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          jour.statutJour === 'rouge'
                            ? 'bg-jauge-rouge'
                            : jour.statutJour === 'orange'
                            ? 'bg-jauge-orange'
                            : 'bg-jauge-vert'
                        }`}
                        style={{ width: `${Math.min(jour.ratio, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold font-mono min-w-[50px] text-right">
                      {jour.ratio}%
                    </span>
                  </div>
                )}

                <div className="text-right text-xs shrink-0 font-medium text-coton-700">
                  {jour.statutJour === 'repos' ? (
                    <Badge variant="outline">Fermé</Badge>
                  ) : (
                    <span>
                      <strong>{jour.chargeDuJour}</strong> / {jour.capaciteJour} unités ({jour.nbCommandes} tenue{jour.nbCommandes > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
