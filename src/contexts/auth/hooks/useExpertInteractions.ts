
import { supabase } from '@/lib/supabase';

export const useExpertInteractions = (userId: string | undefined) => {
  
  const addReview = async (expertId: string | number | object, rating?: number, comment?: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      let reviewData;
      if ((typeof expertId === 'string' || typeof expertId === 'number') && rating !== undefined) {
        // Old style: separate parameters
        const expertIdString = typeof expertId === 'number' ? expertId.toString() : expertId;
        reviewData = {
          user_id: userId,
          expert_id: parseInt(expertIdString, 10),
          rating,
          comment: comment || '',
          date: new Date().toISOString().split('T')[0]
        };
      } else if (typeof expertId === 'object' && expertId !== null && 'expertId' in expertId) {
        // New style: object parameter
        const reviewObj = expertId as any;
        const expertIdString = typeof reviewObj.expertId === 'number' ? reviewObj.expertId.toString() : reviewObj.expertId;
        reviewData = {
          user_id: userId,
          expert_id: parseInt(expertIdString, 10),
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

  const reportExpert = async (expertId: string | number | object, reason?: string, details?: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      let reportData;
      if ((typeof expertId === 'string' || typeof expertId === 'number') && reason !== undefined) {
        // Old style: separate parameters
        const expertIdString = typeof expertId === 'number' ? expertId.toString() : expertId;
        reportData = {
          user_id: userId,
          expert_id: parseInt(expertIdString, 10),
          reason,
          details: details || '',
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
      } else if (typeof expertId === 'object' && expertId !== null && 'expertId' in expertId) {
        // New style: object parameter
        const reportObj = expertId as any;
        const expertIdString = typeof reportObj.expertId === 'number' ? reportObj.expertId.toString() : reportObj.expertId;
        reportData = {
          user_id: userId,
          expert_id: parseInt(expertIdString, 10),
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

  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const expertIdString = typeof expertId === 'number' ? expertId.toString() : expertId;
      
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', userId)
        .eq('expert_id', expertIdString)
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };
  
  const getExpertShareLink = (expertId: string | number): string => {
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
