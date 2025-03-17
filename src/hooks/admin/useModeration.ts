
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReportUI, ReportStatus, ModerationActionType } from '@/types/supabase/moderation';
import { ReviewUI } from '@/types/supabase/reviews';
import { useAuth } from '@/contexts/AuthContext';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [feedback, setFeedback] = useState<ReviewUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch reports and feedback
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch reports
      const { data: reportData, error: reportError } = await supabase
        .from('moderation_reports')
        .select(`
          id,
          reporter_id,
          reporter_type,
          target_id,
          target_type,
          reason,
          details,
          status,
          created_at,
          session_id
        `)
        .order('created_at', { ascending: false });

      if (reportError) throw reportError;

      // Get reporter/target names
      const transformedReports: ReportUI[] = await Promise.all(
        (reportData || []).map(async (report) => {
          let reporterName = 'Unknown';
          let targetName = 'Unknown';

          // Get reporter name based on type
          if (report.reporter_type === 'user') {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', report.reporter_id)
              .single();
            reporterName = userData?.name || 'Unknown User';
          } else {
            const { data: expertData } = await supabase
              .from('experts')
              .select('name')
              .eq('id', report.reporter_id)
              .single();
            reporterName = expertData?.name || 'Unknown Expert';
          }

          // Get target name based on type
          if (report.target_type === 'user') {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', report.target_id)
              .single();
            targetName = userData?.name || 'Unknown User';
          } else {
            const { data: expertData } = await supabase
              .from('experts')
              .select('name')
              .eq('id', report.target_id)
              .single();
            targetName = expertData?.name || 'Unknown Expert';
          }

          return {
            id: report.id,
            reporterId: report.reporter_id,
            reporterType: report.reporter_type as 'user' | 'expert',
            reporterName: reporterName,
            targetId: report.target_id,
            targetType: report.target_type as 'user' | 'expert',
            targetName: targetName,
            reason: report.reason as any,
            details: report.details || '',
            status: report.status as 'pending' | 'under_review' | 'resolved' | 'dismissed',
            date: report.created_at,
            sessionId: report.session_id
          };
        })
      );

      setReports(transformedReports);

      // Fetch feedback (reviews)
      const { data: reviewData, error: reviewError } = await supabase
        .from('user_reviews')
        .select(`
          id,
          user_id,
          expert_id,
          rating,
          comment,
          date,
          verified
        `)
        .order('date', { ascending: false });

      if (reviewError) throw reviewError;

      // Transform review data
      const transformedReviews: ReviewUI[] = await Promise.all(
        (reviewData || []).map(async (review) => {
          let userName = 'Unknown User';
          let expertName = 'Unknown Expert';

          // Get user name
          if (review.user_id) {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', review.user_id)
              .single();
            userName = userData?.name || 'Unknown User';
          }

          // Get expert name
          const { data: expertData } = await supabase
            .from('experts')
            .select('name')
            .eq('id', review.expert_id.toString())
            .single();
          expertName = expertData?.name || 'Unknown Expert';

          return {
            id: review.id,
            userId: review.user_id || '',
            userName: userName,
            expertId: String(review.expert_id),
            expertName: expertName,
            rating: review.rating,
            comment: review.comment || '',
            date: review.date,
            verified: review.verified || false
          };
        })
      );

      setFeedback(transformedReviews);
    } catch (error: any) {
      console.error('Error fetching moderation data:', error);
      toast.error(error.message || 'Failed to load moderation data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Mark a report as under review
  const handleReviewReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status: 'under_review' })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'under_review' } 
            : report
        )
      );

      toast.success('Report marked as under review');
    } catch (error: any) {
      console.error('Error updating report status:', error);
      toast.error(error.message || 'Failed to update report');
    }
  };

  // Dismiss a report
  const handleDismissReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status: 'dismissed' })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'dismissed' } 
            : report
        )
      );

      toast.success('Report dismissed');
    } catch (error: any) {
      console.error('Error dismissing report:', error);
      toast.error(error.message || 'Failed to dismiss report');
    }
  };

  // Take action on a report
  const handleTakeAction = async (reportId: string, actionType: ModerationActionType, message: string, notes?: string) => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to take action');
        return;
      }

      // 1. Create a moderation action record
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: currentUser.username, // Using username as ID since we don't have real auth.users
          action_type: actionType as 'warning' | 'suspension' | 'ban' | 'no_action',
          message: message,
          notes: notes,
        });

      if (actionError) throw actionError;

      // 2. Update the report status to resolved
      const { error: reportError } = await supabase
        .from('moderation_reports')
        .update({ status: 'resolved' })
        .eq('id', reportId);

      if (reportError) throw reportError;

      // 3. Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'resolved' } 
            : report
        )
      );

      toast.success(`Action taken: ${actionType}`);

      // Refresh data to ensure it's up to date
      fetchData();
    } catch (error: any) {
      console.error('Error taking action:', error);
      toast.error(error.message || 'Failed to take action');
    }
  };

  // Delete feedback
  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.filter(item => item.id !== feedbackId)
      );

      toast.success('Feedback deleted successfully');
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      toast.error(error.message || 'Failed to delete feedback');
    }
  };

  return {
    reports,
    feedback,
    isLoading,
    fetchData,
    handleReviewReport,
    handleDismissReport,
    handleTakeAction,
    handleDeleteFeedback
  };
};
