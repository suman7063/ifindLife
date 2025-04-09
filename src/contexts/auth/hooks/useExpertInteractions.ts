
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserReview } from '@/types/supabase/tables';

export const useExpertInteractions = (userId: string | null) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setIsProcessing(true);
      
      // Check appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', userId)
        .eq('expert_id', expertId)
        .eq('status', 'completed')
        .limit(1);
      
      if (appointmentsError) {
        console.error('Error checking appointments:', appointmentsError);
        return false;
      }
      
      if (appointments && appointments.length > 0) {
        return true;
      }
      
      // Check programs
      const { data: programs, error: programsError } = await supabase
        .from('user_courses')
        .select('id')
        .eq('user_id', userId)
        .eq('expert_id', parseInt(expertId, 10))
        .limit(1);
      
      if (programsError) {
        console.error('Error checking programs:', programsError);
        return false;
      }
      
      return programs && programs.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addReview = async (expertId: string, rating: number, comment: string): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to leave a review');
      return false;
    }
    
    try {
      setIsProcessing(true);
      
      // First check if user has already reviewed this expert
      const { data: existingReviews, error: checkError } = await supabase
        .from('user_reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('expert_id', parseInt(expertId, 10))
        .limit(1);
      
      if (checkError) {
        console.error('Error checking existing reviews:', checkError);
        toast.error('Error checking your previous reviews');
        return false;
      }
      
      if (existingReviews && existingReviews.length > 0) {
        toast.error('You have already reviewed this expert');
        return false;
      }
      
      // Validate the user has actually received service from this expert
      const hasReceivedService = await hasTakenServiceFrom(expertId);
      
      if (!hasReceivedService) {
        toast.error('You can only review experts you have taken services from');
        return false;
      }
      
      // Create the review
      const review = {
        user_id: userId,
        expert_id: parseInt(expertId, 10),
        rating,
        comment,
        date: new Date().toISOString(),
        verified: true
      };
      
      const { error } = await supabase
        .from('user_reviews')
        .insert(review);
      
      if (error) {
        console.error('Error adding review:', error);
        toast.error('Failed to add your review');
        return false;
      }
      
      toast.success('Your review has been submitted');
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('An error occurred while submitting your review');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const reportExpert = async (expertId: string, reason: string, details: string): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to report an expert');
      return false;
    }
    
    try {
      setIsProcessing(true);
      
      const report = {
        user_id: userId,
        expert_id: parseInt(expertId, 10),
        reason,
        details,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      const { error } = await supabase
        .from('user_reports')
        .insert(report);
      
      if (error) {
        console.error('Error reporting expert:', error);
        toast.error('Failed to submit your report');
        return false;
      }
      
      toast.success('Your report has been submitted for review');
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      toast.error('An error occurred while submitting your report');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const getExpertShareLink = (expertId: string): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };

  const getReferralLink = (): string | null => {
    return null; // Implemented in user-specific context
  };

  return {
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    isProcessing
  };
};
