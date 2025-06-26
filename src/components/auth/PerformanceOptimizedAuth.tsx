
import React, { Suspense } from 'react';
import { OptimizedAuthProvider } from '@/contexts/auth/OptimizedAuthContext';
import AuthPerformanceMonitor from './AuthPerformanceMonitor';
import LoadingScreen from './LoadingScreen';

interface PerformanceOptimizedAuthProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
}

/**
 * Performance-optimized authentication wrapper
 * Combines all Phase 4 optimizations in a single component
 */
const PerformanceOptimizedAuth: React.FC<PerformanceOptimizedAuthProps> = ({
  children,
  showPerformanceMonitor = true
}) => {
  return (
    <Suspense fallback={<LoadingScreen message="Optimizing authentication system..." />}>
      <OptimizedAuthProvider>
        {children}
        {showPerformanceMonitor && <AuthPerformanceMonitor />}
      </OptimizedAuthProvider>
    </Suspense>
  );
};

export default PerformanceOptimizedAuth;
