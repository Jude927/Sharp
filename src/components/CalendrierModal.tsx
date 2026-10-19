import { useState, useMemo } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCouleurs } from '@/hooks/useCouleurs';
import { dateDuJour } from '@/utils/formaterDate';

// Propriétés attendues pour le sélecteur de date sous forme de modal calendrier
interface CalendrierModalProps {
  visible: boolean;
  dateSelectionnee: string;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
}

// Noms des mois en français
const NOMS_MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

// Abréviations des jours de la semaine (lundi à dimanche)
const JOURS_SEMAINE = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// Extrait l'année et le mois d'une chaîne YYYY-MM-DD
function extraireAnneeEtMois(dateStr: string) {
  const parts = dateStr.split('-').map(Number);
  const now = new Date();
  const annee = parts.length === 3 && !isNaN(parts[0]) ? parts[0] : now.getFullYear();
  const mois = parts.length === 3 && !isNaN(parts[1]) ? parts[1] : now.getMonth() + 1;
  return { annee, mois };
}

// Modal calendrier interactif permettant de naviguer entre les mois et de sélectionner une date
export default function CalendrierModal({
  visible,
  dateSelectionnee,
  onSelectDate,
  onClose,
}: CalendrierModalProps) {
  const { couleurs } = useCouleurs();
  const aujourdhui = useMemo(() => dateDuJour(), []);

  // État local de l'année et du mois visualisés dans le calendrier
  const [vueDate, setVueDate] = useState(() => ({
    source: dateSelectionnee,
    ...extraireAnneeEtMois(dateSelectionnee),
  }));

  // Synchronisation directe durant le rendu si la prop dateSelectionnee a changé
  if (vueDate.source !== dateSelectionnee) {
    setVueDate({
      source: dateSelectionnee,
      ...extraireAnneeEtMois(dateSelectionnee),
    });
  }

  const { annee, mois } = vueDate;

  // Passage au mois précédent
  const moisPrecedent = () => {
    setVueDate((prev) => {
      if (prev.mois === 1) {
        return { ...prev, mois: 12, annee: prev.annee - 1 };
      }
      return { ...prev, mois: prev.mois - 1 };
    });
  };

  // Passage au mois suivant
  const moisSuivant = () => {
    setVueDate((prev) => {
      if (prev.mois === 12) {
        return { ...prev, mois: 1, annee: prev.annee + 1 };
      }
      return { ...prev, mois: prev.mois + 1 };
    });
  };

  // Calcul du nombre de jours et du jour de départ pour la grille du mois
  const nombreDeJours = new Date(annee, mois, 0).getDate();
  const jourDepartBrut = new Date(annee, mois - 1, 1).getDay(); // 0 = Dimanche
  const decalageDepart = jourDepartBrut === 0 ? 6 : jourDepartBrut - 1; // 0 = Lundi

  // Sélection d'un jour précis
  const handleChoisirJour = (jour: number) => {
    const moisStr = String(mois).padStart(2, '0');
    const jourStr = String(jour).padStart(2, '0');
    onSelectDate(`${annee}-${moisStr}-${jourStr}`);
    onClose();
  };

  // Sélection rapide de la date du jour
  const handleChoisirAujourdhui = () => {
    onSelectDate(aujourdhui);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        {/* Boîte de dialogue du calendrier */}
        <View
          className="bg-carte dark:bg-carte-sombre rounded-2xl p-5 border border-bordure dark:border-bordure-sombre w-full max-w-[340px] shadow-2xl"
          style={{ elevation: 6 }}
        >
          {/* En-tête : Mois, Année et flèches de navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mois précédent"
              onPress={moisPrecedent}
              className="w-9 h-9 items-center justify-center rounded-full active:bg-gray-200 dark:active:bg-gray-800"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={couleurs.texte} />
            </Pressable>

            <Text className="text-base font-bold text-texte dark:text-texte-sombre">
              {`${NOMS_MOIS[mois - 1]} ${annee}`}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mois suivant"
              onPress={moisSuivant}
              className="w-9 h-9 items-center justify-center rounded-full active:bg-gray-200 dark:active:bg-gray-800"
              hitSlop={8}
            >
              <Ionicons name="chevron-forward" size={20} color={couleurs.texte} />
            </Pressable>
          </View>

          {/* Ligne des libellés des jours de la semaine */}
          <View className="flex-row mb-2">
            {JOURS_SEMAINE.map((j) => (
              <View key={j} className="flex-1 items-center justify-center py-1">
                <Text className="text-xs font-semibold text-secondaire dark:text-secondaire-sombre">
                  {j}
                </Text>
              </View>
            ))}
          </View>

          {/* Grille des jours du mois */}
          <View className="flex-row flex-wrap">
            {/* Cases vides avant le 1er du mois */}
            {Array.from({ length: decalageDepart }).map((_, i) => (
              <View key={`vide-${i}`} className="w-[14.28%] h-10" />
            ))}

            {/* Jours du mois */}
            {Array.from({ length: nombreDeJours }).map((_, i) => {
              const jour = i + 1;
              const moisStr = String(mois).padStart(2, '0');
              const jourStr = String(jour).padStart(2, '0');
              const dateStr = `${annee}-${moisStr}-${jourStr}`;

              const estSelectionne = dateStr === dateSelectionnee;
              const estAujourdhui = dateStr === aujourdhui;

              return (
                <Pressable
                  key={`jour-${jour}`}
                  onPress={() => handleChoisirJour(jour)}
                  className="w-[14.28%] h-10 items-center justify-center"
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      estSelectionne
                        ? 'bg-primaire'
                        : estAujourdhui
                        ? 'border border-primaire'
                        : ''
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        estSelectionne
                          ? 'text-white font-bold'
                          : estAujourdhui
                          ? 'text-primaire font-bold'
                          : 'text-texte dark:text-texte-sombre'
                      }`}
                    >
                      {jour}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Pied de page : actions rapides "Aujourd'hui" et "Fermer" */}
          <View className="flex-row justify-between items-center mt-5 pt-3 border-t border-bordure dark:border-bordure-sombre">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sélectionner aujourd'hui"
              onPress={handleChoisirAujourdhui}
              className="py-1.5 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 active:opacity-80"
            >
              <Text className="text-xs font-semibold text-primaire">
                {"Aujourd'hui"}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer le calendrier"
              onPress={onClose}
              className="py-1.5 px-3 rounded-lg active:opacity-80"
            >
              <Text className="text-xs font-semibold text-secondaire dark:text-secondaire-sombre">
                Fermer
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
