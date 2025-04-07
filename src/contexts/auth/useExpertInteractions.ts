
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Expert } from '@/types/expert';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';
import { useUserFavorites } from '@/hooks/user-auth/useUserFavorites';

export const useExpertInteractions = (
  currentUser: UserProfile | null,
  setCurrentUser: (user: UserProfile | null) => void
) => {
  const { 
    addExpertToFavorites,
    removeExpertFromFavorites
  } = useUserFavorites(currentUser?.id);
  
  // Add to favorites - for backward compatibility
  const addToFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error('You need to login to add favorites');
      return false;
    }
    
    try {
      const { data: expertData } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();
        
      if (!expertData) {
        toast.error('Expert not found');
        return false;
      }
      
      return await addExpertToFavorites(expertData as Expert);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add expert to favorites');
      return false;
    }
  };
  
  // Remove from favorites - for backward compatibility
  const removeFromFavorites = async (expertId: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error('You need to login to manage favorites');
      return false;
    }
    
    try {
      const { data: expertData } = await supabase
        .from('experts')
        .select('*')
        .eq('id', expertId)
        .single();
        
      if (!expertData) {
        toast.error('Expert not found');
        return false;
      }
      
      return await removeExpertFromFavorites(expertData as Expert);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove expert from favorites');
      return false;
    }
  };

  // Add a review for an expert
  const addReview = async (reviewData: { expertId: string; rating: number; comment: string }): Promise<boolean> => {
    if (!currentUser) {
      toast.error('You need to login to add a review');
      return false;
    }
    
    try {
      const { expertId, rating, comment } = reviewData;
      
      // Add review to user_reviews table
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          expert_id: parseInt(expertId, 10), // Convert string to number
          user_id: currentUser.id,
          rating,
          comment,
          date: new Date().toISOString(),
          verified: true
        });
        
      if (error) throw error;
      
      toast.success('Review submitted successfully');
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
      return false;
    }
  };

  // Report an expert
  const reportExpert = async (reportData: { expertId: string; reason: string; details: string }): Promise<boolean> => {
    if (!currentUser) {
      toast.error('You need to login to report an expert');
      return false;
    }
    
    try {
      const { expertId, reason, details } = reportData;
      
      // Add report to user_reports table
      const { error } = await supabase
        .from('user_reports')
        .insert({
          expert_id: parseInt(expertId, 10), // Convert string to number
          user_id: currentUser.id,
          reason,
          details,
          date: new Date().toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      toast.error('Failed to submit report');
      return false;
    }
  };

  // Check if user has taken a service from this expert
  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertId)
        .eq('status', 'completed')
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };

  // Get a shareable link for an expert
  const getExpertShareLink = (expertId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
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
