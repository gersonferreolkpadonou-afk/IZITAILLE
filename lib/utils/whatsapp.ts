/**
 * Générateur de messages WhatsApp pré-rédigés en français pour IZITAILLE.
 * Ouvre directement l'application WhatsApp (wa.me) sans API payante.
 */

export function nettoyerNumeroTelephone(tel: string): string {
  // Supprime les espaces, tirets, parenthèses
  let clean = tel.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+')) {
    clean = clean.substring(1);
  }
  return clean;
}

export function genererLienWhatsApp(numero: string, message: string): string {
  const telClean = nettoyerNumeroTelephone(numero);
  const textEncoded = encodeURIComponent(message);
  return `https://wa.me/${telClean}?text=${textEncoded}`;
}

export function genererMessageCommandePrete(params: {
  nomClient: string;
  nomTenue: string;
  nomAtelier: string;
  soldeRestant: number;
  devise: string;
}): string {
  const { nomClient, nomTenue, nomAtelier, soldeRestant, devise } = params;

  let message = `Bonjour ${nomClient} !\n\nBonne nouvelle : votre tenue (${nomTenue}) est prête et repassée à l'atelier ${nomAtelier}.\n\nVous pouvez passer la récupérer dès aujourd'hui.`;

  if (soldeRestant > 0) {
    message += `\n\nSolde restant à régler : ${soldeRestant.toLocaleString('fr-FR')} ${devise}.`;
  } else {
    message += `\n\nLa commande est entièrement soldée.`;
  }

  message += `\n\nMerci pour votre confiance !\n— ${nomAtelier}`;
  return message;
}

export function genererMessageRappelEcheance(params: {
  nomClient: string;
  nomTenue: string;
  datePromise: string;
  lienSuivi: string;
  nomAtelier: string;
}): string {
  const { nomClient, nomTenue, datePromise, lienSuivi, nomAtelier } = params;

  return `Bonjour ${nomClient},\n\nNous confectionnons actuellement votre tenue (${nomTenue}) à l'atelier ${nomAtelier}.\n\nLa livraison est prévue pour le ${datePromise}.\n\nVous pouvez suivre l'avancée de votre commande en direct ici :\n${lienSuivi}\n\nÀ très bientôt !`;
}

export function genererMessageRelancePaiement(params: {
  nomClient: string;
  codeCommande: string;
  soldeRestant: number;
  devise: string;
  nomAtelier: string;
}): string {
  const { nomClient, codeCommande, soldeRestant, devise, nomAtelier } = params;

  return `Bonjour ${nomClient},\n\nNous vous contactons concernant votre commande ${codeCommande} à l'atelier ${nomAtelier}.\n\nLe solde restant est de ${soldeRestant.toLocaleString('fr-FR')} ${devise}.\n\nMerci de bien vouloir passer à l'atelier ou effectuer le règlement par Mobile Money (Wave, Orange Money ou MTN Money).\n\nBelle journée !`;
}
