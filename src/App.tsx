
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from './AppRoutes';
import { UnifiedAuthProvider } from '@/contexts/auth/UnifiedAuthContext';
import { FavoritesProvider } from '@/contexts/favorites';
import { AgoraConfigProvider } from '@/components/call/config/AgoraConfig';
import { CallSessionProvider } from '@/components/call/session/CallSessionManager';
import EmergencyFallback from '@/components/EmergencyFallback';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <EmergencyFallback>
      <Router>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
              <UnifiedAuthProvider>
                <FavoritesProvider>
                  <AgoraConfigProvider appId="711352125">
                    <CallSessionProvider>
                      <div className="min-h-screen bg-background font-sans antialiased">
                        <Toaster />
                        <AppRoutes />
                      </div>
                    </CallSessionProvider>
                  </AgoraConfigProvider>
                </FavoritesProvider>
              </UnifiedAuthProvider>
            </Suspense>
          </QueryClientProvider>
        </HelmetProvider>
      </Router>
    </EmergencyFallback>
  );
}

export default App;
