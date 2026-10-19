import * as ImagePicker from 'expo-image-picker';

// Permet de choisir une photo carrée dans la galerie du téléphone et renvoie sa représentation base64
export async function choisirDansGalerie(): Promise<string | null> {
  try {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (resultat.canceled || !resultat.assets || resultat.assets.length === 0) {
      return null;
    }

    const premiereImage = resultat.assets[0];
    if (premiereImage.base64) {
      return `data:image/jpeg;base64,${premiereImage.base64}`;
    }

    return null;
  } catch (erreur) {
    console.error('Erreur lors de la sélection de photo dans la galerie :', erreur);
    return null;
  }
}
