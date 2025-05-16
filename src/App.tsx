
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AdminAuthProvider } from '@/contexts/admin-auth';
import { FavoritesProvider } from '@/contexts/favorites/FavoritesContext';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@radix-ui/react-toast';
import AppRoutes from './AppRoutes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ifind-theme">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {/* Removed the Router component here as it's already in main.tsx */}
          <AdminAuthProvider>
            <AuthProvider>
              <FavoritesProvider>
                <AppRoutes />
                <Toaster />
              </FavoritesProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
