
import { toast } from 'sonner';
import { UserProfile, Expert } from '@/types/supabase';

export const useExpertInteractions = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addToFavorites = (expert: Expert) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const removeFromFavorites = (expertId: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const addReview = (expertId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const reportExpert = (expertId: string, reason: string, details: string) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };
  
  const hasTakenServiceFrom = (expertId: string): boolean => {
    if (!currentUser) return false;
    return false;
  };
  
  const getExpertShareLink = (expertId: string): string => {
    return `${window.location.origin}/experts/${expertId}?ref=${currentUser?.id || 'guest'}`;
  };

  return {
    addToFavorites,
    removeFromFavorites,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
