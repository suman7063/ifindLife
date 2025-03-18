import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { convertExpertIdToString } from '@/types/supabase/expertId';
import { ModerationStatus, ModerationActionType, ReportUI, ReporterType, TargetType } from '@/types/supabase/moderation';
import { Review } from '@/types/supabase/reviews';
import { useAuth } from '@/contexts/AuthContext';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [feedback, setFeedback] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
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

      const transformedReports: ReportUI[] = await Promise.all(
        (reportData || []).map(async (report) => {
          let reporterName = 'Unknown';
          let targetName = 'Unknown';

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
            reporterType: report.reporter_type as ReporterType,
            reporterName: reporterName,
            targetId: report.target_id,
            targetType: report.target_type as TargetType,
            targetName: targetName,
            reason: report.reason,
            details: report.details || '',
            status: report.status as ModerationStatus,
            date: report.created_at,
            sessionId: report.session_id
          };
        })
      );

      setReports(transformedReports);

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

      const transformedReviews: Review[] = await Promise.all(
        (reviewData || []).map(async (review) => {
          let userName = 'Unknown User';
          let expertName = 'Unknown Expert';

          if (review.user_id) {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', review.user_id)
              .single();
            userName = userData?.name || 'Unknown User';
          }

          const { data: expertData } = await supabase
            .from('experts')
            .select('name')
            .eq('id', review.expert_id.toString())
            .single();
          expertName = expertData?.name || 'Unknown Expert';

          return {
            id: review.id,
            expertId: String(review.expert_id),
            rating: review.rating,
            comment: review.comment || '',
            date: review.date,
            verified: review.verified || false,
            userId: review.user_id || '',
            userName: userName,
            expertName: expertName
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewReport = useCallback(async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status: 'under_review' })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.REVIEWING } 
            : report
        )
      );

      toast.success('Report marked as under review');
    } catch (error: any) {
      console.error('Error updating report status:', error);
      toast.error(error.message || 'Failed to update report');
    }
  }, []);

  const handleDismissReport = useCallback(async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status: 'dismissed' })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.DISMISSED } 
            : report
        )
      );

      toast.success('Report dismissed');
    } catch (error: any) {
      console.error('Error dismissing report:', error);
      toast.error(error.message || 'Failed to dismiss report');
    }
  }, []);

  const handleTakeAction = useCallback(async (reportId: string, actionType: ModerationActionType, message: string, notes?: string) => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to take action');
        return;
      }

      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: currentUser.username,
          action_type: actionType,
          message: message,
          notes: notes,
        });

      if (actionError) throw actionError;

      const { error: reportError } = await supabase
        .from('moderation_reports')
        .update({ status: 'resolved' })
        .eq('id', reportId);

      if (reportError) throw reportError;

      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.RESOLVED } 
            : report
        )
      );

      toast.success(`Action taken: ${actionType}`);

      fetchData();
    } catch (error: any) {
      console.error('Error taking action:', error);
      toast.error(error.message || 'Failed to take action');
    }
  }, [fetchData]);

  const handleDeleteFeedback = useCallback(async (feedbackId: string) => {
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      setFeedback(prevFeedback => 
        prevFeedback.filter(item => item.id !== feedbackId)
      );

      toast.success('Feedback deleted successfully');
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      toast.error(error.message || 'Failed to delete feedback');
    }
  }, []);

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
