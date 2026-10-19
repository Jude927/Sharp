import { Alert, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/services/ThemeContext';
import { useTaches } from '@/services/TachesContext';
import { Theme } from '@/services/themeService';
import { couleurs } from '@/constants/couleurs';

// Options de sélection de thème disponibles
const OPTIONS_THEME: {
  valeur: Theme;
  label: string;
  icone: keyof typeof Ionicons.glyphMap;
}[] = [
  { valeur: 'systeme', label: 'Système', icone: 'phone-portrait-outline' },
  { valeur: 'clair', label: 'Clair', icone: 'sunny-outline' },
  { valeur: 'sombre', label: 'Sombre', icone: 'moon-outline' },
];

// Vue de gestion des préférences utilisateur stylisée avec NativeWind
export default function PreferencesView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, changerTheme } = useTheme();
  const { taches, chargerExemples, supprimerToutes } = useTaches();
  const { colorScheme } = useColorScheme();

  const couleurIcone = colorScheme === 'dark' ? '#f3f4f6' : '#111827';

  // Chargement des exemples avec confirmation si des tâches existent déjà
  const handleChargerExemples = () => {
    if (taches.length > 0) {
      Alert.alert(
        "Charger les tâches d'exemple",
        'Cela remplacera vos tâches actuelles.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Charger',
            onPress: () => {
              chargerExemples();
            },
          },
        ]
      );
    } else {
      chargerExemples();
    }
  };

  // Suppression de toutes les tâches avec confirmation destructive
  const handleSupprimerToutes = () => {
    Alert.alert(
      'Supprimer toutes mes tâches',
      'Êtes-vous sûr de vouloir supprimer toutes vos tâches ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            supprimerToutes();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-fond dark:bg-fond-sombre"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
    >
      {/* Carte des réglages d'apparence */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        {/* En-tête de la carte */}
        <Text className="text-lg font-bold text-texte dark:text-texte-sombre">
          Apparence
        </Text>
        <Text className="text-sm text-secondaire dark:text-secondaire-sombre mt-1 mb-4">
          {"Choisissez l'apparence de Sharp"}
        </Text>

        {/* Lignes de sélection des modes d'affichage */}
        {OPTIONS_THEME.map((option, index) => {
          const estActif = theme === option.valeur;
          const estDernier = index === OPTIONS_THEME.length - 1;

          return (
            <Pressable
              key={option.valeur}
              accessibilityRole="button"
              accessibilityLabel={`Activer le thème ${option.label}`}
              onPress={() => changerTheme(option.valeur)}
              className={`flex-row items-center justify-between py-3.5 ${
                estDernier ? '' : 'border-b border-bordure dark:border-bordure-sombre'
              }`}
            >
              {/* Icône et libellé de l'option */}
              <View className="flex-row items-center">
                <Ionicons
                  name={option.icone}
                  size={22}
                  color={couleurIcone}
                />
                <Text className="text-base font-medium text-texte dark:text-texte-sombre ml-3">
                  {option.label}
                </Text>
              </View>

              {/* Indicateur de coche pour la sélection active */}
              {estActif && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={couleurs.primaire}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Carte de gestion des données */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        <Text className="text-lg font-bold text-texte dark:text-texte-sombre mb-3">
          Mes données
        </Text>

        {/* Ligne pour relancer la présentation */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Revoir la présentation"
          onPress={() => router.push('/onboarding' as any)}
          className="flex-row items-center py-2.5 border-b border-bordure dark:border-bordure-sombre"
        >
          <Ionicons
            name="play-circle-outline"
            size={22}
            color={couleurIcone}
          />
          <Text className="text-base font-medium text-texte dark:text-texte-sombre ml-3">
            Revoir la présentation
          </Text>
        </Pressable>

        {/* Ligne pour charger les tâches d'exemple */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Charger les tâches d'exemple"
          onPress={handleChargerExemples}
          className="flex-row items-center py-2.5 border-b border-bordure dark:border-bordure-sombre"
        >
          <Ionicons name="download-outline" size={22} color={couleurs.primaire} />
          <Text className="text-base font-medium text-primaire ml-3">
            Charger les tâches d&apos;exemple
          </Text>
        </Pressable>

        {/* Ligne pour supprimer toutes les tâches */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Supprimer toutes mes tâches"
          onPress={handleSupprimerToutes}
          className="flex-row items-center py-2.5"
        >
          <Ionicons name="trash-outline" size={22} color={couleurs.danger} />
          <Text className="text-base font-medium text-red-600 dark:text-red-500 ml-3">
            Supprimer toutes mes tâches
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
