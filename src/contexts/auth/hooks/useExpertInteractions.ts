
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useExpertInteractions = (user: any) => {
  // Report an expert
  const reportExpert = async (expertId: string, reason: string, details: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to report an expert');
      return false;
    }
    
    try {
      // Create the report
      const { error } = await supabase
        .from('user_reports')
        .insert([{
          reporter_id: user.id,
          reported_entity_id: expertId,
          entity_type: 'expert',
          reason,
          details,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error reporting expert:', error);
        toast.error('Failed to submit report');
        return false;
      }
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error reporting expert:', error);
      toast.error('An error occurred while submitting report');
      return false;
    }
  };
  
  // Review an expert
  const reviewExpert = async (expertId: string, rating: number, comment: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to review an expert');
      return false;
    }
    
    try {
      // Check if already reviewed
      const { data: existingReview, error: checkError } = await supabase
        .from('expert_reviews')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId })
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking reviews:', checkError);
        toast.error('Failed to submit review');
        return false;
      }
      
      let success = false;
      
      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from('expert_reviews')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);
        
        if (updateError) {
          console.error('Error updating review:', updateError);
          toast.error('Failed to update review');
          return false;
        }
        
        success = true;
        toast.success('Review updated successfully');
      } else {
        // Create new review
        const { error: insertError } = await supabase
          .from('expert_reviews')
          .insert([{
            user_id: user.id,
            expert_id: expertId,
            rating,
            comment,
            created_at: new Date().toISOString(),
            status: 'published'
          }]);
        
        if (insertError) {
          console.error('Error submitting review:', insertError);
          toast.error('Failed to submit review');
          return false;
        }
        
        success = true;
        toast.success('Review submitted successfully');
      }
      
      return success;
    } catch (error) {
      console.error('Error reviewing expert:', error);
      toast.error('An error occurred while submitting review');
      return false;
    }
  };

  // Check if user has taken a service from an expert
  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check appointments
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('id')
        .match({ user_id: user.id, expert_id: expertId, status: 'completed' })
        .limit(1);
      
      if (appointmentError) {
        console.error('Error checking appointments:', appointmentError);
        return false;
      }
      
      // If they have completed appointments, they've taken service
      if (appointments && appointments.length > 0) {
        return true;
      }
      
      // Also check program enrollments (if expert is a program instructor)
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('program_enrollments')
        .select(`
          id,
          programs (
            instructor_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1);
      
      if (enrollmentError) {
        console.error('Error checking enrollments:', enrollmentError);
        return false;
      }
      
      // Check if any enrollments have the expert as instructor
      const hasProgram = (enrollments || []).some(
        enrollment => enrollment.programs && enrollment.programs.instructor_id === expertId
      );
      
      return hasProgram;
    } catch (error) {
      console.error("Error in hasTakenServiceFrom:", error);
      return false;
    }
  };

  const getExpertShareLink = (expertId: string | number): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/experts/${expertId}`;
  };

  return {
    reportExpert,
    reviewExpert,
    hasTakenServiceFrom,
    getExpertShareLink
  };
};
