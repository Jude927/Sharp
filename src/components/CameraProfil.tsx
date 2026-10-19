import { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useCouleurs } from '@/hooks/useCouleurs';
import { choisirDansGalerie } from '@/utils/photoProfil';

// Propriétés acceptées par le composant CameraProfil
interface CameraProfilProps {
  visible: boolean;
  onCapture: (photoBase64: string) => void;
  onClose: () => void;
}

// Modal plein écran pour la prise de vue avec aperçu et sélection depuis la galerie
export default function CameraProfil({
  visible,
  onCapture,
  onClose,
}: CameraProfilProps) {
  const { couleurs } = useCouleurs();
  const insets = useSafeAreaInsets();

  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraPrete, setCameraPrete] = useState(false);
  const [enCapture, setEnCapture] = useState(false);
  const [photoApercu, setPhotoApercu] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  // Fermeture du modal et réinitialisation de l'aperçu
  const handleFermer = () => {
    setPhotoApercu(null);
    setCameraPrete(false);
    onClose();
  };

  // Bascule entre la caméra avant et arrière
  const handleBasculerCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Prise de photo avec la caméra
  const handlePrendrePhoto = async () => {
    if (!cameraRef.current || !cameraPrete || enCapture) {
      return;
    }
    try {
      setEnCapture(true);
      const resultat = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: true,
      });
      if (resultat?.base64) {
        setPhotoApercu(`data:image/jpeg;base64,${resultat.base64}`);
      }
    } catch (erreur) {
      console.error('Erreur lors de la capture de la photo :', erreur);
    } finally {
      setEnCapture(false);
    }
  };

  // Sélection d'une image existante depuis la bibliothèque de photos
  const handleChoisirGalerie = async () => {
    const photo = await choisirDansGalerie();
    if (photo) {
      setPhotoApercu(photo);
    }
  };

  // Validation finale de l'image sélectionnée ou capturée
  const handleValiderPhoto = () => {
    if (photoApercu) {
      onCapture(photoApercu);
      setPhotoApercu(null);
      setCameraPrete(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleFermer}
    >
      <View className="flex-1 bg-black">
        {/* 1. Écran de chargement des permissions */}
        {!permission ? (
          <View className="flex-1 items-center justify-center bg-black">
            <ActivityIndicator size="large" color={couleurs.primaire} />
          </View>
        ) : !permission.granted ? (
          /* 2. Écran explicatif lorsque la permission caméra n'est pas accordée */
          <View
            className="flex-1 items-center justify-center p-6 bg-[#121212]"
            style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              style={{
                position: 'absolute',
                top: insets.top + 16,
                right: 20,
                padding: 8,
              }}
              onPress={handleFermer}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
            </Pressable>

            <Ionicons
              name="camera-outline"
              size={64}
              color="#ffffff"
              style={{ marginBottom: 20 }}
            />
            <Text className="text-white text-base text-center mb-7 leading-[22px]">
              Sharp a besoin de la caméra pour prendre votre photo de profil
            </Text>

            <Pressable
              className="bg-primaire rounded-lg py-3.5 px-6 w-full items-center mb-3"
              onPress={requestPermission}
            >
              <Text className="text-white text-base font-bold">
                Autoriser la caméra
              </Text>
            </Pressable>

            {!permission.canAskAgain && (
              <Pressable
                className="bg-transparent border border-white rounded-lg py-3.5 px-6 w-full items-center"
                onPress={() => Linking.openSettings()}
              >
                <Text className="text-white text-base font-semibold">
                  Ouvrir les réglages
                </Text>
              </Pressable>
            )}
          </View>
        ) : photoApercu ? (
          /* 3. Écran d'aperçu de la photo capturée ou choisie */
          <View
            className="flex-1 items-center justify-center px-6"
            style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
          >
            <View className="w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white mb-10 shadow-2xl">
              <Image
                source={{ uri: photoApercu }}
                style={{ width: 280, height: 280 }}
                contentFit="cover"
              />
            </View>

            <View className="w-full max-w-[320px] gap-3">
              <Pressable
                className="bg-primaire rounded-lg py-3.5 items-center"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
                onPress={handleValiderPhoto}
              >
                <Text className="text-white text-base font-bold">
                  Utiliser cette photo
                </Text>
              </Pressable>

              <Pressable
                className="bg-transparent border border-white rounded-lg py-3.5 items-center"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
                onPress={() => setPhotoApercu(null)}
              >
                <Text className="text-white text-base font-semibold">
                  Reprendre
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* 4. Affichage du viseur caméra avec boutons superposés en frères */
          <>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={facing}
              onCameraReady={() => setCameraPrete(true)}
            />

            {/* Barre supérieure : fermer à gauche, bascule caméra à droite */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + 12,
                left: 20,
                right: 20,
                zIndex: 10,
                elevation: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fermer"
                className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
                onPress={handleFermer}
                hitSlop={10}
              >
                <Ionicons name="close" size={28} color="#ffffff" />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Basculer la caméra"
                className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
                onPress={handleBasculerCamera}
                hitSlop={10}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={28}
                  color="#ffffff"
                />
              </Pressable>
            </View>

            {/* Barre de commandes en bas : galerie, déclencheur, espace équilibrant */}
            <View
              style={{
                position: 'absolute',
                bottom: insets.bottom + 24,
                left: 32,
                right: 32,
                zIndex: 10,
                elevation: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Bouton pour ouvrir la galerie */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choisir dans la galerie"
                className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
                onPress={handleChoisirGalerie}
                hitSlop={10}
              >
                <Ionicons name="images-outline" size={26} color="#ffffff" />
              </Pressable>

              {/* Bouton de capture au centre */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Prendre une photo"
                disabled={!cameraPrete || enCapture}
                className={`w-[76px] h-[76px] rounded-full border-4 border-white items-center justify-center bg-transparent ${
                  !cameraPrete || enCapture ? 'opacity-50' : 'active:opacity-75'
                }`}
                onPress={handlePrendrePhoto}
              >
                {enCapture ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="w-[60px] h-[60px] rounded-full bg-white" />
                )}
              </Pressable>

              {/* Espace vide de 44px pour équilibrer le centrage */}
              <View className="w-11" />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}
