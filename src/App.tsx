
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/auth/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { FavoritesProvider } from './contexts/favorites';

const App = () => {
  useEffect(() => {
    document.body.classList.add('bg-background');
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ifind-theme">
      <AuthProvider>
        <FavoritesProvider>
          <AppRoutes />
          <Toaster />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
