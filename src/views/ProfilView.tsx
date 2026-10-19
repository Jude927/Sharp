import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCouleurs } from '@/hooks/useCouleurs';
import { useProfil } from '@/services/ProfilContext';
import { Profil } from '@/types/Profil';
import CameraProfil from '@/components/CameraProfil';
import { choisirDansGalerie } from '@/utils/photoProfil';

// Contenu éditable du profil une fois les données chargées
function FormulaireProfil({
  profil,
  metAJourProfil,
}: {
  profil: Profil;
  metAJourProfil: (partiel: Partial<Profil>) => Promise<void>;
}) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { couleurs, estSombre } = useCouleurs();
  const insets = useSafeAreaInsets();

  const [nom, setNom] = useState(profil.nom);
  const [classe, setClasse] = useState(profil.classe);
  const [ecole, setEcole] = useState(profil.ecole);
  const [messageEnregistre, setMessageEnregistre] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  // Ouverture du menu d'actions pour modifier ou supprimer la photo de profil
  const handleOuvrirMenuPhoto = () => {
    const aUnePhoto = Boolean(profil.photo);
    const options = aUnePhoto
      ? [
          'Prendre une photo',
          'Choisir dans la galerie',
          'Supprimer la photo',
          'Annuler',
        ]
      : ['Prendre une photo', 'Choisir dans la galerie', 'Annuler'];
    const cancelButtonIndex = aUnePhoto ? 3 : 2;
    const destructiveButtonIndex = aUnePhoto ? 2 : undefined;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        userInterfaceStyle: estSombre ? 'dark' : 'light',
      },
      async (selectedIndex) => {
        if (selectedIndex === 0) {
          setCameraVisible(true);
        } else if (selectedIndex === 1) {
          const photo = await choisirDansGalerie();
          if (photo) {
            await metAJourProfil({ photo });
          }
        } else if (aUnePhoto && selectedIndex === 2) {
          await metAJourProfil({ photo: null });
        }
      }
    );
  };

  // Enregistrement des modifications du formulaire avec affichage temporaire de confirmation
  const handleEnregistrer = async () => {
    await metAJourProfil({ nom, classe, ecole });
    setMessageEnregistre(true);
    setTimeout(() => {
      setMessageEnregistre(false);
    }, 2000);
  };

  const styleInput = {
    backgroundColor: couleurs.fond,
    color: couleurs.texte,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-fond dark:bg-fond-sombre"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Zone supérieure avec l'avatar et le badge photo */}
        <View className="items-center my-5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Modifier la photo de profil"
            className="relative w-[120px] h-[120px]"
            onPress={handleOuvrirMenuPhoto}
          >
            {profil.photo ? (
              <Image
                source={{ uri: profil.photo }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                contentFit="cover"
              />
            ) : (
              <View className="w-[120px] h-[120px] rounded-full bg-primaire items-center justify-center">
                <Ionicons name="person" size={60} color="#ffffff" />
              </View>
            )}

            {/* Badge caméra en bas à droite de l'avatar */}
            <View className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primaire border-[3px] border-white dark:border-gray-900 items-center justify-center">
              <Ionicons name="camera" size={18} color="#ffffff" />
            </View>
          </Pressable>
        </View>

        {/* Carte contenant les 3 champs du formulaire */}
        <View
          className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4"
          style={{ elevation: 2 }}
        >
        {/* Champ : Nom */}
        <View className="mb-3.5">
          <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
            Nom
          </Text>
          <TextInput
            style={styleInput}
            placeholder="Votre nom"
            placeholderTextColor={couleurs.texteSecondaire}
            value={nom}
            onChangeText={setNom}
            autoCorrect={false}
          />
        </View>

        {/* Champ : Classe */}
        <View className="mb-3.5">
          <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
            Classe
          </Text>
          <TextInput
            style={styleInput}
            placeholder="Ex: ING 4"
            placeholderTextColor={couleurs.texteSecondaire}
            value={classe}
            onChangeText={setClasse}
            autoCorrect={false}
          />
        </View>

        {/* Champ : École */}
        <View className="mb-3.5">
          <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
            École
          </Text>
          <TextInput
            style={styleInput}
            placeholder="Ex: Polytech"
            placeholderTextColor={couleurs.texteSecondaire}
            value={ecole}
            onChangeText={setEcole}
            autoCorrect={false}
          />
        </View>

        {/* Bouton d'enregistrement */}
        <Pressable
          className="bg-primaire rounded-lg py-3.5 items-center mt-2"
          style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
          onPress={handleEnregistrer}
        >
          <Text className="text-white text-base font-bold">Enregistrer</Text>
        </Pressable>

        {/* Message de confirmation affiché pendant 2 secondes */}
        {messageEnregistre && (
          <Text className="mt-3 text-sm font-semibold text-green-600 dark:text-green-400 text-center">
            Profil enregistré ✓
          </Text>
        )}
      </View>

      {/* Modal de capture par caméra */}
      <CameraProfil
        visible={cameraVisible}
        onCapture={(photoBase64) => metAJourProfil({ photo: photoBase64 })}
        onClose={() => setCameraVisible(false)}
      />
    </ScrollView>
  </KeyboardAvoidingView>
);
}

// Vue affichant et permettant d'éditer le profil utilisateur avec prise de photo
export default function ProfilView() {
  const { profil, chargement, metAJourProfil } = useProfil();
  const { couleurs } = useCouleurs();

  // Affichage d'un indicateur de chargement centré pendant l'accès au stockage
  if (chargement) {
    return (
      <View className="flex-1 items-center justify-center bg-fond dark:bg-fond-sombre">
        <ActivityIndicator size="large" color={couleurs.primaire} />
      </View>
    );
  }

  return (
    <FormulaireProfil
      profil={profil}
      metAJourProfil={metAJourProfil}
    />
  );
}
