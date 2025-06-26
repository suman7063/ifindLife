
import { useCallback, useEffect } from 'react';
import { useOptimizedAuth } from '@/contexts/auth/OptimizedAuthContext';
import { useAuthCache } from './useAuthCache';
import { useAuthPerformance } from './useAuthPerformance';

interface AuthFlowConfig {
  enableCaching: boolean;
  enablePerformanceTracking: boolean;
  cacheUserProfiles: boolean;
  trackSlowOperations: boolean;
}

const DEFAULT_CONFIG: AuthFlowConfig = {
  enableCaching: true,
  enablePerformanceTracking: true,
  cacheUserProfiles: true,
  trackSlowOperations: true
};

/**
 * Optimized authentication flow hook
 * Combines caching, performance tracking, and smart loading
 */
export const useOptimizedAuthFlow = (config: Partial<AuthFlowConfig> = {}) => {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const auth = useOptimizedAuth();
  const cache = useAuthCache();
  const performance = useAuthPerformance();

  // Smart user profile loading with caching
  const loadUserProfile = useCallback(async (userId: string, forceRefresh = false) => {
    if (!settings.enableCaching || forceRefresh) {
      return performance.measurePerformance(
        'loadUserProfile',
        async () => {
          // Direct API call - implement based on your API
          const response = await fetch(`/api/users/${userId}`);
          const profile = await response.json();
          
          if (settings.cacheUserProfiles) {
            cache.set(`profile:${userId}`, profile, 15 * 60 * 1000); // 15 minutes
          }
          
          return profile;
        },
        { userId, cached: false }
      );
    }

    // Try cache first
    const cachedProfile = cache.get(`profile:${userId}`);
    if (cachedProfile) {
      return cachedProfile;
    }

    // Cache miss - load from API
    return loadUserProfile(userId, true);
  }, [settings, performance.measurePerformance, cache, settings.cacheUserProfiles]);

  // Optimized login with smart caching
  const optimizedLogin = useCallback(async (email: string, password: string) => {
    const operation = async () => {
      const result = await auth.login(email, password);
      
      if (result && auth.user && settings.cacheUserProfiles) {
        // Pre-cache user profile
        await loadUserProfile(auth.user.id);
      }
      
      return result;
    };

    if (settings.enablePerformanceTracking) {
      return performance.measurePerformance('optimizedLogin', operation, { email: email.split('@')[1] });
    }
    
    return operation();
  }, [auth.login, auth.user, loadUserProfile, performance.measurePerformance, settings]);

  // Performance insights and recommendations
  const getOptimizationRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    const stats = performance.stats;
    const cacheStats = cache.getStats();

    // Cache efficiency recommendations
    if (cacheStats.hitRate < 50) {
      recommendations.push('Consider increasing cache TTL or improving cache key strategy');
    }

    // Performance recommendations
    if (stats.averageResponseTime > 500) {
      recommendations.push('Auth operations are slow - consider optimizing API calls');
    }

    // Operation frequency recommendations
    if (stats.totalOperations > 100) {
      recommendations.push('High auth operation frequency detected - implement request debouncing');
    }

    return recommendations;
  }, [performance.stats, cache.getStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (import.meta.env.DEV) {
        console.log('🧹 Cleaning up optimized auth flow');
      }
    };
  }, []);

  return {
    // Core auth
    ...auth,
    
    // Optimized methods
    login: optimizedLogin,
    loadUserProfile,
    
    // Performance insights
    getOptimizationRecommendations,
    
    // Metrics
    cacheStats: cache.getStats(),
    performanceStats: performance.stats,
    
    // Configuration
    config: settings
  };
};
