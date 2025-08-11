import { useEffect, useRef } from 'react';

/**
 * Hook to prevent memory leaks by tracking component mount state
 * and providing utilities for safe async operations
 */
export const useMemoryLeak = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetState = <T>(setter: (value: T) => void) => {
    return (value: T) => {
      if (isMountedRef.current) {
        setter(value);
      }
    };
  };

  const safeAsyncOperation = async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      const result = await operation();
      if (isMountedRef.current && onSuccess) {
        onSuccess(result);
      }
      return isMountedRef.current ? result : null;
    } catch (error) {
      if (isMountedRef.current && onError) {
        onError(error as Error);
      }
      return null;
    }
  };

  return {
    isMounted: () => isMountedRef.current,
    safeSetState,
    safeAsyncOperation
  };
};

/**
 * Hook for cleanup utilities
 */
export const useCleanup = () => {
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  const addCleanup = (cleanupFn: () => void) => {
    cleanupFunctionsRef.current.push(cleanupFn);
  };

  const cleanup = () => {
    cleanupFunctionsRef.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        // Silently handle cleanup errors
      }
    });
    cleanupFunctionsRef.current = [];
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return { addCleanup, cleanup };
};