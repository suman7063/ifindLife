import { useEffect, useRef, useCallback } from 'react';

interface UseLoadingTimeoutProps {
  isLoading: boolean;
  timeout: number;
  onTimeout: () => void;
  dependencies?: React.DependencyList;
}

export const useLoadingTimeout = ({
  isLoading,
  timeout,
  onTimeout,
  dependencies = []
}: UseLoadingTimeoutProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback ref updated
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      clearLoadingTimeout();
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, timeout);
    } else {
      // Clear timeout if not loading
      clearLoadingTimeout();
    }

    return clearLoadingTimeout;
  }, [isLoading, timeout, clearLoadingTimeout, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return clearLoadingTimeout;
  }, [clearLoadingTimeout]);

  return { clearLoadingTimeout };
};
