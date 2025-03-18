
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ModerationActionType, ReportUI, ReporterType, TargetType } from '@/types/supabase/moderation';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('moderation_reports')
        .select(`
          *,
          reporter:reporter_id(*),
          target:target_id(*)
        `);

      if (error) {
        throw error;
      }

      // Transform the data to match our UI model
      const transformedReports: ReportUI[] = data.map(item => ({
        id: item.id,
        reporterId: item.reporter_id,
        reporterType: (item.reporter_type || 'user') as ReporterType,
        reporterName: item.reporter?.name || 'Anonymous',
        targetId: item.target_id,
        targetType: (item.target_type || 'user') as TargetType,
        targetName: item.target?.name || 'Unknown',
        reason: item.reason,
        details: item.details || '',
        status: item.status || 'pending',
        date: item.created_at,
        sessionId: item.session_id || '',
      }));

      setReports(transformedReports);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const assignReport = async (reportId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({
          status: 'in_review',
          assigned_to: adminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(currentReports => 
        currentReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'in_review' } 
            : report
        )
      );

      toast.success('Report assigned for review');
      return true;
    } catch (err: any) {
      toast.error('Failed to assign report');
      return false;
    }
  };

  const dismissReport = async (reportId: string, adminId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({
          status: 'dismissed',
          resolved_by: adminId,
          admin_notes: notes || 'Dismissed without notes',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(currentReports => 
        currentReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'dismissed' } 
            : report
        )
      );

      toast.success('Report dismissed');
      return true;
    } catch (err: any) {
      toast.error('Failed to dismiss report');
      return false;
    }
  };

  const takeAction = async (
    reportId: string, 
    adminId: string, 
    actionType: ModerationActionType,
    message?: string,
    notes?: string
  ) => {
    try {
      // First update the report status
      const { error: reportError } = await supabase
        .from('moderation_reports')
        .update({
          status: 'actioned',
          action_taken: actionType,
          resolved_by: adminId,
          admin_notes: notes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) throw reportError;

      // Get the report to get target information
      const { data: reportData } = await supabase
        .from('moderation_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (!reportData) throw new Error('Report not found');

      // Create a moderation action record
      const { error: actionError } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: reportId,
          target_id: reportData.target_id,
          target_type: reportData.target_type,
          action_type: actionType,
          admin_id: adminId,
          message: message || '',
          notes: notes || '',
          created_at: new Date().toISOString()
        });

      if (actionError) throw actionError;

      // Update local state
      setReports(currentReports => 
        currentReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'actioned' } 
            : report
        )
      );

      toast.success('Action taken successfully');
      return true;
    } catch (err: any) {
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
