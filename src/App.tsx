
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/auth';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme/theme-provider';
import { FavoritesProvider } from './contexts/favorites';
import { AdminAuthProvider } from './contexts/admin-auth';
import { UserAuthProvider } from './contexts/auth';

const App = () => {
  useEffect(() => {
    document.body.classList.add('bg-background');
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ifind-theme">
      <AuthProvider>
        <UserAuthProvider>
          <AdminAuthProvider>
            <FavoritesProvider>
              <AppRoutes />
              <Toaster />
            </FavoritesProvider>
          </AdminAuthProvider>
        </UserAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
