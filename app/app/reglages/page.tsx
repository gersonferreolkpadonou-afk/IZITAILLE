import * as React from 'react';
import {
  Settings,
  Scissors,
  Save,
  PlusCircle,
  Clock,
  Coins,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getTypesTenue } from '@/lib/services/atelier-service';
import {
  enregistrerReglagesAction,
  ajouterTypeTenueAction,
} from './actions';

export default async function ReglagesPage() {
  const typesTenue = await getTypesTenue();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* En-tête */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
          Administration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
          Réglages & Configuration de l&apos;Atelier
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-coton-600">
          Personnalise ta devise, ta capacité quotidienne et le catalogue de tes confections.
        </p>
      </div>

      {/* 1. Profil & Coordonnées */}
      <form action={enregistrerReglagesAction} className="space-y-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <Building className="w-5 h-5 text-terracotta-500" />
            <span>Identité de l&apos;atelier</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                name="nom_atelier"
                label="Nom de l'atelier"
                defaultValue="Atelier Maître Ibrahima Diallo"
                required
              />
            </div>
            <div>
              <Input
                name="whatsapp"
                label="Numéro WhatsApp principal"
                defaultValue="+225 07 01 02 03 04"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                name="ville"
                label="Ville ou Commune"
                defaultValue="Abidjan (Treichville)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coton-900 mb-1.5">
                Devise utilisée
              </label>
              <select
                name="devise"
                defaultValue="XOF"
                className="w-full h-[52px] px-3.5 rounded-xl border border-coton-300 bg-white text-coton-900 text-base font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="XOF">Franc CFA (XOF / UEMOA)</option>
                <option value="GNF">Franc Guinéen (GNF)</option>
                <option value="USD">Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Paramètres de Capacité & Jours de Repos */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-terracotta-500" />
            <span>Capacité de travail quotidienne & Jours de repos</span>
          </h2>
          <p className="text-xs text-coton-600">
            Ces réglages alimentent la jauge de charge pour empêcher la surcharge avant les fêtes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <Input
                name="capacite_journaliere"
                type="number"
                step="0.5"
                label="Capacité quotidienne (unités de travail / jour)"
                defaultValue="8.0"
                helperText="Exemple : 8 unités = 3 boubous complets ou 8 chemises par jour."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-coton-900 mb-1.5">
                Jours de repos de l&apos;atelier
              </label>
              <div className="space-y-2 pt-1 text-xs font-bold text-coton-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    name="repos_dimanche"
                    className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-500 cursor-pointer"
                  />
                  <span>Dimanche (Fermé pour repos)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="repos_vendredi"
                    className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-500 cursor-pointer"
                  />
                  <span>Vendredi (Après-midi prière)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="terracotta"
              size="default"
              className="gap-2 font-bold shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres de l&apos;atelier</span>
            </Button>
          </div>
        </div>
      </form>

      {/* 3. Catalogue des types de tenue & Coûts en unités */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-coton-100">
          <div>
            <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-terracotta-500" />
              <span>Catalogue des types de confections ({typesTenue.length})</span>
            </h2>
            <p className="text-xs text-coton-600">
              Chaque tenue a son équivalent en unités de travail pour le calcul automatique de charge.
            </p>
          </div>
        </div>

        {/* Tableau du catalogue actuel */}
        <div className="space-y-2">
          {typesTenue.map((tenue) => (
            <div
              key={tenue.id}
              className="p-3.5 rounded-2xl bg-coton-50 border border-coton-200 flex items-center justify-between text-xs font-medium"
            >
              <div>
                <strong className="text-sm font-extrabold text-primary-950 block">
                  {tenue.nom}
                </strong>
                <span className="text-[11px] text-coton-500">
                  Prix indicatif : {tenue.prix_base ? `${tenue.prix_base.toLocaleString('fr-FR')} FCFA` : 'Non fixé'}
                </span>
              </div>

              <div className="text-right">
                <Badge variant="terracotta" className="font-bold">
                  {tenue.cout_unites} unités de charge
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout rapide au catalogue */}
        <form
          action={ajouterTypeTenueAction}
          className="p-4 rounded-2xl bg-coton-100/60 border border-dashed border-coton-300 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
            + Ajouter un nouveau type de tenue
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Input
                name="nom"
                placeholder="ex: Kaftan brodé royal"
                required
              />
            </div>
            <div>
              <Input
                name="cout_unites"
                type="number"
                step="0.1"
                defaultValue="1.5"
                placeholder="Coût en unités"
                suffix="unités"
                required
              />
            </div>
            <div>
              <Input
                name="prix_base"
                type="number"
                placeholder="Prix de base"
                defaultValue="30000"
                suffix="FCFA"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="sm" className="gap-2 font-bold text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter au catalogue</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
