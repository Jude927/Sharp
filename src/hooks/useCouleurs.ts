import { useColorScheme } from 'nativewind';
import { couleurs, couleursSombre } from '@/constants/couleurs';

// Hook qui renvoie la palette de couleurs active en fonction du thème (clair ou sombre)
export function useCouleurs() {
  const { colorScheme } = useColorScheme();
  const estSombre = colorScheme === 'dark';

  return {
    couleurs: estSombre ? couleursSombre : couleurs,
    estSombre,
  };
}

export default useCouleurs;
