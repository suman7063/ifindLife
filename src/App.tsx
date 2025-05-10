
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/auth/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme/theme-provider';
import { FavoritesProvider } from './contexts/favorites';
import { AdminAuthProvider } from './contexts/admin-auth';

const App = () => {
  useEffect(() => {
    document.body.classList.add('bg-background');
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ifind-theme">
      <AuthProvider>
        <AdminAuthProvider>
          <FavoritesProvider>
            <AppRoutes />
            <Toaster />
          </FavoritesProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
