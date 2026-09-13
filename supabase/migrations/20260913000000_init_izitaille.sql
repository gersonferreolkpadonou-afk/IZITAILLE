-- ============================================================================
-- IZITAILLE - Schéma SQL Complet & Row Level Security (Supabase / PostgreSQL)
-- Migration: 20260913000000_init_izitaille.sql
-- ============================================================================

-- Activer les extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TABLE: ATELIERS
-- ----------------------------------------------------------------------------
create table if not exists public.ateliers (
    id uuid primary key default gen_random_uuid(),
    nom text not null,
    telephone text,
    whatsapp text,
    ville text not null,
    pays text not null default 'Côte d''Ivoire',
    devise text not null default 'XOF', -- XOF, GNF, etc.
    capacite_journaliere_unites numeric(5,2) not null default 8.0, -- Unités de travail par jour
    jours_repos integer[] not null default '{0}', -- 0 = Dimanche, 5 = Vendredi, 6 = Samedi
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. TABLE: UTILISATEURS (Lié à auth.users de Supabase)
-- ----------------------------------------------------------------------------
create table if not exists public.utilisateurs (
    id uuid primary key references auth.users(id) on delete cascade,
    atelier_id uuid references public.ateliers(id) on delete cascade,
    role text not null check (role in ('patron', 'couturier')) default 'couturier',
    nom_complet text not null,
    telephone text,
    actif boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index pour optimiser la recherche d'atelier pour l'utilisateur connecté
create index if not exists idx_utilisateurs_atelier on public.utilisateurs(atelier_id);

-- ----------------------------------------------------------------------------
-- FONCTIONS SÉCURISÉES DE CONTEXTE RLS
-- ----------------------------------------------------------------------------
create or replace function public.get_current_atelier_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select atelier_id from public.utilisateurs where id = auth.uid() limit 1;
$$;

create or replace function public.is_patron()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.utilisateurs
    where id = auth.uid() and role = 'patron' and actif = true
  );
$$;

-- ----------------------------------------------------------------------------
-- 3. TABLE: PARAMETRES_CAPACITE
-- ----------------------------------------------------------------------------
create table if not exists public.parametres_capacite (
    atelier_id uuid primary key references public.ateliers(id) on delete cascade,
    seuil_orange numeric(5,2) not null default 80.0,  -- 80%
    seuil_rouge numeric(5,2) not null default 100.0,  -- 100%
    alerte_surcharge_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. TABLE: CLIENTS
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    nom_complet text not null,
    telephone_whatsapp text,
    ville text,
    photo_url text,
    preferences_remarques text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_clients_atelier on public.clients(atelier_id);
create index if not exists idx_clients_nom on public.clients(nom_complet text_pattern_ops);
create index if not exists idx_clients_telephone on public.clients(telephone_whatsapp);

-- ----------------------------------------------------------------------------
-- 5. TABLE: PROFILS_MESURES (Homme, Femme, Enfant par client)
-- ----------------------------------------------------------------------------
create table if not exists public.profils_mesures (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    client_id uuid not null references public.clients(id) on delete cascade,
    nom_profil text not null, -- ex: "Lui-même", "Épouse", "Fils aîné"
    type_profil text not null check (type_profil in ('homme', 'femme', 'enfant')),
    est_defaut boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_profils_client on public.profils_mesures(client_id);
create index if not exists idx_profils_atelier on public.profils_mesures(atelier_id);

-- ----------------------------------------------------------------------------
-- 6. TABLE: VERSIONS_MESURES (Historique daté inaltérable)
-- ----------------------------------------------------------------------------
create table if not exists public.versions_mesures (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    profil_mesure_id uuid not null references public.profils_mesures(id) on delete cascade,
    version_num integer not null default 1,
    date_prise timestamptz not null default now(),
    notes text,
    mesures jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_versions_profil on public.versions_mesures(profil_mesure_id, version_num desc);
create index if not exists idx_versions_atelier on public.versions_mesures(atelier_id);

-- ----------------------------------------------------------------------------
-- 7. TABLE: TYPES_TENUE (Catalogue de l'atelier & Coût en unités)
-- ----------------------------------------------------------------------------
create table if not exists public.types_tenue (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    nom text not null,
    cout_unites numeric(4,2) not null default 1.0,
    prix_base numeric(12,2) not null default 0,
    actif boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_types_tenue_atelier on public.types_tenue(atelier_id);

-- ----------------------------------------------------------------------------
-- 8. TABLE: COMMANDES
-- ----------------------------------------------------------------------------
create table if not exists public.commandes (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    code_commande text not null, -- ex: CMD-001
    client_id uuid not null references public.clients(id) on delete cascade,
    statut text not null check (statut in ('recue', 'coupee', 'en_couture', 'finitions', 'prete', 'livree', 'payee')) default 'recue',
    date_commande date not null default current_date,
    date_promise date not null,
    date_livraison_reelle date,
    couturier_assigne_id uuid references public.utilisateurs(id) on delete set null,
    est_urgent boolean not null default false,
    prix_total numeric(12,2) not null default 0,
    acompte_paye numeric(12,2) not null default 0,
    solde_du numeric(12,2) generated always as (prix_total - acompte_paye) stored,
    charge_totale_unites numeric(5,2) not null default 1.0,
    token_suivi text not null unique default encode(gen_random_bytes(16), 'hex'),
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_commandes_atelier on public.commandes(atelier_id);
create index if not exists idx_commandes_date_promise on public.commandes(atelier_id, date_promise);
create index if not exists idx_commandes_statut on public.commandes(atelier_id, statut);
create index if not exists idx_commandes_token on public.commandes(token_suivi);

-- ----------------------------------------------------------------------------
-- 9. TABLE: ARTICLES_COMMANDE
-- ----------------------------------------------------------------------------
create table if not exists public.articles_commande (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    commande_id uuid not null references public.commandes(id) on delete cascade,
    type_tenue_id uuid references public.types_tenue(id) on delete set null,
    profil_mesure_id uuid references public.profils_mesures(id) on delete set null,
    version_mesure_id uuid references public.versions_mesures(id) on delete set null,
    description text,
    quantite integer not null default 1,
    cout_unitaire_unites numeric(4,2) not null default 1.0,
    prix_unitaire numeric(12,2) not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_articles_commande on public.articles_commande(commande_id);
create index if not exists idx_articles_atelier on public.articles_commande(atelier_id);

-- ----------------------------------------------------------------------------
-- 10. TABLE: PHOTOS_COMMANDE (3 photos : modèle, tissu, tenue_finie)
-- ----------------------------------------------------------------------------
create table if not exists public.photos_commande (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    commande_id uuid not null references public.commandes(id) on delete cascade,
    type_photo text not null check (type_photo in ('modele', 'tissu', 'tenue_finie')),
    storage_path text not null,
    url_publique text,
    compression_info jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_photos_commande on public.photos_commande(commande_id, type_photo);
create index if not exists idx_photos_atelier on public.photos_commande(atelier_id);

-- ----------------------------------------------------------------------------
-- 11. TABLE: PAIEMENTS
-- ----------------------------------------------------------------------------
create table if not exists public.paiements (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    commande_id uuid not null references public.commandes(id) on delete cascade,
    montant numeric(12,2) not null check (montant > 0),
    moyen_paiement text not null check (moyen_paiement in ('especes', 'orange_money', 'mtn_money', 'wave', 'moov_money', 'virement', 'autre')) default 'especes',
    reference_recu text,
    notes text,
    enregistre_par uuid references public.utilisateurs(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_paiements_commande on public.paiements(commande_id);
create index if not exists idx_paiements_atelier on public.paiements(atelier_id);

-- ----------------------------------------------------------------------------
-- 12. TABLE: LISTE_ATTENTE (Site Vitrine)
-- ----------------------------------------------------------------------------
create table if not exists public.liste_attente (
    id uuid primary key default gen_random_uuid(),
    nom_atelier text not null,
    whatsapp text not null,
    ville text not null,
    pays text,
    source text default 'site_web',
    statut text not null default 'en_attente' check (statut in ('en_attente', 'contacte', 'converti')),
    created_at timestamptz not null default now()
);

create index if not exists idx_liste_attente_whatsapp on public.liste_attente(whatsapp);

-- ----------------------------------------------------------------------------
-- 13. TABLE: JOURNAL_SYNCHRONISATION (Dexie / Offline-First Queue)
-- ----------------------------------------------------------------------------
create table if not exists public.journal_synchronisation (
    id uuid primary key default gen_random_uuid(),
    atelier_id uuid not null references public.ateliers(id) on delete cascade,
    client_mutation_id text not null,
    entite text not null,
    action text not null check (action in ('insert', 'update', 'delete')),
    donnees jsonb not null,
    cree_hors_ligne_a timestamptz not null,
    applique_a timestamptz not null default now()
);

create index if not exists idx_journal_sync on public.journal_synchronisation(atelier_id, applique_a desc);

-- ----------------------------------------------------------------------------
-- TRIGGERS DE MISE À JOUR (updated_at automatique)
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trigger_set_updated_at_ateliers on public.ateliers;
create trigger trigger_set_updated_at_ateliers
before update on public.ateliers
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_utilisateurs on public.utilisateurs;
create trigger trigger_set_updated_at_utilisateurs
before update on public.utilisateurs
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_parametres on public.parametres_capacite;
create trigger trigger_set_updated_at_parametres
before update on public.parametres_capacite
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_clients on public.clients;
create trigger trigger_set_updated_at_clients
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_profils on public.profils_mesures;
create trigger trigger_set_updated_at_profils
before update on public.profils_mesures
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_types_tenue on public.types_tenue;
create trigger trigger_set_updated_at_types_tenue
before update on public.types_tenue
for each row execute function public.set_updated_at();

drop trigger if exists trigger_set_updated_at_commandes on public.commandes;
create trigger trigger_set_updated_at_commandes
before update on public.commandes
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- ACTIVATION ET POLITIQUES ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
alter table public.ateliers enable row level security;
alter table public.utilisateurs enable row level security;
alter table public.parametres_capacite enable row level security;
alter table public.clients enable row level security;
alter table public.profils_mesures enable row level security;
alter table public.versions_mesures enable row level security;
alter table public.types_tenue enable row level security;
alter table public.commandes enable row level security;
alter table public.articles_commande enable row level security;
alter table public.photos_commande enable row level security;
alter table public.paiements enable row level security;
alter table public.journal_synchronisation enable row level security;
alter table public.liste_attente enable row level security;

-- Politiques ATELIERS
drop policy if exists "Les membres peuvent voir leur propre atelier" on public.ateliers;
create policy "Les membres peuvent voir leur propre atelier"
  on public.ateliers for select
  using (id = public.get_current_atelier_id());

drop policy if exists "Seul le patron peut modifier son atelier" on public.ateliers;
create policy "Seul le patron peut modifier son atelier"
  on public.ateliers for update
  using (id = public.get_current_atelier_id() and public.is_patron());

drop policy if exists "Un utilisateur authentifié peut créer un atelier" on public.ateliers;
create policy "Un utilisateur authentifié peut créer un atelier"
  on public.ateliers for insert
  to authenticated
  with check (true);

-- Politiques UTILISATEURS
drop policy if exists "Voir les collaborateurs de son atelier" on public.utilisateurs;
create policy "Voir les collaborateurs de son atelier"
  on public.utilisateurs for select
  using (atelier_id = public.get_current_atelier_id() or id = auth.uid());

drop policy if exists "L'utilisateur peut éditer son profil" on public.utilisateurs;
create policy "L'utilisateur peut éditer son profil"
  on public.utilisateurs for update
  using (id = auth.uid());

drop policy if exists "Insertion du profil utilisateur" on public.utilisateurs;
create policy "Insertion du profil utilisateur"
  on public.utilisateurs for insert
  to authenticated
  with check (id = auth.uid());

-- Politiques isolées par atelier pour toutes les entités métier
drop policy if exists "Atelier isolation: clients" on public.clients;
create policy "Atelier isolation: clients" on public.clients
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: profils_mesures" on public.profils_mesures;
create policy "Atelier isolation: profils_mesures" on public.profils_mesures
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: versions_mesures" on public.versions_mesures;
create policy "Atelier isolation: versions_mesures" on public.versions_mesures
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: types_tenue" on public.types_tenue;
create policy "Atelier isolation: types_tenue" on public.types_tenue
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: commandes" on public.commandes;
create policy "Atelier isolation: commandes" on public.commandes
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: articles_commande" on public.articles_commande;
create policy "Atelier isolation: articles_commande" on public.articles_commande
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: photos_commande" on public.photos_commande;
create policy "Atelier isolation: photos_commande" on public.photos_commande
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: paiements" on public.paiements;
create policy "Atelier isolation: paiements" on public.paiements
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: parametres_capacite" on public.parametres_capacite;
create policy "Atelier isolation: parametres_capacite" on public.parametres_capacite
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

drop policy if exists "Atelier isolation: journal_synchronisation" on public.journal_synchronisation;
create policy "Atelier isolation: journal_synchronisation" on public.journal_synchronisation
  for all using (atelier_id = public.get_current_atelier_id())
  with check (atelier_id = public.get_current_atelier_id());

-- Politiques LISTE_ATTENTE (Visiteurs anonymes)
drop policy if exists "Insertion publique liste attente" on public.liste_attente;
create policy "Insertion publique liste attente"
  on public.liste_attente for insert
  to anon, authenticated
  with check (true);

-- ----------------------------------------------------------------------------
-- FONCTIONS RPC PUBLIQUES SÉCURISÉES
-- ----------------------------------------------------------------------------

-- 1. Compteur public de la liste d'attente
create or replace function public.get_liste_attente_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer from public.liste_attente;
$$;

-- 2. Suivi public de commande /suivi/[token]
create or replace function public.get_suivi_commande(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  select json_build_object(
    'code_commande', c.code_commande,
    'statut', c.statut,
    'date_promise', c.date_promise,
    'est_urgent', c.est_urgent,
    'nom_atelier', a.nom,
    'telephone_atelier', a.telephone,
    'whatsapp_atelier', a.whatsapp,
    'ville_atelier', a.ville,
    'articles', (
      select coalesce(json_agg(json_build_object(
        'nom', coalesce(tt.nom, 'Confection'),
        'description', ac.description,
        'quantite', ac.quantite
      )), '[]'::json)
      from public.articles_commande ac
      left join public.types_tenue tt on tt.id = ac.type_tenue_id
      where ac.commande_id = c.id
    ),
    'photos', (
      select coalesce(json_agg(json_build_object(
        'type_photo', pc.type_photo,
        'url', pc.url_publique
      )), '[]'::json)
      from public.photos_commande pc
      where pc.commande_id = c.id
    )
  ) into v_result
  from public.commandes c
  join public.ateliers a on a.id = c.atelier_id
  where c.token_suivi = p_token;

  return v_result;
end;
$$;
