import { ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Device from 'expo-device';
import appConfig from '../../app.json';
import { NOM_APP, SLOGAN, AUTEUR, ANNEE_CREATION, CREDITS_PHOTOS } from '@/constants/infosApp';
import { useTaches } from '@/services/TachesContext';

// Vue affichant les informations de l'application, de l'appareil et les statistiques d'utilisation avec support du thème
export default function AProposView() {
  const insets = useSafeAreaInsets();
  const { taches } = useTaches();
  const nombreTaches = taches.length;
  const nombreFavoris = taches.filter((t) => t.favori).length;

  const versionApp = appConfig.expo.version;
  const modeleAppareil = Device.modelName || 'Inconnu';
  const systemeAppareil = `${Device.osName || 'OS'} ${Device.osVersion || ''}`.trim();

  return (
    <ScrollView
      className="flex-1 bg-fond dark:bg-fond-sombre"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
    >
      {/* En-tête : Logo, nom de l'application et slogan */}
      <View className="items-center my-5">
        <Image
          source={require('../../assets/images/icon.png')}
          style={{ width: 96, height: 96, borderRadius: 21, marginBottom: 12 }}
          contentFit="cover"
        />
        <Text className="text-2xl font-bold text-texte dark:text-texte-sombre">
          {NOM_APP}
        </Text>
        <Text className="text-sm text-secondaire dark:text-secondaire-sombre mt-1">
          {SLOGAN}
        </Text>
      </View>

      {/* Carte : Informations sur l'application */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        <Text className="text-base font-bold text-texte dark:text-texte-sombre mb-3">
          Informations
        </Text>

        <View className="flex-row justify-between items-center py-2 border-b border-bordure dark:border-bordure-sombre">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Version
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {versionApp}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-bordure dark:border-bordure-sombre">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Réalisé par
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {AUTEUR}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2 border-b border-bordure dark:border-bordure-sombre">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Année de création
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {ANNEE_CREATION}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Technologies
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            Expo, React Native, TypeScript, Expo Router
          </Text>
        </View>
      </View>

      {/* Carte : Cet appareil */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        <Text className="text-base font-bold text-texte dark:text-texte-sombre mb-3">
          Cet appareil
        </Text>

        <View className="flex-row justify-between items-center py-2 border-b border-bordure dark:border-bordure-sombre">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Modèle
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {modeleAppareil}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Système
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {systemeAppareil}
          </Text>
        </View>
      </View>

      {/* Carte : Mes données */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        <Text className="text-base font-bold text-texte dark:text-texte-sombre mb-3">
          Mes données
        </Text>

        <View className="flex-row justify-between items-center py-2 border-b border-bordure dark:border-bordure-sombre">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Nombre de tâches
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {nombreTaches}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm text-secondaire dark:text-secondaire-sombre flex-1">
            Nombre de favoris
          </Text>
          <Text className="text-sm font-medium text-texte dark:text-texte-sombre text-right flex-1">
            {nombreFavoris}
          </Text>
        </View>
      </View>

      {/* Carte : Crédits photos */}
      <View
        className="bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-4 mb-4"
        style={{ elevation: 2 }}
      >
        <Text className="text-base font-bold text-texte dark:text-texte-sombre mb-3">
          Crédits photos
        </Text>

        {CREDITS_PHOTOS.map((credit, index) => {
          const estDernier = index === CREDITS_PHOTOS.length - 1;
          return (
            <View
              key={credit.slide}
              className={`py-2.5 ${
                estDernier ? '' : 'border-b border-bordure dark:border-bordure-sombre'
              }`}
            >
              <Text className="text-sm font-semibold text-texte dark:text-texte-sombre">
                {credit.slide}
              </Text>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                  Photographe : {credit.photographe}
                </Text>
                <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
                  Source : {credit.source}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Pied de page avec copyright */}
      <View className="items-center mt-3 mb-2">
        <Text className="text-xs text-secondaire dark:text-secondaire-sombre text-center">
          {`© ${ANNEE_CREATION} ${AUTEUR}. Tous droits réservés.`}
        </Text>
      </View>
    </ScrollView>
  );
}
