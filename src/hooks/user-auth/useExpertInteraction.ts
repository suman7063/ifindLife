
import { UserProfile } from '@/types/supabase';

export const useExpertInteraction = (
  currentUser: UserProfile | null
) => {
  const hasTakenServiceFrom = (expertId: string): boolean => {
    // In a real application, you would check if the user has taken service from the expert
    // For now, let's return true
    return true;
  };

  const getExpertShareLink = (expertId: string): string => {
    // In a real application, you would generate a share link
    // For now, let's return a dummy link
    return `${window.location.origin}/experts/${expertId}`;
  };

  return {
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
