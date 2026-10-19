import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profil } from '@/types/Profil';

// Clé de stockage pour le profil utilisateur dans AsyncStorage
const CLE_STOCKAGE = 'sharp.profil.v1';

// Valeurs par défaut du profil utilisateur
const PROFIL_PAR_DEFAUT: Profil = {
  nom: '',
  classe: '',
  ecole: '',
  photo: null,
};

// Charge le profil utilisateur depuis AsyncStorage ou renvoie les valeurs par défaut
export async function chargerProfil(): Promise<Profil> {
  try {
    const donnees = await AsyncStorage.getItem(CLE_STOCKAGE);
    if (donnees !== null) {
      return JSON.parse(donnees) as Profil;
    }
    return PROFIL_PAR_DEFAUT;
  } catch (erreur) {
    console.error('Erreur lors du chargement du profil :', erreur);
    return PROFIL_PAR_DEFAUT;
  }
}

// Sauvegarde le profil utilisateur dans AsyncStorage
export async function sauvegarderProfil(profil: Profil): Promise<void> {
  try {
    await AsyncStorage.setItem(CLE_STOCKAGE, JSON.stringify(profil));
  } catch (erreur) {
    console.error('Erreur lors de la sauvegarde du profil :', erreur);
  }
}
