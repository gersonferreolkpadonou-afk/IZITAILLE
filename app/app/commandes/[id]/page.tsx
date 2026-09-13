import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Camera,
  Scissors,
  DollarSign,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getCommandeById,
  getClientById,
  getCouturiers,
  getPhotosByCommandeId,
} from '@/lib/services/atelier-service';
import { PhotosCommandeManager } from '@/components/app/PhotosCommandeManager';
import {
  genererLienWhatsApp,
  genererMessageCommandePrete,
  genererMessageRappelEcheance,
  genererMessageRelancePaiement,
} from '@/lib/utils/whatsapp';
import {
  passerEtapeSuivanteAction,
  ajouterPaiementSoldeAction,
} from '../actions';
import { CommandeStatut } from '@/lib/supabase/types';

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const commande = await getCommandeById(resolvedParams.id);

  if (!commande) {
    notFound();
  }

  const client = await getClientById(commande.client_id);
  const couturiers = await getCouturiers();
  const photos = await getPhotosByCommandeId(commande.id);
  const couturier = couturiers.find((c) => c.id === commande.couturier_assigne_id);

  const etapes: { id: CommandeStatut; label: string }[] = [
    { id: 'recue', label: 'Reçue' },
    { id: 'coupee', label: 'Coupée' },
    { id: 'en_couture', label: 'En couture' },
    { id: 'finitions', label: 'Finitions' },
    { id: 'prete', label: 'Prête' },
    { id: 'livree', label: 'Livrée' },
    { id: 'payee', label: 'Payée' },
  ];

  const indexActuel = etapes.findIndex((e) => e.id === commande.statut);
  const estEnRetard =
    commande.date_promise < new Date().toISOString().split('T')[0] &&
    commande.statut !== 'livree' &&
    commande.statut !== 'payee';

  // Liens WhatsApp prêts
  const lienPret =
    client?.telephone_whatsapp &&
    genererLienWhatsApp(
      client.telephone_whatsapp,
      genererMessageCommandePrete({
        nomClient: client.nom_complet,
        nomTenue: commande.notes || 'votre habit',
        nomAtelier: 'Atelier IZITAILLE',
        soldeRestant: commande.solde_du,
        devise: 'FCFA',
      })
    );

  const lienRappel =
    client?.telephone_whatsapp &&
    genererLienWhatsApp(
      client.telephone_whatsapp,
      genererMessageRappelEcheance({
        nomClient: client.nom_complet,
        nomTenue: commande.notes || 'votre habit',
        datePromise: commande.date_promise,
        lienSuivi: `https://izitaille.com/suivi/${commande.token_suivi}`,
        nomAtelier: 'Atelier IZITAILLE',
      })
    );

  const lienRelance =
    client?.telephone_whatsapp &&
    genererLienWhatsApp(
      client.telephone_whatsapp,
      genererMessageRelancePaiement({
        nomClient: client.nom_complet,
        codeCommande: commande.code_commande,
        soldeRestant: commande.solde_du,
        devise: 'FCFA',
        nomAtelier: 'Atelier IZITAILLE',
      })
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* En-tête commande */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app/commandes"
            className="p-2 rounded-xl bg-white border border-coton-200 text-coton-700 hover:text-primary-950 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 font-mono">
                {commande.code_commande}
              </span>
              {commande.est_urgent && (
                <Badge variant="danger" className="text-[9px] py-0 px-1.5">
                  Urgent
                </Badge>
              )}
              {estEnRetard && (
                <Badge variant="danger" className="text-[9px] py-0 px-1.5">
                  En retard !
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-950 tracking-tight">
              {client?.nom_complet || 'Client'}
            </h1>
          </div>
        </div>

        {/* Lien de suivi client public */}
        <Link
          href={`/suivi/${commande.token_suivi}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coton-100 hover:bg-coton-200 text-coton-800 font-bold text-xs border border-coton-300 transition-colors"
        >
          <span>Voir la page de suivi client</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stepper d'avancement des 7 statuts */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-primary-950 uppercase tracking-wider">
            Étape en cours : <span className="text-terracotta-600">{commande.statut.replace('_', ' ')}</span>
          </h2>
          <span className="text-xs text-coton-500 font-medium">
            Promise pour le : <strong>{commande.date_promise}</strong>
          </span>
        </div>

        {/* Stepper tactile mobile */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
          {etapes.map((etape, idx) => {
            const isCompleted = idx < indexActuel;
            const isCurrent = idx === indexActuel;
            return (
              <div key={etape.id} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                    isCurrent
                      ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-400/20 shadow-sm'
                      : isCompleted
                      ? 'bg-jauge-vert text-white'
                      : 'bg-coton-100 text-coton-400'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`truncate w-full ${isCurrent ? 'text-terracotta-600 font-extrabold' : 'text-coton-500'}`}>
                  {etape.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bouton d'action pour faire avancer le statut */}
        {indexActuel < etapes.length - 1 && (
          <form action={passerEtapeSuivanteAction} className="pt-2">
            <input type="hidden" name="commande_id" value={commande.id} />
            <input type="hidden" name="statut_actuel" value={commande.statut} />
            <Button
              type="submit"
              variant="terracotta"
              size="default"
              className="w-full gap-2 font-bold text-sm shadow-sm"
            >
              <span>Passer à l&apos;étape suivante : </span>
              <strong>{etapes[indexActuel + 1].label}</strong>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>

      {/* Les 3 Photos interactives du dossier de la commande (réelles et persistées) */}
      <PhotosCommandeManager
        commandeId={commande.id}
        initialPhotos={photos}
        statutCommande={commande.statut}
      />

      {/* Règlements & Solde restant */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-primary-950">
          Caisse & Règlements
        </h2>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-coton-50 border border-coton-200">
            <span className="text-[11px] text-coton-500 font-medium block">Prix total</span>
            <span className="text-base sm:text-lg font-extrabold text-primary-950 font-mono">
              {commande.prix_total.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-jauge-vert-bg border border-jauge-vert/30">
            <span className="text-[11px] text-jauge-vert font-bold block">Acompte payé</span>
            <span className="text-base sm:text-lg font-extrabold text-jauge-vert font-mono">
              {commande.acompte_paye.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-terracotta-100 border border-terracotta-300">
            <span className="text-[11px] text-terracotta-700 font-bold block">Solde restant</span>
            <span className="text-base sm:text-lg font-extrabold text-terracotta-800 font-mono">
              {commande.solde_du.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        {/* Encaissement rapide si solde > 0 */}
        {commande.solde_du > 0 && (
          <form
            action={ajouterPaiementSoldeAction}
            className="pt-2 p-4 rounded-2xl bg-coton-50 border border-coton-200 flex flex-col sm:flex-row items-center gap-3"
          >
            <input type="hidden" name="commande_id" value={commande.id} />
            <div className="w-full sm:flex-1">
              <label className="text-xs font-bold text-coton-700 block mb-1">
                Encaisser le solde (ou un acompte)
              </label>
              <input
                name="montant"
                type="number"
                defaultValue={commande.solde_du}
                className="w-full h-11 px-3 rounded-xl border border-coton-300 bg-white font-mono font-bold text-base"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="text-xs font-bold text-coton-700 block mb-1">
                Moyen
              </label>
              <select
                name="moyen_paiement"
                defaultValue="especes"
                className="w-full h-11 px-2 rounded-xl border border-coton-300 bg-white text-xs font-bold"
              >
                <option value="especes">Espèces</option>
                <option value="wave">Wave</option>
                <option value="orange_money">Orange Money</option>
                <option value="mtn_money">MTN Money</option>
              </select>
            </div>
            <div className="w-full sm:w-auto pt-5">
              <Button type="submit" variant="primary" size="sm" className="w-full h-11 font-bold">
                Valider
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Actions WhatsApp 1-Clic pré-rédigées */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coton-200 shadow-sm space-y-3">
        <h2 className="text-base font-extrabold text-primary-950 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-jauge-vert" />
          <span>Messages WhatsApp en 1 clic (sans saisie)</span>
        </h2>
        <p className="text-xs text-coton-600">
          Ouvre WhatsApp avec le message pré-rempli pour prévenir ton client en 1 seconde.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {lienPret ? (
            <a href={lienPret} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="default"
                className="w-full gap-2 text-xs font-bold border-jauge-vert/40 text-jauge-vert hover:bg-jauge-vert-bg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tenue prête à récupérer</span>
              </Button>
            </a>
          ) : null}

          {lienRappel ? (
            <a href={lienRappel} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="default"
                className="w-full gap-2 text-xs font-bold text-primary-950"
              >
                <Clock className="w-4 h-4 text-terracotta-500" />
                <span>Rappel d&apos;échéance</span>
              </Button>
            </a>
          ) : null}

          {lienRelance && commande.solde_du > 0 ? (
            <a href={lienRelance} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="default"
                className="w-full gap-2 text-xs font-bold text-terracotta-700 hover:bg-terracotta-50"
              >
                <DollarSign className="w-4 h-4 text-terracotta-600" />
                <span>Relance de solde impayé</span>
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
