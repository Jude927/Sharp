import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tache } from '@/types/Tache';
import { formaterDate } from '@/utils/formaterDate';
import { useCouleurs } from '@/hooks/useCouleurs';

// Propriétés attendues pour le composant ItemView
interface ItemViewProps {
  tache: Tache;
  onPress: () => void;
}

// Composant d'affichage d'un élément de tâche dans la liste avec statut terminé et favori
export default function ItemView({ tache, onPress }: ItemViewProps) {
  const { couleurs } = useCouleurs();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Tâche : ${tache.nom}`}
      onPress={onPress}
      className={`flex-row items-center bg-carte dark:bg-carte-sombre rounded-xl border border-bordure dark:border-bordure-sombre p-3 mb-2.5 ${
        tache.terminee ? 'opacity-60' : ''
      }`}
      style={({ pressed }) => [
        { elevation: 2 },
        pressed ? { opacity: 0.7 } : undefined,
      ]}
    >
      {/* Pastille ronde avec icône document à gauche */}
      <View className="w-12 h-12 rounded-full bg-primaire items-center justify-center mr-3">
        <Ionicons name="document-text-outline" size={24} color="#ffffff" />
      </View>

      {/* Contenu textuel central : nom (barré si terminée) et date */}
      <View className="flex-1 mr-2">
        <Text
          className={`text-base font-bold text-texte dark:text-texte-sombre mb-1 ${
            tache.terminee
              ? 'line-through text-secondaire dark:text-secondaire-sombre'
              : ''
          }`}
          numberOfLines={1}
        >
          {tache.nom}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="calendar-outline"
            size={14}
            color={couleurs.texteSecondaire}
          />
          <Text className="text-xs text-secondaire dark:text-secondaire-sombre">
            {formaterDate(tache.date)}
          </Text>
        </View>
      </View>

      {/* Petite étoile si la tâche est marquée comme favorite */}
      {tache.favori && (
        <View className="mr-1.5">
          <Ionicons name="star" size={18} color={couleurs.favori} />
        </View>
      )}

      {/* Chevron de navigation à droite */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={couleurs.texteSecondaire}
      />
    </Pressable>
  );
}
