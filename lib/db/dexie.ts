import Dexie, { Table } from 'dexie';
import {
  Client,
  ProfilMesure,
  VersionMesure,
  Commande,
  JournalSync,
} from '@/lib/supabase/types';

export interface SyncQueueItem {
  id?: number;
  mutation_id: string;
  entite: 'client' | 'profil' | 'mesure' | 'commande' | 'paiement';
  action: 'insert' | 'update' | 'delete';
  donnees: Record<string, unknown>;
  cree_hors_ligne_a: string;
  statut: 'en_attente' | 'en_cours' | 'synchronise' | 'erreur';
}

export class IzitailleOfflineDb extends Dexie {
  clients!: Table<Client, string>;
  profils!: Table<ProfilMesure, string>;
  versions!: Table<VersionMesure, string>;
  commandes!: Table<Commande, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('izitaille_offline_db');
    this.version(1).stores({
      clients: 'id, atelier_id, nom_complet, telephone_whatsapp, ville',
      profils: 'id, atelier_id, client_id, type_profil',
      versions: 'id, atelier_id, profil_mesure_id, version_num, date_prise',
      commandes: 'id, atelier_id, code_commande, client_id, statut, date_promise',
      syncQueue: '++id, mutation_id, entite, action, statut, cree_hors_ligne_a',
    });
  }
}

export const offlineDb = new IzitailleOfflineDb();
