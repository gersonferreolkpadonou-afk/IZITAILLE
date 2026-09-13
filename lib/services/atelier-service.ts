/**
 * Service Métier IZITAILLE.
 * Gère les interactions avec la base Supabase ou le stockage local pour tous les modules :
 * Clients, Mesures versionnées, Commandes, Photos, Caisse, Capacité.
 */

import {
  Client,
  ProfilMesure,
  VersionMesure,
  Commande,
  ArticleCommande,
  PhotoCommande,
  PhotoType,
  Paiement,
  TypeTenue,
  Utilisateur,
  SuiviCommandePublic,
} from '@/lib/supabase/types';

// Données de démonstration initiales pré-remplies pour tester immédiatement
let DEMO_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    atelier_id: 'ate-001',
    nom_complet: 'Mamadou Konaté',
    telephone_whatsapp: '+2250748921033',
    ville: 'Abidjan (Cocody)',
    photo_url: null,
    preferences_remarques: 'Manches larges toujours, col officier 3cm, pas de fente',
    created_at: '2026-01-14T10:00:00Z',
    updated_at: '2026-01-14T10:00:00Z',
  },
  {
    id: 'cli-002',
    atelier_id: 'ate-001',
    nom_complet: 'Aïssatou Diallo',
    telephone_whatsapp: '+224622112233',
    ville: 'Conakry (Kipé)',
    photo_url: null,
    preferences_remarques: 'Robe longue cintrée avec broderie fine sur le plastron',
    created_at: '2026-02-01T14:30:00Z',
    updated_at: '2026-02-01T14:30:00Z',
  },
  {
    id: 'cli-003',
    atelier_id: 'ate-001',
    nom_complet: 'Cheick Oumar Traoré',
    telephone_whatsapp: '+22370001122',
    ville: 'Bamako',
    photo_url: null,
    preferences_remarques: 'Boubou traditionnel 3 pièces, col rond simple',
    created_at: '2026-02-10T09:15:00Z',
    updated_at: '2026-02-10T09:15:00Z',
  },
];

let DEMO_PROFILS: ProfilMesure[] = [
  {
    id: 'prof-001',
    atelier_id: 'ate-001',
    client_id: 'cli-001',
    nom_profil: 'Lui-même',
    type_profil: 'homme',
    est_defaut: true,
    created_at: '2026-01-14T10:05:00Z',
    updated_at: '2026-01-14T10:05:00Z',
  },
  {
    id: 'prof-002',
    atelier_id: 'ate-001',
    client_id: 'cli-002',
    nom_profil: 'Elle-même',
    type_profil: 'femme',
    est_defaut: true,
    created_at: '2026-02-01T14:35:00Z',
    updated_at: '2026-02-01T14:35:00Z',
  },
];

let DEMO_VERSIONS: VersionMesure[] = [
  {
    id: 'ver-001',
    atelier_id: 'ate-001',
    profil_mesure_id: 'prof-001',
    version_num: 2,
    date_prise: '2026-01-14T10:10:00Z',
    notes: 'Ajustement après prise de poids légère',
    mesures: {
      tour_cou: 41.5,
      carrure_epaules: 48,
      tour_poitrine: 104,
      tour_taille: 92,
      tour_bassin: 106,
      longueur_haut: 85,
      longueur_boubou: 138,
      longueur_manche_longue: 64,
      longueur_manche_courte: 26,
      tour_bras: 36,
      tour_poignet: 19,
      longueur_pantalon: 104,
      hauteur_entrejambe: 78,
      tour_cuisse: 58,
      tour_genou: 42,
      bas_pantalon: 21,
      tour_ceinture: 90,
    },
    created_at: '2026-01-14T10:10:00Z',
  },
  {
    id: 'ver-000',
    atelier_id: 'ate-001',
    profil_mesure_id: 'prof-001',
    version_num: 1,
    date_prise: '2024-03-10T11:00:00Z',
    notes: 'Prise initiale de mesures',
    mesures: {
      tour_cou: 40.5,
      carrure_epaules: 47,
      tour_poitrine: 100,
      tour_taille: 88,
      tour_bassin: 102,
      longueur_haut: 84,
      longueur_boubou: 137,
      longueur_pantalon: 104,
    },
    created_at: '2024-03-10T11:00:00Z',
  },
  {
    id: 'ver-002',
    atelier_id: 'ate-001',
    profil_mesure_id: 'prof-002',
    version_num: 1,
    date_prise: '2026-02-01T14:40:00Z',
    notes: 'Mesures pour ensemble jupe et robe cérémonie',
    mesures: {
      tour_cou: 37,
      longueur_epaule: 12.5,
      carrure_devant: 38,
      carrure_dos: 39,
      tour_poitrine: 96,
      dessous_poitrine: 82,
      hauteur_poitrine: 26,
      tour_taille: 76,
      tour_hanches: 102,
      hauteur_taille_hanches: 20,
      longueur_robe: 140,
      longueur_jupe: 102,
      longueur_manche: 58,
      longueur_pagne: 110,
    },
    created_at: '2026-02-01T14:40:00Z',
  },
];

