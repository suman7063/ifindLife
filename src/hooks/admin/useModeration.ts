
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReportUI, ModerationActionType, ReporterType, TargetType, ModerationStatus } from '@/types/supabase';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('moderation_reports')
        .select(`
          *,
          reporter:reporter_id,
          target:target_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data for UI consumption
      const formattedReports = data.map(item => {
        // Use default values when reporter or target information is not available
        const reporterName = item.reporter ? 'Unknown User' : 'Unknown User';
        const targetName = item.target ? 'Unknown Target' : 'Unknown Target';

        return {
          id: item.id,
          reporterId: item.reporter_id,
          reporterType: item.reporter_type as ReporterType,
          reporterName: reporterName,
          targetId: item.target_id,
          targetType: item.target_type as TargetType,
          targetName: targetName,
          reason: item.reason,
          details: item.details || '',
          status: item.status as ModerationStatus,
          date: item.created_at,
          sessionId: item.session_id || ''
        };
      });

      setReports(formattedReports as ReportUI[]);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to assign a report to an admin
  const assignReport = async (reportId: string, adminId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ 
          status: 'in_review' as ModerationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'in_review' as ModerationStatus } 
            : report
        )
      );

      toast.success('Report has been assigned for review');
      return true;
    } catch (err: any) {
      console.error('Error assigning report:', err);
      toast.error('Failed to assign report');
      return false;
    }
  };

  // Function to dismiss a report
  const dismissReport = async (reportId: string, adminId: string, notes?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ 
          status: 'dismissed' as ModerationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      // Create a moderation action record
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: adminId,
          action_type: 'dismiss' as ModerationActionType,
          message: 'Report dismissed',
          notes: notes || 'No additional notes'
        });

      if (actionError) {
        console.error('Error creating moderation action:', actionError);
      }

      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'dismissed' as ModerationStatus } 
            : report
        )
      );

      toast.success('Report has been dismissed');
      return true;
    } catch (err: any) {
      console.error('Error dismissing report:', err);
      toast.error('Failed to dismiss report');
      return false;
    }
  };

  // Function to take action on a report
  const takeAction = async (reportId: string, adminId: string, actionType: ModerationActionType): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ 
          status: 'actioned' as ModerationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      // Create a moderation action record
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: adminId,
          action_type: actionType,
          message: `Action taken: ${actionType}`,
          notes: 'Action processed via moderation dashboard'
        });

      if (actionError) {
        console.error('Error creating moderation action:', actionError);
      }

      // Update local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'actioned' as ModerationStatus } 
            : report
        )
      );

      toast.success(`Action "${actionType}" has been taken`);
      return true;
    } catch (err: any) {
      console.error('Error taking action on report:', err);
      toast.error('Failed to take action on report');
      return false;
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    assignReport,
    dismissReport,
    takeAction
  };
};
