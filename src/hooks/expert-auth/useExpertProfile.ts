
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ProfileUpdateData, ExpertAvailability, ExpertService } from './types';
import { toast } from 'sonner';

export const useExpertProfile = (
  currentExpert: ExpertProfile | null,
  setExpert: (expert: ExpertProfile | null) => void
) => {
  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('Not logged in as an expert');
      return false;
    }

    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update(data)
        .eq('id', currentExpert.id);

      if (error) throw error;
      
      // Update local state
      setExpert({
        ...currentExpert,
        ...data
      });

      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating expert profile:', error);
      toast.error(error.message || 'Failed to update profile');
      return false;
    }
  };

  const updateAvailability = async (availability: ExpertAvailability[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('Not logged in as an expert');
      return false;
    }

    try {
      // First delete existing availability
      await supabase
        .from('expert_availability')
        .delete()
        .eq('expert_id', currentExpert.id);

      // Then insert new availability
      const { error } = await supabase
        .from('expert_availability')
        .insert(
          availability.map(slot => ({
            expert_id: currentExpert.id,
            ...slot
          }))
        );

      if (error) throw error;

      // Update local state
      setExpert({
        ...currentExpert,
        availability
      });

      toast.success('Availability updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating expert availability:', error);
      toast.error(error.message || 'Failed to update availability');
      return false;
    }
  };

  const updateServices = async (services: ExpertService[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('Not logged in as an expert');
      return false;
    }

    try {
      // Update the expert record with selected service IDs
      const { error } = await supabase
        .from('expert_accounts')
        .update({
          selected_services: services.map(s => s.id)
        })
        .eq('id', currentExpert.id);

      if (error) throw error;

      // Update local state
      setExpert({
        ...currentExpert,
        services,
        selected_services: services.map(s => s.id)
      });

      toast.success('Services updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating expert services:', error);
      toast.error(error.message || 'Failed to update services');
      return false;
    }
  };

  return {
    updateProfile,
    updateAvailability,
    updateServices
  };
};
