import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { onboardingVu } from '@/services/onboardingService';
import { useCouleurs } from '@/hooks/useCouleurs';

// Point d'entrée principal qui redirige vers l'onboarding ou l'accueil selon l'état enregistré
export default function Index() {
  const [estVu, setEstVu] = useState<boolean | null>(null);
  const { couleurs } = useCouleurs();

  // Lecture de l'état de l'onboarding au montage du composant
  useEffect(() => {
    async function verifierOnboarding() {
      const vu = await onboardingVu();
      setEstVu(vu);
    }
    verifierOnboarding();
  }, []);

  // Affichage d'un indicateur de chargement pendant la lecture dans AsyncStorage
  if (estVu === null) {
    return (
      <View className="flex-1 items-center justify-center bg-fond dark:bg-fond-sombre">
        <ActivityIndicator size="large" color={couleurs.primaire} />
      </View>
    );
  }

  // Redirection selon le statut de visionnage
  return estVu ? (
    <Redirect href="/accueil" />
  ) : (
    <Redirect href={'/onboarding' as any} />
  );
}
