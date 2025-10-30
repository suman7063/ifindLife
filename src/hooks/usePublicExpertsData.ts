import { useOptimizedExpertData } from './useOptimizedExpertData';

export function usePublicExpertsData() {
  // Enable presence checking so list fetches presence for visible experts
  return useOptimizedExpertData({ enablePresenceChecking: true });
}