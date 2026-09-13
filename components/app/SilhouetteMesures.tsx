'use client';

import * as React from 'react';
import { ProfilType } from '@/lib/supabase/types';

export interface SilhouetteMesuresProps {
  typeProfil: ProfilType;
  activeField?: string | null;
  onSelectField?: (fieldKey: string) => void;
}

export function SilhouetteMesures({
  typeProfil,
  activeField,
  onSelectField,
}: SilhouetteMesuresProps) {
  // Points anatomiques pour HOMME
  const pointsHomme = [
    { key: 'tour_cou', label: 'Cou', x: 100, y: 45 },
    { key: 'carrure_epaules', label: 'Carrure', x: 50, y: 70 },
    { key: 'tour_poitrine', label: 'Poitrine', x: 100, y: 105 },
    { key: 'tour_bras', label: 'Bras', x: 35, y: 110 },
    { key: 'tour_taille', label: 'Taille', x: 100, y: 155 },
    { key: 'tour_poignet', label: 'Poignet', x: 25, y: 185 },
    { key: 'tour_bassin', label: 'Bassin', x: 100, y: 195 },
    { key: 'longueur_haut', label: 'Long. Haut', x: 135, y: 170 },
    { key: 'longueur_boubou', label: 'Long. Boubou', x: 145, y: 260 },
    { key: 'hauteur_entrejambe', label: 'Entrejambe', x: 95, y: 225 },
    { key: 'tour_cuisse', label: 'Cuisse', x: 75, y: 240 },
    { key: 'tour_genou', label: 'Genou', x: 75, y: 285 },
    { key: 'longueur_pantalon', label: 'Long. Pantalon', x: 135, y: 310 },
    { key: 'bas_pantalon', label: 'Bas', x: 75, y: 350 },
  ];

  // Points anatomiques pour FEMME
  const pointsFemme = [
    { key: 'tour_cou', label: 'Cou', x: 100, y: 45 },
    { key: 'longueur_epaule', label: 'Épaule', x: 60, y: 65 },
    { key: 'carrure_devant', label: 'Carrure', x: 100, y: 75 },
    { key: 'tour_poitrine', label: 'Poitrine', x: 100, y: 105 },
    { key: 'dessous_poitrine', label: 'Dessous Poitrine', x: 100, y: 125 },
    { key: 'tour_taille', label: 'Taille', x: 100, y: 150 },
    { key: 'tour_hanches', label: 'Hanches', x: 100, y: 195 },
    { key: 'longueur_robe', label: 'Long. Robe', x: 145, y: 270 },
    { key: 'longueur_pagne', label: 'Long. Pagne', x: 145, y: 330 },
    { key: 'longueur_manche', label: 'Manche', x: 30, y: 140 },
    { key: 'tour_cuisse', label: 'Cuisse', x: 75, y: 235 },
    { key: 'bas_pantalon', label: 'Bas', x: 75, y: 350 },
  ];

  const points = typeProfil === 'femme' ? pointsFemme : pointsHomme;

  return (
    <div className="relative w-full max-w-[240px] mx-auto bg-white rounded-2xl border border-coton-200 p-3 shadow-xs">
      <div className="text-center pb-2 border-b border-coton-100">
        <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider">
          Schéma de Silhouette ({typeProfil})
        </span>
        <span className="text-[10px] text-coton-500 block">
          Clique sur un repère pour aller au champ
        </span>
      </div>

      <div className="relative aspect-[1/1.8] w-full flex items-center justify-center my-2">
        <svg
          viewBox="0 0 200 370"
          className="w-full h-full text-coton-300 drop-shadow-xs"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Silhouette de base stylisée */}
          {/* Tête */}
          <circle cx="100" cy="25" r="16" className="stroke-coton-400 fill-coton-50" />
          {/* Cou */}
          <path d="M94 41 L94 48 M106 41 L106 48" className="stroke-coton-400" />
          {/* Épaules & Buste */}
          <path
            d="M50 68 C70 58, 130 58, 150 68 L142 155 C130 160, 70 160, 58 155 Z"
            className="stroke-coton-400 fill-coton-50/60"
          />
          {/* Bras gauche */}
          <path d="M50 68 L28 140 L22 195" className="stroke-coton-400" />
          {/* Bras droit */}
          <path d="M150 68 L172 140 L178 195" className="stroke-coton-400" />
          {/* Bassin */}
          <path
            d="M58 155 C50 185, 52 205, 65 215 L135 215 C148 205, 150 185, 142 155 Z"
            className="stroke-coton-400 fill-coton-50/60"
          />
          {/* Jambes & Pantalon */}
          <path
            d="M65 215 L60 355 L85 355 L98 230 L102 230 L115 355 L140 355 L135 215"
            className="stroke-coton-400 fill-coton-50/40"
          />
        </svg>

        {/* Repères cliquables interactifs */}
        {points.map((pt) => {
          const isActive = activeField === pt.key;
          return (
            <button
              key={pt.key}
              type="button"
              onClick={() => onSelectField?.(pt.key)}
              style={{ left: `${(pt.x / 200) * 100}%`, top: `${(pt.y / 370) * 100}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer focus:outline-none`}
              title={`Prendre : ${pt.label}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-terracotta-500 ring-4 ring-terracotta-400/30 scale-125'
                    : 'bg-primary-950 hover:bg-terracotta-500 hover:scale-110'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span
                className={`absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap pointer-events-none transition-opacity ${
                  isActive
                    ? 'bg-terracotta-600 text-white opacity-100'
                    : 'bg-white text-coton-800 border border-coton-200 opacity-0 group-hover:opacity-100'
                }`}
              >
                {pt.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeField && (
        <div className="mt-1 p-2 rounded-xl bg-terracotta-50 border border-terracotta-200 text-center">
          <span className="text-[10px] font-extrabold text-terracotta-800">
            Repère sélectionné : {points.find((p) => p.key === activeField)?.label || activeField}
          </span>
        </div>
      )}
    </div>
  );
}
