'use client';

import * as React from 'react';
import { useState, useTransition } from 'react';
import {
  Camera,
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhotoCommande, PhotoType, CommandeStatut } from '@/lib/supabase/types';
import { compresserPhoto } from '@/lib/utils/image-compression';
import {
  uploaderPhotoCommandeAction,
  supprimerPhotoCommandeAction,
} from '@/app/app/commandes/actions';

interface PhotosCommandeManagerProps {
  commandeId: string;
  initialPhotos: PhotoCommande[];
  statutCommande: CommandeStatut;
}

interface SlotConfig {
  type: PhotoType;
  numero: number;
  titre: string;
  sousTitre: string;
  description: string;
  badgeCouleur: string;
}

const SLOTS: SlotConfig[] = [
  {
    type: 'modele',
    numero: 1,
    titre: 'Modèle voulu',
    sousTitre: 'Inspiration ou catalogue',
    description: 'La photo du modèle ou du style demandé par le client (WhatsApp, capture ou croquis).',
    badgeCouleur: 'bg-primary-950 text-white',
  },
  {
    type: 'tissu',
    numero: 2,
    titre: 'Tissu / Pagne déposé',
    sousTitre: 'Preuve irréfutable du tissu',
    description: 'Photo du coupon (Bazin, Wax, Woodin, etc.) laissé à l’atelier pour éviter toute confusion de tissu.',
    badgeCouleur: 'bg-terracotta-500 text-white',
  },
  {
    type: 'tenue_finie',
    numero: 3,
    titre: 'Tenue finie',
    sousTitre: 'Chef-d’œuvre repassé',
    description: 'Photo de la tenue terminée, prête pour l’essayage ou remise au client.',
    badgeCouleur: 'bg-jauge-vert text-white',
  },
];

