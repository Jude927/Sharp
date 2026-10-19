// Tableau des 12 mois abrégés en français
const moisAbreges = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

// Transformation d'une date YYYY-MM-DD en format court (ex: 1 oct. 2026)
export function formaterDate(date: string): string {
  if (!date) {
    return '';
  }

  const parties = date.split('-');
  if (parties.length !== 3) {
    return date;
  }

  const annee = parties[0];
  const moisIndex = parseInt(parties[1], 10) - 1;
  const jour = parseInt(parties[2], 10);

  if (moisIndex >= 0 && moisIndex < 12 && !isNaN(jour)) {
    return `${jour} ${moisAbreges[moisIndex]} ${annee}`;
  }

  return date;
}

// Calcule la date du jour au format AAAA-MM-JJ en heure locale
export function dateDuJour(): string {
  const d = new Date();
  const annee = d.getFullYear();
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

export default formaterDate;
