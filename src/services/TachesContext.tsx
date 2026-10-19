import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Tache } from '@/types/Tache';
import {
  chargerTaches,
  sauvegarderTaches,
  basculerTerminee as basculerTermineeService,
  basculerFavori as basculerFavoriService,
  supprimerTache as supprimerTacheService,
  ajouterTache as ajouterTacheService,
  modifierTache as modifierTacheService,
  chargerExemples as chargerExemplesService,
} from './tachesService';

// Interface décrivant les données et actions fournies par le contexte des tâches
interface TachesContextType {
  taches: Tache[];
  chargement: boolean;
  basculerTerminee: (id: number) => void;
  basculerFavori: (id: number) => void;
  supprimerTache: (id: number) => void;
  ajouterTache: (nouvelleTache: { nom: string; date: string; assigne: string }) => void;
  modifierTache: (id: number, modifications: { nom: string; date: string; assigne: string }) => void;
  chargerExemples: () => Promise<void>;
  supprimerToutes: () => Promise<void>;
  getTacheParId: (id: number) => Tache | undefined;
}

// Contexte React pour partager l'état des tâches dans toute l'application
const TachesContext = createContext<TachesContextType | undefined>(undefined);

// Fournisseur de contexte pour initialiser et synchroniser les tâches
export function TachesProvider({ children }: { children: ReactNode }) {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);

  // Chargement initial des tâches au montage du composant
  useEffect(() => {
    async function initialiser() {
      const donnees = await chargerTaches();
      setTaches(donnees);
      setChargement(false);
    }
    initialiser();
  }, []);

  // Sauvegarde des tâches à chaque modification, uniquement après le chargement initial
  useEffect(() => {
    if (!chargement) {
      sauvegarderTaches(taches);
    }
  }, [taches, chargement]);

  // Action pour basculer l'état terminé
  const basculerTerminee = useCallback((id: number) => {
    setTaches((prev) => basculerTermineeService(prev, id));
  }, []);

  // Action pour basculer l'état favori
  const basculerFavori = useCallback((id: number) => {
    setTaches((prev) => basculerFavoriService(prev, id));
  }, []);

  // Action pour supprimer une tâche
  const supprimerTache = useCallback((id: number) => {
    setTaches((prev) => supprimerTacheService(prev, id));
  }, []);

  // Action pour ajouter une nouvelle tâche
  const ajouterTache = useCallback(
    (nouvelleTache: { nom: string; date: string; assigne: string }) => {
      setTaches((prev) => ajouterTacheService(prev, nouvelleTache));
    },
    []
  );

  // Action pour modifier une tâche existante
  const modifierTache = useCallback(
    (id: number, modifications: { nom: string; date: string; assigne: string }) => {
      setTaches((prev) => modifierTacheService(prev, id, modifications));
    },
    []
  );

  // Action pour charger les exemples de tâches depuis tasks.json
  const chargerExemples = useCallback(async () => {
    const exemples = await chargerExemplesService();
    setTaches(exemples);
  }, []);

  // Action pour supprimer toutes les tâches et vider le stockage
  const supprimerToutes = useCallback(async () => {
    await sauvegarderTaches([]);
    setTaches([]);
  }, []);

  // Recherche d'une tâche par son identifiant
  const getTacheParId = useCallback(
    (id: number): Tache | undefined => {
      return taches.find((t) => t.id === id);
    },
    [taches]
  );

  return (
    <TachesContext.Provider
      value={{
        taches,
        chargement,
        basculerTerminee,
        basculerFavori,
        supprimerTache,
        ajouterTache,
        modifierTache,
        chargerExemples,
        supprimerToutes,
        getTacheParId,
      }}
    >
      {children}
    </TachesContext.Provider>
  );
}

// Hook personnalisé pour consommer les données et actions du contexte des tâches
export function useTaches(): TachesContextType {
  const contexte = useContext(TachesContext);
  if (!contexte) {
    throw new Error('useTaches doit être utilisé à l\'intérieur d\'un TachesProvider');
  }
  return contexte;
}

export default TachesContext;