export function PhotosCommandeManager({
  commandeId,
  initialPhotos,
  statutCommande,
}: PhotosCommandeManagerProps) {
  const [photos, setPhotos] = useState<PhotoCommande[]>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const [loadingSlot, setLoadingSlot] = useState<PhotoType | null>(null);
  const [activeModalPhoto, setActiveModalPhoto] = useState<PhotoCommande | null>(null);
  const [compressionNotice, setCompressionNotice] = useState<{
    slot: PhotoType;
    message: string;
  } | null>(null);

  // Synchroniser si les photos initiales changent
  React.useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const handlePhotoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    typePhoto: PhotoType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingSlot(typePhoto);

    try {
      // 1. Compression locale sur le téléphone pour économiser la data (90-95% d'économie)
      const comp = await compresserPhoto(file);
      setCompressionNotice({
        slot: typePhoto,
        message: `Compressée : ${comp.tailleCompresseeKo} Ko (-${comp.gainPourcentage}% data économisée)`,
      });

      // 2. Préparation du FormData pour l'action serveur
      const formData = new FormData();
      formData.append('commande_id', commandeId);
      formData.append('type_photo', typePhoto);
      formData.append('photo_data', comp.dataUrl);
      formData.append('taille_originale_ko', String(comp.tailleOriginaleKo));
      formData.append('taille_compressee_ko', String(comp.tailleCompresseeKo));

      // 3. Mise à jour optimiste immédiate dans l'UI
      const optimisticPhoto: PhotoCommande = {
        id: `optimistic-${Date.now()}`,
        atelier_id: 'ate-001',
        commande_id: commandeId,
        type_photo: typePhoto,
        storage_path: comp.dataUrl,
        url_publique: comp.dataUrl,
        compression_info: {
          taille_originale_ko: comp.tailleOriginaleKo,
          taille_compressee_ko: comp.tailleCompresseeKo,
        },
        created_at: new Date().toISOString(),
      };

      setPhotos((prev) => [
        optimisticPhoto,
        ...prev.filter((p) => p.type_photo !== typePhoto),
      ]);

      // 4. Exécution sur le serveur
      startTransition(async () => {
        try {
          await uploaderPhotoCommandeAction(formData);
        } catch (err) {
          console.error('Erreur enregistrement photo:', err);
        } finally {
          setLoadingSlot(null);
        }
      });
    } catch (err) {
      console.error('Erreur compression photo:', err);
      setLoadingSlot(null);
    }
  };

  const handleSupprimerPhoto = (typePhoto: PhotoType) => {
    if (!confirm('Voulez-vous vraiment retirer cette photo du dossier ?')) return;

    // Optimiste
    setPhotos((prev) => prev.filter((p) => p.type_photo !== typePhoto));
    if (compressionNotice?.slot === typePhoto) {
      setCompressionNotice(null);
    }

    const formData = new FormData();
    formData.append('commande_id', commandeId);
    formData.append('type_photo', typePhoto);

    startTransition(async () => {
      try {
        await supprimerPhotoCommandeAction(formData);
      } catch (err) {
        console.error('Erreur suppression photo:', err);
      }
    });
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-coton-100 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-primary-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-terracotta-500" />
            <span>Les trois photos du dossier de confection</span>
          </h2>
          <p className="text-xs text-coton-600 mt-0.5">
            Photos réelles prises à l’atelier pour ce client. Évite les litiges de pagnes et alimente le suivi client.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-jauge-vert bg-jauge-vert-bg px-2.5 py-1 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compression data mobile activée</span>
        </div>
      </div>

      {/* Grille des 3 slots photos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SLOTS.map((slot) => {
          const photo = photos.find((p) => p.type_photo === slot.type);
          const isLoading = loadingSlot === slot.type || (isPending && loadingSlot === slot.type);
          const inputId = `photo-input-${slot.type}-${commandeId}`;

          return (
            <div
              key={slot.type}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                photo
                  ? 'bg-coton-50/70 border-coton-200 shadow-xs'
                  : 'bg-coton-50/40 border-dashed border-coton-300 hover:border-terracotta-400'
              }`}
            >
              {/* En-tête du slot */}
              <div className="p-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${slot.badgeCouleur}`}
                  >
                    {slot.numero}
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-primary-950 leading-none">
                      {slot.titre}
                    </h3>
                    <span className="text-[10px] text-coton-500 font-medium">
                      {slot.sousTitre}
                    </span>
                  </div>
                </div>

                {photo && (
                  <span className="text-[9px] font-bold text-jauge-vert flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-jauge-vert/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Enregistrée</span>
                  </span>
                )}
              </div>

              {/* Zone Visuelle Photo / Upload */}
              <div className="px-3 pb-3 flex-1 flex flex-col justify-center">
                {photo ? (
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300 group">
                    {/* Image réelle */}
                    <img
                      src={photo.url_publique || photo.storage_path}
                      alt={slot.titre}
                      className="w-full h-full object-cover"
                    />

                    {/* Actions au survol ou tactiles */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveModalPhoto(photo)}
                          className="p-2 rounded-xl bg-white/90 hover:bg-white text-primary-950 font-bold text-xs shadow-md transition-transform hover:scale-105"
                          title="Agrandir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <label
                          htmlFor={inputId}
                          className="p-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
                          title="Remplacer la photo"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSupprimerPhoto(slot.type)}
                          className="p-2 rounded-xl bg-jauge-rouge hover:bg-red-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isLoading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 px-3 text-center space-y-2.5 border border-dashed border-coton-300 rounded-xl bg-white">
                    <div className="w-10 h-10 rounded-full bg-coton-100 text-coton-500 flex items-center justify-center mx-auto">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-terracotta-500" />
                      ) : (
                        <Camera className="w-5 h-5 text-coton-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-primary-950">
                        {slot.type === 'tenue_finie' && statutCommande !== 'prete' && statutCommande !== 'livree'
                          ? 'En cours de confection'
                          : 'Aucune photo'}
                      </p>
                      <p className="text-[10px] text-coton-500 leading-tight line-clamp-2">
                        {slot.description}
                      </p>
                    </div>

                    <label
                      htmlFor={inputId}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-primary-950 hover:bg-primary-900 text-white text-xs font-extrabold cursor-pointer shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-terracotta-400" />
                      <span>Prendre en photo</span>
                    </label>
                  </div>
                )}

                {/* Input caché pour photo mobile & upload */}
                <input
                  id={inputId}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handlePhotoSelect(e, slot.type)}
                  className="hidden"
                  disabled={isLoading}
                />

                {/* Info de compression pour ce slot */}
                {compressionNotice?.slot === slot.type && (
                  <p className="text-[10px] font-bold text-jauge-vert mt-1.5 text-center">
                    {compressionNotice.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Modale zoom photo plein écran */}
      {activeModalPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-primary-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold uppercase tracking-wider text-terracotta-400">
                  {SLOTS.find((s) => s.type === activeModalPhoto.type_photo)?.titre}
                </span>
                <span className="text-xs text-coton-400">
                  {new Date(activeModalPhoto.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-square sm:aspect-4/3 w-full bg-black flex items-center justify-center p-2">
              <img
                src={activeModalPhoto.url_publique || activeModalPhoto.storage_path}
                alt="Agrandissement"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-primary-900/60 border-t border-white/10 flex items-center justify-between text-xs text-coton-300">
              <span>Photo authentique de l’atelier IZITAILLE</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveModalPhoto(null)}
                className="text-xs font-bold"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
