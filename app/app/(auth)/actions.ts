'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const identifiant = formData.get('identifiant') as string;
  const password = formData.get('password') as string;

  if (!identifiant || !password) {
    return { error: 'Veuillez renseigner votre identifiant et votre mot de passe.' };
  }

  // Vérifier si l'identifiant est un email ou un numéro
  const email = identifiant.includes('@')
    ? identifiant.trim()
    : `${identifiant.trim().replace(/[^0-9+]/g, '')}@izitaille.app`;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Si Supabase n'est pas configuré en dev local, on informe clairement l'utilisateur
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return {
        error:
          'Supabase n’est pas encore connecté avec de vraies clés API. Configurez vos clés dans .env.local.',
      };
    }
    return { error: 'Identifiant ou mot de passe incorrect.' };
  }

  redirect('/app');
}

export async function signupAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const nomAtelier = formData.get('nomAtelier') as string;
  const ville = formData.get('ville') as string;
  const pays = (formData.get('pays') as string) || "Côte d'Ivoire";
  const whatsapp = formData.get('whatsapp') as string;
  const nomPatron = formData.get('nomPatron') as string;
  const identifiant = formData.get('identifiant') as string;
  const password = formData.get('password') as string;

  if (!nomAtelier || !ville || !whatsapp || !nomPatron || !identifiant || !password) {
    return { error: 'Tous les champs obligatoires doivent être remplis.' };
  }

  const email = identifiant.includes('@')
    ? identifiant.trim()
    : `${identifiant.trim().replace(/[^0-9+]/g, '')}@izitaille.app`;

  const supabase = await createClient();

  // Création du compte Auth Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nom_complet: nomPatron,
        nom_atelier: nomAtelier,
        telephone: whatsapp,
      },
    },
  });

  if (authError) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return {
        error:
          'Supabase n’est pas encore connecté avec de vraies clés API. Configurez vos clés dans .env.local.',
      };
    }
    return { error: authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { error: 'Erreur lors de la création du compte. Veuillez réessayer.' };
  }

  // Création de l'atelier dans la table public.ateliers
  const { data: atelierData, error: atelierError } = await supabase
    .from('ateliers')
    .insert({
      nom: nomAtelier,
      ville,
      pays,
      whatsapp,
      telephone: whatsapp,
    })
    .select('id')
    .single();

  if (atelierError || !atelierData) {
    // Si l'insertion a échoué mais qu'on est en dev
    console.error("Erreur insertion atelier:", atelierError);
  } else {
    // Lier l'utilisateur à son atelier avec le rôle patron
    await supabase.from('utilisateurs').insert({
      id: userId,
      atelier_id: atelierData.id,
      role: 'patron',
      nom_complet: nomPatron,
      telephone: whatsapp,
      actif: true,
    });
  }

  redirect('/app');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/app/connexion');
}
