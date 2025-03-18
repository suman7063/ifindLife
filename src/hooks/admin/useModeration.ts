
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ReportUI, ModerationStatus } from '@/types/supabase';

export const useModeration = () => {
  const [reports, setReports] = useState<ReportUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('moderation_reports')
        .select(`
          *,
          reporter:reporter_id(*),
          target:target_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Transform into UI format
      const transformedReports: ReportUI[] = data.map(report => ({
        id: report.id,
        reporterId: report.reporter_id,
        reporterType: report.reporter_type,
        reporterName: report.reporter?.name || 'Unknown',
        targetId: report.target_id,
        targetType: report.target_type,
        targetName: report.target?.name || 'Unknown',
        reason: report.reason,
        details: report.details,
        status: report.status as ModerationStatus, // Cast to ensure compatibility
        date: report.created_at,
        sessionId: report.session_id || '',
      }));

      setReports(transformedReports);
    } catch (err) {
      console.error('Error fetching moderation reports:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: ModerationStatus) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw new Error(error.message);
      
      // Update the local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, status } : report
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating report status:', err);
      return false;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('moderation_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw new Error(error.message);
      
      // Update the local state
      setReports(prev => prev.filter(report => report.id !== reportId));
      
      return true;
    } catch (err) {
      console.error('Error deleting report:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    updateReportStatus,
    deleteReport
  };
};
