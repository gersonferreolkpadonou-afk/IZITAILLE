'use client';

import * as React from 'react';
import { useState } from 'react';
import { Camera, Eye, X, Scissors, CheckCircle2, Clock } from 'lucide-react';
import { PhotoType, CommandeStatut } from '@/lib/supabase/types';

interface SuiviPhotosClientProps {
  photos: Array<{
    type_photo: PhotoType;
    url?: string | null;
  }>;
  statut: CommandeStatut;
}

export function SuiviPhotosClient({ photos, statut }: SuiviPhotosClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    titre: string;
  } | null>(null);

  const photoModele = photos.find((p) => p.type_photo === 'modele');
  const photoTissu = photos.find((p) => p.type_photo === 'tissu');
  const photoTenueFinie = photos.find((p) => p.type_photo === 'tenue_finie');

  const estPrete = statut === 'prete' || statut === 'livree' || statut === 'payee';

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-coton-100 pb-3">
        <div>
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-terracotta-500" />
            <span>Photos réelles de votre commande</span>
          </h2>
          <p className="text-xs text-coton-600 mt-0.5">
            Photographies prises à l’atelier pour certifier vos tissus et le modèle convenu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Modèle voulu */}
        <div className="rounded-2xl bg-coton-50 border border-coton-200 overflow-hidden flex flex-col justify-between">
          <div className="p-3 pb-2 flex items-center justify-between">
            <span className="text-xs font-extrabold text-primary-950">
              1. Modèle souhaité
            </span>
            {photoModele && (
              <span className="text-[10px] font-bold text-coton-500">Convenu</span>
            )}
          </div>

          <div className="px-3 pb-3 flex-1 flex flex-col justify-center">
            {photoModele?.url ? (
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: photoModele.url!,
                    titre: 'Modèle de confection convenu',
                  })
                }
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300 cursor-pointer group"
              >
                <img
                  src={photoModele.url}
                  alt="Modèle voulu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Agrandir</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-1.5 border border-dashed border-coton-300 rounded-xl bg-white">
                <Camera className="w-6 h-6 text-coton-400 mx-auto" />
                <p className="text-[11px] text-coton-500">Modèle convenu verbalement</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Tissu / Pagne remis */}
        <div className="rounded-2xl bg-coton-50 border border-coton-200 overflow-hidden flex flex-col justify-between">
          <div className="p-3 pb-2 flex items-center justify-between">
            <span className="text-xs font-extrabold text-primary-950">
              2. Votre tissu déposé
            </span>
            {photoTissu && (
              <span className="text-[10px] font-bold text-jauge-vert">Certifié</span>
            )}
          </div>

          <div className="px-3 pb-3 flex-1 flex flex-col justify-center">
            {photoTissu?.url ? (
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: photoTissu.url!,
                    titre: 'Votre coupon de tissu / pagne déposé à l’atelier',
                  })
                }
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300 cursor-pointer group"
              >
                <img
                  src={photoTissu.url}
                  alt="Tissu remis"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Agrandir</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-1.5 border border-dashed border-coton-300 rounded-xl bg-white">
                <Camera className="w-6 h-6 text-coton-400 mx-auto" />
                <p className="text-[11px] text-coton-500">Tissu enregistré à l’atelier</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Tenue finie */}
        <div className="rounded-2xl bg-coton-50 border border-coton-200 overflow-hidden flex flex-col justify-between">
          <div className="p-3 pb-2 flex items-center justify-between">
            <span className="text-xs font-extrabold text-primary-950">
              3. Tenue terminée
            </span>
            {photoTenueFinie ? (
              <span className="text-[10px] font-bold text-jauge-vert flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Prête</span>
              </span>
            ) : estPrete ? (
              <span className="text-[10px] font-bold text-jauge-vert">À l’atelier</span>
            ) : (
              <span className="text-[10px] font-bold text-terracotta-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>En cours</span>
              </span>
            )}
          </div>

          <div className="px-3 pb-3 flex-1 flex flex-col justify-center">
            {photoTenueFinie?.url ? (
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: photoTenueFinie.url!,
                    titre: 'Votre habit confectionné et repassé',
                  })
                }
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300 cursor-pointer group"
              >
                <img
                  src={photoTenueFinie.url}
                  alt="Tenue finie"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Agrandir</span>
                </div>
              </div>
            ) : (
              <div className="py-8 px-2 text-center space-y-2 border border-dashed border-coton-300 rounded-xl bg-white">
                <div className="w-8 h-8 rounded-full bg-terracotta-50 text-terracotta-600 flex items-center justify-center mx-auto">
                  <Scissors className="w-4 h-4 -rotate-45" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-primary-950">
                    {estPrete ? 'Prête pour essayage' : 'En confection'}
                  </p>
                  <p className="text-[10px] text-coton-500 leading-tight">
                    {estPrete
                      ? 'Venez essayer votre tenue à l’atelier !'
                      : 'La photo sera affichée dès la fin du repassage.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal zoom */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-primary-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <span className="text-sm font-extrabold text-terracotta-300">
                {selectedPhoto.titre}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-square w-full bg-black flex items-center justify-center p-2">
              <img
                src={selectedPhoto.url}
                alt="Agrandissement"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
