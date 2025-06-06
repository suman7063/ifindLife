
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { FavoritesProvider } from '@/contexts/favorites';
import { CallSessionProvider } from '@/components/call/session/CallSessionManager';
import { AgoraConfigProvider } from '@/components/call/config/AgoraConfig';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AuthProvider>
              <FavoritesProvider>
                <AgoraConfigProvider>
                  <CallSessionProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <Toaster />
                      <AppRoutes />
                    </div>
                  </CallSessionProvider>
                </AgoraConfigProvider>
              </FavoritesProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
