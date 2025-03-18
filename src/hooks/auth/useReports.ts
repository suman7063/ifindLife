
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, Report } from '@/types/supabase';
import { toast } from 'sonner';

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  const addReport = async (
    user: UserProfile, 
    expertId: string,
    reason: string,
    details: string
  ) => {
    setLoading(true);
    try {
      const newReport = {
        user_id: user.id,
        expert_id: expertId,
        reason,
        details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const { error } = await supabase
        .from('user_reports')
        .insert(newReport);

      if (error) throw error;

      // Update user's reports list
      const updatedReports = [...(user.reports || []), {
        id: 'pending', // Will be updated when we fetch again
        userId: user.id,
        expertId,
        reason,
        details,
        date: new Date().toISOString(),
        status: 'pending',
        user_id: user.id,
        expert_id: expertId
      } as Report];

      toast.success('Report submitted successfully');
      
      return {
        ...user,
        reports: updatedReports
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
      return user;
    } finally {
      setLoading(false);
    }
  };

  const getUserReports = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch reports');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async (
    user: UserProfile,
    expertId: string,
    reason: string,
    details: string
  ) => {
    return addReport(user, expertId, reason, details);
  };

  return {
    addReport,
    getUserReports,
    submitReport,
    loading
  };
};
