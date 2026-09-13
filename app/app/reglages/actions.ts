'use server';

import { revalidatePath } from 'next/cache';
import { getTypesTenue } from '@/lib/services/atelier-service';

export async function enregistrerReglagesAction(formData: FormData) {
  const nom_atelier = formData.get('nom_atelier') as string;
  const devise = formData.get('devise') as string;
  const capacite_journaliere = Number(formData.get('capacite_journaliere')) || 8.0;
  const whatsapp = formData.get('whatsapp') as string;
  const ville = formData.get('ville') as string;

  // En production, met à jour public.ateliers dans Supabase
  // await supabase.from('ateliers').update({ nom: nom_atelier, devise, capacite_journaliere_unites: capacite_journaliere, whatsapp, ville }).eq('id', atelierId);

  revalidatePath('/app');
  revalidatePath('/app/charge');
  revalidatePath('/app/reglages');
}

export async function ajouterTypeTenueAction(formData: FormData) {
  const nom = (formData.get('nom') as string)?.trim();
  const cout_unites = Number(formData.get('cout_unites')) || 1.0;
  const prix_base = Number(formData.get('prix_base')) || 0;

  if (nom) {
    const types = await getTypesTenue();
    types.push({
      id: `tt-${Date.now()}`,
      atelier_id: 'ate-001',
      nom,
      cout_unites,
      prix_base,
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath('/app/commandes/nouvelle');
  revalidatePath('/app/reglages');
}
