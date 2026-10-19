import { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tache } from '@/types/Tache';
import { useCouleurs } from '@/hooks/useCouleurs';
import { useTaches } from '@/services/TachesContext';
import { normaliser } from '@/utils/texte';
import { dateDuJour } from '@/utils/formaterDate';
import ItemView from '@/components/ItemView';
import FormulaireTache from '@/components/FormulaireTache';
import SkeletonItem from '@/components/SkeletonItem';

// Types des filtres de statut disponibles
type FiltreStatut = 'toutes' | 'a_faire' | 'terminees' | 'en_retard';

// Types de tris disponibles
type OptionTri = 'date_asc' | 'date_desc' | 'nom_asc';

// Configuration des pastilles de filtre
const PASTILLES_FILTRES: { id: FiltreStatut; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'a_faire', label: 'À faire' },
  { id: 'terminees', label: 'Terminées' },
  { id: 'en_retard', label: 'En retard' },
];

// Vue principale de la liste des tâches avec recherche normalisée, filtres, tri et états vides distincts
export default function TachesView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { taches, chargement, ajouterTache, chargerExemples } = useTaches();
  const { couleurs, estSombre } = useCouleurs();
  const { showActionSheetWithOptions } = useActionSheet();

  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState<FiltreStatut>('toutes');
  const [tri, setTri] = useState<OptionTri>('date_asc');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const flashListRef = useRef<FlashListRef<Tache>>(null);

  const snapPoints = useMemo(() => ['60%'], []);
  const aujourdhui = useMemo(() => dateDuJour(), []);

  // Composant d'assombrissement d'arrière-plan pour le BottomSheet
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  // Filtrage et tri complet des tâches
  const tachesFiltrees = useMemo(() => {
    let resultat = taches;

    // 1. Filtrage par statut
    if (filtre === 'a_faire') {
      resultat = resultat.filter((t) => !t.terminee);
    } else if (filtre === 'terminees') {
      resultat = resultat.filter((t) => t.terminee);
    } else if (filtre === 'en_retard') {
      resultat = resultat.filter((t) => !t.terminee && t.date < aujourdhui);
    }

    // 2. Recherche insensible à la casse et sans accents
    const texteNettoye = normaliser(recherche.trim());
    if (texteNettoye) {
      resultat = resultat.filter(
        (t) =>
          normaliser(t.nom).includes(texteNettoye) ||
          normaliser(t.assigne).includes(texteNettoye)
      );
    }

    // 3. Tri des tâches
    return [...resultat].sort((a, b) => {
      if (tri === 'date_desc') {
        return b.date.localeCompare(a.date);
      }
      if (tri === 'nom_asc') {
        return a.nom.localeCompare(b.nom);
      }
      // Par défaut : date croissante
      return a.date.localeCompare(b.date);
    });
  }, [taches, filtre, recherche, tri, aujourdhui]);

  // Ouverture du menu d'options de tri
  const handleOuvrirTri = () => {
    const options = [
      'Date croissante',
      'Date décroissante',
      'Nom (A-Z)',
      'Annuler',
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        title: 'Trier les tâches',
        options,
        cancelButtonIndex,
        userInterfaceStyle: estSombre ? 'dark' : 'light',
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          setTri('date_asc');
        } else if (selectedIndex === 1) {
          setTri('date_desc');
        } else if (selectedIndex === 2) {
          setTri('nom_asc');
        }
      }
    );
  };

  // Ouverture de la feuille inférieure pour créer une tâche
  const handleOuvrirBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // Traitement à la soumission du formulaire
  const handleAjouterTache = (donnees: { nom: string; date: string; assigne: string }) => {
    ajouterTache(donnees);
    bottomSheetRef.current?.close();
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Affichage des squelettes pendant le chargement initial
  if (chargement) {
    return (
      <View className="flex-1 bg-fond dark:bg-fond-sombre px-4 pt-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonItem key={`skeleton-${index}`} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fond dark:bg-fond-sombre">
      {/* Zone supérieure : Recherche, filtres horizontaux et compteur/tri */}
      <View className="px-4 pt-3 pb-2">
        {/* Barre de recherche */}
        <View className="flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-lg px-2.5 h-11 border border-bordure dark:border-bordure-sombre">
          <Ionicons
            name="search-outline"
            size={20}
            color={couleurs.texteSecondaire}
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-base text-texte dark:text-texte-sombre h-full"
            style={{ color: couleurs.texte }}
            placeholder="Rechercher une tâche..."
            placeholderTextColor={couleurs.texteSecondaire}
            value={recherche}
            onChangeText={setRecherche}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>

        {/* Rangée horizontale de pastilles de filtrage */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row py-2.5"
          contentContainerStyle={{ gap: 8 }}
        >
          {PASTILLES_FILTRES.map((pastille) => {
            const estActif = filtre === pastille.id;
            return (
              <Pressable
                key={pastille.id}
                accessibilityRole="button"
                accessibilityLabel={`Filtrer par : ${pastille.label}`}
                onPress={() => setFiltre(pastille.id)}
                className={`py-1.5 px-3.5 rounded-full ${
                  estActif
                    ? 'bg-primaire'
                    : 'bg-carte dark:bg-carte-sombre border border-bordure dark:border-bordure-sombre'
                }`}
                style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
              >
                <Text
                  className={`text-xs ${
                    estActif
                      ? 'text-white font-bold'
                      : 'text-texte dark:text-texte-sombre font-medium'
                  }`}
                >
                  {pastille.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Compteur de tâches et bouton de tri */}
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-xs text-secondaire dark:text-secondaire-sombre ml-1">
            {`${tachesFiltrees.length} tâche(s)`}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trier les tâches"
            onPress={handleOuvrirTri}
            className="flex-row items-center gap-1.5 py-1 px-2.5 rounded-lg border border-bordure dark:border-bordure-sombre bg-carte dark:bg-carte-sombre"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
          >
            <Ionicons
              name="swap-vertical-outline"
              size={15}
              color={couleurs.primaire}
            />
            <Text className="text-xs font-semibold text-primaire">Trier</Text>
          </Pressable>
        </View>
      </View>

      {/* Liste des tâches ou affichage de l'état vide adéquat */}
      <FlashList
        ref={flashListRef}
        data={tachesFiltrees}
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
        }}
        ListEmptyComponent={
          taches.length === 0 ? (
            /* État vide A : Aucune tâche dans toute l'application */
            <View className="items-center justify-center py-14 px-6">
              <Ionicons
                name="clipboard-outline"
                size={68}
                color={couleurs.texteSecondaire}
              />
              <Text className="text-lg font-bold text-texte dark:text-texte-sombre mt-4 mb-1.5 text-center">
                Aucune tâche pour l&apos;instant
              </Text>
              <Text className="text-sm text-secondaire dark:text-secondaire-sombre text-center mb-6 max-w-[280px]">
                Ajoutez votre première tâche pour commencer.
              </Text>

              {/* Bouton principal pour ajouter */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ajouter une tâche"
                className="bg-primaire rounded-xl py-3 px-6 mb-3 w-full max-w-[260px] items-center"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
                onPress={handleOuvrirBottomSheet}
              >
                <Text className="text-white text-base font-bold">
                  Ajouter une tâche
                </Text>
              </Pressable>

              {/* Bouton secondaire pour charger des exemples */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Charger des tâches d'exemple"
                className="border border-primaire rounded-xl py-3 px-6 w-full max-w-[260px] items-center"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
                onPress={chargerExemples}
              >
                <Text className="text-primaire text-base font-semibold">
                  Charger des tâches d&apos;exemple
                </Text>
              </Pressable>
            </View>
          ) : (
            /* État vide B : Des tâches existent mais aucune ne correspond à la recherche/au filtre */
            <View className="items-center justify-center py-14">
              <Text className="text-base text-secondaire dark:text-secondaire-sombre text-center">
                Aucune tâche trouvée
              </Text>
            </View>
          )
        }
      />

      {/* Bouton flottant pour ajouter une tâche avec marge basse adaptée aux barres système */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter une tâche"
        className="absolute right-6 w-14 h-14 rounded-full bg-primaire items-center justify-center shadow-lg"
        style={({ pressed }) => [
          { bottom: insets.bottom + 24, elevation: 6 },
          pressed ? { opacity: 0.85, transform: [{ scale: 0.96 }] } : undefined,
        ]}
        onPress={handleOuvrirBottomSheet}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </Pressable>

      {/* Feuille inférieure pour créer une tâche avec gestion de clavier edge-to-edge */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: couleurs.carte }}
        handleIndicatorStyle={{ backgroundColor: couleurs.texteSecondaire }}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <Text className="text-xl font-bold text-texte dark:text-texte-sombre mb-3">
            Nouvelle tâche
          </Text>
          <FormulaireTache onSubmit={handleAjouterTache} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
