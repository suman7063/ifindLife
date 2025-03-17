
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { ExpertIdDB, convertExpertIdToNumber } from '@/types/supabase/expertId';
import { Report } from '@/types/supabase/reviews';

export const useReports = () => {
  const addReport = async (currentUser: UserProfile | null, expertId: string, reason: string, details: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a report');
      return null;
    }

    try {
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);
      
      const { data, error } = await supabase
        .from('user_reports')
        .insert({
          user_id: currentUser.id,
          expert_id: expertIdNumber,
          reason: reason,
          details: details,
          date: new Date().toISOString(),
          status: 'pending',
        })
        .select();

      if (error) throw error;

      // Return updated user data to update the local state
      const newReportId = data && data.length > 0 ? data[0].id : 'temp_id';
      
      const newReport: Report = {
        id: newReportId,
        expertId: expertId, // Store as string in our UI
        reason,
        details,
        date: new Date().toISOString(),
        status: 'pending',
      };

      const updatedUser = {
        ...currentUser,
        reports: [...(currentUser.reports || []), newReport],
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
