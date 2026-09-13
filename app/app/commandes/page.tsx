import * as React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Clock,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCommandes, getClients } from '@/lib/services/atelier-service';

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const filtre = resolvedParams.filtre || 'toutes';
  const q = (resolvedParams.q || '').toLowerCase();

  const allCommandes = await getCommandes();
  const clients = await getClients();

  const clientsMap = new Map(clients.map((c) => [c.id, c]));

  // Filtrage
  let commandesFiltrees = allCommandes;

  if (filtre === 'retard') {
    const today = new Date().toISOString().split('T')[0];
    commandesFiltrees = allCommandes.filter(
      (c) => c.date_promise < today && c.statut !== 'livree' && c.statut !== 'payee'
    );
  } else if (filtre === 'en_cours') {
    commandesFiltrees = allCommandes.filter(
      (c) => c.statut === 'recue' || c.statut === 'coupee' || c.statut === 'en_couture' || c.statut === 'finitions'
    );
  } else if (filtre === 'prete') {
    commandesFiltrees = allCommandes.filter((c) => c.statut === 'prete');
  } else if (filtre === 'livree') {
    commandesFiltrees = allCommandes.filter((c) => c.statut === 'livree' || c.statut === 'payee');
  }

  if (q) {
    commandesFiltrees = commandesFiltrees.filter((c) => {
      const client = clientsMap.get(c.client_id);
      return (
        c.code_commande.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q)) ||
        (client && client.nom_complet.toLowerCase().includes(q))
      );
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Atelier de Confection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Toutes les commandes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-coton-600">
            Suivi des statuts, photos et échéances de livraison promises.
          </p>
        </div>

        <Link href="/app/commandes/nouvelle">
          <Button
            variant="terracotta"
            size="default"
            className="w-full sm:w-auto gap-2 font-bold shadow-md shadow-terracotta-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Prendre commande (60s)</span>
          </Button>
        </Link>
      </div>

      {/* Onglets filtres */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <Link
          href="/app/commandes"
          className={`px-3.5 py-2 rounded-xl border transition-colors whitespace-nowrap ${
            filtre === 'toutes'
              ? 'bg-primary-950 text-white border-primary-950 shadow-xs'
              : 'bg-white text-coton-700 border-coton-200 hover:bg-coton-100'
          }`}
        >
          Toutes ({allCommandes.length})
        </Link>
        <Link
          href="/app/commandes?filtre=en_cours"
          className={`px-3.5 py-2 rounded-xl border transition-colors whitespace-nowrap ${
            filtre === 'en_cours'
              ? 'bg-primary-950 text-white border-primary-950 shadow-xs'
              : 'bg-white text-coton-700 border-coton-200 hover:bg-coton-100'
          }`}
        >
          En couture / atelier
        </Link>
        <Link
          href="/app/commandes?filtre=prete"
          className={`px-3.5 py-2 rounded-xl border transition-colors whitespace-nowrap ${
            filtre === 'prete'
              ? 'bg-jauge-vert text-white border-jauge-vert shadow-xs'
              : 'bg-white text-jauge-vert border-coton-200 hover:bg-jauge-vert-bg'
          }`}
        >
          Prêtes à livrer
        </Link>
        <Link
          href="/app/commandes?filtre=retard"
          className={`px-3.5 py-2 rounded-xl border transition-colors whitespace-nowrap ${
            filtre === 'retard'
              ? 'bg-jauge-rouge text-white border-jauge-rouge shadow-xs'
              : 'bg-white text-jauge-rouge border-coton-200 hover:bg-jauge-rouge-bg'
          }`}
        >
          En retard
        </Link>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-3">
        {commandesFiltrees.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-coton-200">
            <ShoppingBag className="w-12 h-12 text-coton-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-primary-950 text-lg">
              Aucune commande trouvée
            </h3>
            <p className="text-xs sm:text-sm text-coton-600 mt-1">
              Prends une nouvelle commande en moins de 60 secondes.
            </p>
          </div>
        ) : (
          commandesFiltrees.map((cmd) => {
            const client = clientsMap.get(cmd.client_id);
            const estEnRetard =
              cmd.date_promise < new Date().toISOString().split('T')[0] &&
              cmd.statut !== 'livree' &&
              cmd.statut !== 'payee';

            return (
              <Link
                key={cmd.id}
                href={`/app/commandes/${cmd.id}`}
                className="group block p-4 sm:p-5 rounded-2xl bg-white border border-coton-200 hover:border-terracotta-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-primary-950 font-mono">
                        {cmd.code_commande}
                      </span>
                      {cmd.est_urgent && (
                        <Badge variant="danger" className="text-[9px] py-0 px-1.5">
                          Urgent
                        </Badge>
                      )}
                      {estEnRetard && (
                        <Badge variant="danger" className="text-[9px] py-0 px-1.5">
                          En retard !
                        </Badge>
                      )}
                      <Badge
                        variant={
                          cmd.statut === 'prete'
                            ? 'success'
                            : cmd.statut === 'en_couture'
                            ? 'warning'
                            : 'default'
                        }
                        className="text-[10px]"
                      >
                        {cmd.statut.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-base text-primary-950 group-hover:text-terracotta-600 transition-colors">
                      {client?.nom_complet || 'Client'} — {cmd.notes || 'Confection sur mesure'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-coton-600 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                        Promise pour le : <strong>{cmd.date_promise}</strong>
                      </span>
                      <span>
                        Charge : <strong>{cmd.charge_totale_unites} unités</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-primary-950 font-mono block">
                      {cmd.prix_total.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span
                      className={`text-xs font-bold block ${
                        cmd.solde_du > 0 ? 'text-terracotta-600' : 'text-jauge-vert'
                      }`}
                    >
                      {cmd.solde_du > 0
                        ? `Reste : ${cmd.solde_du.toLocaleString('fr-FR')} FCFA`
                        : 'Soldé'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-coton-400 group-hover:text-terracotta-600 group-hover:translate-x-1 transition-all ml-auto mt-2" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
