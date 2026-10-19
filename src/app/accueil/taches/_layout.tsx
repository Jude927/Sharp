import { Stack } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';
import { useCouleurs } from '@/hooks/useCouleurs';

// Configuration de la pile de navigation (Stack) pour la section des tâches avec support du thème
export default function TachesLayout() {
  const { couleurs } = useCouleurs();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: couleurs.primaire,
        },
        headerTintColor: couleurs.texteSurPrimaire,
        contentStyle: {
          backgroundColor: couleurs.fond,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Mes tâches',
          headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Détail de la tâche',
        }}
      />
    </Stack>
  );
}
