
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useReports = () => {
  const addReport = async (currentUser: UserProfile | null, expertId: string, reason: string, details: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a report');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_reports')
        .insert([{
          user_id: currentUser.id,
          expert_id: expertId,
          reason: reason,
          details: details,
          date: new Date().toISOString(),
          status: 'pending',
        }]);

      if (error) throw error;

      // Return updated user data to update the local state
      const newReport = {
        id: data ? data[0].id : 'temp_id', // Use a temporary ID
        user_id: currentUser.id,
        expert_id: expertId,
        reason: reason,
        details: details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const updatedUser = {
        ...currentUser,
        reports: [...currentUser.reports, newReport],
      };

      toast.success('Report added successfully!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add report');
      return null;
    }
  };

  return {
    addReport
  };
};
