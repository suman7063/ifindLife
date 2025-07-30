import { useOptimizedExpertData } from './useOptimizedExpertData';

export function usePublicExpertsData() {
  // Use the optimized hook with presence checking enabled
  return useOptimizedExpertData({ enablePresenceChecking: true });
}