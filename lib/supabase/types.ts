export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'patron' | 'couturier';

export type ProfilType = 'homme' | 'femme' | 'enfant';

export type CommandeStatut =
  | 'recue'
  | 'coupee'
  | 'en_couture'
  | 'finitions'
  | 'prete'
  | 'livree'
  | 'payee';

export type PhotoType = 'modele' | 'tissu' | 'tenue_finie';

export type MoyenPaiement =
  | 'especes'
  | 'orange_money'
  | 'mtn_money'
  | 'wave'
  | 'moov_money'
  | 'virement'
  | 'autre';

// Profil de mesures HOMME
export interface MesuresHomme {
  tour_cou?: number;
  carrure_epaules?: number;
  tour_poitrine?: number;
  tour_taille?: number;
  tour_bassin?: number;
  longueur_haut?: number;
  longueur_boubou?: number;
  longueur_manche_longue?: number;
  longueur_manche_courte?: number;
  tour_bras?: number;
  tour_poignet?: number;
  longueur_pantalon?: number;
  hauteur_entrejambe?: number;
  tour_cuisse?: number;
  tour_genou?: number;
  bas_pantalon?: number;
  tour_ceinture?: number;
  [key: string]: number | undefined;
}

// Profil de mesures FEMME
export interface MesuresFemme {
  tour_cou?: number;
  longueur_epaule?: number;
  carrure_devant?: number;
  carrure_dos?: number;
  tour_poitrine?: number;
  dessous_poitrine?: number;
  hauteur_poitrine?: number;
  ecart_poitrine?: number;
  tour_taille?: number;
  tour_hanches?: number;
  hauteur_taille_hanches?: number;
  longueur_dos?: number;
  longueur_robe?: number;
  longueur_jupe?: number;
  longueur_manche?: number;
  tour_bras?: number;
  tour_poignet?: number;
  tour_emmanchure?: number;
  longueur_pagne?: number;
  tour_cuisse?: number;
  bas_pantalon?: number;
  [key: string]: number | undefined;
}

// Profil de mesures ENFANT
export interface MesuresEnfant {
  age?: number;
  tour_poitrine?: number;
  tour_taille?: number;
  tour_hanches?: number;
  carrure_epaules?: number;
  longueur_haut?: number;
  longueur_manche?: number;
  longueur_pantalon?: number;
  [key: string]: number | undefined;
}

export type MesuresValeurs = MesuresHomme | MesuresFemme | MesuresEnfant;

export interface Atelier {
  id: string;
  nom: string;
  telephone?: string | null;
  whatsapp?: string | null;
  ville: string;
  pays: string;
  devise: string;
  capacite_journaliere_unites: number;
  jours_repos: number[]; // 0 = Dimanche, 1 = Lundi ...
  created_at: string;
  updated_at: string;
}

export interface Utilisateur {
  id: string;
  atelier_id: string | null;
  role: UserRole;
  nom_complet: string;
  telephone?: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParametreCapacite {
  atelier_id: string;
  seuil_orange: number;
  seuil_rouge: number;
  alerte_surcharge_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  atelier_id: string;
  nom_complet: string;
  telephone_whatsapp?: string | null;
  ville?: string | null;
  photo_url?: string | null;
  preferences_remarques?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfilMesure {
  id: string;
  atelier_id: string;
  client_id: string;
  nom_profil: string;
  type_profil: ProfilType;
  est_defaut: boolean;
  created_at: string;
  updated_at: string;
}

export interface VersionMesure {
  id: string;
  atelier_id: string;
  profil_mesure_id: string;
  version_num: number;
  date_prise: string;
  notes?: string | null;
  mesures: MesuresValeurs;
  created_at: string;
}

export interface TypeTenue {
  id: string;
  atelier_id: string;
  nom: string;
  cout_unites: number;
  prix_base: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Commande {
  id: string;
  atelier_id: string;
  code_commande: string;
  client_id: string;
  statut: CommandeStatut;
  date_commande: string;
  date_promise: string;
  date_livraison_reelle?: string | null;
  couturier_assigne_id?: string | null;
  est_urgent: boolean;
  prix_total: number;
  acompte_paye: number;
  solde_du: number;
  charge_totale_unites: number;
  token_suivi: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleCommande {
  id: string;
  atelier_id: string;
  commande_id: string;
  type_tenue_id?: string | null;
  profil_mesure_id?: string | null;
  version_mesure_id?: string | null;
  description?: string | null;
  quantite: number;
  cout_unitaire_unites: number;
  prix_unitaire: number;
  created_at: string;
}

export interface PhotoCommande {
  id: string;
  atelier_id: string;
  commande_id: string;
  type_photo: PhotoType;
  storage_path: string;
  url_publique?: string | null;
  compression_info?: {
    taille_originale_ko?: number;
    taille_compressee_ko?: number;
  } | null;
  created_at: string;
}

export interface Paiement {
  id: string;
  atelier_id: string;
  commande_id: string;
  montant: number;
  moyen_paiement: MoyenPaiement;
  reference_recu?: string | null;
  notes?: string | null;
  enregistre_par?: string | null;
  created_at: string;
}

export interface ListeAttente {
  id: string;
  nom_atelier: string;
  whatsapp: string;
  ville: string;
  pays?: string | null;
  source: string;
  statut: 'en_attente' | 'contacte' | 'converti';
  created_at: string;
}

export interface JournalSync {
  id: string;
  atelier_id: string;
  client_mutation_id: string;
  entite: string;
  action: 'insert' | 'update' | 'delete';
  donnees: Json;
  cree_hors_ligne_a: string;
  applique_a: string;
}

export interface SuiviCommandePublic {
  code_commande: string;
  statut: CommandeStatut;
  date_promise: string;
  est_urgent: boolean;
  nom_atelier: string;
  telephone_atelier?: string | null;
  whatsapp_atelier?: string | null;
  ville_atelier: string;
  articles: Array<{
    nom: string;
    description?: string | null;
    quantite: number;
  }>;
  photos: Array<{
    type_photo: PhotoType;
    url?: string | null;
  }>;
}
