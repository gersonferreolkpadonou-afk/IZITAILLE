'use server';

import { redirect } from 'next/navigation';
import {
  createClientDirect,
  createProfilMesure,
  createVersionMesure,
} from '@/lib/services/atelier-service';

export async function creerClientCompletAction(formData: FormData) {
  const nom_complet = (formData.get('nom_complet') as string)?.trim();
  const telephone_whatsapp = (formData.get('telephone_whatsapp') as string)?.trim();
  const ville = (formData.get('ville') as string)?.trim();
  const preferences_remarques = (formData.get('preferences_remarques') as string)?.trim();
  const type_profil = (formData.get('type_profil') as 'homme' | 'femme' | 'enfant') || 'homme';
  const nom_profil = (formData.get('nom_profil') as string)?.trim() || 'Lui-même';

  if (!nom_complet) {
    throw new Error('Le nom du client est obligatoire.');
  }

  // 1. Créer le client
  const client = await createClientDirect({
    nom_complet,
    telephone_whatsapp,
    ville,
    preferences_remarques,
  });

  // 2. Créer son premier profil de mesures
  const profil = await createProfilMesure({
    client_id: client.id,
    nom_profil,
    type_profil,
  });

  // 3. Extraire les mesures saisies
  const mesures: Record<string, number | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith('m_') &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !isNaN(Number(value))
    ) {
      const measureKey = key.replace('m_', '');
      mesures[measureKey] = Number(value);
    }
  }

  // 4. Créer la version initiale (Version 1)
  await createVersionMesure({
    profil_mesure_id: profil.id,
    notes: 'Prise de mesures initiale',
    mesures,
  });

  redirect(`/app/clients/${client.id}`);
}

export async function ajouterVersionMesureAction(formData: FormData) {
  const clientId = formData.get('client_id') as string;
  const profilId = formData.get('profil_id') as string;
  const notes = (formData.get('notes') as string) || 'Nouvelle prise de mesures';

  const mesures: Record<string, number | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith('m_') &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !isNaN(Number(value))
    ) {
      const measureKey = key.replace('m_', '');
      mesures[measureKey] = Number(value);
    }
  }

  await createVersionMesure({
    profil_mesure_id: profilId,
    notes,
    mesures,
  });

  redirect(`/app/clients/${clientId}`);
}
