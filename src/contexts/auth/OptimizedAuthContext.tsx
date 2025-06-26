
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useAuthCache } from '@/hooks/auth/useAuthCache';
import { useAuthPerformance } from '@/hooks/auth/useAuthPerformance';

interface OptimizedAuthContextType {
  // Core auth (from original context)
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Performance optimizations
  cacheStats: {
    size: number;
    hitRate: number;
    hits: number;
    misses: number;
  };
  performanceStats: {
    averageResponseTime: number;
    totalOperations: number;
    slowestOperation: any;
    fastestOperation: any;
  };
  
  // Cache management
  invalidateCache: (key?: string) => void;
  clearPerformanceMetrics: () => void;
}

const OptimizedAuthContext = createContext<OptimizedAuthContextType | null>(null);

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const cache = useAuthCache();
  const performance = useAuthPerformance();

  // Memoized login with performance tracking and caching
  const optimizedLogin = useMemo(() => async (email: string, password: string): Promise<boolean> => {
    return performance.measurePerformance(
      'login',
      async () => {
        const result = await auth.login(email, password);
        
        // Cache successful login user data
        if (result && auth.user) {
          cache.set(`user:${auth.user.id}`, auth.user, 10 * 60 * 1000); // 10 minutes
        }
        
        return result;
      },
      { email: email.substring(0, 3) + '***' } // Don't log full email
    );
  }, [auth.login, auth.user, performance.measurePerformance, cache.set]);

  // Memoized logout with performance tracking
  const optimizedLogout = useMemo(() => async (): Promise<boolean> => {
    return performance.measurePerformance(
      'logout',
      async () => {
        const result = await auth.logout();
        
        // Clear cached user data on logout
        if (result) {
          cache.invalidate();
        }
        
        return result;
      }
    );
  }, [auth.logout, performance.measurePerformance, cache.invalidate]);

  const value = useMemo(() => ({
    // Core auth state
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    
    // Optimized methods
    login: optimizedLogin,
    logout: optimizedLogout,
    
    // Performance metrics
    cacheStats: cache.getStats(),
    performanceStats: performance.stats,
    
    // Management functions
    invalidateCache: cache.invalidate,
    clearPerformanceMetrics: performance.clearMetrics
  }), [
    auth.isAuthenticated,
    auth.isLoading,
    auth.user,
    optimizedLogin,
    optimizedLogout,
    cache.getStats(),
    performance.stats,
    cache.invalidate,
    performance.clearMetrics
  ]);

  return (
    <OptimizedAuthContext.Provider value={value}>
      {children}
    </OptimizedAuthContext.Provider>
  );
};

export const useOptimizedAuth = () => {
  const context = useContext(OptimizedAuthContext);
  if (!context) {
    throw new Error('useOptimizedAuth must be used within OptimizedAuthProvider');
  }
  return context;
};
