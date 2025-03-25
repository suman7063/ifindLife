
import { toast } from 'sonner';
import { UserProfile, Expert } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useExpertInteractions = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addToFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to add to favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: currentUser.id,
          expert_id: parseInt(expertId, 10) // Convert string to number
        });

      if (error) throw error;
      
      toast.success('Expert added to favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (expertId: string) => {
    if (!currentUser) {
      toast.error('Please log in to remove from favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('expert_id', parseInt(expertId, 10)); // Convert string to number

      if (error) throw error;
      
      toast.success('Expert removed from favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from favorites');
    }
  };

  const addReview = async (expertId: string, rating: number, comment: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: currentUser.id,
          expert_id: parseInt(expertId, 10), // Convert string to number
          rating,
          comment,
          date: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Review submitted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
    }
  };
  
  const reportExpert = async (expertId: string, reason: string, details: string) => {
    if (!currentUser) {
      toast.error('Please log in to report an expert');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: currentUser.id,
          expert_id: parseInt(expertId, 10), // Convert string to number
          reason,
          details,
          date: new Date().toISOString(),
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Report submitted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
    }
  };
  
  const hasTakenServiceFrom = (expertId: string): boolean => {
    if (!currentUser) return false;
    // In a real application, you would check if the user has taken service from the expert
    return true;
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
