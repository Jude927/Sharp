import AsyncStorage from '@react-native-async-storage/async-storage';

// Types de thème pris en charge dans l'application
export type Theme = 'systeme' | 'clair' | 'sombre';

// Clé de persistance du thème dans AsyncStorage
const CLE_STOCKAGE = 'sharp.theme.v1';

// Charge la préférence de thème enregistrée ou retourne 'systeme' par défaut
export async function chargerTheme(): Promise<Theme> {
  try {
    const valeur = await AsyncStorage.getItem(CLE_STOCKAGE);
    if (valeur === 'systeme' || valeur === 'clair' || valeur === 'sombre') {
      return valeur;
    }
    return 'systeme';
  } catch (erreur) {
    console.error('Erreur lors du chargement du thème :', erreur);
    return 'systeme';
  }
}

// Sauvegarde le choix de thème dans AsyncStorage
export async function sauvegarderTheme(theme: Theme): Promise<void> {
  try {
    await AsyncStorage.setItem(CLE_STOCKAGE, theme);
  } catch (erreur) {
    console.error('Erreur lors de la sauvegarde du thème :', erreur);
  }
}
