import { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCouleurs } from '@/hooks/useCouleurs';
import { useTaches } from '@/services/TachesContext';
import { useProfil } from '@/services/ProfilContext';
import { calculerStatistiques, prochainesTaches } from '@/services/tachesService';
import { formaterDate, dateDuJour } from '@/utils/formaterDate';
import ItemView from '@/components/ItemView';
import SkeletonItem from '@/components/SkeletonItem';

// Vue principale de l'écran d'accueil avec indicateurs de progression, statistiques et support du thème
export default function AccueilView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { taches, chargement } = useTaches();
  const { profil } = useProfil();
  const { couleurs } = useCouleurs();

  // Date du jour calculée en heure locale
  const aujourdhui = useMemo(() => dateDuJour(), []);

  // Calcul des statistiques globales sur les tâches
  const stats = useMemo(
    () => calculerStatistiques(taches, aujourdhui),
    [taches, aujourdhui]
  );

  // Récupération des 3 prochaines tâches non terminées à venir
  const prochaines = useMemo(
    () => prochainesTaches(taches, aujourdhui, 3),
    [taches, aujourdhui]
  );

  // Titre personnalisé avec le nom de l'utilisateur si renseigné
  const titreAccueil = profil.nom.trim()
    ? `Bonjour ${profil.nom.trim()} 👋`
    : 'Bonjour 👋';

  // Affichage de 3 squelettes animés pendant le chargement initial
  if (chargement) {
    return (
      <View className="flex-1 bg-fond dark:bg-fond-sombre px-4 pt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonItem key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-fond dark:bg-fond-sombre"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
    >
      {/* En-tête : Titre et date du jour */}
      <View className="mb-5">
        <Text className="text-2xl font-bold text-texte dark:text-texte-sombre">
          {titreAccueil}
        </Text>
        <Text className="text-sm text-secondaire dark:text-secondaire-sombre mt-1">
          {formaterDate(aujourdhui)}
        </Text>
      </View>

      {/* État vide : invitation à créer la première tâche */}
      {taches.length === 0 ? (
        <View
          className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-6 items-center my-4"
          style={{ elevation: 2 }}
        >
          <Ionicons
            name="sparkles-outline"
            size={48}
            color={couleurs.primaire}
          />
          <Text className="text-xl font-bold text-texte dark:text-texte-sombre mt-3 mb-2 text-center">
            Bienvenue ! Créez votre première tâche
          </Text>
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre text-center mb-6 max-w-[280px]">
            Organisez votre quotidien en toute simplicité et suivez votre avancement.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Créer ma première tâche"
            className="bg-primaire rounded-xl py-3 px-6 items-center w-full max-w-[240px]"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            onPress={() => router.navigate('/accueil/taches' as any)}
          >
            <Text className="text-white text-base font-bold">
              Créer une tâche
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Carte d'avancement globale */}
          <View
            className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
            style={{ elevation: 2 }}
          >
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-base font-bold text-texte dark:text-texte-sombre">
                Progression
              </Text>
              <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
                {`${stats.progression} % accompli`}
              </Text>
            </View>

            {/* Barre visuelle de progression */}
            <View className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2.5">
              <View
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${stats.progression}%` }}
              />
            </View>

            <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
              {`${stats.terminees} sur ${stats.total} tâches terminées`}
            </Text>
          </View>

          {/* Grille 2x2 des indicateurs clés */}
          <View className="flex-row flex-wrap gap-3 mb-6">
            {/* Carte : À faire */}
            <View
              className="w-[48%] flex-grow bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 items-center"
              style={{ elevation: 2 }}
            >
              <Ionicons name="time-outline" size={24} color={couleurs.primaire} />
              <Text className="text-2xl font-bold text-texte dark:text-texte-sombre my-1.5">
                {stats.aFaire}
              </Text>
              <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                À faire
              </Text>
            </View>

            {/* Carte : En retard */}
            <View
              className="w-[48%] flex-grow bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 items-center"
              style={{ elevation: 2 }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={couleurs.danger}
              />
              <Text className="text-2xl font-bold text-texte dark:text-texte-sombre my-1.5">
                {stats.enRetard}
              </Text>
              <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                En retard
              </Text>
            </View>

            {/* Carte : Terminées */}
            <View
              className="w-[48%] flex-grow bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 items-center"
              style={{ elevation: 2 }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={couleurs.succes}
              />
              <Text className="text-2xl font-bold text-texte dark:text-texte-sombre my-1.5">
                {stats.terminees}
              </Text>
              <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                Terminées
              </Text>
            </View>

            {/* Carte : Favoris */}
            <View
              className="w-[48%] flex-grow bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 items-center"
              style={{ elevation: 2 }}
            >
              <Ionicons name="star-outline" size={24} color={couleurs.favori} />
              <Text className="text-2xl font-bold text-texte dark:text-texte-sombre my-1.5">
                {stats.favoris}
              </Text>
              <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                Favoris
              </Text>
            </View>
          </View>

          {/* Section des 3 prochaines tâches */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-texte dark:text-texte-sombre mb-3">
              Prochaines échéances
            </Text>

            {prochaines.length === 0 ? (
              <View className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-6 items-center justify-center">
                <Text className="text-sm text-secondaire dark:text-secondaire-sombre">
                  Aucune tâche à venir
                </Text>
              </View>
            ) : (
              prochaines.map((tache) => (
                <ItemView
                  key={tache.id}
                  tache={tache}
                  onPress={() =>
                    router.navigate({
                      pathname: '/accueil/taches/[id]',
                      params: { id: tache.id },
                    })
                  }
                />
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
