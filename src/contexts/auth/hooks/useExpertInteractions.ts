
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useExpertInteractions = (userId: string | null) => {
  const [loading, setLoading] = useState(false);

  // Add a review for an expert
  const addReview = async (
    expertId: string, 
    rating: number, 
    comment: string
  ): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: userId,
          expert_id: expertId,
          rating,
          comment,
          date: new Date().toISOString(),
          verified: true  // Assuming all reviews from authenticated users are verified
        });
      
      if (error) {
        console.error('Error adding review:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Report an expert
  const reportExpert = async (
    expertId: string, 
    reason: string, 
    details: string
  ): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: userId,
          expert_id: expertId,
          reason,
          details,
          date: new Date().toISOString(),
          status: 'pending'
        });
      
      if (error) {
        console.error('Error reporting expert:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if the user has taken a service from an expert
  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('*')
        .eq('user_id', userId)
        .eq('expert_id', expertId)
        .limit(1);
      
      if (error) {
        console.error('Error checking user service history:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking user service history:', error);
      return false;
    }
  };

  // Get a referral link
  const getReferralLink = (): string | null => {
    if (!userId) return null;
    
    // Fetch the user's referral code from the profiles table
    return `${window.location.origin}/signup?ref=${userId}`;
  };

  // Get a shareable link for an expert
  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };

  return {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getReferralLink,
    getExpertShareLink,
    loading
  };
};
