import { useOptimizedExpertData } from './useOptimizedExpertData';

export function usePublicExpertsData() {
  // Disabled presence checking to prevent excessive API calls
  // Presence is checked only when user interacts with individual expert cards
  return useOptimizedExpertData({ enablePresenceChecking: false });
}