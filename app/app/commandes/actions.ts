'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  createCommandeDirect,
  updateStatutCommande,
  enregistrerPaiement,
  savePhotoCommande,
  deletePhotoCommande,
} from '@/lib/services/atelier-service';
import { Commande, PhotoType } from '@/lib/supabase/types';

export async function creerCommandeAction(formData: FormData) {
  const client_id = formData.get('client_id') as string;
  const type_tenue_nom = (formData.get('type_tenue_nom') as string) || 'Confection sur mesure';
  const date_promise = formData.get('date_promise') as string;
  const prix_total = Number(formData.get('prix_total')) || 0;
  const acompte = Number(formData.get('acompte')) || 0;
  const charge_unites = Number(formData.get('charge_unites')) || 1.5;
  const couturier_id = (formData.get('couturier_id') as string) || undefined;
  const notes = (formData.get('notes') as string) || '';
  const est_urgent = formData.get('est_urgent') === 'on';
  const photo_modele_url = (formData.get('photo_modele_data') as string) || undefined;
  const photo_tissu_url = (formData.get('photo_tissu_data') as string) || undefined;

  if (!client_id || !date_promise) {
    throw new Error('Le client et la date promise de livraison sont obligatoires.');
  }

  const nouvelleCmd = await createCommandeDirect({
    client_id,
    type_tenue_nom,
    date_promise,
    prix_total,
    acompte,
    charge_unites,
    couturier_id,
    notes,
    est_urgent,
    photo_modele_url,
    photo_tissu_url,
  });

  redirect(`/app/commandes/${nouvelleCmd.id}`);
}

export async function passerEtapeSuivanteAction(formData: FormData) {
  const commande_id = formData.get('commande_id') as string;
  const statut_actuel = formData.get('statut_actuel') as Commande['statut'];

  const ordreStatuts: Commande['statut'][] = [
    'recue',
    'coupee',
    'en_couture',
    'finitions',
    'prete',
    'livree',
    'payee',
  ];

  const idx = ordreStatuts.indexOf(statut_actuel);
  if (idx >= 0 && idx < ordreStatuts.length - 1) {
    const suivant = ordreStatuts[idx + 1];
    await updateStatutCommande(commande_id, suivant);
  }

  revalidatePath(`/app/commandes/${commande_id}`);
}

export async function uploaderPhotoCommandeAction(formData: FormData) {
  const commande_id = formData.get('commande_id') as string;
  const type_photo = formData.get('type_photo') as PhotoType;
  const photo_data = formData.get('photo_data') as string;
  const taille_originale_ko = Number(formData.get('taille_originale_ko')) || undefined;
  const taille_compressee_ko = Number(formData.get('taille_compressee_ko')) || undefined;

  if (!commande_id || !type_photo || !photo_data) {
    throw new Error('Données de photo incomplètes.');
  }

  await savePhotoCommande({
    commande_id,
    type_photo,
    url_publique: photo_data,
    taille_originale_ko,
    taille_compressee_ko,
  });

  revalidatePath(`/app/commandes/${commande_id}`);
  revalidatePath(`/suivi`);
}

export async function supprimerPhotoCommandeAction(formData: FormData) {
  const commande_id = formData.get('commande_id') as string;
  const type_photo = formData.get('type_photo') as PhotoType;

  if (!commande_id || !type_photo) {
    throw new Error('Paramètres manquants.');
  }

  await deletePhotoCommande(commande_id, type_photo);

  revalidatePath(`/app/commandes/${commande_id}`);
  revalidatePath(`/suivi`);
}

export async function ajouterPaiementSoldeAction(formData: FormData) {
  const commande_id = formData.get('commande_id') as string;
  const montant = Number(formData.get('montant')) || 0;
  const moyen_paiement =
    (formData.get('moyen_paiement') as
      | 'especes'
      | 'orange_money'
      | 'mtn_money'
      | 'wave'
      | 'moov_money'
      | 'virement'
      | 'autre') || 'especes';

  if (montant > 0) {
    await enregistrerPaiement({
      commande_id,
      montant,
      moyen_paiement,
      notes: 'Règlement de solde',
    });
  }

  revalidatePath(`/app/commandes/${commande_id}`);
  revalidatePath(`/app/caisse`);
}