let DEMO_TYPES_TENUE: TypeTenue[] = [
  { id: 'tt-001', atelier_id: 'ate-001', nom: 'Grand Boubou 3 pièces', cout_unites: 2.5, prix_base: 50000, actif: true, created_at: '', updated_at: '' },
  { id: 'tt-002', atelier_id: 'ate-001', nom: 'Robe Cérémonie / Mariage', cout_unites: 2.0, prix_base: 40000, actif: true, created_at: '', updated_at: '' },
  { id: 'tt-003', atelier_id: 'ate-001', nom: 'Chemise col officier', cout_unites: 1.0, prix_base: 15000, actif: true, created_at: '', updated_at: '' },
  { id: 'tt-004', atelier_id: 'ate-001', nom: 'Pantalon simple', cout_unites: 1.0, prix_base: 12000, actif: true, created_at: '', updated_at: '' },
  { id: 'tt-005', atelier_id: 'ate-001', nom: 'Ensemble Pagne 2 pièces', cout_unites: 1.8, prix_base: 25000, actif: true, created_at: '', updated_at: '' },
];

let DEMO_COMMANDES: Commande[] = [
  {
    id: 'cmd-001',
    atelier_id: 'ate-001',
    code_commande: 'CMD-001',
    client_id: 'cli-001',
    statut: 'en_couture',
    date_commande: '2026-03-01',
    date_promise: '2026-03-18',
    date_livraison_reelle: null,
    couturier_assigne_id: 'usr-002',
    est_urgent: true,
    prix_total: 55000,
    acompte_paye: 30000,
    solde_du: 25000,
    charge_totale_unites: 2.5,
    token_suivi: 'suivi-tok-mamadou-8821',
    notes: 'Bazin riche bleu nuit avec broderie dorée',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'cmd-002',
    atelier_id: 'ate-001',
    code_commande: 'CMD-002',
    client_id: 'cli-002',
    statut: 'prete',
    date_commande: '2026-03-02',
    date_promise: '2026-03-14',
    date_livraison_reelle: null,
    couturier_assigne_id: 'usr-002',
    est_urgent: false,
    prix_total: 40000,
    acompte_paye: 40000,
    solde_du: 0,
    charge_totale_unites: 2.0,
    token_suivi: 'suivi-tok-aissatou-3312',
    notes: 'Tenue finie et repassée, prête pour le retrait',
    created_at: '2026-03-02T11:30:00Z',
    updated_at: '2026-03-10T16:00:00Z',
  },
];

let DEMO_PHOTOS: PhotoCommande[] = [
  {
    id: 'pho-001',
    atelier_id: 'ate-001',
    commande_id: 'cmd-001',
    type_photo: 'modele',
    storage_path: '/images/modele-voulu.jpg',
    url_publique: '/images/modele-voulu.jpg',
    compression_info: { taille_originale_ko: 1420, taille_compressee_ko: 110 },
    created_at: '2026-03-01T10:05:00Z',
  },
  {
    id: 'pho-002',
    atelier_id: 'ate-001',
    commande_id: 'cmd-001',
    type_photo: 'tissu',
    storage_path: '/images/tissu-remis.jpg',
    url_publique: '/images/tissu-remis.jpg',
    compression_info: { taille_originale_ko: 1850, taille_compressee_ko: 125 },
    created_at: '2026-03-01T10:06:00Z',
  },
  {
    id: 'pho-003',
    atelier_id: 'ate-001',
    commande_id: 'cmd-002',
    type_photo: 'modele',
    storage_path: '/images/modele-voulu.jpg',
    url_publique: '/images/modele-voulu.jpg',
    compression_info: { taille_originale_ko: 1200, taille_compressee_ko: 95 },
    created_at: '2026-03-02T11:32:00Z',
  },
  {
    id: 'pho-004',
    atelier_id: 'ate-001',
    commande_id: 'cmd-002',
    type_photo: 'tissu',
    storage_path: '/images/tissu-remis.jpg',
    url_publique: '/images/tissu-remis.jpg',
    compression_info: { taille_originale_ko: 2100, taille_compressee_ko: 140 },
    created_at: '2026-03-02T11:33:00Z',
  },
  {
    id: 'pho-005',
    atelier_id: 'ate-001',
    commande_id: 'cmd-002',
    type_photo: 'tenue_finie',
    storage_path: '/images/tenue-finie.jpg',
    url_publique: '/images/tenue-finie.jpg',
    compression_info: { taille_originale_ko: 1980, taille_compressee_ko: 135 },
    created_at: '2026-03-10T15:45:00Z',
  },
];

