// Fonctions utilitaires pour le traitement et la normalisation de chaînes de caractères

// Normalise un texte en minuscules et sans accents (signes diacritiques) pour la recherche
export function normaliser(texte: string): string {
  if (!texte) {
    return '';
  }
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
