import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  Scissors,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getClients } from '@/lib/services/atelier-service';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q || '').toLowerCase();

  const allClients = await getClients();
  const clients = q
    ? allClients.filter(
        (c) =>
          c.nom_complet.toLowerCase().includes(q) ||
          (c.telephone_whatsapp && c.telephone_whatsapp.includes(q)) ||
          (c.ville && c.ville.toLowerCase().includes(q))
      )
    : allClients;

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Dossiers Clients
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Tous tes clients enregistrés
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-coton-600">
            Retrouve les mesures et l&apos;historique de chaque client en 1 seconde.
          </p>
        </div>

        <Link href="/app/clients/nouveau">
          <Button
            variant="terracotta"
            size="default"
            className="w-full sm:w-auto gap-2 font-bold shadow-md shadow-terracotta-500/20"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouveau client</span>
          </Button>
        </Link>
      </div>

      {/* Barre de recherche instantanée */}
      <div className="relative">
        <form method="GET" className="relative flex items-center">
          <Search className="w-5 h-5 text-coton-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Rechercher par nom, numéro WhatsApp ou quartier..."
            className="w-full h-[52px] pl-12 pr-4 rounded-2xl border border-coton-300 bg-white text-coton-900 placeholder:text-coton-400 font-medium text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          />
        </form>
      </div>

      {/* Liste des clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-coton-200">
            <Users className="w-12 h-12 text-coton-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-primary-950 text-lg">
              Aucun client trouvé pour &ldquo;{q}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-coton-600 mt-1">
              Vérifie l&apos;orthographe ou enregistre un nouveau dossier.
            </p>
            <Link href="/app/clients/nouveau" className="inline-block mt-4">
              <Button variant="terracotta" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Créer ce client
              </Button>
            </Link>
          </div>
        ) : (
          clients.map((client) => {
            const initiales = client.nom_complet
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);

            return (
              <Link
                key={client.id}
                href={`/app/clients/${client.id}`}
                className="group block p-4 sm:p-5 rounded-2xl bg-white border border-coton-200 hover:border-terracotta-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-950 text-white font-extrabold text-base flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {initiales}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-primary-950 group-hover:text-terracotta-600 transition-colors">
                        {client.nom_complet}
                      </h3>
                      {client.telephone_whatsapp && (
                        <p className="text-xs text-coton-600 flex items-center gap-1 mt-0.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-jauge-vert" />
                          <span>{client.telephone_whatsapp}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-coton-400 group-hover:text-terracotta-600 group-hover:translate-x-1 transition-all" />
                </div>

                {client.preferences_remarques && (
                  <div className="mt-3 pt-3 border-t border-coton-100 text-xs text-coton-700 italic line-clamp-1">
                    &ldquo;{client.preferences_remarques}&rdquo;
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-coton-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-terracotta-500" />
                    {client.ville || 'Ville non précisée'}
                  </span>
                  <span className="text-terracotta-600 font-bold group-hover:underline">
                    Ouvrir le dossier &gt;
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
