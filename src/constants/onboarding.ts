// Modèle de données pour une diapositive d'onboarding
export interface SlideOnboardingItem {
  id: string;
  image: number;
  titre: string;
  texte: string;
}

// Données des 4 diapositives d'introduction avec visuels pleine page
export const SLIDES_ONBOARDING: SlideOnboardingItem[] = [
  {
    id: '1',
    image: require('../../assets/onboarding/slide-1.jpg'),
    titre: 'Bienvenue sur Sharp',
    texte: 'Organisez votre quotidien, simplement.',
  },
  {
    id: '2',
    image: require('../../assets/onboarding/slide-2.jpg'),
    titre: "Votre journée en un coup d'œil",
    texte:
      'Tâches du jour, en retard, terminées : tout est clair, avec une progression qui motive.',
  },
  {
    id: '3',
    image: require('../../assets/onboarding/slide-3.jpg'),
    titre: 'Avancez, terminez, célébrez',
    texte:
      'Mettez vos tâches importantes en favori, partagez-les et cochez-les en deux gestes.',
  },
  {
    id: '4',
    image: require('../../assets/onboarding/slide-4.jpg'),
    titre: 'Faisons connaissance',
    texte:
      'Dites-nous comment vous appeler et ajoutez une photo si vous le souhaitez. Tout est facultatif.',
  },
];
