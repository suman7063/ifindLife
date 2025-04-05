
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
      // Convert experience to string if it's a number
      const updateData = {
        ...data,
        experience: data.experience !== undefined ? String(data.experience) : undefined
      };

      const { error } = await supabase
        .from('expert_accounts')
        .update(updateData)
        .eq('id', String(currentExpert.id));

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
      const expertId = String(currentExpert.id);
      
      // First delete existing availability
      await supabase
        .from('expert_availabilities')
        .delete()
        .eq('expert_id', expertId);

      // For each availability slot, create a record
      for (const slot of availability) {
        // Prepare availability data for this expert
        const availabilityData = {
          expert_id: expertId,
          availability_type: 'weekly', // Default type
          start_date: new Date().toISOString().split('T')[0], // Current date
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days from now
        };
        
        // Insert into expert_availabilities
        const { data: availabilityRecord, error: availabilityError } = await supabase
          .from('expert_availabilities')
          .insert(availabilityData)
          .select('id')
          .single();

        if (availabilityError) throw availabilityError;

        if (!availabilityRecord) throw new Error('Failed to create availability record');

        // Add time slots for this availability
        const { error: timeSlotError } = await supabase
          .from('expert_time_slots')
          .insert({
            availability_id: availabilityRecord.id,
            day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(slot.day),
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_booked: false
          });

        if (timeSlotError) throw timeSlotError;
      }

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
      // Convert service IDs to numbers for consistency with the database
      const serviceIds = services.map(s => typeof s.id === 'string' ? parseInt(s.id, 10) : s.id);
      
      // Update the expert record with selected service IDs
      const { error } = await supabase
        .from('expert_accounts')
        .update({
          selected_services: serviceIds
        })
        .eq('id', String(currentExpert.id));

      if (error) throw error;

      // Update local state
      setExpert({
        ...currentExpert,
        services,
        selected_services: serviceIds
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
