
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReportUI, ReportDB, ModerationAction } from '@/types/supabase/moderation';
import { ReviewUI } from '@/types/supabase/reviews';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [feedback, setFeedback] = useState<ReviewUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          session_id,
          users:reporter_id(name),
          experts:target_id(name)
        `)
        .order('created_at', { ascending: false });

      if (reportError) throw reportError;

      // Transform report data
      const transformedReports: ReportUI[] = (reportData || []).map(report => ({
        id: report.id,
        reporterId: report.reporter_id,
        reporterType: report.reporter_type,
        reporterName: report.reporter_type === 'user' 
          ? report.users?.name || 'Unknown User'
          : report.experts?.name || 'Unknown Expert',
        targetId: report.target_id,
        targetType: report.target_type,
        targetName: report.target_type === 'user'
          ? report.users?.name || 'Unknown User'
          : report.experts?.name || 'Unknown Expert',
        reason: report.reason as any,
        details: report.details,
        status: report.status as any,
        date: report.created_at,
        sessionId: report.session_id
      }));

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
          verified,
          users:user_id(name),
          experts:expert_id(name)
        `)
        .order('date', { ascending: false });

      if (reviewError) throw reviewError;

      // Transform review data
      const transformedReviews: ReviewUI[] = (reviewData || []).map(review => ({
        id: review.id,
        userId: review.user_id,
        userName: review.users?.name || 'Unknown User',
        expertId: String(review.expert_id),
        expertName: review.experts?.name || 'Unknown Expert',
        rating: review.rating,
        comment: review.comment || '',
        date: review.date,
        verified: review.verified || false
      }));

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
  const handleTakeAction = async (reportId: string, actionType: string, message: string, notes?: string) => {
    try {
      // Get the current admin user (this will need to be updated based on your auth implementation)
      const adminId = 'admin_user_id'; // Replace with actual admin ID
      const adminName = 'Administrator'; // Replace with actual admin name

      // 1. Create a moderation action record
      const { data: actionData, error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: adminId,
          action_type: actionType,
          message: message,
          notes: notes,
          created_at: new Date().toISOString()
        })
        .select();

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

      // 4. Send notification to the user or expert
      // This would need to be implemented based on your notification system

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