let DEMO_PAIEMENTS: Paiement[] = [
  {
    id: 'pai-001',
    atelier_id: 'ate-001',
    commande_id: 'cmd-001',
    montant: 30000,
    moyen_paiement: 'orange_money',
    reference_recu: 'OM-CI-88231',
    notes: 'Acompte à la dépose du tissu',
    enregistre_par: 'usr-001',
    created_at: '2026-03-01T10:15:00Z',
  },
  {
    id: 'pai-002',
    atelier_id: 'ate-001',
    commande_id: 'cmd-002',
    montant: 40000,
    moyen_paiement: 'wave',
    reference_recu: 'WAVE-PAY-9921',
    notes: 'Paiement intégral',
    enregistre_par: 'usr-001',
    created_at: '2026-03-02T11:40:00Z',
  },
];

let DEMO_COUTURIERS: Utilisateur[] = [
  {
    id: 'usr-001',
    atelier_id: 'ate-001',
    role: 'patron',
    nom_complet: 'Maître Ibrahima Diallo',
    telephone: '+2250701020304',
    actif: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: 'usr-002',
    atelier_id: 'ate-001',
    role: 'couturier',
    nom_complet: 'Sékou Camara (Chef coupeur)',
    telephone: '+2250506070809',
    actif: true,
    created_at: '2026-01-05T08:00:00Z',
    updated_at: '2026-01-05T08:00:00Z',
  },
];

// ----------------------------------------------------------------------------
// FONCTIONS SERVICE CLIENTS & MESURES
// ----------------------------------------------------------------------------

export async function getClients(): Promise<Client[]> {
  return [...DEMO_CLIENTS];
}

export async function getClientById(id: string): Promise<Client | null> {
  return DEMO_CLIENTS.find((c) => c.id === id) || null;
}

export async function searchClients(query: string): Promise<Client[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [...DEMO_CLIENTS];
  return DEMO_CLIENTS.filter(
    (c) =>
      c.nom_complet.toLowerCase().includes(q) ||
      (c.telephone_whatsapp && c.telephone_whatsapp.includes(q)) ||
      (c.ville && c.ville.toLowerCase().includes(q))
  );
}

