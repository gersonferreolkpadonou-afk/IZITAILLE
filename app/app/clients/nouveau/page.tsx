'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SilhouetteMesures } from '@/components/app/SilhouetteMesures';
import { creerClientCompletAction } from '../actions';
import { ProfilType } from '@/lib/supabase/types';

export default function NouveauClientPage() {
  const [typeProfil, setTypeProfil] = useState<ProfilType>('homme');
  const [activeField, setActiveField] = useState<string | null>(null);

  const champsHomme = [
    { key: 'tour_cou', label: 'Tour de cou' },
    { key: 'carrure_epaules', label: "Carrure d'épaules" },
    { key: 'tour_poitrine', label: 'Tour de poitrine' },
    { key: 'tour_taille', label: 'Tour de taille' },
    { key: 'tour_bassin', label: 'Tour de bassin' },
    { key: 'longueur_haut', label: 'Longueur du haut' },
    { key: 'longueur_boubou', label: 'Longueur du boubou' },
    { key: 'longueur_manche_longue', label: 'Longueur manche longue' },
    { key: 'longueur_manche_courte', label: 'Longueur manche courte' },
    { key: 'tour_bras', label: 'Tour de bras' },
    { key: 'tour_poignet', label: 'Tour de poignet' },
    { key: 'longueur_pantalon', label: 'Longueur du pantalon' },
    { key: 'hauteur_entrejambe', label: "Hauteur d'entrejambe" },
    { key: 'tour_cuisse', label: 'Tour de cuisse' },
    { key: 'tour_genou', label: 'Tour de genou' },
    { key: 'bas_pantalon', label: 'Bas du pantalon' },
    { key: 'tour_ceinture', label: 'Tour de ceinture' },
  ];

  const champsFemme = [
    { key: 'tour_cou', label: 'Tour de cou' },
    { key: 'longueur_epaule', label: "Longueur d'épaule" },
    { key: 'carrure_devant', label: 'Carrure devant' },
    { key: 'carrure_dos', label: 'Carrure dos' },
    { key: 'tour_poitrine', label: 'Tour de poitrine' },
    { key: 'dessous_poitrine', label: 'Dessous de poitrine' },
    { key: 'hauteur_poitrine', label: 'Hauteur de poitrine' },
    { key: 'ecart_poitrine', label: 'Écart de poitrine' },
    { key: 'tour_taille', label: 'Tour de taille' },
    { key: 'tour_hanches', label: 'Tour de hanches' },
    { key: 'hauteur_taille_hanches', label: 'Hauteur taille-hanches' },
    { key: 'longueur_dos', label: 'Longueur du dos' },
    { key: 'longueur_robe', label: 'Longueur de robe' },
    { key: 'longueur_jupe', label: 'Longueur de jupe' },
    { key: 'longueur_manche', label: 'Longueur de manche' },
    { key: 'tour_bras', label: 'Tour de bras' },
    { key: 'tour_poignet', label: 'Tour de poignet' },
    { key: 'tour_emmanchure', label: "Tour d'emmanchure" },
    { key: 'longueur_pagne', label: 'Longueur de pagne' },
    { key: 'tour_cuisse', label: 'Tour de cuisse' },
    { key: 'bas_pantalon', label: 'Bas du pantalon' },
  ];

  const champsEnfant = [
    { key: 'age', label: 'Âge de l’enfant (ans)' },
    { key: 'tour_poitrine', label: 'Tour de poitrine' },
    { key: 'tour_taille', label: 'Tour de taille' },
    { key: 'tour_hanches', label: 'Tour de hanches' },
    { key: 'carrure_epaules', label: "Carrure d'épaules" },
    { key: 'longueur_haut', label: 'Longueur du haut' },
    { key: 'longueur_manche', label: 'Longueur de manche' },
    { key: 'longueur_pantalon', label: 'Longueur du pantalon' },
  ];

  const champsActuels =
    typeProfil === 'homme'
      ? champsHomme
      : typeProfil === 'femme'
      ? champsFemme
      : champsEnfant;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Retour et En-tête */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/clients"
          className="p-2 rounded-xl bg-white border border-coton-200 text-coton-700 hover:text-primary-950 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Nouveau dossier
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
            Créer un dossier client
          </h1>
        </div>
      </div>

      <form action={creerClientCompletAction} className="space-y-6">
        {/* Informations générales du client */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-950 text-white text-xs flex items-center justify-center">
              1
            </span>
            <span>Coordonnées du client</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                name="nom_complet"
                label="Nom et Prénom *"
                placeholder="ex: Mamadou Konaté"
                required
              />
            </div>
            <div>
              <Input
                name="telephone_whatsapp"
                type="tel"
                label="Numéro WhatsApp"
                placeholder="ex: +225 07 48 92 10 33"
                helperText="Pour envoyer le suivi de commande et les rappels"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                name="ville"
                label="Ville ou Quartier"
                placeholder="ex: Abidjan (Cocody Angré)"
              />
            </div>
            <div>
              <Input
                name="nom_profil"
                label="Nom du profil de mesures"
                defaultValue={typeProfil === 'homme' ? 'Lui-même' : 'Elle-même'}
                placeholder="ex: Lui-même, Épouse, Enfant..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-coton-900 mb-1.5">
              Préférences et remarques du client
            </label>
            <textarea
              name="preferences_remarques"
              rows={2}
              placeholder="ex: Manches larges toujours, col mao 3cm, pas de fente au pantalon..."
              className="w-full p-3.5 rounded-xl border border-coton-300 bg-white text-coton-900 placeholder:text-coton-400 font-medium text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>
        </div>

        {/* Prise des mesures avec schéma */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-coton-100">
            <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Profil & Prise des mesures (en cm)</span>
            </h2>

            {/* Sélecteur de type de profil */}
            <div className="flex rounded-xl bg-coton-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTypeProfil('homme')}
                className={`py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                  typeProfil === 'homme'
                    ? 'bg-white text-primary-950 shadow-xs'
                    : 'text-coton-600'
                }`}
              >
                Homme
              </button>
              <button
                type="button"
                onClick={() => setTypeProfil('femme')}
                className={`py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                  typeProfil === 'femme'
                    ? 'bg-white text-primary-950 shadow-xs'
                    : 'text-coton-600'
                }`}
              >
                Femme
              </button>
              <button
                type="button"
                onClick={() => setTypeProfil('enfant')}
                className={`py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                  typeProfil === 'enfant'
                    ? 'bg-white text-primary-950 shadow-xs'
                    : 'text-coton-600'
                }`}
              >
                Enfant
              </button>
            </div>
          </div>

          <input type="hidden" name="type_profil" value={typeProfil} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Schéma de silhouette interactif */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <SilhouetteMesures
                typeProfil={typeProfil}
                activeField={activeField}
                onSelectField={(key) => {
                  setActiveField(key);
                  const input = document.getElementById(`m_${key}`);
                  input?.focus();
                }}
              />
            </div>

            {/* Grille des champs de mesures */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-3">
              <p className="text-xs text-coton-600">
                Remplis uniquement les mesures nécessaires pour ta confection.
                Clavier numérique optimisé.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {champsActuels.map((champ) => {
                  const isCurrent = activeField === champ.key;
                  return (
                    <div key={champ.key}>
                      <Input
                        id={`m_${champ.key}`}
                        name={`m_${champ.key}`}
                        type="number"
                        step="0.5"
                        inputMode="decimal"
                        label={champ.label}
                        placeholder="0"
                        suffix="cm"
                        onFocus={() => setActiveField(champ.key)}
                        className={isCurrent ? 'ring-2 ring-terracotta-500 border-terracotta-500' : ''}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de validation */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="terracotta"
            size="lg"
            className="w-full gap-2 text-base font-extrabold shadow-lg shadow-terracotta-500/25"
          >
            <UserCheck className="w-5 h-5" />
            <span>Enregistrer le dossier client</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
