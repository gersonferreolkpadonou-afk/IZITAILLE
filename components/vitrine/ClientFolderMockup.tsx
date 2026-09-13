'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Tag,
  Scissors,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ClientFolderMockup() {
  const [activeTab, setActiveTab] = useState<'mesures' | 'preferences' | 'commandes'>('mesures');

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[390px] rounded-[42px] p-3 bg-primary-950 shadow-2xl shadow-primary-950/40 border-4 border-primary-900/60 text-left select-none animate-float hover:shadow-terracotta-500/20 transition-shadow duration-500">
      {/* Encoche & haut-parleur mobile */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-primary-950 rounded-full flex items-center justify-center gap-2 z-20">
        <div className="w-10 h-1 bg-primary-800 rounded-full" />
        <div className="w-2.5 h-2.5 bg-primary-900 rounded-full border border-primary-800" />
      </div>

      {/* Écran du smartphone */}
      <div className="bg-coton-50 rounded-[34px] overflow-hidden border border-coton-200 text-coton-900 pt-7 pb-4 px-3.5 flex flex-col min-h-[580px]">
        {/* Barre d'état Android */}
        <div className="flex items-center justify-between text-[11px] font-bold text-coton-500 px-2 pb-2">
          <span>10:42</span>
          <div className="flex items-center gap-1.5">
            <span>4G</span>
            <div className="w-3.5 h-2 bg-coton-500 rounded-[2px]" />
          </div>
        </div>

        {/* Barre de recherche dans l'app */}
        <div className="mt-1 flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-coton-200 shadow-xs">
          <Search className="w-4 h-4 text-coton-400 shrink-0" />
          <span className="text-xs font-bold text-primary-950">Mamadou Konaté</span>
          <span className="ml-auto text-[10px] bg-terracotta-100 text-terracotta-700 font-bold px-2 py-0.5 rounded-md">
            Trouvé en 1s
          </span>
        </div>

        {/* Carte Client Header */}
        <div className="mt-2.5 p-3 rounded-2xl bg-white border border-coton-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-primary-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              MK
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-primary-950 truncate">
                  Mamadou Konaté
                </h4>
                <Badge variant="success" className="text-[9px] px-1.5 py-0.5">
                  Fidèle
                </Badge>
              </div>
              <p className="text-[11px] text-coton-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-jauge-vert" />
                <span>+225 07 48 92 10 33</span>
              </p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-coton-100 flex items-center justify-between text-[10px] text-coton-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-terracotta-500" />
              Abidjan (Cocody)
            </span>
            <span className="flex items-center gap-1 font-bold text-jauge-vert">
              <CheckCircle className="w-3 h-3" />
              Solde : 0 FCFA dû
            </span>
          </div>
        </div>

        {/* Onglets tactiles du dossier */}
        <div className="mt-2.5 grid grid-cols-3 gap-1 bg-coton-200/60 p-1 rounded-xl text-[11px] font-bold text-center">
          <button
            onClick={() => setActiveTab('mesures')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'mesures'
                ? 'bg-white text-primary-950 shadow-xs'
                : 'text-coton-600 hover:text-coton-900'
            }`}
          >
            Mesures (H)
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-white text-primary-950 shadow-xs'
                : 'text-coton-600 hover:text-coton-900'
            }`}
          >
            Préférences
          </button>
          <button
            onClick={() => setActiveTab('commandes')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'commandes'
                ? 'bg-white text-primary-950 shadow-xs'
                : 'text-coton-600 hover:text-coton-900'
            }`}
          >
            Historique
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        <div className="mt-2.5 flex-1 bg-white rounded-2xl border border-coton-200 p-3 shadow-xs flex flex-col justify-between">
          {activeTab === 'mesures' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider">
                  Profil : Homme (Boubou & Pantalon)
                </span>
                <span className="text-[9px] bg-coton-100 font-semibold text-coton-600 px-1.5 py-0.5 rounded">
                  v2 • Janv 2026
                </span>
              </div>

              {/* Grille de mesures avec unités cm */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Tour de cou</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    41.5 cm
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Carrure épaules</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    48.0 cm
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Tour poitrine</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    104 cm
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Longueur boubou</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    138 cm
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Tour de taille</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    92.0 cm
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200/80">
                  <span className="text-[10px] text-coton-500 block">Longueur pantalon</span>
                  <span className="text-sm font-extrabold text-primary-950 font-mono">
                    104 cm
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-coton-500 italic bg-coton-50 p-2 rounded-lg border border-dashed border-coton-200">
                &ldquo;Prise initiale en 2024 conservée. Version ajustée suite à prise de poids.&rdquo;
              </p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                Habitudes de coupe du client
              </span>
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-terracotta-50 border border-terracotta-200 text-xs font-bold text-terracotta-800 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                  <span>Manches larges toujours</span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200 text-xs font-bold text-coton-800 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-coton-500 shrink-0" />
                  <span>Pas de fente au bas du pantalon</span>
                </div>
                <div className="p-2 rounded-xl bg-coton-50 border border-coton-200 text-xs font-bold text-coton-800 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-coton-500 shrink-0" />
                  <span>Col officier brodé 3 cm</span>
                </div>
              </div>
              <p className="text-[10px] text-coton-600 pt-1">
                Le client n&apos;a plus besoin de te répéter comment il aime porter ses tenues.
              </p>
            </div>
          )}

          {activeTab === 'commandes' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                Commandes enregistrées (3)
              </span>
              <div className="p-2 rounded-xl bg-coton-50 border border-coton-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-primary-950">Grand Boubou Bazin</span>
                  <Badge variant="success" className="text-[8px] py-0 px-1">Livrée</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-coton-500">
                  <span>Tabaski 2025</span>
                  <span className="font-bold text-primary-950">65 000 FCFA</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-coton-50 border border-coton-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-primary-950">Chemise manche courte</span>
                  <Badge variant="success" className="text-[8px] py-0 px-1">Livrée</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-coton-500">
                  <span>Août 2025</span>
                  <span className="font-bold text-primary-950">15 000 FCFA</span>
                </div>
              </div>
            </div>
          )}

          {/* Bouton d'action rapide dans le mockup */}
          <div className="pt-2 border-t border-coton-100 flex items-center justify-between text-[10px] font-bold text-primary-900">
            <span className="flex items-center gap-1 text-terracotta-600">
              <Scissors className="w-3.5 h-3.5" />
              Lui coudre une tenue
            </span>
            <span className="text-coton-400">&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
