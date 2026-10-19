import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'nativewind';
import { Theme, chargerTheme, sauvegarderTheme } from '@/services/themeService';

// Interface exposée par le contexte de gestion du thème
interface ThemeContextType {
  theme: Theme;
  changerTheme: (nouveauTheme: Theme) => Promise<void>;
}

// Contexte React pour le thème
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Convertit le type de thème interne vers le format attendu par NativeWind
function versModeNativeWind(theme: Theme): 'system' | 'light' | 'dark' {
  if (theme === 'clair') {
    return 'light';
  }
  if (theme === 'sombre') {
    return 'dark';
  }
  return 'system';
}

// Fournisseur du thème pour toute l'application
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('systeme');
  const { setColorScheme } = useColorScheme();

  // Chargement initial du thème stocké et application à NativeWind
  useEffect(() => {
    let actif = true;
    async function initialiserTheme() {
      const themeEnregistre = await chargerTheme();
      if (actif) {
        setTheme(themeEnregistre);
        setColorScheme(versModeNativeWind(themeEnregistre));
      }
    }
    initialiserTheme();
    return () => {
      actif = false;
    };
  }, [setColorScheme]);

  // Applique le nouveau thème, met à jour l'état et persiste le choix
  const changerTheme = async (nouveauTheme: Theme) => {
    setColorScheme(versModeNativeWind(nouveauTheme));
    setTheme(nouveauTheme);
    await sauvegarderTheme(nouveauTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour accéder et modifier le thème de l'application
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
}
