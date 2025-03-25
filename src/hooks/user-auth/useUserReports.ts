
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useUserReports = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addReport = async (expertId: string, reason: string, details: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a report');
      return;
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

      // Optimistically update the local state
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
      setCurrentUser(updatedUser);

      toast.success('Report added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add report');
    }
  };

  return {
    addReport
  };
};
