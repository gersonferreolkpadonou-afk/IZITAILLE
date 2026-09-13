import * as React from 'react';
import Link from 'next/link';
import { Scissors } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-coton-50 flex flex-col justify-between pattern-wax">
      {/* En-tête avec marque IZITAILLE */}
      <header className="p-4 sm:p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary-950 flex items-center justify-center text-terracotta-400 shadow-md group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-primary-950 block leading-none">
              IZITAILLE
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600 block">
              Gestion d&apos;Atelier
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-coton-600 hover:text-primary-950 transition-colors"
        >
          Retour au site
        </Link>
      </header>

      {/* Contenu principal centré et adapté mobile */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-coton-200 p-6 sm:p-8 shadow-xl shadow-coton-900/5">
          {children}
        </div>
      </main>

      {/* Pied de page sobre */}
      <footer className="p-4 text-center text-xs text-coton-500 font-medium">
        IZITAILLE &copy; {new Date().getFullYear()} — L&apos;outil des ateliers d&apos;Afrique de l&apos;Ouest
      </footer>
    </div>
  );
}
