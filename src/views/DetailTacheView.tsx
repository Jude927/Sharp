import { useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTaches } from '@/services/TachesContext';
import { useCouleurs } from '@/hooks/useCouleurs';
import { formaterDate } from '@/utils/formaterDate';
import FormulaireTache from '@/components/FormulaireTache';

// Vue affichant les détails complets d'une tâche, le menu d'actions et l'édition via BottomSheet
export default function DetailTacheView() {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNombre = id ? parseInt(id, 10) : NaN;

  const { couleurs, estSombre } = useCouleurs();

  // Récupération des méthodes et de la tâche depuis le contexte global
  const {
    getTacheParId,
    basculerTerminee,
    basculerFavori,
    supprimerTache,
    modifierTache,
  } = useTaches();
  const tache = isNaN(idNombre) ? undefined : getTacheParId(idNombre);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);

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

  // Affichage d'un message si la tâche demandée n'existe pas
  if (!tache) {
    return (
      <View className="flex-1 bg-fond dark:bg-fond-sombre items-center justify-center p-4">
        <Text className="text-lg font-medium text-secondaire dark:text-secondaire-sombre">
          Tâche introuvable
        </Text>
      </View>
    );
  }

  // Ouverture du menu d'actions ActionSheet
  const handleOuvrirActions = () => {
    const options = [
      'Modifier',
      tache.terminee ? 'Rouvrir la tâche' : 'Marquer comme terminée',
      tache.favori ? 'Retirer des favoris' : 'Ajouter aux favoris',
      'Partager',
      'Supprimer',
      'Annuler',
    ];
    const cancelButtonIndex = 5;
    const destructiveButtonIndex = 4;

    showActionSheetWithOptions(
      {
        title: tache.nom,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        userInterfaceStyle: estSombre ? 'dark' : 'light',
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // Ouvre la feuille d'édition pré-remplie
            bottomSheetRef.current?.expand();
            break;
          case 1:
            basculerTerminee(tache.id);
            break;
          case 2:
            basculerFavori(tache.id);
            break;
          case 3:
            try {
              await Share.share({
                message: `Tâche : ${tache.nom}\nDate : ${formaterDate(tache.date)}\nAssignée à : ${tache.assigne}\nPartagé depuis Sharp`,
              });
            } catch (erreur) {
              console.error('Erreur lors du partage de la tâche :', erreur);
            }
            break;
          case 4:
            Alert.alert(
              'Supprimer la tâche',
              'Cette action est définitive.',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: () => {
                    supprimerTache(tache.id);
                    router.back();
                  },
                },
              ]
            );
            break;
          default:
            break;
        }
      }
    );
  };

  // Traitement lors de l'enregistrement des modifications
  const handleModifierTache = (donnees: {
    nom: string;
    date: string;
    assigne: string;
  }) => {
    modifierTache(tache.id, donnees);
    bottomSheetRef.current?.close();
  };

  return (
    <View className="flex-1 bg-fond dark:bg-fond-sombre p-4">
      {/* Carte contenant les informations détaillées de la tâche */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-5"
        style={{ elevation: 2 }}
      >
        {/* En-tête : numéro et état actuel */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-primaire">
            {`Tâche n°${tache.id}`}
          </Text>
          <Text
            className={`text-xs font-semibold px-2 py-0.5 rounded overflow-hidden ${
              tache.terminee
                ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {tache.terminee ? 'Terminée' : 'À faire'}
          </Text>
        </View>

        {/* Nom principal de la tâche */}
        <Text
          className={`text-xl font-bold text-texte dark:text-texte-sombre mb-4 ${
            tache.terminee ? 'line-through text-secondaire dark:text-secondaire-sombre' : ''
          }`}
        >
          {tache.nom}
        </Text>

        {/* Ligne d'information : Date */}
        <View className="flex-row items-center gap-2 mt-2.5">
          <Ionicons
            name="calendar-outline"
            size={18}
            color={couleurs.texteSecondaire}
          />
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre">
            {formaterDate(tache.date)}
          </Text>
        </View>

        {/* Ligne d'information : Personne assignée */}
        <View className="flex-row items-center gap-2 mt-2.5">
          <Ionicons
            name="person-outline"
            size={18}
            color={couleurs.texteSecondaire}
          />
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre">
            {`Assignée à : ${tache.assigne}`}
          </Text>
        </View>

        {/* Bouton unique ouvrant le menu d'actions */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Actions pour cette tâche"
          className="flex-row items-center justify-center bg-primaire rounded-lg py-3 px-5 mt-6 gap-2"
          style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
          onPress={handleOuvrirActions}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#ffffff" />
          <Text className="text-white text-base font-bold">Actions</Text>
        </Pressable>
      </View>

      {/* Feuille inférieure pour modifier la tâche avec support edge-to-edge du clavier */}
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
            Modifier la tâche
          </Text>
          <FormulaireTache
            valeursInitiales={{
              nom: tache.nom,
              date: tache.date,
              assigne: tache.assigne,
            }}
            libelleBouton="Enregistrer"
            onSubmit={handleModifierTache}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
