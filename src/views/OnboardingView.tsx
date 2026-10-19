import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useProfil } from '@/services/ProfilContext';
import { marquerOnboardingVu } from '@/services/onboardingService';
import { SLIDES_ONBOARDING, SlideOnboardingItem } from '@/constants/onboarding';

// Vue d'onboarding immersive avec défilement parallaxe plein écran et animations natives
export default function OnboardingView() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { metAJourProfil } = useProfil();

  const [indexActif, setIndexActif] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  const flatListRef = useRef<FlatList<SlideOnboardingItem>>(null);
  const [scrollX] = useState(() => new Animated.Value(0));

  // Gestion du bouton retour physique Android : revient à la slide précédente si index > 0
  useEffect(() => {
    const handleBackPress = () => {
      if (indexActif > 0) {
        const indexPrecedent = indexActif - 1;
        flatListRef.current?.scrollToIndex({
          index: indexPrecedent,
          animated: true,
        });
        setIndexActif(indexPrecedent);
        return true;
      }
      return false;
    };

    const abonnement = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => abonnement.remove();
  }, [indexActif]);

  // Clôture de l'onboarding et redirection vers l'accueil
  const handleTerminer = async () => {
    if (prenom.trim()) {
      await metAJourProfil({ nom: prenom.trim() });
    }
    await marquerOnboardingVu();
    router.replace('/accueil');
  };

  // Passage à la slide suivante ou finalisation au dernier écran
  const handleSuivant = () => {
    if (indexActif < SLIDES_ONBOARDING.length - 1) {
      const prochainIndex = indexActif + 1;
      flatListRef.current?.scrollToIndex({
        index: prochainIndex,
        animated: true,
      });
      setIndexActif(prochainIndex);
    } else {
      handleTerminer();
    }
  };

  // Mise à jour de l'index actif lors de l'arrêt du défilement
  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setIndexActif(index);
  };

  // Rendu individuel d'une diapositive avec parallaxe et animations de texte
  const renderSlide = ({
    item,
    index,
  }: {
    item: SlideOnboardingItem;
    index: number;
  }) => {
    // Effet parallaxe discret sans sur-zoom excessif
    const translateX = scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [-width * 0.03, 0, width * 0.03],
      extrapolate: 'clamp',
    });

    // Apparition en fondu du bloc texte lorsque la slide est centrée
    const opacity = scrollX.interpolate({
      inputRange: [
        (index - 0.7) * width,
        index * width,
        (index + 0.7) * width,
      ],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    // Translation verticale douce du texte
    const translateY = scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [24, 0, 24],
      extrapolate: 'clamp',
    });

    const estDerniereSlide = index === SLIDES_ONBOARDING.length - 1;

    return (
      <View
        style={{ width, height, overflow: 'hidden', backgroundColor: '#000000' }}
        className="relative"
      >
        {/* Conteneur de l'image ajusté sans sur-zoom excessif avec subtile translation parallaxe */}
        <Animated.View
          style={{
            width: width * 1.06,
            height,
            position: 'absolute',
            left: -width * 0.03,
            transform: [{ translateX }],
          }}
        >
          <Image
            source={item.image}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            contentPosition="center"
            transition={300}
            priority="high"
          />
        </Animated.View>

        {/* Voile assombrissant principal (35% d'opacité) */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
          ]}
        />

        {/* Second voile plus sombre dans le tiers bas pour maximiser la lisibilité */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: height * 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
          }}
        />

        {/* Bloc textuel et formulaire défilables pour que les champs restent visibles avec le clavier */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 110,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
            }}
          >
            {/* Logo de l'application sur la première diapositive */}
            {index === 0 && (
              <Image
                source={require('../../assets/images/icon.png')}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 20,
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
                contentFit="cover"
              />
            )}

            {/* Titre principal */}
            <Text className="text-[32px] font-bold text-white text-center leading-10 mb-3">
              {item.titre}
            </Text>

            {/* Texte descriptif */}
            <Text className="text-[17px] text-white/85 text-center leading-6">
              {item.texte}
            </Text>

            {/* Carte interactive sur la 4ème slide */}
            {estDerniereSlide && (
              <View
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-4 mt-4 w-full max-w-[340px] self-center shadow-lg"
                style={{ elevation: 2 }}
              >
                <TextInput
                  placeholder="Votre prénom"
                  placeholderTextColor="#9ca3af"
                  value={prenom}
                  onChangeText={setPrenom}
                  autoCorrect={false}
                  className="bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-base border border-gray-300 dark:border-slate-700"
                />

                {permission?.granted ? (
                  <View className="mt-3 bg-green-600 rounded-xl py-3 px-4 items-center flex-row justify-center gap-2">
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text className="text-white text-base font-semibold">
                      Caméra autorisée ✓
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Autoriser la caméra"
                    className="mt-3 bg-primaire rounded-xl py-3 px-4 items-center flex-row justify-center gap-2 active:opacity-85"
                    onPress={requestPermission}
                  >
                    <Ionicons name="camera-outline" size={20} color="#ffffff" />
                    <Text className="text-white text-base font-semibold">
                      Autoriser la caméra
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Bouton "Passer" en haut à droite visible sur les slides 1 à 3 */}
        <View
          style={{
            position: 'absolute',
            top: insets.top + 8,
            right: 20,
            zIndex: 20,
          }}
        >
          {indexActif < 3 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Passer la présentation"
              onPress={handleTerminer}
              hitSlop={12}
              className="py-2 px-3"
            >
              <Text className="text-white text-base font-semibold">
                Passer
              </Text>
            </Pressable>
          )}
        </View>

        {/* Liste animée horizontale des diapositives */}
        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES_ONBOARDING}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          renderItem={renderSlide}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          className="flex-1"
        />

        {/* Pied de page avec pagination animée et bouton principal */}
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 16,
            left: 24,
            right: 24,
            zIndex: 20,
          }}
        >
          {/* Points de pagination animés (largeur 8 -> 24 via scaleX, opacité 0.4 -> 1) */}
          <View className="flex-row justify-center items-center mb-4">
            {SLIDES_ONBOARDING.map((_, i) => {
              const dotScaleX = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [1, 3, 1],
                extrapolate: 'clamp',
              });

              const dotOpacity = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    opacity: dotOpacity,
                    transform: [{ scaleX: dotScaleX }],
                    backgroundColor: '#ffffff',
                    marginHorizontal: 6,
                  }}
                />
              );
            })}
          </View>

          {/* Bouton principal plein écran Suivant / Commencer */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={indexActif === 3 ? 'Commencer' : 'Suivant'}
            className="w-full bg-white rounded-2xl py-4 items-center shadow-lg active:opacity-90"
            onPress={handleSuivant}
          >
            <Text className="text-primaire text-lg font-bold">
              {indexActif === 3 ? 'Commencer' : 'Suivant'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
