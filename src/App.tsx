
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from './AppRoutes';
import { UnifiedAuthProvider } from '@/contexts/auth/UnifiedAuthContext';
import { FavoritesProvider } from '@/contexts/favorites';
import EmergencyFallback from '@/components/EmergencyFallback';

function App() {
  const queryClient = new QueryClient();

  return (
    <EmergencyFallback>
      <Router>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
              <UnifiedAuthProvider>
                <FavoritesProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Toaster />
                    <AppRoutes />
                  </div>
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
