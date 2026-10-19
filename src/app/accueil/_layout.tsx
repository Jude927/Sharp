import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from 'expo-router/drawer';
import { useCouleurs } from '@/hooks/useCouleurs';
import { useTaches } from '@/services/TachesContext';

// Configuration du navigateur par onglets (Tabs) de la section Accueil avec support du thème
export default function AccueilLayout() {
  const { couleurs } = useCouleurs();
  const { taches } = useTaches();
  const nombreFavoris = taches.filter((t) => t.favori).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: couleurs.primaire,
        tabBarInactiveTintColor: couleurs.texteSecondaire,
        tabBarStyle: {
          backgroundColor: couleurs.carte,
          borderTopColor: couleurs.bordure,
        },
        sceneStyle: {
          backgroundColor: couleurs.fond,
        },
        headerStyle: {
          backgroundColor: couleurs.primaire,
        },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={typeof color === 'string' ? color : undefined}
            />
          ),
          headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
        }}
      />
      <Tabs.Screen
        name="taches"
        options={{
          title: 'Mes tâches',
          tabBarLabel: 'Mes tâches',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="list-outline"
              size={size}
              color={typeof color === 'string' ? color : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: 'Favoris',
          tabBarLabel: 'Favoris',
          tabBarBadge: nombreFavoris > 0 ? nombreFavoris : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="star-outline"
              size={size}
              color={typeof color === 'string' ? color : undefined}
            />
          ),
          headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
        }}
      />
    </Tabs>
  );
}
