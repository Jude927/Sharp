import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tache } from '@/types/Tache';
import tasksData from '@/data/tasks.json';

// Clé unique pour le stockage des tâches dans AsyncStorage
const CLE_STOCKAGE = 'sharp.taches.v1';

// Initialise les tâches par défaut depuis tasks.json avec les propriétés requises
function initialiserTachesParDefaut(): Tache[] {
  return (tasksData as { id: number; nom: string; date: string; assigne: string }[]).map(
    (t) => ({
      ...t,
      terminee: false,
      favori: false,
    })
  );
}

// Charge les tâches depuis AsyncStorage ou renvoie une liste vide au premier lancement
export async function chargerTaches(): Promise<Tache[]> {
  try {
    const donneesBrutes = await AsyncStorage.getItem(CLE_STOCKAGE);
    if (donneesBrutes !== null) {
      const tachesStockees = JSON.parse(donneesBrutes) as Tache[];
      return tachesStockees;
    }
    // Premier lancement : démarrage à vide
    return [];
  } catch (erreur) {
    console.error('Erreur lors du chargement des tâches :', erreur);
    return [];
  }
}

// Sauvegarde la liste des tâches dans AsyncStorage
export async function sauvegarderTaches(taches: Tache[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CLE_STOCKAGE, JSON.stringify(taches));
  } catch (erreur) {
    console.error('Erreur lors de la sauvegarde des tâches :', erreur);
  }
}

// Bascule l'état terminé d'une tâche sans modifier le tableau d'origine
export function basculerTerminee(taches: Tache[], id: number): Tache[] {
  return taches.map((t) => (t.id === id ? { ...t, terminee: !t.terminee } : t));
}

// Bascule l'état favori d'une tâche sans modifier le tableau d'origine
export function basculerFavori(taches: Tache[], id: number): Tache[] {
  return taches.map((t) => (t.id === id ? { ...t, favori: !t.favori } : t));
}

// Supprime une tâche par son identifiant sans modifier le tableau d'origine
export function supprimerTache(taches: Tache[], id: number): Tache[] {
  return taches.filter((t) => t.id !== id);
}

// Ajoute une nouvelle tâche en tête de liste avec un identifiant incrémenté
export function ajouterTache(
  taches: Tache[],
  nouvelleTache: { nom: string; date: string; assigne: string }
): Tache[] {
  const plusGrandId = taches.reduce((max, t) => (t.id > max ? t.id : max), 0);
  const tacheCreee: Tache = {
    id: plusGrandId + 1,
    nom: nouvelleTache.nom,
    date: nouvelleTache.date,
    assigne: nouvelleTache.assigne,
    terminee: false,
    favori: false,
  };
  return [tacheCreee, ...taches];
}

// Modifie les données d'une tâche existante sans altérer le tableau d'origine
export function modifierTache(
  taches: Tache[],
  id: number,
  modifications: { nom: string; date: string; assigne: string }
): Tache[] {
  return taches.map((t) =>
    t.id === id
      ? {
          ...t,
          nom: modifications.nom,
          date: modifications.date,
          assigne: modifications.assigne,
        }
      : t
  );
}

// Structure des statistiques de gestion des tâches
export interface StatistiquesTaches {
  total: number;
  terminees: number;
  aFaire: number;
  enRetard: number;
  duJour: number;
  favoris: number;
  progression: number;
}

// Calcule les statistiques d'avancement des tâches pour une date donnée
export function calculerStatistiques(
  taches: Tache[],
  aujourdhui: string
): StatistiquesTaches {
  const total = taches.length;
  const terminees = taches.filter((t) => t.terminee).length;
  const aFaire = taches.filter((t) => !t.terminee).length;
  const enRetard = taches.filter((t) => !t.terminee && t.date < aujourdhui).length;
  const duJour = taches.filter((t) => !t.terminee && t.date === aujourdhui).length;
  const favoris = taches.filter((t) => t.favori).length;
  const progression = total === 0 ? 0 : Math.round((terminees / total) * 100);

  return {
    total,
    terminees,
    aFaire,
    enRetard,
    duJour,
    favoris,
    progression,
  };
}

// Renvoie les prochaines tâches non terminées à partir d'une date de référence, triées chronologiquement
export function prochainesTaches(
  taches: Tache[],
  aujourdhui: string,
  nombre: number
): Tache[] {
  return taches
    .filter((t) => !t.terminee && t.date >= aujourdhui)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, nombre);
}

// Construit la liste d'exemples depuis tasks.json (terminee false, favori false), la sauvegarde et la renvoie
export async function chargerExemples(): Promise<Tache[]> {
  const exemples = initialiserTachesParDefaut();
  await sauvegarderTaches(exemples);
  return exemples;
}


