
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  ModerationStatus, 
  ModerationType,
  ReportUI
} from '@/types/supabase/moderation';

/**
 * Hook for handling moderation actions in the admin panel
 */
export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reports
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('moderation_reports')
        .select(`
          *,
          reporting_user:reporter_id(name),
          target_user:target_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert data to UI format
      const formattedReports: ReportUI[] = data.map(report => ({
        id: report.id,
        reporterId: report.reporter_id,
        reporterType: report.reporter_type,
        reporterName: report.reporting_user?.name || 'Unknown User',
        targetId: report.target_id,
        targetType: report.target_type,
        targetName: report.target_user?.name || 'Unknown Target',
        reason: report.reason,
        details: report.details || '',
        status: report.status,
        date: new Date(report.created_at).toLocaleDateString(),
        sessionId: report.session_id || undefined
      }));

      setReports(formattedReports);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to load reports: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Assign a report to an admin for review
  const assignReport = async (reportId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({
          status: 'reviewing',
          assigned_to: adminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      toast.success('Report assigned for review');
      
      // Update the local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.REVIEWING } 
            : report
        )
      );
      
      return true;
    } catch (err: any) {
      toast.error(`Failed to assign report: ${err.message}`);
      return false;
    }
  };

  // Dismiss a report without taking action
  const dismissReport = async (reportId: string, adminId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({
          status: 'dismissed',
          resolved_by: adminId,
          admin_notes: notes || 'No further action required',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      toast.success('Report dismissed');
      
      // Update the local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.DISMISSED } 
            : report
        )
      );
      
      return true;
    } catch (err: any) {
      toast.error(`Failed to dismiss report: ${err.message}`);
      return false;
    }
  };

  // Take action on a report and resolve it
  const takeAction = async (
    reportId: string, 
    adminId: string, 
    actionType: ModerationType, 
    message: string, 
    notes?: string
  ) => {
    try {
      // First update the report status
      const { error: reportError } = await supabase
        .from('moderation_reports')
        .update({
          status: 'resolved',
          resolved_by: adminId,
          action_taken: actionType,
          admin_notes: notes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) {
        throw reportError;
      }

      // Then create a moderation action record
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          admin_id: adminId,
          action_type: actionType,
          message: message,
          created_at: new Date().toISOString()
        });

      if (actionError) {
        throw actionError;
      }

      toast.success(`Action taken: ${actionType}`);
      
      // Update the local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: ModerationStatus.RESOLVED } 
            : report
        )
      );
      
      return true;
    } catch (err: any) {
      toast.error(`Failed to take action: ${err.message}`);
      return false;
    }
  };

  // Load reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

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

export default useModeration;
