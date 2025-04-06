
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ProfileUpdateData, ExpertTimeSlot } from './types';
import { toast } from 'sonner';

export const useExpertProfile = (
  currentExpert: ExpertProfile | null,
  setExpert: (expert: ExpertProfile | null) => void
) => {
  const [updating, setUpdating] = useState(false);

  /**
   * Updates the expert's profile information
   */
  const updateProfile = async (profileData: ProfileUpdateData): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }

    try {
      setUpdating(true);
      
      // Update the expert_accounts table
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('id', currentExpert.id);
      
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile: ' + error.message);
        return false;
      }
      
      // Update the local state
      const updatedExpert = {
        ...currentExpert,
        ...profileData
      };
      
      setExpert(updatedExpert);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred while updating your profile');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Updates the expert's availability schedule
   */
  const updateAvailability = async (timeSlots: ExpertTimeSlot[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }
    
    try {
      setUpdating(true);
      
      // First, delete all existing availability entries for this expert
      const { error: deleteError } = await supabase
        .from('expert_availability')
        .delete()
        .eq('expert_id', currentExpert.id);
      
      if (deleteError) {
        console.error('Error deleting existing availability:', deleteError);
        toast.error('Failed to update availability: ' + deleteError.message);
        return false;
      }
      
      // Then, insert the new availability entries
      const availabilityData = timeSlots.map(slot => ({
        expert_id: currentExpert.id,
        availability_type: 'regular',
        start_date: slot.start_time,
        end_date: slot.end_time,
        day_of_week: slot.day,
      }));
      
      const { error: insertError } = await supabase
        .from('expert_availability')
        .insert(availabilityData);
      
      if (insertError) {
        console.error('Error updating availability:', insertError);
        toast.error('Failed to update availability: ' + insertError.message);
        return false;
      }
      
      toast.success('Availability updated successfully');
      return true;
    } catch (error) {
      console.error('Availability update error:', error);
      toast.error('An unexpected error occurred while updating your availability');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Updates the services offered by the expert
   */
  const updateServices = async (serviceIds: number[]): Promise<boolean> => {
    if (!currentExpert) {
      toast.error('No expert profile found. Please log in again.');
      return false;
    }
    
    try {
      setUpdating(true);
      
      // Update the selected_services field in the expert_accounts table
      const { error } = await supabase
        .from('expert_accounts')
        .update({ selected_services: serviceIds })
        .eq('id', currentExpert.id);
      
      if (error) {
        console.error('Services update error:', error);
        toast.error('Failed to update services: ' + error.message);
        return false;
      }
      
      // Update the local state
      const updatedExpert = {
        ...currentExpert,
        selected_services: serviceIds
      };
      
      setExpert(updatedExpert);
      toast.success('Services updated successfully');
      return true;
    } catch (error) {
      console.error('Services update error:', error);
      toast.error('An unexpected error occurred while updating your services');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateProfile,
    updateAvailability,
    updateServices,
    updating
  };
};
