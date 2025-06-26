
import React, { Suspense, lazy } from 'react';
import LoadingScreen from './LoadingScreen';

// Lazy load heavy authentication components
const AuthProvider = lazy(() => import('@/contexts/auth/AuthProvider').then(module => ({ default: module.AuthProvider })));
const SecurityProvider = lazy(() => import('@/contexts/auth/SecurityContext').then(module => ({ default: module.SecurityProvider })));

interface LazyAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Lazy-loaded authentication provider wrapper
 * Reduces initial bundle size by code-splitting auth components
 */
const LazyAuthProvider: React.FC<LazyAuthProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingScreen message="Loading authentication system..." />}>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen message="Loading security features..." />}>
          <SecurityProvider>
            {children}
          </SecurityProvider>
        </Suspense>
      </AuthProvider>
    </Suspense>
  );
};

export default LazyAuthProvider;
