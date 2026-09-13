'use server';

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { redirect } from 'next/navigation';

export interface WaitlistState {
  error?: string;
  success?: boolean;
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc('get_liste_attente_count');

    if (!error && typeof data === 'number') {
      return data;
    }

    const { count, error: countError } = await supabase
      .from('liste_attente')
      .select('*', { count: 'exact', head: true });

    if (!countError && count !== null) {
      return count;
    }
  } catch (err) {
    console.error('Erreur lecture compteur liste attente:', err);
  }

  return 0;
}

export async function rejoindreListeAttenteAction(
  prevState: WaitlistState | null,
  formData: FormData
): Promise<WaitlistState> {
  const nomAtelier = (formData.get('nomAtelier') as string)?.trim();
  const whatsapp = (formData.get('whatsapp') as string)?.trim();
  const ville = (formData.get('ville') as string)?.trim();
  const pays = (formData.get('pays') as string)?.trim() || "Côte d'Ivoire";

  if (!nomAtelier || !whatsapp || !ville) {
    return { error: 'Merci de renseigner le nom de ton atelier, ton WhatsApp et ta ville.' };
  }

  try {
    const supabase = await createClient();

    // Insertion dans la table liste_attente
    const { error } = await supabase.from('liste_attente').insert({
      nom_atelier: nomAtelier,
      whatsapp,
      ville,
      pays,
      source: 'site_vitrine',
      statut: 'en_attente',
    });

    if (error && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.error('Erreur Supabase insertion liste attente:', error);
      return { error: 'Une erreur est survenue lors de ton inscription. Réessaie ou contacte-nous sur WhatsApp.' };
    }
  } catch (err) {
    console.error('Exception waitlist:', err);
  }

  // Redirection vers la page merci avec les paramètres d'atelier pour personnalisation
  const params = new URLSearchParams({
    atelier: nomAtelier,
    ville,
  });

  redirect(`/merci?${params.toString()}`);
}
