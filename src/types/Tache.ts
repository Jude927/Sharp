// Définition du type Tache pour l'application Sharp
export interface Tache {
  id: number;
  nom: string;
  date: string;
  assigne: string;
  terminee?: boolean;
  favori?: boolean;
}
