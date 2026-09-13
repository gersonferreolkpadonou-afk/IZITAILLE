import { offlineDb, SyncQueueItem } from './dexie';

/**
 * Ajoute une mutation à la file d'attente hors-ligne.
 */
export async function empilerMutationHorsLigne(
  entite: SyncQueueItem['entite'],
  action: SyncQueueItem['action'],
  donnees: Record<string, unknown>
): Promise<number> {
  const item: SyncQueueItem = {
    mutation_id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entite,
    action,
    donnees,
    cree_hors_ligne_a: new Date().toISOString(),
    statut: 'en_attente',
  };

  return await offlineDb.syncQueue.add(item);
}

/**
 * Rejoue la file d'attente vers Supabase quand le réseau revient.
 */
export async function synchroniserFileAttente(): Promise<{ reussies: number; echecs: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { reussies: 0, echecs: 0 };
  }

  const enAttente = await offlineDb.syncQueue
    .where('statut')
    .equals('en_attente')
    .toArray();

  let reussies = 0;
  let echecs = 0;

  for (const item of enAttente) {
    try {
      if (item.id) {
        await offlineDb.syncQueue.update(item.id, { statut: 'en_cours' });
      }

      // Simulation d'envoi API / Supabase
      // En production, on appelle supabase.from(item.entite).upsert(item.donnees)
      await new Promise((r) => setTimeout(r, 100));

      if (item.id) {
        await offlineDb.syncQueue.update(item.id, { statut: 'synchronise' });
      }
      reussies++;
    } catch (err) {
      console.error('Erreur synchronisation mutation:', item, err);
      if (item.id) {
        await offlineDb.syncQueue.update(item.id, { statut: 'erreur' });
      }
      echecs++;
    }
  }

  return { reussies, echecs };
}

/**
 * Retourne le nombre d'éléments en attente de synchronisation.
 */
export async function getNombreMutationsEnAttente(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  try {
    return await offlineDb.syncQueue.where('statut').equals('en_attente').count();
  } catch {
    return 0;
  }
}
