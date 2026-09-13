'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Scissors,
  Calendar,
  AlertOctagon,
  Camera,
  CheckCircle,
  Zap,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JaugeBadge } from '@/components/ui/jauge-badge';
import { Client, TypeTenue, Utilisateur } from '@/lib/supabase/types';
import { evaluerCapacite, CapaciteResultat } from '@/lib/utils/capacite';
import { compresserPhoto } from '@/lib/utils/image-compression';
import { creerCommandeAction } from '@/app/app/commandes/actions';

export interface CommandeFormClientProps {
  clients: Client[];
  typesTenue: TypeTenue[];
  couturiers: Utilisateur[];
  preselectedClientId?: string;
}

export function CommandeFormClient({
  clients,
  typesTenue,
  couturiers,
  preselectedClientId,
}: CommandeFormClientProps) {
  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId || clients[0]?.id || '');
  const [selectedTenueId, setSelectedTenueId] = useState(typesTenue[0]?.id || '');
  const [prixTotal, setPrixTotal] = useState<number>(typesTenue[0]?.prix_base || 35000);
  const [acompte, setAcompte] = useState<number>(15000);
  const [datePromise, setDatePromise] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [estUrgent, setEstUrgent] = useState<boolean>(false);
  const [forceAccept, setForceAccept] = useState<boolean>(false);

  // Photos compressées & dataUrls
  const [photoModeleData, setPhotoModeleData] = useState<string | null>(null);
  const [photoModeleInfo, setPhotoModeleInfo] = useState<string | null>(null);
  const [photoTissuData, setPhotoTissuData] = useState<string | null>(null);
  const [photoTissuInfo, setPhotoTissuInfo] = useState<string | null>(null);

  // Évaluation de capacité dynamique en temps réel
  const selectedTenue = typesTenue.find((t) => t.id === selectedTenueId);
  const chargeUnites = selectedTenue ? Number(selectedTenue.cout_unites) : 1.5;

  const capacite: CapaciteResultat = React.useMemo(() => {
    return evaluerCapacite(datePromise, chargeUnites, [], 8.0, [0]);
  }, [datePromise, chargeUnites]);

  const soldeRestant = Math.max(0, prixTotal - acompte);

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'modele' | 'tissu'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await compresserPhoto(file);
        if (type === 'modele') {
          setPhotoModeleData(res.dataUrl);
          setPhotoModeleInfo(
            `Compressée : ${res.tailleCompresseeKo} Ko (-${res.gainPourcentage}% data)`
          );
        } else {
          setPhotoTissuData(res.dataUrl);
          setPhotoTissuInfo(
            `Compressée : ${res.tailleCompresseeKo} Ko (-${res.gainPourcentage}% data)`
          );
        }
      } catch (err) {
        console.warn('Erreur compression:', err);
      }
    }
  };

  return (
    <form action={creerCommandeAction} className="space-y-6">
      {/* 1. Client & Tenue */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-950 text-white text-xs flex items-center justify-center">
            1
          </span>
          <span>Pour quel client et quel modèle ?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-coton-900 mb-1.5">
              Client *
            </label>
            <select
              name="client_id"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full h-[52px] px-3.5 rounded-xl border border-coton-300 bg-white text-coton-900 text-base font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom_complet} ({c.telephone_whatsapp || c.ville || 'Sans tél'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-coton-900 mb-1.5">
              Type de confection *
            </label>
            <select
              name="type_tenue_nom"
              value={selectedTenue?.nom || 'Grand Boubou 3 pièces'}
              onChange={(e) => {
                const tenue = typesTenue.find((t) => t.nom === e.target.value);
                if (tenue) {
                  setSelectedTenueId(tenue.id);
                  if (tenue.prix_base) setPrixTotal(tenue.prix_base);
                }
              }}
              className="w-full h-[52px] px-3.5 rounded-xl border border-coton-300 bg-white text-coton-900 text-base font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              required
            >
              {typesTenue.map((t) => (
                <option key={t.id} value={t.nom}>
                  {t.nom} (Coût : {t.cout_unites} unités)
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="hidden" name="charge_unites" value={chargeUnites} />

        <div>
          <Input
            name="notes"
            label="Détails du modèle & tissu"
            placeholder="ex: Bazin riche bleu ciel, broderie fil d'or, boutons nacrés..."
          />
        </div>
      </div>

      {/* 2. Moteur de Capacité & Date de livraison (Fonctionnalité maîtresse) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-terracotta-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white text-xs flex items-center justify-center">
              2
            </span>
            <span>Date promise & Vérification de capacité</span>
          </h2>
          <span className="text-[11px] uppercase font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full">
            Anti-Surcharge
          </span>
        </div>

        <div>
          <Input
            name="date_promise"
            type="date"
            label="Date de livraison promise au client *"
            value={datePromise}
            onChange={(e) => setDatePromise(e.target.value)}
            required
            className="font-bold text-lg"
          />
        </div>

        {/* Jauge de capacité réactive immédiate */}
        <div className="pt-1">
          <JaugeBadge
            pourcentage={capacite.pourcentage}
            dateEstimee={capacite.premiereDateRecommandee}
          />
        </div>

        {/* Si alerte rouge, confirmation explicite requise pour forcer */}
        {capacite.statut === 'rouge' && (
          <div className="p-4 rounded-2xl bg-jauge-rouge-bg border border-jauge-rouge/40 space-y-2">
            <div className="flex items-center gap-2 text-jauge-rouge text-xs font-bold">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>
                Attention patron : cette commande dépasse la capacité physique de l&apos;atelier !
              </span>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-coton-900 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={forceAccept}
                onChange={(e) => setForceAccept(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-500 cursor-pointer"
              />
              <span>
                Je confirme forcer l&apos;enregistrement malgré le risque de retard.
              </span>
            </label>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <label className="flex items-center gap-2 text-xs font-bold text-coton-800 cursor-pointer">
            <input
              type="checkbox"
              name="est_urgent"
              checked={estUrgent}
              onChange={(e) => setEstUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-jauge-rouge focus:ring-jauge-rouge cursor-pointer"
            />
            <span className={estUrgent ? 'text-jauge-rouge font-extrabold' : ''}>
              Marquer cette confection comme URGENTE
            </span>
          </label>
        </div>
      </div>

      {/* 3. Les Photos de la commande (Compression locale anti-data) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-950 text-white text-xs flex items-center justify-center">
            3
          </span>
          <span>Les photos de la commande</span>
        </h2>
        <p className="text-xs text-coton-600">
          Compressées automatiquement sur ton téléphone pour ne pas consommer ton forfait internet.
        </p>

        {/* Champs cachés contenant la data URL réelle de chaque photo */}
        <input type="hidden" name="photo_modele_data" value={photoModeleData || ''} />
        <input type="hidden" name="photo_tissu_data" value={photoTissuData || ''} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Photo 1: Modèle voulu */}
          <div className="p-4 rounded-2xl bg-coton-50 border border-coton-200 text-center space-y-2">
            {photoModeleData ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300">
                <img src={photoModeleData} alt="Modèle" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-950 text-white flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
            )}
            <strong className="text-xs font-bold block text-primary-950">
              1. Modèle voulu par le client
            </strong>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-coton-300 text-xs font-bold text-coton-800 hover:bg-coton-100 cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5 text-terracotta-600" />
              <span>{photoModeleData ? 'Changer la photo' : 'Prendre en photo'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoUpload(e, 'modele')}
                className="hidden"
              />
            </label>
            {photoModeleInfo && (
              <span className="text-[10px] text-jauge-vert font-bold block">
                {photoModeleInfo}
              </span>
            )}
          </div>

          {/* Photo 2: Tissu remis */}
          <div className="p-4 rounded-2xl bg-coton-50 border border-coton-200 text-center space-y-2">
            {photoTissuData ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-coton-200 border border-coton-300">
                <img src={photoTissuData} alt="Tissu" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
            )}
            <strong className="text-xs font-bold block text-primary-950">
              2. Tissu ou pagne remis
            </strong>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-coton-300 text-xs font-bold text-coton-800 hover:bg-coton-100 cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5 text-terracotta-600" />
              <span>{photoTissuData ? 'Changer la photo' : 'Prendre en photo'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoUpload(e, 'tissu')}
                className="hidden"
              />
            </label>
            {photoTissuInfo && (
              <span className="text-[10px] text-jauge-vert font-bold block">
                {photoTissuInfo}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Tarifs & Acompte */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-950 text-white text-xs flex items-center justify-center">
            4
          </span>
          <span>Prix et règlement d&apos;acompte</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              name="prix_total"
              type="number"
              label="Prix total de la confection *"
              value={prixTotal}
              onChange={(e) => setPrixTotal(Number(e.target.value))}
              suffix="FCFA"
              required
            />
          </div>
          <div>
            <Input
              name="acompte"
              type="number"
              label="Acompte versé aujourd'hui"
              value={acompte}
              onChange={(e) => setAcompte(Number(e.target.value))}
              suffix="FCFA"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-coton-50 border border-coton-200 flex items-center justify-between text-xs font-bold">
          <span className="text-coton-600">Solde restant à la livraison :</span>
          <span className="text-sm font-extrabold text-terracotta-600 font-mono">
            {soldeRestant.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      {/* Bouton de validation rapide */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="terracotta"
          size="lg"
          disabled={capacite.statut === 'rouge' && !forceAccept}
          className="w-full gap-2 text-base font-extrabold shadow-lg shadow-terracotta-500/25"
        >
          <Scissors className="w-5 h-5" />
          <span>Enregistrer la commande (moins de 60s)</span>
        </Button>
      </div>
    </form>
  );
}
