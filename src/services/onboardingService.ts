import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé unique pour le stockage de l'état d'onboarding dans AsyncStorage
const CLE_STOCKAGE = 'sharp.onboarding.v1';

// Vérifie si l'onboarding a déjà été visualisé par l'utilisateur
export async function onboardingVu(): Promise<boolean> {
  try {
    const valeur = await AsyncStorage.getItem(CLE_STOCKAGE);
    return valeur === 'true';
  } catch (erreur) {
    console.error("Erreur lors de la vérification de l'onboarding :", erreur);
    return false;
  }
}

// Marque l'onboarding comme visualisé dans AsyncStorage
export async function marquerOnboardingVu(): Promise<void> {
  try {
    await AsyncStorage.setItem(CLE_STOCKAGE, 'true');
  } catch (erreur) {
    console.error("Erreur lors de la sauvegarde de l'état d'onboarding :", erreur);
  }
}
