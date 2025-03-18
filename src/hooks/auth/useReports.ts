
import { toast } from 'sonner';
import { UserProfile, Report } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { adaptReportsToUI } from '@/utils/dataAdapters';
import { ReportReason } from '@/types/supabase/moderation';

interface ReportSubmission {
  targetId: string;
  targetType: 'expert' | 'user';
  reason: ReportReason;
  details: string;
}

const useReports = () => {
  // Add a new report
  const addReport = async (user: UserProfile, expertId: string, reason: string, details: string) => {
    if (!user || !user.id) {
      toast.error('You must be logged in to report an expert');
      return null;
    }
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Add the report
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: user.id,
          expert_id: Number(expertId),
          reason,
          details,
          date: today,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Report submitted successfully');
      
      // Return the updated user with reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', user.id);
        
      if (reportsError) throw reportsError;
      
      // Convert reports to the correct format
      const reports = adaptReportsToUI(reportsData || []);
      
      // Update the user object with the reports
      return {
        ...user,
        reports
      };
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Failed to submit report');
      return null;
    }
  };
  
  // Submit a report using the moderation system
  const submitReport = async (reportData: ReportSubmission) => {
    try {
      // This would normally check for currentUser, but we'll mock the user ID
      const mockUserId = 'current-user-id';
      
      const { error } = await supabase
        .from('moderation_reports')
        .insert({
          reporter_id: mockUserId,
          reporter_type: 'user',
          target_id: reportData.targetId,
          target_type: reportData.targetType,
          reason: reportData.reason,
          details: reportData.details,
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success('Report submitted successfully');
      return true;
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
      return false;
    }
  };
  
  // Get reports for a user
  const getUserReports = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return adaptReportsToUI(data || []);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      return [];
    }
  };
  
  return {
    addReport,
    getUserReports,
    submitReport
  };
};

export default useReports;
