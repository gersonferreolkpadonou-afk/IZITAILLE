import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scissors } from 'lucide-react';
import {
  getClients,
  getTypesTenue,
  getCouturiers,
} from '@/lib/services/atelier-service';
import { CommandeFormClient } from '@/components/app/CommandeFormClient';

export default async function NouvelleCommandePage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const clients = await getClients();
  const typesTenue = await getTypesTenue();
  const couturiers = await getCouturiers();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/commandes"
          className="p-2 rounded-xl bg-white border border-coton-200 text-coton-700 hover:text-primary-950 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Prise rapide (60 secondes)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Nouvelle commande
          </h1>
        </div>
      </div>

      <CommandeFormClient
        clients={clients}
        typesTenue={typesTenue}
        couturiers={couturiers}
        preselectedClientId={resolvedParams.client_id}
      />
    </div>
  );
}
