
import { supabase } from '@/lib/supabase';

export const useExpertInteractions = (userId: string | undefined) => {
  
  const addReview = async (expertId: string | object, rating?: number, comment?: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      let reviewData;
      if (typeof expertId === 'string' && rating !== undefined) {
        // Old style: separate parameters
        reviewData = {
          user_id: userId,
          expert_id: expertId,
          rating,
          comment: comment || '',
          date: new Date().toISOString().split('T')[0]
        };
      } else if (typeof expertId === 'object' && expertId !== null && 'expertId' in expertId) {
        // New style: object parameter
        const reviewObj = expertId as any;
        reviewData = {
          user_id: userId,
          expert_id: reviewObj.expertId,
          rating: reviewObj.rating,
          comment: reviewObj.comment || '',
          date: new Date().toISOString().split('T')[0]
        };
      } else {
        return false;
      }

      const { error } = await supabase
        .from('user_reviews')
        .insert(reviewData);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  const reportExpert = async (expertId: string | object, reason?: string, details?: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      let reportData;
      if (typeof expertId === 'string' && reason !== undefined) {
        // Old style: separate parameters
        reportData = {
          user_id: userId,
          expert_id: expertId,
          reason,
          details: details || '',
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
      } else if (typeof expertId === 'object' && expertId !== null && 'expertId' in expertId) {
        // New style: object parameter
        const reportObj = expertId as any;
        reportData = {
          user_id: userId,
          expert_id: reportObj.expertId,
          reason: reportObj.reason,
          details: reportObj.details || '',
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
      } else {
        return false;
      }

      const { error } = await supabase
        .from('user_reports')
        .insert(reportData);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      return false;
    }
  };

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', userId)
        .eq('expert_id', expertId)
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };
  
  const getExpertShareLink = (expertId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };
  
  const getReferralLink = (): string | null => {
    if (!userId) return null;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?ref=${userId}`;
  };

  return {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };
};
