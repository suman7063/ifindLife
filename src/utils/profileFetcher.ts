import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { convertExpertIdToString, convertExpertIdToNumber } from '@/types/supabase/expertId';

// Function to fetch user reviews
export const fetchUserReviews = async (userId: string) => {
  try {
    const { data: reviews, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
    
    const reviewsWithDetails = await Promise.all((reviews || []).map(async (review) => {
      const { data: expertData } = await supabase
        .from('experts')
        .select('name')
        .eq('id', review.expert_id)
        .single();
      
      return {
        id: review.id,
        expertId: convertExpertIdToString(review.expert_id),
        rating: review.rating,
        comment: review.comment || '',
        date: review.date,
        verified: review.verified || false,
        userId: review.user_id || '',
        userName: 'Anonymous User', // Will be updated from user profile
        expertName: expertData?.name || 'Unknown Expert'
      };
    }));
    
    return reviewsWithDetails;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

// Function to fetch user reports
export const fetchUserReports = async (userId: string) => {
  try {
    const { data: reports, error } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user reports:', error);
      return [];
    }
    
    // Map the data to the Report interface
    return (reports || []).map(report => ({
      id: report.id,
      expertId: convertExpertIdToString(report.expert_id),
      reason: report.reason || '',
      details: report.details || '',
      date: report.date || new Date().toISOString(),
      status: report.status || 'pending',
      userId: report.user_id,
      userName: 'User' // Will be updated from profile
    }));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
};
