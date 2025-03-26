
import { toast } from 'sonner';
import { UserProfile, Report } from '@/types/supabase';
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
      const newReport = {
        user_id: currentUser.id,
        expert_id: parseInt(expertId, 10), // Convert string to number
        reason: reason,
        details: details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('user_reports')
        .insert(newReport);

      if (error) throw error;

      // Optimistically update the local state
      const adaptedReport: Report = {
        id: data && Array.isArray(data) && data.length > 0 && data[0] ? 
            typeof data[0] === 'object' && 'id' in data[0] ? 
            data[0].id : `temp_${Date.now()}` : `temp_${Date.now()}`,
        expertId: expertId,
        reason: reason,
        details: details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const updatedUser = {
        ...currentUser,
        reports: [...(currentUser.reports || []), adaptedReport],
      };
      
      setCurrentUser(updatedUser);

      toast.success('Report added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add report');
    }
  };

  return {
    addReport,
    reportExpert: addReport // Alias for consistency with UserAuthContext
  };
};
