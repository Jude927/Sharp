import { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCouleurs } from '@/hooks/useCouleurs';
import { useTaches } from '@/services/TachesContext';
import ItemView from '@/components/ItemView';

// Vue affichant la liste des tâches marquées comme favorites avec support du thème et gestion de l'état vide
export default function FavorisView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { taches, chargement } = useTaches();
  const { couleurs } = useCouleurs();

  // Filtrage des tâches favorites uniquement
  const favoris = useMemo(() => taches.filter((t) => t.favori), [taches]);

  // Affichage d'un indicateur de chargement pendant la récupération des données
  if (chargement) {
    return (
      <View className="flex-1 items-center justify-center bg-fond dark:bg-fond-sombre">
        <ActivityIndicator size="large" color={couleurs.primaire} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fond dark:bg-fond-sombre">
      <FlashList
        data={favoris}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemView
            tache={item}
            onPress={() =>
              router.navigate({
                pathname: '/accueil/taches/[id]',
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16 px-6">
            <View className="mb-4">
              <Ionicons
                name="star-outline"
                size={64}
                color={couleurs.texteSecondaire}
              />
            </View>
            <Text className="text-lg font-bold text-texte dark:text-texte-sombre mb-2 text-center">
              {"Aucun favori pour l'instant"}
            </Text>
            <Text className="text-sm text-secondaire dark:text-secondaire-sombre text-center mb-6 leading-5">
              {"Ouvrez une tâche et ajoutez-la à vos favoris"}
            </Text>
            <Pressable
              className="bg-primaire rounded-lg py-3 px-6 items-center"
              style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
              onPress={() => router.navigate('/accueil/taches')}
            >
              <Text className="text-white text-base font-semibold">Voir mes tâches</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}
