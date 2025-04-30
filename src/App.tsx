
import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/auth/AuthContext';
import { AuthProvider as AdminAuthProvider } from './contexts/admin-auth';
import { ThemeProvider } from '@/components/ui/theme-provider';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <AdminAuthProvider>
            <AppRoutes />
            <Toaster />
            <SonnerToaster position="top-right" />
          </AdminAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
