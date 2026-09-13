/**
 * Moteur de calcul de capacité et anti-surcharge IZITAILLE.
 * Calcule la charge en unités de travail, en tenant compte des jours de repos.
 */

export interface CapaciteResultat {
  pourcentage: number;
  statut: 'vert' | 'orange' | 'rouge';
  chargeEngageeUnites: number;
  capaciteTotaleUnites: number;
  joursOuvrables: number;
  premiereDateRecommandee?: string;
  message: string;
}

export interface CommandeSimple {
  date_promise: string;
  charge_totale_unites: number;
  statut: string;
}

/**
 * Calcule si une date est un jour ouvré selon les jours de repos de l'atelier.
 * 0 = Dimanche, 1 = Lundi, 2 = Mardi, 3 = Mercredi, 4 = Jeudi, 5 = Vendredi, 6 = Samedi.
 */
export function estJourOuvre(date: Date, joursRepos: number[] = [0]): boolean {
  const jourSemaine = date.getDay();
  return !joursRepos.includes(jourSemaine);
}

/**
 * Calcule le nombre de jours ouvrés entre deux dates (incluses).
 */
export function compterJoursOuvres(
  dateDebut: Date,
  dateFin: Date,
  joursRepos: number[] = [0]
): number {
  let count = 0;
  const cur = new Date(dateDebut);
  cur.setHours(0, 0, 0, 0);

  const fin = new Date(dateFin);
  fin.setHours(0, 0, 0, 0);

  while (cur <= fin) {
    if (estJourOuvre(cur, joursRepos)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}

/**
 * Calcule l'évaluation de charge pour une nouvelle commande.
 */
export function evaluerCapacite(
  datePromiseStr: string,
  nouvelleChargeUnites: number,
  commandesExistantes: CommandeSimple[] = [],
  capaciteJournaliere = 8.0,
  joursRepos: number[] = [0]
): CapaciteResultat {
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  const datePromise = new Date(datePromiseStr);
  datePromise.setHours(0, 0, 0, 0);

  // Si la date est dans le passé ou aujourd'hui
  if (datePromise < aujourdhui) {
    return {
      pourcentage: 999,
      statut: 'rouge',
      chargeEngageeUnites: nouvelleChargeUnites,
      capaciteTotaleUnites: 0,
      joursOuvrables: 0,
      premiereDateRecommandee: trouverPremiereDateDisponible(
        nouvelleChargeUnites,
        commandesExistantes,
        capaciteJournaliere,
        joursRepos
      ),
      message: 'La date de livraison promise ne peut pas être dans le passé.',
    };
  }

  const joursOuvrables = compterJoursOuvres(aujourdhui, datePromise, joursRepos);
  const capaciteTotale = Math.max(joursOuvrables * capaciteJournaliere, 1.0);

  // Somme des charges des commandes non terminées promises d'ici cette date
  const chargeCommandesEnCours = commandesExistantes
    .filter((c) => {
      if (c.statut === 'livree' || c.statut === 'payee' || c.statut === 'annulee') {
        return false;
      }
      const cDate = new Date(c.date_promise);
      cDate.setHours(0, 0, 0, 0);
      return cDate <= datePromise;
    })
    .reduce((acc, c) => acc + (Number(c.charge_totale_unites) || 1.0), 0);

  const chargeTotaleEngagee = chargeCommandesEnCours + nouvelleChargeUnites;
  const pourcentage = Math.round((chargeTotaleEngagee / capaciteTotale) * 100);

  if (pourcentage < 80) {
    return {
      pourcentage,
      statut: 'vert',
      chargeEngageeUnites: chargeTotaleEngagee,
      capaciteTotaleUnites: capaciteTotale,
      joursOuvrables,
      message: `Tu peux tenir le ${formaterDateFr(datePromise)}. (${pourcentage}% de charge)`,
    };
  }

  if (pourcentage <= 100) {
    return {
      pourcentage,
      statut: 'orange',
      chargeEngageeUnites: chargeTotaleEngagee,
      capaciteTotaleUnites: capaciteTotale,
      joursOuvrables,
      message: `C'est très juste, ${pourcentage}% de ta capacité d'ici le ${formaterDateFr(datePromise)}.`,
    };
  }

  const dateRecommandee = trouverPremiereDateDisponible(
    nouvelleChargeUnites,
    commandesExistantes,
    capaciteJournaliere,
    joursRepos
  );

  return {
    pourcentage,
    statut: 'rouge',
    chargeEngageeUnites: chargeTotaleEngagee,
    capaciteTotaleUnites: capaciteTotale,
    joursOuvrables,
    premiereDateRecommandee: dateRecommandee,
    message: `Impossible. Surcharge détectée (${pourcentage}%). Première date réaliste : le ${dateRecommandee}.`,
  };
}

/**
 * Recherche la première date où la charge totale sera < 80%.
 */
export function trouverPremiereDateDisponible(
  chargeRequise: number,
  commandesExistantes: CommandeSimple[],
  capaciteJournaliere = 8.0,
  joursRepos: number[] = [0]
): string {
  const testDate = new Date();
  testDate.setHours(0, 0, 0, 0);
  testDate.setDate(testDate.getDate() + 1); // Commencer à demain

  // Parcourir les 60 prochains jours max
  for (let i = 1; i <= 60; i++) {
    const joursOuvres = compterJoursOuvres(new Date(), testDate, joursRepos);
    if (joursOuvres > 0) {
      const cap = joursOuvres * capaciteJournaliere;
      const charge =
        commandesExistantes
          .filter((c) => {
            if (c.statut === 'livree' || c.statut === 'payee' || c.statut === 'annulee') {
              return false;
            }
            const cDate = new Date(c.date_promise);
            cDate.setHours(0, 0, 0, 0);
            return cDate <= testDate;
          })
          .reduce((acc, c) => acc + (Number(c.charge_totale_unites) || 1.0), 0) +
        chargeRequise;

      const pct = (charge / cap) * 100;
      if (pct < 80 && estJourOuvre(testDate, joursRepos)) {
        return formaterDateFr(testDate);
      }
    }
    testDate.setDate(testDate.getDate() + 1);
  }

  return formaterDateFr(testDate);
}

export function formaterDateFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
