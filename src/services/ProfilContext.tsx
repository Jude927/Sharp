import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Profil } from '@/types/Profil';
import { chargerProfil, sauvegarderProfil } from '@/services/profilService';

// Définition de l'interface du contexte du profil utilisateur
interface ProfilContextType {
  profil: Profil;
  chargement: boolean;
  metAJourProfil: (partiel: Partial<Profil>) => Promise<void>;
}

// Création du contexte React pour le profil
const ProfilContext = createContext<ProfilContextType | undefined>(undefined);

// Fournisseur de contexte pour l'état et la persistance du profil
export function ProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<Profil>({
    nom: '',
    classe: '',
    ecole: '',
    photo: null,
  });
  const [chargement, setChargement] = useState(true);

  // Chargement asynchrone des données de profil stockées au montage
  useEffect(() => {
    let actif = true;
    async function initialiser() {
      const donnees = await chargerProfil();
      if (actif) {
        setProfil(donnees);
        setChargement(false);
      }
    }
    initialiser();
    return () => {
      actif = false;
    };
  }, []);

  // Met à jour les champs partiels, met à jour l'état et sauvegarde dans AsyncStorage
  const metAJourProfil = async (partiel: Partial<Profil>) => {
    const profilMisAJour = { ...profil, ...partiel };
    setProfil(profilMisAJour);
    await sauvegarderProfil(profilMisAJour);
  };

  return (
    <ProfilContext.Provider value={{ profil, chargement, metAJourProfil }}>
      {children}
    </ProfilContext.Provider>
  );
}

// Hook personnalisé permettant d'accéder au profil dans toute l'application
export function useProfil(): ProfilContextType {
  const context = useContext(ProfilContext);
  if (!context) {
    throw new Error('useProfil doit être utilisé à l\'intérieur d\'un ProfilProvider');
  }
  return context;
}