export async function createClientDirect(data: {
  nom_complet: string;
  telephone_whatsapp?: string;
  ville?: string;
  preferences_remarques?: string;
}): Promise<Client> {
  const newClient: Client = {
    id: `cli-${Date.now()}`,
    atelier_id: 'ate-001',
    nom_complet: data.nom_complet,
    telephone_whatsapp: data.telephone_whatsapp || null,
    ville: data.ville || null,
    photo_url: null,
    preferences_remarques: data.preferences_remarques || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_CLIENTS.unshift(newClient);
  return newClient;
}

export async function getProfilsByClientId(clientId: string): Promise<ProfilMesure[]> {
  return DEMO_PROFILS.filter((p) => p.client_id === clientId);
}

export async function createProfilMesure(data: {
  client_id: string;
  nom_profil: string;
  type_profil: 'homme' | 'femme' | 'enfant';
}): Promise<ProfilMesure> {
  const newProfil: ProfilMesure = {
    id: `prof-${Date.now()}`,
    atelier_id: 'ate-001',
    client_id: data.client_id,
    nom_profil: data.nom_profil,
    type_profil: data.type_profil,
    est_defaut: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_PROFILS.push(newProfil);
  return newProfil;
}

export async function getVersionsByProfilId(profilId: string): Promise<VersionMesure[]> {
  return DEMO_VERSIONS.filter((v) => v.profil_mesure_id === profilId).sort(
    (a, b) => b.version_num - a.version_num
  );
}

export async function createVersionMesure(data: {
  profil_mesure_id: string;
  notes?: string;
  mesures: Record<string, number | undefined>;
}): Promise<VersionMesure> {
  const existing = DEMO_VERSIONS.filter((v) => v.profil_mesure_id === data.profil_mesure_id);
  const nextNum = existing.length > 0 ? Math.max(...existing.map((v) => v.version_num)) + 1 : 1;

  const newVersion: VersionMesure = {
    id: `ver-${Date.now()}`,
    atelier_id: 'ate-001',
    profil_mesure_id: data.profil_mesure_id,
    version_num: nextNum,
    date_prise: new Date().toISOString(),
    notes: data.notes || null,
    mesures: data.mesures,
    created_at: new Date().toISOString(),
  };

  DEMO_VERSIONS.unshift(newVersion);
  return newVersion;
}

// ----------------------------------------------------------------------------
// FONCTIONS SERVICE COMMANDES
// ----------------------------------------------------------------------------

export async function getCommandes(): Promise<Commande[]> {
  return [...DEMO_COMMANDES];
}

export async function getCommandeById(id: string): Promise<Commande | null> {
  return DEMO_COMMANDES.find((c) => c.id === id) || null;
}

export async function getCommandesByClientId(clientId: string): Promise<Commande[]> {
  return DEMO_COMMANDES.filter((c) => c.client_id === clientId);
}

export async function getPhotosByCommandeId(commandeId: string): Promise<PhotoCommande[]> {
  return DEMO_PHOTOS.filter((p) => p.commande_id === commandeId);
}

export async function savePhotoCommande(data: {
  commande_id: string;
  type_photo: PhotoType;
  url_publique: string;
  taille_originale_ko?: number;
  taille_compressee_ko?: number;
}): Promise<PhotoCommande> {
  // Remplacer si une photo de ce type existe déjà pour cette commande
  DEMO_PHOTOS = DEMO_PHOTOS.filter(
    (p) => !(p.commande_id === data.commande_id && p.type_photo === data.type_photo)
  );

  const photo: PhotoCommande = {
    id: `pho-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    atelier_id: 'ate-001',
    commande_id: data.commande_id,
    type_photo: data.type_photo,
    storage_path: data.url_publique,
    url_publique: data.url_publique,
    compression_info: data.taille_compressee_ko
      ? {
          taille_originale_ko: data.taille_originale_ko,
          taille_compressee_ko: data.taille_compressee_ko,
        }
      : null,
    created_at: new Date().toISOString(),
  };

  DEMO_PHOTOS.unshift(photo);
  return photo;
}

export async function deletePhotoCommande(
  commandeId: string,
  type_photo: PhotoType
): Promise<void> {
  DEMO_PHOTOS = DEMO_PHOTOS.filter(
    (p) => !(p.commande_id === commandeId && p.type_photo === type_photo)
  );
}

export async function createCommandeDirect(data: {
  client_id: string;
  type_tenue_nom: string;
  date_promise: string;
  prix_total: number;
  acompte: number;
  charge_unites?: number;
  couturier_id?: string;
  notes?: string;
  est_urgent?: boolean;
  photo_modele_url?: string;
  photo_tissu_url?: string;
}): Promise<Commande> {
  const code = `CMD-${String(DEMO_COMMANDES.length + 1).padStart(3, '0')}`;
  const token = `suivi-${Math.random().toString(36).substring(2, 12)}`;

  const newCmd: Commande = {
    id: `cmd-${Date.now()}`,
    atelier_id: 'ate-001',
    code_commande: code,
    client_id: data.client_id,
    statut: 'recue',
    date_commande: new Date().toISOString().split('T')[0],
    date_promise: data.date_promise,
    date_livraison_reelle: null,
    couturier_assigne_id: data.couturier_id || null,
    est_urgent: !!data.est_urgent,
    prix_total: data.prix_total,
    acompte_paye: data.acompte,
    solde_du: Math.max(0, data.prix_total - data.acompte),
    charge_totale_unites: data.charge_unites || 1.5,
    token_suivi: token,
    notes: data.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DEMO_COMMANDES.unshift(newCmd);

  // Photos initiales si prises lors de la création
  if (data.photo_modele_url) {
    DEMO_PHOTOS.unshift({
      id: `pho-${Date.now()}-mod`,
      atelier_id: 'ate-001',
      commande_id: newCmd.id,
      type_photo: 'modele',
      storage_path: data.photo_modele_url,
      url_publique: data.photo_modele_url,
      created_at: new Date().toISOString(),
    });
  }

  if (data.photo_tissu_url) {
    DEMO_PHOTOS.unshift({
      id: `pho-${Date.now()}-tis`,
      atelier_id: 'ate-001',
      commande_id: newCmd.id,
      type_photo: 'tissu',
      storage_path: data.photo_tissu_url,
      url_publique: data.photo_tissu_url,
      created_at: new Date().toISOString(),
    });
  }

  // Si acompte versé, enregistrer le paiement
  if (data.acompte > 0) {
    DEMO_PAIEMENTS.unshift({
      id: `pai-${Date.now()}`,
      atelier_id: 'ate-001',
      commande_id: newCmd.id,
      montant: data.acompte,
      moyen_paiement: 'especes',
      reference_recu: 'Acompte initial',
      notes: 'Versement à la commande',
      enregistre_par: 'usr-001',
      created_at: new Date().toISOString(),
    });
  }

  return newCmd;
}

export async function updateStatutCommande(
  commandeId: string,
  nouveauStatut: Commande['statut']
): Promise<Commande | null> {
  const cmd = DEMO_COMMANDES.find((c) => c.id === commandeId);
  if (!cmd) return null;

  cmd.statut = nouveauStatut;
  cmd.updated_at = new Date().toISOString();
  if (nouveauStatut === 'livree' && !cmd.date_livraison_reelle) {
    cmd.date_livraison_reelle = new Date().toISOString().split('T')[0];
  }

  return cmd;
}

// ----------------------------------------------------------------------------
// FONCTIONS SERVICE PAIEMENTS & CAISSE
// ----------------------------------------------------------------------------

export async function getPaiements(): Promise<Paiement[]> {
  return [...DEMO_PAIEMENTS];
}

export async function enregistrerPaiement(data: {
  commande_id: string;
  montant: number;
  moyen_paiement: Paiement['moyen_paiement'];
  notes?: string;
}): Promise<Paiement> {
  const cmd = DEMO_COMMANDES.find((c) => c.id === data.commande_id);
  if (cmd) {
    cmd.acompte_paye += data.montant;
    cmd.solde_du = Math.max(0, cmd.prix_total - cmd.acompte_paye);
    if (cmd.solde_du === 0 && cmd.statut === 'livree') {
      cmd.statut = 'payee';
    }
  }

  const newPai: Paiement = {
    id: `pai-${Date.now()}`,
    atelier_id: 'ate-001',
    commande_id: data.commande_id,
    montant: data.montant,
    moyen_paiement: data.moyen_paiement,
    reference_recu: `REC-${Date.now().toString().slice(-4)}`,
    notes: data.notes || null,
    enregistre_par: 'usr-001',
    created_at: new Date().toISOString(),
  };

  DEMO_PAIEMENTS.unshift(newPai);
  return newPai;
}

// ----------------------------------------------------------------------------
// SUIVI PUBLIC SÉCURISÉ /suivi/[token]
// ----------------------------------------------------------------------------

export async function getSuiviPublicByToken(token: string): Promise<SuiviCommandePublic | null> {
  const cmd = DEMO_COMMANDES.find((c) => c.token_suivi === token);
  if (!cmd) return null;

  // Récupérer UNIQUEMENT les vraies photos enregistrées pour CETTE commande spécifique
  const photosCmd = DEMO_PHOTOS.filter((p) => p.commande_id === cmd.id);

  return {
    code_commande: cmd.code_commande,
    statut: cmd.statut,
    date_promise: cmd.date_promise,
    est_urgent: cmd.est_urgent,
    nom_atelier: 'Atelier Maître Ibrahima Diallo',
    telephone_atelier: '+225 07 01 02 03 04',
    whatsapp_atelier: '+225 07 01 02 03 04',
    ville_atelier: 'Abidjan (Treichville)',
    articles: [
      {
        nom: cmd.notes || 'Confection sur mesure',
        description: 'Confection artisanale selon vos mesures enregistrées',
        quantite: 1,
      },
    ],
    photos: photosCmd.map((p) => ({
      type_photo: p.type_photo,
      url: p.url_publique,
    })),
  };
}

export async function getCouturiers(): Promise<Utilisateur[]> {
  return [...DEMO_COUTURIERS];
}

export async function getTypesTenue(): Promise<TypeTenue[]> {
  return [...DEMO_TYPES_TENUE];
}
