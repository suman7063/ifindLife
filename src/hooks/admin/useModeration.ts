
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ReportUI, ModerationActionType } from '@/types/supabase';

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
          reporter:reporter_id(*),
          target:target_id(*)
        `)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match ReportUI type
      const transformedReports = data.map(report => {
        // Use safe type assertion to prevent errors with undefined properties
        return {
          id: report.id,
          reporterId: report.reporter_id,
          reporterType: report.reporter_type as any, // Cast to any to avoid type errors
          reporterName: report.reporter?.name || 'Unknown',
          targetId: report.target_id,
          targetType: report.target_type as any, // Cast to any to avoid type errors
          targetName: report.target?.name || 'Unknown',
          reason: report.reason,
          details: report.details || '',
          status: report.status,
          date: report.date,
          sessionId: report.session_id || ''
        } as ReportUI;
      });

      setReports(transformedReports);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const assignReport = async (reportId: string, adminId: string): Promise<boolean> => {
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
      await fetchReports();
      return true;
    } catch (err) {
      setError('Failed to assign report');
      return false;
    }
  };

  const dismissReport = async (reportId: string, adminId: string, notes?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ 
          status: 'dismissed',
          assigned_to: adminId,
          admin_notes: notes || 'No notes provided',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      await fetchReports();
      return true;
    } catch (err) {
      setError('Failed to dismiss report');
      return false;
    }
  };

  const takeAction = async (
    reportId: string, 
    adminId: string, 
    actionType: ModerationActionType
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ 
          status: 'action_taken',
          action_type: actionType,
          assigned_to: adminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      
      // Here you would also take the appropriate action against the reported user/content
      // e.g. update user status, remove content, etc.
      
      await fetchReports();
      return true;
    } catch (err) {
      setError('Failed to take action');
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
