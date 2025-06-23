
import { useState } from 'react';
import { toast } from 'sonner';
import { UserReview } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';

export const useExpertInteractions = (userId: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReview = async (
    expertId: string | number,
    rating: number,
    comment: string
  ): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to leave a review');
      return false;
    }

    try {
      setIsSubmitting(true);

      // Convert expertId to number for database compatibility
      const expertIdNumber = typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;

      // Check if user has already reviewed this expert
      const { data: existingReviews, error: checkError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('expert_id', expertIdNumber);

      if (checkError) {
        console.error('Error checking existing reviews:', checkError);
        toast.error('Failed to check if you already reviewed this expert');
        return false;
      }

      if (existingReviews && existingReviews.length > 0) {
        toast.error('You have already reviewed this expert');
        return false;
      }

      // Add new review
      const reviewData = {
        expert_id: expertIdNumber,
        user_id: userId,
        rating,
        comment,
        date: new Date().toISOString(),
        verified: false,
      };

      const { error } = await supabase
        .from('user_reviews')
        .insert(reviewData);

      if (error) {
        console.error('Error adding review:', error);
        toast.error('Failed to add your review');
        return false;
      }

      toast.success('Your review has been submitted successfully');
      return true;
    } catch (error) {
      console.error('Error in addReview:', error);
      toast.error('An error occurred while submitting your review');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportExpert = async (
    expertId: string | number,
    reason: string,
    details: string
  ): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to report an expert');
      return false;
    }

    try {
      setIsSubmitting(true);

      // Convert expertId to number for database compatibility
      const expertIdNumber = typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;

      const reportData = {
        expert_id: expertIdNumber,
        user_id: userId,
        reason,
        details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const { error } = await supabase
        .from('user_reports')
        .insert(reportData);

      if (error) {
        console.error('Error reporting expert:', error);
        toast.error('Failed to submit your report');
        return false;
      }

      toast.success('Your report has been submitted successfully');
      return true;
    } catch (error) {
      console.error('Error in reportExpert:', error);
      toast.error('An error occurred while submitting your report');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    return true; // Placeholder for now
  };

  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };

  const getReferralLink = (): string | null => {
    return null; // Placeholder implementation
  };

  return {
    isSubmitting,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };
};
