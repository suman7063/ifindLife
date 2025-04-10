
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useExpertInteractions = (user: User | null) => {
  // Report an expert
  const reportExpert = useCallback(async (
    expertId: string, 
    reason: string, 
    details: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to report an expert');
      return false;
    }
    
    try {
      const report = {
        user_id: user.id,
        expert_id: expertId,
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
        toast.error('Failed to submit report');
        return false;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error in reportExpert:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [user]);
  
  // Submit a review for an expert
  const reviewExpert = useCallback(async (
    expertId: string, 
    rating: number, 
    comment: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to review an expert');
      return false;
    }
    
    try {
      // Check if the user has taken a service from this expert
      const hasTaken = await hasTakenServiceFrom(expertId);
      
      if (!hasTaken) {
        toast.error('You can only review experts you have taken services from');
        return false;
      }
      
      // Check if already reviewed
      const { data: existingReview } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('expert_id', expertId)
        .single();
        
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('user_reviews')
          .update({
            rating,
            comment,
            date: new Date().toISOString()
          })
          .eq('id', existingReview.id);
          
        if (error) {
          console.error('Error updating review:', error);
          toast.error('Failed to update review');
          return false;
        }
        
        toast.success('Review updated successfully');
      } else {
        // Create new review
        const { error } = await supabase
          .from('user_reviews')
          .insert({
            user_id: user.id,
            expert_id: expertId,
            rating,
            comment,
            date: new Date().toISOString(),
            verified: true
          });
          
        if (error) {
          console.error('Error submitting review:', error);
          toast.error('Failed to submit review');
          return false;
        }
        
        toast.success('Review submitted successfully');
      }
      
      // Update the expert's average rating
      await updateExpertRating(expertId);
      
      return true;
    } catch (error) {
      console.error('Error in reviewExpert:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [user]);
  
  // Check if user has taken a service from an expert
  const hasTakenServiceFrom = useCallback(async (expertId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check for completed services with this expert
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', user.id)
        .eq('expert_id', expertId)
        .eq('status', 'completed')
        .limit(1);
        
      if (error) {
        console.error('Error checking service history:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasTakenServiceFrom:', error);
      return false;
    }
  }, [user]);
  
  // Update expert's average rating
  const updateExpertRating = async (expertId: string): Promise<void> => {
    try {
      // Get all reviews for this expert
      const { data: reviews, error } = await supabase
        .from('user_reviews')
        .select('rating')
        .eq('expert_id', expertId);
        
      if (error || !reviews) {
        console.error('Error fetching reviews for rating update:', error);
        return;
      }
      
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      // Update expert's record
      await supabase
        .from('expert_accounts')
        .update({
          average_rating: avgRating,
          reviews_count: reviews.length
        })
        .eq('id', expertId);
    } catch (error) {
      console.error('Error updating expert rating:', error);
    }
  };
  
  // Check if a user has booked or is currently enrolled in a course with an instructor
  const hasBookedWithInstructor = useCallback(async (instructorId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check for any appointments with this instructor
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user.id)
        .eq('expert_id', instructorId)
        .limit(1);
        
      if (appointmentsError) {
        console.error('Error checking appointment history:', appointmentsError);
      } else if (appointments && appointments.length > 0) {
        return true;
      }
      
      // Check for any courses with this instructor
      const { data: courses, error: coursesError } = await supabase
        .from('user_courses')
        .select('expert_id')
        .eq('user_id', user.id)
        .limit(10);
        
      if (coursesError) {
        console.error('Error checking course history:', coursesError);
        return false;
      }
      
      // Check if any course is associated with the given instructor
      // Safe access to avoid the property error
      const hasInstructor = courses ? courses.some(course => 
        course && typeof course === 'object' && 
        'expert_id' in course && 
        course.expert_id === instructorId
      ) : false;
      
      return hasInstructor;
    } catch (error) {
      console.error('Error in hasBookedWithInstructor:', error);
      return false;
    }
  }, [user]);
  
  // Generate share link for an expert
  const getExpertShareLink = (expertId: string | number): string => {
    return `${window.location.origin}/experts/${expertId}`;
  };

  return {
    reportExpert,
    reviewExpert,
    hasTakenServiceFrom,
    hasBookedWithInstructor,
    getExpertShareLink
  };
};
