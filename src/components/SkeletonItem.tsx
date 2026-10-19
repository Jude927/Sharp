import { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';

// Composant squelette de chargement reprenant la forme d'un ItemView avec pulsation d'opacité
export default function SkeletonItem() {
  const [opacite] = useState(() => new Animated.Value(0.4));

  // Animation en boucle de pulsation de l'opacité (useNativeDriver: true)
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacite, {
          toValue: 0.9,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacite, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacite]);

  return (
    <Animated.View
      style={{ opacity: opacite }}
      className="flex-row items-center bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-3 mb-2.5"
    >
      {/* Pastille ronde grise simulant l'icône */}
      <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 mr-3" />

      {/* Barres grises simulant le titre et la date */}
      <View className="flex-1 mr-2">
        <View className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <View className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
      </View>

      {/* Espace simulant le chevron */}
      <View className="w-3 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm opacity-50" />
    </Animated.View>
  );
}
