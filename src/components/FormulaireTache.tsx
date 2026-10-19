import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dateDuJour } from '@/utils/formaterDate';
import { useCouleurs } from '@/hooks/useCouleurs';
import CalendrierModal from '@/components/CalendrierModal';

// Propriétés acceptées par le composant FormulaireTache
interface FormulaireTacheProps {
  onSubmit: (donnees: { nom: string; date: string; assigne: string }) => void;
  valeursInitiales?: { nom: string; date: string; assigne: string };
  libelleBouton?: string;
}

// Vérifie si une chaîne correspond à une date valide et existante dans le calendrier au format AAAA-MM-JJ
function validerDate(dateStr: string): { valide: boolean; message: string } {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return { valide: false, message: 'Format attendu : AAAA-MM-JJ' };
  }
  const [annee, mois, jour] = dateStr.split('-').map(Number);
  if (annee < 1900 || annee > 2100 || mois < 1 || mois > 12 || jour < 1 || jour > 31) {
    return { valide: false, message: "Cette date n'existe pas" };
  }
  const dateObj = new Date(annee, mois - 1, jour);
  if (
    dateObj.getFullYear() !== annee ||
    dateObj.getMonth() !== mois - 1 ||
    dateObj.getDate() !== jour
  ) {
    return { valide: false, message: "Cette date n'existe pas" };
  }
  return { valide: true, message: '' };
}

// Composant de saisie ou d'édition d'une tâche avec validation calendrier et adaptation au thème
export default function FormulaireTache({
  onSubmit,
  valeursInitiales,
  libelleBouton = 'Ajouter la tâche',
}: FormulaireTacheProps) {
  const { couleurs } = useCouleurs();
  const insets = useSafeAreaInsets();

  const [nom, setNom] = useState(valeursInitiales?.nom ?? '');
  const [assigne, setAssigne] = useState(valeursInitiales?.assigne ?? '');
  const [date, setDate] = useState(valeursInitiales?.date ?? dateDuJour());

  const [erreurNom, setErreurNom] = useState('');
  const [erreurAssigne, setErreurAssigne] = useState('');
  const [erreurDate, setErreurDate] = useState('');
  const [calendrierVisible, setCalendrierVisible] = useState(false);

  // Synchronisation lors d'un changement de valeursInitiales pendant le rendu
  const [valeursPrecedentes, setValeursPrecedentes] = useState(valeursInitiales);
  if (valeursInitiales !== valeursPrecedentes) {
    setValeursPrecedentes(valeursInitiales);
    if (valeursInitiales) {
      setNom(valeursInitiales.nom);
      setAssigne(valeursInitiales.assigne);
      setDate(valeursInitiales.date);
    }
  }

  // Gestion du champ nom avec effacement de l'erreur
  const handleNomChange = (texte: string) => {
    setNom(texte);
    if (erreurNom) {
      setErreurNom('');
    }
  };

  // Gestion du champ assigné avec effacement de l'erreur
  const handleAssigneChange = (texte: string) => {
    setAssigne(texte);
    if (erreurAssigne) {
      setErreurAssigne('');
    }
  };

  // Gestion du champ date avec effacement de l'erreur
  const handleDateChange = (texte: string) => {
    setDate(texte);
    if (erreurDate) {
      setErreurDate('');
    }
  };

  // Validation complète des champs à la soumission
  const handleSubmit = () => {
    let valide = true;

    if (!nom.trim()) {
      setErreurNom('Le nom est obligatoire');
      valide = false;
    }

    if (!assigne.trim()) {
      setErreurAssigne("L'assigné est obligatoire");
      valide = false;
    }

    const resultatDate = validerDate(date.trim());
    if (!resultatDate.valide) {
      setErreurDate(resultatDate.message);
      valide = false;
    }

    if (!valide) {
      return;
    }

    // Transmission des données validées
    onSubmit({
      nom: nom.trim(),
      assigne: assigne.trim(),
      date: date.trim(),
    });

    // En mode création (pas de valeurs initiales), réinitialisation des champs
    if (!valeursInitiales) {
      setNom('');
      setAssigne('');
      setDate(dateDuJour());
      setErreurNom('');
      setErreurAssigne('');
      setErreurDate('');
    }
  };

  // Style personnalisé pour BottomSheetTextInput
  const styleInput = {
    backgroundColor: couleurs.fond,
    color: couleurs.texte,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  };

  const styleInputErreur = {
    borderColor: couleurs.danger,
  };

  return (
    <View className="py-2">
      {/* Champ : Nom de la tâche */}
      <View className="mb-3.5">
        <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
          Nom de la tâche
        </Text>
        <BottomSheetTextInput
          style={[styleInput, Boolean(erreurNom) && styleInputErreur]}
          placeholder="Ex: Développer le serveur"
          placeholderTextColor={couleurs.texteSecondaire}
          value={nom}
          onChangeText={handleNomChange}
          autoCorrect={false}
        />
        {Boolean(erreurNom) && (
          <Text className="text-xs text-red-600 dark:text-red-500 mt-1">
            {erreurNom}
          </Text>
        )}
      </View>

      {/* Champ : Assignée à */}
      <View className="mb-3.5">
        <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
          Assignée à
        </Text>
        <BottomSheetTextInput
          style={[styleInput, Boolean(erreurAssigne) && styleInputErreur]}
          placeholder="Ex: Jean Dupont"
          placeholderTextColor={couleurs.texteSecondaire}
          value={assigne}
          onChangeText={handleAssigneChange}
          autoCorrect={false}
        />
        {Boolean(erreurAssigne) && (
          <Text className="text-xs text-red-600 dark:text-red-500 mt-1">
            {erreurAssigne}
          </Text>
        )}
      </View>

      {/* Champ : Date avec bouton pour ouvrir le calendrier */}
      <View className="mb-3.5">
        <Text className="text-sm font-semibold text-texte dark:text-texte-sombre mb-1.5">
          Date (AAAA-MM-JJ)
        </Text>
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <BottomSheetTextInput
              style={[styleInput, Boolean(erreurDate) && styleInputErreur]}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={couleurs.texteSecondaire}
              value={date}
              onChangeText={handleDateChange}
              autoCorrect={false}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le calendrier"
            onPress={() => setCalendrierVisible(true)}
            style={({ pressed }) => [
              {
                backgroundColor: couleurs.fond,
                borderColor: couleurs.bordure,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 13,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color={couleurs.primaire} />
          </Pressable>
        </View>
        {Boolean(erreurDate) && (
          <Text className="text-xs text-red-600 dark:text-red-500 mt-1">
            {erreurDate}
          </Text>
        )}
      </View>

      {/* Bouton de confirmation avec marge basse adaptée aux barres système */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={libelleBouton}
        className="bg-primaire rounded-lg py-3.5 items-center mt-2.5"
        style={({ pressed }) => [
          { marginBottom: insets.bottom + 16 },
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleSubmit}
      >
        <Text className="text-white text-base font-bold">{libelleBouton}</Text>
      </Pressable>

      {/* Modal interactif du calendrier */}
      <CalendrierModal
        visible={calendrierVisible}
        dateSelectionnee={date}
        onSelectDate={handleDateChange}
        onClose={() => setCalendrierVisible(false)}
      />
    </View>
  );
}
