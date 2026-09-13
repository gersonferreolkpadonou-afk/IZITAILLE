import * as React from 'react';
import Link from 'next/link';
import {
  Scissors,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Gauge,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';
import { logoutAction } from './(auth)/actions';
import { OfflineBanner } from '@/components/app/OfflineBanner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-coton-50 flex flex-col pb-20 md:pb-0">
      {/* Bannière hors ligne automatique */}
      <OfflineBanner />

      {/* Barre supérieure Atelier */}
      <header className="sticky top-0 z-30 bg-primary-950 text-white border-b border-primary-900 px-4 py-3 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta-500 flex items-center justify-center text-white shadow-sm">
              <Scissors className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base sm:text-lg block leading-tight">
                IZITAILLE
              </span>
              <span className="text-[11px] text-terracotta-300 font-medium">
                Espace Atelier
              </span>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-primary-900/60 p-1 rounded-xl border border-primary-800">
            <Link
              href="/app"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Tableau de bord
            </Link>
            <Link
              href="/app/clients"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Clients & Mesures
            </Link>
            <Link
              href="/app/commandes"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Commandes
            </Link>
            <Link
              href="/app/charge"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Jauge de charge
            </Link>
            <Link
              href="/app/caisse"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Caisse
            </Link>
            <Link
              href="/app/couturiers"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Équipe
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/app/reglages"
              className="p-2 text-coton-400 hover:text-white rounded-lg hover:bg-primary-900 transition-colors"
              title="Réglages de l'atelier"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2 text-coton-400 hover:text-white rounded-lg hover:bg-primary-900 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenu de l'application */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Barre de navigation mobile inférieure (Fixe, tactile, ergonomique) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-coton-200 px-2 py-1 shadow-lg shadow-coton-900/10 flex items-center justify-around">
        <Link
          href="/app"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-primary-950 font-bold hover:text-terracotta-500"
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Accueil</span>
        </Link>
        <Link
          href="/app/clients"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-coton-600 font-medium hover:text-terracotta-500"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Clients</span>
        </Link>
        <Link
          href="/app/commandes"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-coton-600 font-medium hover:text-terracotta-500"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Commandes</span>
        </Link>
        <Link
          href="/app/charge"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-coton-600 font-medium hover:text-terracotta-500"
        >
          <Gauge className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Charge</span>
        </Link>
        <Link
          href="/app/caisse"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-coton-600 font-medium hover:text-terracotta-500"
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Caisse</span>
        </Link>
        <Link
          href="/app/couturiers"
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] text-coton-600 font-medium hover:text-terracotta-500"
        >
          <Scissors className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Équipe</span>
        </Link>
      </nav>
    </div>
  );
}
