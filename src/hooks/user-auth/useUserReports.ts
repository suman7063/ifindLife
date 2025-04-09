
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { Report, NewReport } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';

export const useUserReports = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addReport = async (reportData: NewReport): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to report an expert');
      return false;
    }

    try {
      const newReport = {
        user_id: currentUser.id,
        expert_id: parseInt(String(reportData.expertId), 10), // Convert to number for database
        reason: reportData.reason,
        details: reportData.details,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('user_reports')
        .insert(newReport);

      if (error) throw error;

      // Create a safer way to get the ID
      let newId = `temp_${Date.now()}`;
      
      if (data) {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];
        // Check if array has items and first item has an id
        if (dataArray.length > 0 && typeof dataArray[0] === 'object') {
          const firstItem = dataArray[0] as Record<string, any>;
          if ('id' in firstItem) {
            newId = firstItem.id;
          }
        }
      }

      // Optimistically update the local state
      const adaptedReport: Report = {
        id: newId,
        expertId: reportData.expertId,
        reason: reportData.reason,
        details: reportData.details || '',
        date: new Date().toISOString(),
        status: 'pending'
      };

      const updatedUser = {
        ...currentUser,
        reports: [...(currentUser.reports || []), adaptedReport],
      };
      setCurrentUser(updatedUser);

      toast.success('Report submitted successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
      return false;
    }
  };

  return {
    addReport
  };
};
