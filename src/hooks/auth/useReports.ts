
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (
    targetId: string,
    targetType: string,
    reason: string,
    details: string
  ) => {
    if (!user) {
      setError("You must be logged in to submit a report");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const reportData = {
        id: uuidv4(),
        reporter_id: user.id,
        reporter_type: 'user',
        target_id: targetId,
        target_type: targetType,
        reason,
        details,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('moderation_reports')
        .insert(reportData);

      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      console.error('Error submitting report:', err);
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitReport,
    loading,
    error
  };
};
