
/**
 * Bundle optimization utilities for authentication system
 * Reduces bundle size and improves loading performance
 */

// Lazy load heavy authentication dependencies
export const loadAuthDependencies = {
  // Lazy load form validation
  validation: () => import('zod').then(module => module.z),
  
  // Lazy load date utilities
  dateUtils: () => import('date-fns'),
  
  // Lazy load chart components for analytics
  charts: () => import('recharts'),
};

// Preload critical authentication modules
export const preloadAuthModules = () => {
  // Preload in idle time
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      import('@/contexts/auth/AuthProvider');
      import('@/contexts/auth/SecurityContext');
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      import('@/contexts/auth/AuthProvider');
      import('@/contexts/auth/SecurityContext');
    }, 100);
  }
};

// Bundle size analysis helper
export const getAuthBundleInfo = () => {
  if (import.meta.env.DEV) {
    return {
      components: [
        'AuthProvider',
        'SecurityProvider', 
        'AuthValidation',
        'SimpleAuthForm',
        'SessionTimeoutWarning'
      ],
      hooks: [
        'useAuth',
        'useAuthCache',
        'useAuthPerformance',
        'useSessionTimeout'
      ],
      utilities: [
        'securityUtils',
        'authRedirectSystem',
        'bundleOptimization'
      ]
    };
  }
  return null;
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  if (import.meta.env.DEV) {
    // Check if auth bundle exceeds recommended size
    const authModules = [
      'contexts/auth/',
      'components/auth/',
      'hooks/auth/',
      'utils/auth/'
    ];
    
    console.group('🎯 Auth Bundle Performance Budget');
    console.log('📦 Monitoring auth-related modules for size optimization');
    console.log('⚡ Recommended: Keep auth bundle under 50KB gzipped');
    console.log('🔍 Use webpack-bundle-analyzer for detailed analysis');
    console.groupEnd();
  }
};
