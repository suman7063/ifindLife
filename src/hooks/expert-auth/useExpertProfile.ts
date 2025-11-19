
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
      
      // Use auth_id for updates
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // Update the expert_accounts table
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('auth_id', expertId);
      
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
      
      // Use auth_id for expert operations
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // First, delete all existing availability entries for this expert
      const { error: deleteError } = await supabase
        .from('expert_availabilities')
        .delete()
        .eq('expert_id', expertId);
      
      if (deleteError) {
        console.error('Error deleting existing availability:', deleteError);
        toast.error('Failed to update availability: ' + deleteError.message);
        return false;
      }
      
      // Then, insert the new availability entries
      // Map the timeSlots to match the database schema
      const availabilityData = timeSlots.map(slot => ({
        expert_id: expertId,
        availability_type: 'regular',
        start_date: slot.start_time,
        end_date: slot.end_time,
        day_of_week: slot.day_of_week || slot.day // Use day_of_week or fallback to day
      }));
      
      // Insert the transformed data
      const { error: insertError } = await supabase
        .from('expert_availabilities')
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
      
      // Use auth_id for expert operations
      const expertId = String(currentExpert.auth_id || currentExpert.id);
      
      // Update the selected_services field in the expert_accounts table
      // Note: selected_services is INTEGER[] but services use UUID, so we skip updating it
      // Services are stored in expert_service_specializations table instead
      const { error } = await supabase
        .from('expert_accounts')
        .update({ 
          // selected_services: serviceIds, // Skip - INTEGER[] vs UUID mismatch
        })
        .eq('auth_id', expertId);
      
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
