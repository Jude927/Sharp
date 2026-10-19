import { ReactNode } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

// Propriétés acceptées par chaque slide du carousel d'onboarding
interface SlideOnboardingProps {
  icone?: keyof typeof Ionicons.glyphMap;
  titre: string;
  texte: string;
  children?: ReactNode;
  estPremier?: boolean;
}

// Composant représentant une diapositive d'introduction pleine largeur
export default function SlideOnboarding({
  icone,
  titre,
  texte,
  children,
  estPremier = false,
}: SlideOnboardingProps) {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ width }}
      className="items-center justify-center px-8"
    >
      {/* Visuel central : Logo pour la première slide ou grand cercle avec icône */}
      <View className="items-center justify-center mb-8 h-44">
        {estPremier ? (
          <Image
            source={require('../../assets/images/icon.png')}
            style={{ width: 140, height: 140, borderRadius: 28 }}
            contentFit="cover"
          />
        ) : (
          icone && (
            <View className="w-40 h-40 rounded-full bg-primaire items-center justify-center shadow-lg elevation-4">
              <Ionicons name={icone} size={72} color="#ffffff" />
            </View>
          )
        )}
      </View>

      {/* Titre principal centré en gras */}
      <Text className="text-2xl font-bold text-texte dark:text-texte-sombre text-center mb-3">
        {titre}
      </Text>

      {/* Texte explicatif centré avec interligne confortable */}
      <Text className="text-base text-secondaire dark:text-secondaire-sombre text-center leading-6 mb-4 max-w-[320px]">
        {texte}
      </Text>

      {/* Éléments interactifs ou personnalisés optionnels (ex: formulaire de la slide 4) */}
      {children && <View className="w-full mt-2 max-w-[320px]">{children}</View>}
    </View>
  );
}
