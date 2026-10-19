import '../../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useCouleurs } from '@/hooks/useCouleurs';
import { TachesProvider } from '@/services/TachesContext';
import { ProfilProvider } from '@/services/ProfilContext';
import { ThemeProvider } from '@/services/ThemeContext';

// Composant interne du Drawer appliquant les styles dynamiques selon le thème
function NavigationDrawer() {
  const { couleurs } = useCouleurs();

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: couleurs.primaire,
        },
        headerTintColor: '#ffffff',
        drawerStyle: {
          backgroundColor: couleurs.carte,
        },
        drawerActiveTintColor: couleurs.primaire,
        drawerInactiveTintColor: couleurs.texte,
        sceneStyle: {
          backgroundColor: couleurs.fond,
        },
        drawerItemStyle:
          route.name === 'index' || route.name === 'onboarding'
            ? { display: 'none' }
            : undefined,
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="onboarding"
        options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="accueil"
        options={{
          drawerLabel: 'Accueil',
          title: 'Accueil',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="preferences"
        options={{
          drawerLabel: 'Préférences',
          title: 'Préférences',
        }}
      />
      <Drawer.Screen
        name="profil"
        options={{
          drawerLabel: 'Profil',
          title: 'Profil',
        }}
      />
      <Drawer.Screen
        name="apropos"
        options={{
          drawerLabel: 'À propos',
          title: 'À propos',
        }}
      />
    </Drawer>
  );
}

// Configuration racine de l'application Sharp avec tous les fournisseurs de contexte
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <TachesProvider>
        <ProfilProvider>
          <ThemeProvider>
            <ActionSheetProvider>
              <NavigationDrawer />
            </ActionSheetProvider>
          </ThemeProvider>
        </ProfilProvider>
      </TachesProvider>
    </GestureHandlerRootView>
  );
}
